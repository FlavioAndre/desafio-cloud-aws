import boto3
import os

from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def lambda_handler(event, context):
    send_email(event)

def send_email(event):
    SENDER =  os.environ['sender']
    AWS_REGION =  os.environ['awsRegion']
    
    RECIPIENT = event['email']

    BODY_TEXT = event['message']
    BODY_TITLE = event['title']
    TABELA = event['tabela']
    SUBJECT = BODY_TITLE


    BODY_HTML = f"""<html>
    <h2>{BODY_TITLE}</h2>
    <body>
      <h3>{BODY_TEXT}</h3>
      <br/>
      {TABELA}
      <br/>
      <p>Este email foi enviado pelo sistema desenvolvido para o desafio do Bootcamp Aws - AMcom.</p>
    </body>
    </html>
                """            
    
    CHARSET = "UTF-8"
    
    client = boto3.client('ses',region_name=AWS_REGION)
    
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
