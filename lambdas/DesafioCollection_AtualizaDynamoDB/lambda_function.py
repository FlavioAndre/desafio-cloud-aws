import boto3
import uuid
import json
import os

resource_dynamodb = boto3.resource('dynamodb')
client = boto3.client('lambda')
clientCognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    print(event)
    arquivo = event['Records'][0]['s3']['object']['key']
    evento = event['Records'][0]['eventName'].split(':')
    eventTime = event['Records'][0]['eventTime']
    evento = evento[1]
    main(arquivo,evento,eventTime)


def extrai_arquivo(arquivo):
    atributos = arquivo[:-2]
    atributos = tuple(atributos.split('/'))
    return (atributos)


def atualiza_database(atributos,evento,eventTime):
    USER_POOL_ID =  os.environ['UserPoolId']
    FUNC_NAME =  os.environ['FunctionName']
    TABLE_NAME =  os.environ['TableName']
    
    table = resource_dynamodb.Table(TABLE_NAME)
    response = table.put_item(
        Item={
                'id': str(uuid.uuid4()),
                'userName': atributos[0],
                'fileName': atributos[1],
                'eventTime': eventTime,
                'event': evento
            }
        )

    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        print('DB atualizado: {atributos}')
        if evento == 'Put':
            
            response = clientCognito.list_users(
                UserPoolId = USER_POOL_ID,
                AttributesToGet=[
                    'email',
                ],
                Limit=1,
                Filter=f'username="{atributos[0]}"'
            )

            inputParams = {
                "email": response['Users'][0]['Attributes'][0]['Value'],
                "username": atributos[0],
                "title": "Notificação de novo arquivo no S3",
                "message": f"Arquivo {atributos[1]} recebido!",
                "tabela" : ""
            }
            
            response = client.invoke(
                FunctionName = FUNC_NAME,
                InvocationType = 'RequestResponse',
                Payload = json.dumps(inputParams)
            )
 
    else:
        print('ERRO de atualizacao')


def main(arquivo,evento,eventTime):
    atributos = extrai_arquivo(arquivo)
    atualiza_database(atributos,evento,eventTime)
