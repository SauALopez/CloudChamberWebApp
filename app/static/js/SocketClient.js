
//const topics to formard messages
const TOPICS = {
    COMANDS : 'comands',
    COMANDSWEB : 'comandsweb',
    STATUS : 'status',
    VALUE1 : 'value1',
    VALUE2 : 'value2'
};
//Const Keys and messages that are send 
//to the web server to forword it to de micro by mqtt
const KEYS = {
    WEB : 'EcFmUsAcCL',
    CLIENT : 'EcFmUsAcW',
    SYNC : 'sync',
    GENERAL : 'ALL',
    P12 : 'P12',
    P5 : 'P5',
    VENT : 'VENT',
    HIGH : 'HIGH'
};
//Some variables to make all function
var url = window.location.host;
var socket = io.connect(url);
var controlstatus = [0,0,0,0];
var firstvalue1 = true;
var firstvalue2 = true;
var timestampAlive = Date.now();

//SocketIo connect  event, send the ALIVE comand to micro
socket.on('connect', function () {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.WEB});
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.SYNC});    
    timestampAlive = Date.now()/1000;
});

//SocketIo custom event on_message, received from mqtt server thorug SocketIo
socket.on('on_message', function(message){
    onMessageArrived(message);
});

//Jquery handlers of control buttons
$("#General").on('click', function (event) {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.GENERAL});  
});
$("#12V").on('click', function (event) {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.P12});  
});
$("#5V").on('click', function (event) {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.P5});  
});
$("#Vent").on('click', function (event) {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.VENT});  
});
$("#High").on('click', function (event) {
    socket.emit('mqtt_comand', {
        topic: TOPICS.COMANDS,
        message: KEYS.HIGH});  
});

//Custom function, received the message and topic
//Determines the action to do
//Alive comand received, status  or new values
function onMessageArrived(message) {
    if (message.destinationName == TOPICS.COMANDSWEB) {
        if (message.payloadString == KEYS.CLIENT) {
            socket.emit('mqtt_comand', {
                topic: TOPICS.COMANDS,
                message: KEYS.WEB});
            timestampAlive = Date.now()/1000;
        }

    }
    if (message.destinationName == TOPICS.STATUS) {
        if (message.payloadString[0] == "0") {
            if (message.payloadString[1] == "0") {
                StatusIndicatorUpdate("Peltier12", 0, 0);
            } else {
                StatusIndicatorUpdate("Peltier12", 0, 1);
            }
        }
        if (message.payloadString[0] == "1") {
            if (message.payloadString[1] == "0") {
                StatusIndicatorUpdate("Peltier5", 1, 0);
            } else {
                StatusIndicatorUpdate("Peltier5", 1, 1);
            }
        }
        if (message.payloadString[0] == "2") {
            if (message.payloadString[1] == "0") {
                StatusIndicatorUpdate("Ventilators", 2, 0);
            } else {
                StatusIndicatorUpdate("Ventilators", 2, 1);
            }
        }
        if (message.payloadString[0] == "3") {
            if (message.payloadString[1] == "0") {
                StatusIndicatorUpdate("HighVoltage", 3, 0);
            } else {
                StatusIndicatorUpdate("HighVoltage", 3, 1);
            }
        }
        var on = 0;
        controlstatus.forEach(function (status) {
            on += status;
        });
        if (on == 4) {
            $("#ControlGeneral").removeClass("off");
            $("#ControlGeneral").addClass("on");
        } else {
            $("#ControlGeneral").removeClass("on");
            $("#ControlGeneral").addClass("off");
        }
    }

    if (message.destinationName == TOPICS.VALUE1) {
        if (firstvalue1) {
            inicio1 = Date.now() / 1000;
            firstvalue1 = false;
            document.getElementById("tv1").innerText = message.payloadString;
            DashBoardUpdate(value1_chart.config.data, message.payloadString, 0);
            value1_chart.update();

        }
        else {
            document.getElementById("tv1").innerText = message.payloadString;
            timestamp = Math.round(Date.now() / 1000 - inicio1);
            DashBoardUpdate(value1_chart.config.data, message.payloadString, timestamp);
            value1_chart.update();
        }
    }
    if (message.destinationName == TOPICS.VALUE2) {
        if (firstvalue2) {
            inicio2 = Date.now() / 1000;
            firstvalue2 = false;
            document.getElementById("tv2").innerText = message.payloadString;
            DashBoardUpdate(value2_chart.config.data, message.payloadString, 0);
            value2_chart.update();
        }
        else {
            document.getElementById("tv2").innerText = message.payloadString;
            timestamp = Math.round(Date.now() / 1000 - inicio2);
            DashBoardUpdate(value2_chart.config.data, message.payloadString, timestamp);
            value2_chart.update();
        }
    }
}

//Updates de pass throug chart with the new data
function DashBoardUpdate(chardata, value, timestamp) {
    chardata.datasets[0].data.push(value);
    chardata.labels.push(timestamp);
    if (chardata.labels.length > 20) {
        chardata.datasets[0].data.shift();
        chardata.labels.shift();
    }

}
//Updates de status indicator of the control buttons
function StatusIndicatorUpdate(id, number, value){
    controlstatus[number] = value;
    if (value == 1){
        $("#"+id).removeClass("off");
        $("#"+id).addClass("on");
    }else{
        $("#"+id).removeClass("on");
        $("#"+id).addClass("off");
    }

}
//Interval fucniton that checks if a microncontroller is alive
//If not It show an alert message
var alivecheck = setInterval(function(){
    checktime = Date.now() / 1000 - timestampAlive;
    if (checktime >11){
        socket.emit('mqtt_comand', {
            topic: TOPICS.COMANDS,
            message: KEYS.WEB});
        socket.emit('mqtt_comand',{
            topic : TOPICS.COMANDS,
            message: KEYS.SYNC
        });
        $("#alert").addClass("alert alert-danger");
        $("#alert").html("No active connection with micro-controller, please check the power supply");
    }
    else{
        $("#alert").removeClass("alert alert-danger");
        $("#alert").html("");       
    }
},5000);