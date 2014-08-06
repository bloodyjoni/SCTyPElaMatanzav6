document.addEventListener("deviceready", bddhandler, false);
var db;
var db_version="1.0";
var insertedId=0;
function bddhandler(){

	db = window.openDatabase("CyType", "1","Base de datos de la Secretaria", 10000000);
	db.transaction(populateDB, errorCB,successCB );

}
function populateDB(tx) { 
	tx.executeSql('DROP TABLE IF EXISTS Eventos');
	tx.executeSql('DROP TABLE IF EXISTS ExtraEventos');
	tx.executeSql('DROP TABLE IF EXISTS Noticias');
	tx.executeSql('DROP TABLE IF EXISTS ExtraNoticias');
	tx.executeSql('DROP TABLE IF EXISTS PPublicasCategorias');
	tx.executeSql('DROP TABLE IF EXISTS PPublicasContent');
	tx.executeSql('DROP TABLE IF EXISTS ExtraPPublicas');
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS Eventos (id INTEGER PRIMARY KEY , Titulo, text, FechaIni, FechaFin, img TEXT DEFAULT \'false\')');
	//   tx.executeSql('INSERT INTO Eventos (id, Titulo, text, FechaIni, FechaFin) VALUES ("1" ,"Permitido Soñar","Eventos uno","2014-03-15","2014-03-18" )');
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS Noticias (id INTEGER PRIMARY KEY , Titulo, text, FechaIni, FechaFin, img TEXT DEFAULT \'false\')');
	// tx.executeSql('INSERT INTO Noticias (id, Titulo, text, FechaIni, FechaFin) VALUES ("1" ,"Permitido Soñar","Eventos dos","2014-03-15","2014-03-18" )');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ExtraEventos (externalId INTEGER , key, value, PRIMARY KEY (externalId,key))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ExtraNoticias (externalId INTEGER , key, value, PRIMARY KEY (externalId,key))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS PPublicasContent (id INTEGER, catid INTEGER, Titulo, fulltext, introtext, img TEXT DEFAULT \'false\', PRIMARY KEY (id,catid))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS PPublicasCategorias (id INTEGER, Titulo, PRIMARY KEY (id,Titulo))');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ExtraPPublicas(externalId INTEGER , key, value, PRIMARY KEY (externalId,key))');
}

function errorCB(err) {
	alert("Error a la creacion de las tablas: "+err.code);
}
function successCB() {
//	alert("success! ");
	//After creationg the database update it
	// updateAll();
}/*
function getDB(tx){
	tx.executeSql('Select * from Eventos', [], querySuccess, errorCB);
}*/
//modificate here to get the full item results
function querySuccess(tx, results) {
	var len = results.rows.length;
	//console.log("Tabla Eventos: " + len + " filas encontradas.");
	for (var i=0; i<len; i++){
		console.log("Fila = " + i + " ID = " + results.rows.item(i).id + " Titulo =  " + results.rows.item(i).Titulo);
	}
}

/*
 * Parte correspondiente a la lista en la pagina Noticias html por las Noticias
 */
function getDBNoticiasList(tx){
	tx.executeSql('Select id,Titulo,img from Noticias', [], querySuccessNoticias, errorCB);


}

//modificate here to get the full item results
function querySuccessNoticias(tx, results) {

	var len = results.rows.length;
	console.log("Tabla Noticias: " + len + " filas encontradas.");
	$('#listNoticias').empty();
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#listNoticias').append($('<li/>', { 
			'data-id':results.rows.item(i).id//here appending `<li>`
		}).append(function(){
			if(results.rows.item(i).img=='true'){
				return $('<img/>',{
					'src': getLocalConfig("appContentPath")+'/images/Noticias/'+results.rows.item(i).id+'.jpg',
					'class':'thumb'
				})}})
				.append($('<a/>',{    //here appending `<a>` into `<li>`
					'href': 'javascript:goToFicha('+results.rows.item(i).id+',"Noticias")',
					'data-transition': 'slide',
					'text': results.rows.item(i).Titulo
				})));

		$('#listNoticias').listview('refresh');
		console.log($('#listNoticias').html());
	}
}
function getNoticiasList(){ 
	db.transaction(getDBNoticiasList , errorCB);
}

/*
 * Parte correspondiente a la lista en la pagina Noticias html por los Eventos
 */
function getDBEventosList(tx){
	tx.executeSql('Select id,Titulo,img from Eventos', [], querySuccessEventos, errorCB);


}

//modificate here to get the full item results
function querySuccessEventos(tx, results) {

	var len = results.rows.length;
	console.log("Tabla Eventos: " + len + " filas encontradas.");
	$('#listEventos').empty();
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#listEventos').append($('<li/>', { 
			'data-id':results.rows.item(i).id//here appending `<li>`
		}).append(function(){
			if(results.rows.item(i).img=='true'){
				return $('<img/>',{
					'src': getLocalConfig("appContentPath")+'/images/Eventos/'+results.rows.item(i).id+'.jpg',
					'class':'thumb'
				})}})
				.append($('<a/>',{    //here appending `<a>` into `<li>`
					'href': 'javascript:goToFicha('+results.rows.item(i).id+',"Eventos")',
					'data-transition': 'slide',
					'text': results.rows.item(i).Titulo
				})));

		$('#listEventos').listview('refresh');
		console.log($('#listEventos').html());
	}
}
function getEventosList(){ 
	db.transaction(getDBEventosList , errorCB);
}
/*
 * Parte responsable del slideshox de los eventos al inicio
 *  
 * 
 *
 */
function getDBEventosListSlider(tx){
	tx.executeSql('Select id,Titulo,img,FechaIni,FechaFin from Eventos where FechaFin >= date(\'now\') ORDER BY FechaFin LIMIT 4', [], querySuccessEventosSlider, errorCB);


}

//modificate here to get the full item results
function querySuccessEventosSlider(tx, results) {

	var len = results.rows.length;
	console.log("Tabla Eventos: " + len + " filas encontradas.");
	$('#EventosSlider').empty();
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#EventosSlider').append(function (){
			if(i==0){
				return $('<a/>',{    //here appending `<a>` 
					'href': '#imgshow',
					'class': 'first'
				}).append(function(){
					if(results.rows.item(i).img=='true'){
						return $('<img/>',{
							'src': getLocalConfig("appContentPath")+'/images/Eventos/'+results.rows.item(i).id+'.jpg',
							'alt' : results.rows.item(i).Titulo,
							'name': results.rows.item(i).Titulo,
							'data-fechaini': results.rows.item(i).FechaIni,
							'data-fechafin': results.rows.item(i).FechaFin,
							'data-id': results.rows.item(i).id
							
						})}
					else{
						return $('<img/>',{
							'src': 'file:///android_asset/www/content/images/ciencia.jpg',
							'alt' : results.rows.item(i).Titulo,
							'name': results.rows.item(i).Titulo,
							'data-fechaini': results.rows.item(i).FechaIni,
							'data-fechafin': results.rows.item(i).FechaFin,
							'data-id': results.rows.item(i).id

						})
					}});;}
			else  if (i==len-1){return $('<a/>',{    //here appending `<a>` 
				'href': '#imgshow',
				'class': 'last'
			}).append(function(){
				if(results.rows.item(i).img=='true'){
					return $('<img/>',{
						'src': getLocalConfig("appContentPath")+'/images/Eventos/'+results.rows.item(i).id+'.jpg',
						'alt' : results.rows.item(i).Titulo,
						'name': results.rows.item(i).Titulo,
						'data-fechaini': results.rows.item(i).FechaIni,
						'data-fechafin': results.rows.item(i).FechaFin,
						'data-id': results.rows.item(i).id
					})}
				else{
					return $('<img/>',{
						'src': 'file:///android_asset/www/content/images/ciencia.jpg',
						'alt' : results.rows.item(i).Titulo,
						'name': results.rows.item(i).Titulo,
						'data-fechaini': results.rows.item(i).FechaIni,
						'data-fechafin': results.rows.item(i).FechaFin,
						'data-id': results.rows.item(i).id
					})
				}});;}
			else{
				return $('<a/>',{    //here appending `<a>` 
					'href': '#imgshow',
				}).append(function(){
					if(results.rows.item(i).img=='true'){
						return $('<img/>',{
							'src': getLocalConfig("appContentPath")+'/images/Eventos/'+results.rows.item(i).id+'.jpg',
							'alt' : results.rows.item(i).Titulo,
							'name': results.rows.item(i).Titulo,
							'data-fechaini': results.rows.item(i).FechaIni,
							'data-fechafin': results.rows.item(i).FechaFin,
							'data-id':results.rows.item(i).id
						})}
					else{
						return $('<img/>',{
							'src': 'file:///android_asset/www/content/images/ciencia.jpg',
							'alt' : results.rows.item(i).Titulo,
							'name': results.rows.item(i).Titulo,
							'data-fechaini': results.rows.item(i).FechaIni,
							'data-fechafin': results.rows.item(i).FechaFin,
							'data-id':results.rows.item(i).id
						})
					}});
			}
		})


	}
	console.log($('#EventosSlider').html());
	$('.gallerycontent img').bind('tap',function(event, ui){
		var src = $(this).attr("src");
		var alt = $(this).attr("alt");
		var name = $(this).attr("name");
		var fechaini = $(this).attr("data-fechaini");
		var fechafin = $(this).attr("data-fechafin");
		var id= $(this).attr("data-id");
		//alert("<a href='javascript:goToFicha("+id+',"Eventos")'+"'>"+'<img src="' + src + '" style="width:100%; height:100%;"/></a>' );
		$('#dialogcontent').empty().append("<a href='javascript:goToFicha("+id+',"Eventos")'+"'>"+'<img src="' + src + '" style="width:100%; height:100%;"/></a>' );
		$('#dialoghead').empty().append('<center><h3>' + alt +'</br>' +fechaini+' / '+fechafin+'</h3></center>' );
		$(this).parent().addClass('selectedimg');
	});

	$('.gallerycontent').find('.first img').trigger("tap");
}
function getEventosListSlider(){ 
	db.transaction(getDBEventosListSlider , errorCB);
}
/*
 * Fin de la part del slideshow
 * 
 */
/*
 * Parte de UltimeNoticia
 * 
 */
function getUltimaNoticia(){ 
	db.transaction(getDBUltimaNoticia, errorCB);
}
function getDBUltimaNoticia(tx){
	// para un ahorro de codigo la architectura dentro del index.html fue modificado para que la funcion de success funcione aca tambien
	tx.executeSql('Select id,Titulo,img from Noticias LIMIT 1', [], querySuccessUltimaNoticia, errorCB);
}
function querySuccessUltimaNoticia(tx, results) {

	var len = results.rows.length;
	console.log("Tabla Noticias: " + len + " filas encontradas.");
	$('#listUltimaNoticia').empty();
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#listUltimaNoticia').append($('<li/>', { 
			'data-id':results.rows.item(i).id//here appending `<li>`
		}).append(function(){
			if(results.rows.item(i).img=='true'){
				return $('<img/>',{
					'src': getLocalConfig("appContentPath")+'/images/Noticias/'+results.rows.item(i).id+'.jpg',
					'class':'thumb'
				})}})
				.append($('<a/>',{    //here appending `<a>` into `<li>`
					'href': 'javascript:goToFicha('+results.rows.item(i).id+',"Noticias")',
					'data-transition': 'slide',
					'text': results.rows.item(i).Titulo
				})));

		$('#listUltimaNoticia').listview('refresh');
		console.log($('#listUltimaNoticia').html());
	}
}
/*
 * Fin Parte Ultima Noticia
 * 
 */
function getFicha(tx,id,type){
	//alert(id+":"+type)
	if(type=="Eventos"){
		tx.executeSql('Select id,Titulo,text from Eventos where id='+id, [], function(tx,results){querySuccessFicha(tx,results,id,type)} , errorCB);
	}
	else if(type=="Noticias"){
		tx.executeSql('Select id,Titulo,text from Noticias where id='+id, [],function(tx,results){querySuccessFicha(tx,results,id,type)} , errorCB);
	}
	else if(type=="PPublicas"){
		tx.executeSql('Select id,Titulo,introtext,fulltext from PPublicasContent where id='+id, [],function(tx,results){querySuccessFicha(tx,results,id,type)} , errorCB);	
	}
}
function querySuccessFicha(tx, results,id,type) {

	var len = results.rows.length;
	$("#titletempl").html(results.rows.item(0).Titulo);

	$("#spantempl").html(results.rows.item(0).introtext+'<br/>'+results.rows.item(0).fulltext);

}
function getCurId(tx, table){
	//alert('select MAX(id) AS id FROM '+table+'');
	tx.executeSql('select MAX(id) AS id FROM '+table, [],	function(tx,results){
		//alert(results.rows.item(0).id);
		return results.rows.item(0).id;
	});
}
function getMinId(tx, table){
	//alert('select MIN(id) AS id FROM '+table+'');
	tx.executeSql('select MIN(id) AS id FROM '+table, [],	function(tx,results){
		//alert(results.rows.item(0).id);
		return results.rows.item(0).id;
	});
}
function getCurrentDBId(table){

	db.transaction(function(tx){getCurId(tx,table)}, errorCB);
}
function getMinDBId(table){

	db.transaction(function(tx){getMinId(tx,table)}, errorCB);
}
function getExtras(id,type){
	db.transaction(function(tx){getExtrasDB(tx,id,type)}, errorCB);
}
function getExtrasDB(tx,id,type){
	tx.executeSql('SELECT * FROM Extra'+type+' WHERE externalId='+id, [],function(tx,results){getExtrasResults(tx,results,type)});
	//alert('SELECT * FROM Extra'+type+' WHERE externalId='+id+' ');
}
function getExtrasResults(tx,results,type){
	//alert("inside getExtra result"+ results.rows.length);
	var len = results.rows.length;
	$('#extratempl').empty();
	for (var i=0; i<len; i++){
		//alert("inside getExtra result"+results.rows.item(i).key);
		if(results.rows.item(i).key =="geo"){
			$('#extratempl').append($('<div/>')
					.append($('<a/>', {    //here appending `<a>` into `<li>`
						'href': 'geo:'+results.rows.item(i).value,
						'text': "Ubicacion"
					})));
		}
		else if(results.rows.item(i).key =="url"){
			//alert("url changing"+ results.rows.item(i).value);
			$('#extratempl').append($('<div/>')
					.append($('<a/>', { //here appending `<a>` into `<li>`
						'id':'extraURL',
						'href': "#",
						'data-href': results.rows.item(i).value,
						'text': "URL",
						'data-rel':"external",
						//'onclick': "openExternalURL();"
						'onclick': "window.open($(this).attr(\"data-href\"), '_system', 'location=no');"
					})));
		}
		else if(results.rows.item(i).key =="urltext"){
			//alert("url changing"+ results.rows.item(i).value);
			$('#extraURL').text(results.rows.item(i).value);
		}
		else if(results.rows.item(i).key =="img"){
			//alert("img changing");
			if(document.getElementById('imgtempl') === null){
			$('#ptempl').prepend($('<img/>',{ 
				'id':'imgtempl',
				'src': getLocalConfig("appContentPath")+'/images/'+type+'/'+results.rows.item(i).externalId+'.jpg'
			})); 
			}
			//$("#imgtempl").attr('src','../content/images/'+type+'/'+results.rows.item(i).externalId+'.jpg');
		}

		//$('#listEventos').listview('refresh');
		//console.log($('#listEventos').html());
	}
}
function enableImg(id,type){
	//alert("inside enable img");
	db.transaction(function(tx){enableImgDB(tx,id,type)}, errorCB);
} 
function enableImgDB(tx,id,type){
	tx.executeSql('Update '+type+' SET img = '+"'true'"+'  WHERE id='+id, [],function(tx,results){},errorCB);
}
/*
 *Parte para identificar y bajar los extras para las Noticias 
 */
function getNoticiasIds(){
	db.transaction(getNotIds, errorCB);
}


function getNotIdsDB(tx,results){
	var arrayIds=new Array;
	arrayIds.length=0;
	var len = results.rows.length;

	for (var i=0; i<len; i++){
		console.log(results.rows.item(i).id+"id Noticias libre");
		arrayIds[i]=results.rows.item(i).id;
		console.log("arrayIds:"+arrayIds.toString());

	}
	//alert(arrayIds.toString());
	if(arrayIds.length >0){
		$.ajax({
			type : 'GET', // Le type de ma requete
			url : 'http://www.proyectored.com.ar/mobile/UPDTExtrasNoticias.php', // L'url vers laquelle la requete sera envoyee
			data : {
				currid: arrayIds
			},
			success : function(data, textStatus, jqXHR){
				//alert(data);
				updateExtraNoticiasDB(data);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('Problema de connexion' + textStatus+ " : " + errorThrown);
			}
		});
	}
}

function getNotIds(tx){


	tx.executeSql('select * from Noticias where id not in (select externalId from ExtraEventos)', [],getNotIdsDB);

}

/*
 * Parte para identificar y bajar los extras para los eventos
 */
function getEventosIds(){
	db.transaction(getEvtIds, errorCB);
}


function getEvtIdsDB(tx,results){
	var arrayIds=new Array;
	arrayIds.length=0;
	var len = results.rows.length;

	for (var i=0; i<len; i++){
		console.log(results.rows.item(i).id+"id Eventos libre");
		arrayIds[i]=results.rows.item(i).id;
		console.log("arrayIds:"+arrayIds.toString());

	}
	//alert(arrayIds.toString());
	if(arrayIds.length >0){
		$.ajax({
			type : 'GET', // Le type de ma requete
			url : 'http://www.proyectored.com.ar/mobile/UPDTExtrasEventos.php', // L'url vers laquelle la requete sera envoyee
			data : {
				currid: arrayIds
			},
			success : function(data, textStatus, jqXHR){
				//alert(data);
				updateExtraEventosDB(data);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('Problema de connexion' + textStatus+ " : " + errorThrown);
			}
		});
	}
}

function getEvtIds(tx){


	tx.executeSql('select * from Eventos where id not in (select externalId from ExtraEventos)', [],getEvtIdsDB);

}
//FOnctiones de desarollo inutil ahora

function getExtrasAll(){
	db.transaction(function(tx){getExtrasAllDB(tx)}, errorCB);
}
function getExtrasAllDB(tx){
	tx.executeSql('SELECT * FROM ExtraEventos ', [],getExtrasAllResults);
	//alert('SELECT * FROM ExtraEventos  ');
}
function getExtrasAllResults(tx,results){
	//alert("inside getExtraAll result"+ results.rows.length);
	var len = results.rows.length;
	$('#extratempl').empty();
	/*for (var i=0; i<len; i++){
	//	alert("inside getExtra result"+results.rows.item(i).externalId+results.rows.item(i).key+results.rows.item(i).value);

	}*/
}

