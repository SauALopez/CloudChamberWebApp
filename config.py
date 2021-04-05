class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = "YOUR_SECRET_KEY"
    SESSION_COOKIE_SECURE = True
    #MQTT SERVER CONFIGURATION PARAMETERS
    MQTT_SERVER = "SERVER_NAME"
    MQTT_PORT = 8883
    MQTT_USER = 'USER_NAME'
    MQTT_PWD = 'USER_PASSWORD'
    MQTT_TLS = True
    #MQTT TOPICS TO SUBSCRIBE
    MQTT_TOPICS = ['commandsweb',
                     'value1', 
                     'value2',
                     'status']
class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False

class TestingConfig(Config):
    TESTING = True
    SESSION_COOKIE_SECURE = False
