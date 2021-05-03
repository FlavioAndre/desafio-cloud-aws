import webbrowser, os, tempfile
import json
import boto3
import io
from io import BytesIO
import sys
from pprint import pprint
from boto3.dynamodb.conditions import Key

client = boto3.client('lambda')

def lambda_handler(event, context):
    username = event['username']
    email = event['email']
    response = query_username(username)
    dataHtml = mount_table_Html(response)
    send_email(dataHtml, username, email)
    
def send_email(dataHtml, username, email):
    FUNC_NAME =  os.environ['FunctionName']
    
    inputParams = {
        "email": email,
        "username": username,
        "title": "Listagem de Atividades",
        "message": f"Email está sendo email por solicitação do usuário: {username}.",
        "tabela" : dataHtml
    }

    response = client.invoke(
        FunctionName = FUNC_NAME,
        InvocationType = 'RequestResponse',
        Payload = json.dumps(inputParams)
    )
            
            
def mount_table_Html(data):
    listData = ['<table style="border: black 1px solid;">']
    listData.append('<tbody>')
    listData.append('<style type="text/css" media="screen">')
    listData.append('table{')
    listData.append('background-color: #AAD373;')
    listData.append('empty-cells:hide;')
    listData.append('}')
    listData.append('td.cell{')
    listData.append('background-color: white;')
    listData.append('}')
    listData.append('</style>')
    
    
    listData.append('<tr>')
    listData.append('<th class="cell">Data</th>')
    listData.append('<th class="cell">Evento</th>')
    listData.append('<th class="cell">Arquivo</th>')
    listData.append('<th class="cell">Usuário</th>')
    listData.append('</tr>')
    for row in data:
        listData.append('<tr>')
        field = row['eventTime']
        listData.append(f'<td class="cell">{field}</td>')
        
        field = row['event']
        listData.append(f'<td class="cell">{field}</td>')
        
        field = row['fileName']
        listData.append(f'<td class="cell">{field}</td>')
        
        field = row['userName']
        listData.append(f'<td class="cell">{field}</td>')
        
        listData.append('</tr>')    
    
    listData.append('</tbody>')
    listData.append('</table>')
    return "\n".join(listData)

def json_to_csv(path, dataJson, fileOutput):
    with open(os.path.join(path,fileOutput), 'w') as fp:
        output = csv.writer(fp)
        output.writerow(data[0].keys())
        for row in data:
            output.writerow(row.values())

def query_username(username):
    TABLE_NAME =  os.environ['TableName']
    INDEX_TABLE_NAME =  os.environ['IndexTableName']

    resource_dynamodb = boto3.resource('dynamodb')
    table = resource_dynamodb.Table(TABLE_NAME)

    response = table.query(
        IndexName=INDEX_TABLE_NAME,
        KeyConditionExpression=Key('userName').eq(username)
    )

    return response['Items']     