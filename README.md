# CloudChamberWebApp
Cloud Chamber - DashBoard with real time data and control.
# CloudChamberWebApp
Cloud Chamber - DashBoard with real time data and control.
## Description
This proyect consist in a WebApp(**DashBoard**), constructed with **FLASK** as framework that can be deployable in **FREE** webapp platforms options like (*AppEngine, Heroku, App Plataform, etc*) that uses WebSocket (**SocketIo**) to enable real-time and bidirectional data in the DashBoard.

The WebApp controls and receives data from the CloudChamber through a ESP32 base chip using the MQTT Protocol and the **FREE** Private Broker from [HiveMQ](https://www.hivemq.com/mqtt-cloud-broker/).

The WebApp forward the messages from MQTT between the DashBoard and the ESP32 by creating a client connection to MQTT Broker.
## Diagram
![DiagramImg](https://i.ibb.co/23PBG61/Diagram.png)

## WebPage - DashBoard
You can see an example deploy in Heroku [link](https://camaradeniebla.herokuapp.com/).
![gif](https://i.ibb.co/P6MkDPn/Peek-2021-04-05-00-33.gif)


## Installation
### Requirements
* Python version 3.8.5
* Python Virtual environment
* *requirements.txt* installation
```bash
pip install -r requirements.txt
``` 
## Configurations
### Configuration_BackEnd
You need to configure your MQTT server information in the *config.py* file in root directory.
```python
#MQTT SERVER CONFIGURATION PARAMETERS
    MQTT_SERVER = "SERVER_NAME"
    MQTT_PORT = 8883
    MQTT_USER = 'USER_NAME'
    MQTT_PWD = 'USER_PASSWORD'
    MQTT_TLS = True
```
In this example, the app is using HiveMQ MQTT Broker that use (*TLS*) secure comunication, username and password authentication. Be aware that if you are using other Broker the Paho MQTT client may need other configuration steps.
### Configuration FrontEnd
If your running this exact application with the ESP32 exact code in the [CloudChamber with ESP32](http//:repo). You don't need to configure anything else beside the BackEnd server information.

## Usage
### Cloud Chamber Usage
This app can be run locally, in a container or deploy in a webapp platform (*Heroku **Procfile** is included in repository*) and use to control a Cloud Chamber using the [Cloud Chamber with ESP32](http//:repo) code.

### IoT DashBoard with MQTT
