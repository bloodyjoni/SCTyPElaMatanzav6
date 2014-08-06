


var PushConf = {
		 addTokenScript : "http://www.proyectored.com.ar/mobile/GCMServ/addtoken.php?token=",
		 deleteTokenScript  : "http://www.proyectored.com.ar/mobile/GCMServ/deletetoken.php?token=",
		 senderID : "447745035223",
		 token : "0" ,

		 initialize : function() {

			this.bindEvents();
		},
		// Bind Event Listeners
		//
		// Bind any events that are required on startup. Common events are:
		// 'load', 'deviceready', 'offline', and 'online'.
		 bindEvents : function() {

			document.addEventListener('deviceready', onDeviceReadyforPush, false);
			//onDeviceReadyforPush();

		}
};




function onDeviceReadyforPush() {
			pushNotification = window.plugins.pushNotification;
			pushRegister();
			// used to unregister the device
			document.addEventListener("backbutton", onBackButton, false);


		}


			
			
function pushRegister(){

	pushNotification.register(successHandler, errorHandler,{"senderID":PushConf.senderID,"ecb":"onNotificationGCM"});

}

function getXMLHttpRequest(){
	var xhr = null;

			xhr = new XMLHttpRequest(); 
		

	return xhr;
}

function  onNotificationGCM(e) {
	switch( e.event )
	{
	case 'registered':
		if ( e.regid.length > 0 )

		{		}

		break;

	case 'message':
		// this is the actual push notification. its format depends on the data model from the push server
		//alert('message = '+e.message+'URL = '+e.payload.url);
	/*	var msgtable=document.getElementById("msgtable");
		var rowsArray=msgtable.getElementsByTagName("tr");
		var nbrows=rowsArray.length;
		var row= msgtable.insertRow(nbrows);
		var cell1=row.insertCell(0);
		var cell2=row.insertCell(1);
		cell1.innerHTML=e.message;
		cell2.innerHTML=e.payload.url;
	*/	updateAll();
		break;

	case 'error':
		alert('GCM error = '+e.msg);
		break;

	default:
		alert('An unknown GCM event has occurred');
	break;
	}
}
function onBackButton(e){

	if (e){
		e.preventDefault();


	}
	else
	{
		navigator.app.backHistory();
	}


}
function errorHandler(error) {
	alert(error);
}
	 function successHandler(e) {


			console.log(result);

		}
		


