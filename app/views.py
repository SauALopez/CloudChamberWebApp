from app import app
from app import socketio
from flask import render_template
import paho.mqtt.client as mqtt


def on_message(client, userdata, msg):
    socketio.emit('on_message',{
        'destinationName': msg.topic,
        'payloadString' : msg.payload.decode('utf-8')
        })    

@app.route('/')
def index():
   return render_template("index.html")

@socketio.on('mqtt_comand')
def mqtt_comand(comand):
    MQTT_client.publish(comand['topic'],comand['message'])

MQTT_client = mqtt.Client(client_id="masterweb", clean_session=True)
MQTT_client.on_message = on_message
if (app.config['MQTT_TLS']):
    MQTT_client.tls_set(tls_version=mqtt.ssl.PROTOCOL_TLS)
MQTT_client.username_pw_set(app.config['MQTT_USER'], app.config['MQTT_PWD'])
MQTT_client.connect(host=app.config['MQTT_SERVER'], port=app.config['MQTT_PORT'])

for topic in app.config['MQTT_TOPICS']:
    MQTT_client.subscribe(topic)
MQTT_client.loop_start()



