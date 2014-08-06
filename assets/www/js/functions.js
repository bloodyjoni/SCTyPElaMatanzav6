/**
 * Example of starting a plugin with options.
 * I am just passing all the default options
 * so you can just start the plugin using $('.marquee').marquee();
 */
$(document).ready(function(){
	$('.marquee').marquee({
		speed: 5000,
		//gap in pixels between the tickers
		gap: 50,
		//gap in pixels between the tickers
		delayBeforeStart: 25,
		//'left' or 'right'
		direction: 'left',
		//true or false - should the marquee be duplicated to show an effect of continues flow
		duplicated: false,
		//on hover pause the marquee - using jQuery plugin https://github.com/tobia/Pause
		pauseOnHover: true
	});


});

/**
 * Fonction de récupération des paramètres GET de la page
 * @return Array Tableau associatif contenant les paramètres GET
 */
function extractUrlParams(){	
	var t = location.search.substring(1).split('&');
	var f = [];
	for (var i=0; i<t.length; i++){
		var x = t[ i ].split('=');
		f[x[0]]=x[1];
	}
	return f;
}
function createNews(){
	$('#ptempl').html("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet velit ante, et semper ipsum malesuada a. Aliquam eget varius lectus, eu eleifend enim. Aliquam at dictum orci. Cras vitae magna posuere eros rutrum condimentum vel a metus. Sed nisl purus, suscipit non lorem a, tempor sagittis eros. Maecenas facilisis mi sed dolor blandit fringilla. Nullam viverra sapien in purus porttitor tincidunt. In porttitor pharetra odio non aliquet. Pellentesque nisl libero, sagittis in velit vitae, molestie aliquam mauris. Etiam ac massa ornare, pretium eros a, rhoncus turpis. Aenean cursus auctor lectus, eget congue dolor tincidunt posuere.Etiam sit amet justo sed dolor blandit viverra sit amet sit amet sem. Vivamus id nibh purus. Nunc vel eros purus.\
			Nunc volutpat ornare sollicitudin. Nunc consequat euismod feugiat. Mauris ultrices pellentesque nibh non pretium. Nulla facilisi.\
	");

}
function createTextImg(){
	if($.url(document.URL).param('id')){
		//alert(document.URL);
		db.transaction(function(tx){getFicha(tx,$.url(document.URL).param('id'),$.url(document.URL).param('type'))} , errorCB);
		getExtras($.url(document.URL).param('id'),$.url(document.URL).param('type'));
		//getExtrasAll();
	}	

}
function goToFicha(itemid,itemtype){
	//alert("inside go to ficha id="+itemid);
	$.mobile.changePage("template/textimg.html", {data:{id:itemid,type:itemtype}});
	
}
function sendContactForm(objForm){
	alert('{"obj": '+JSON.stringify(objForm)+'}');
	
	$.ajax({
        type: "POST",/*method type*/
        contentType: "application/json; charset=utf-8",
        url: getLocalConfig("rootURL")+"contacto.php",/*Target function that will be return result*/
        data: JSON.stringify(objForm),
        dataType: "json",
        success: function(data) {
               //alert("Success"+JSON.stringify(data));
            }
        ,
        error: function(result) {
          //  prompt("Error"+JSON.stringify(result));
        }
    });   
	
}/*
function openExternalURL(){
	window.open($(this).attr("data-href"), '_system', 'location=no');

}*/