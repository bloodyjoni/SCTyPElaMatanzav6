/*
 * Parte correspondiente a la lista en la pagina PoliticasPublicas html 
 */
function getDBNoticiasList(tx){
	tx.executeSql('Select id,Titulo,fulltext,introtext,img from Noticias', [], function (tx,results){querySuccessNoticias(tx,results);}, errorCB);


}

//modificate here to get the full item results
function querySuccessNoticias(tx, results) {

	var len = results.rows.length;
	console.log("Tabla Noticias: " + len + " filas encontradas.");
	$('#NoticiasList').empty();
//$('#NoticiasCat'+catid).append='<ul></ul>');//here appending `<ul>` into `<li>`
		
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#NoticiasList').append($('<li/>', { 
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

		$('#NoticiasList').listview('refresh');
		//alert($('#NoticiasCat'+catid).html());
	}
	//alert($('#NoticiasCat'+catid).html());
}
function getNoticiasList(){ 
	db.transaction(function(tx){getDBNoticiasList(tx);} , errorCB);
}

/*
 * Parte Actualisacion
 */
/*
 * Parte del codigo responsable de la actualisacion de la base NoticiasContent
 * 
 */
function insertNoticiasDB(tx,obj){
	//alert(obj);
	for(var i = 0; typeof(obj[i])!= "undefined"; i++){
		tx.executeSql('INSERT INTO NoticiasContent (id, catid ,Titulo ,fulltext ,introtext) VALUES ("'
				+ obj[i].id
				+ '","'
				+ obj[i].catid
				+ '","'
				+ obj[i].title
				+ '","'
				+ obj[i].fulltext
				+ '","'
				+ obj[i].introtext
				+ '")');
	}

}
function updateNoticiasDB(data){
	var obj = JSON.parse(data);
	//obj=JSON.parse(obj);
	//alert(obj);
//	alert(obj.data);
	//alert(obj.data[0]);
//	alert(obj.extras);
	/*alert("INSERT INTO Eventos (id, Titulo, Desc, FechaIni, FechaFin) VALUES ('"
														+ obj[i].id
														+ "','"
														+ obj[i].Titulo
														+ "','"
														+ obj[i].text
														+ "','"
														+ obj[i].FechaIni
														+ "','"
														+ obj[i].FechaFin
														+ "')");*/
	var type='Noticias';
	if(obj.data !=null)
	db.transaction(function(tx){insertNoticiasDB(tx,obj.data)},function (err){errorUpdate(err,"NoticiasContent")},function (){successUpdate("NoticiasContent");updateExtraNoticias(obj.extras);}); 
//	db.transaction(function(tx){insertNoticiasDB(tx,obj[1])},function (err){errorUpdate(err,"NoticiasContent")},function (){successUpdate("NoticiasContent");}); 
}

function updateNoticias(){
	console.log("inside update Noticias");
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	$.ajax({
		type : 'GET', // Le type de ma requete
		url : 'http://www.proyectored.com.ar/mobile/getNoticias.php', // L'url vers laquelle la requete sera envoyee
		success : function(data, textStatus, jqXHR){
		//	alert(data);
			updateNoticiasDB(data);
			//updateExtraNoticias();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Problema de connexion' + textStatus+ " : " + errorThrown);
		}
	});
}

/*
 * Parte del codigo responsable de la actualisacion de los Extras de la base Noticias
 * 
 */
function insertExtraNoticiasDB(tx,obj){
	//for(var j=0; typeof(obj[j])!= "undefined";j++){
	//alert("inside  insert Extra Noticias");
	//alert(obj);
	for(var i = 0; i<obj.length; i++){

		for(var j=0;j<obj[i].length;j++){
			//alert(obj[i][j]);
			//alert(obj[i][j].externalId  + obj[i][j].key +obj[i][j].value)
			if(obj[i][j].externalId && obj[i][j].key && obj[i][j].value){	
				if(obj[i][j].key=="img"){ 
						enableImg(obj[i][j].externalId,"NoticiasContent");
						downloadImg(obj[i][j],"Noticias");
					tx.executeSql('INSERT INTO ExtraNoticias (externalId, key, value) VALUES ("'
							+ obj[i][j].externalId
							+ '","'
							+ obj[i][j].key
							+ '","'
							+ obj[i][j].externalId // Como las imagenes son guardadas sigun el id del elementos a que se refieren value=externalId
							+ '")');
					}
				else{
				tx.executeSql('INSERT INTO ExtraNoticias (externalId, key, value) VALUES ("'
						+ obj[i][j].externalId
						+ '","'
						+ obj[i][j].key
						+ '","'
						+ obj[i][j].value
						+ '")');
				}
			}
		}
	}
	successUpdate("NoticiasCat");
	//	}
}

function updateExtraNoticiasDB(data){
	var obj = JSON.parse(data);
	//alert(obj);
	//alert(obj[i]);
	/*alert("INSERT INTO Eventos (id, Titulo, Desc, FechaIni, FechaFin) VALUES ('"
													+ obj[i].id
													+ "','"
													+ obj[i].Titulo
													+ "','"
													+ obj[i].text
													+ "','"
													+ obj[i].FechaIni
													+ "','"
													+ obj[i].FechaFin
													+ "')");*/
//	db.transaction(function(tx){insertExtraNoticiasDB(tx,obj);},function (err){errorUpdate(err,"ExtrasNoticias")},function (){successUpdate("ExtrasNoticias");});
}

function updateExtraNoticias(obj) {
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	db.transaction(function(tx){insertExtraNoticiasDB(tx,obj);},function (err){errorUpdate(err,"ExtrasNoticias")},function (){successUpdate("ExtrasNoticias");});
}
