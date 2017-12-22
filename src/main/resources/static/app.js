var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({"user" : document.getElementById("sender").value}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/user/queue/reply', function (greeting) {
            showGreeting(JSON.parse(greeting.body).from,JSON.parse(greeting.body).content,JSON.parse(greeting.body).to);
        });
    });
}


function Javasubscription() {
	stompClient.subscribe('/topic/'+$("#subscribe").val(), function (greeting) {
        showGreeting(JSON.parse(greeting.body).from,JSON.parse(greeting.body).to,JSON.parse(greeting.body).content);
    });    
} 
/*function SpringBootsubscription() {
	stompClient.subscribe('/topic/springBoot', function (greeting) {
        showGreeting(JSON.parse(greeting.body).from,JSON.parse(greeting.body).to,JSON.parse(greeting.body).content);
    });    
}*/
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/"+$("#topic").val(), {}, JSON.stringify({'from': $("#sender").val(), 'content': $("#question").val(),'to': $("#topic").val()}));
    showGreeting("Me",$("#topic").val(),$("#question").val());
        
}

function showGreeting(sender,receiver,message) {
    $("#greetings").append("<tr><td>" + sender + "</td><td>"+message+"</td><td>"+receiver+"</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    

    $( "#subscribe" ).click(function() { Javasubscription(); });
    //$( "#SpringBoot" ).click(function() { SpringBootsubscription(); });
    $( "#send" ).click(function() { sendName(); });
});