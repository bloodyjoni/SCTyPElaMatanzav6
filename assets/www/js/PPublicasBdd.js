/*
 * Parte correspondiente a la lista en la pagina PoliticasPublicas html 
 */
function getDBPPublicasList(tx,catid){
	tx.executeSql('Select id,Titulo,fulltext,introtext,catid from PPublicasContent where catid='+catid+' ', [], function (tx,results){querySuccessPPublicas(tx,results,catid);}, errorCB);


}

//modificate here to get the full item results
function querySuccessPPublicas(tx, results,catid) {

	var len = results.rows.length;
	console.log("Tabla PPublicasContent: " + len + " filas encontradas.");
	$('#PPublicasCat'+catid).empty();
//$('#PPublicasCat'+catid).append='<ul></ul>');//here appending `<ul>` into `<li>`
		
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#PPublicasCat'+catid).append($('<li/>', { 
			'data-id':results.rows.item(i).id//here appending `<li>`
		}).append(function(){
			if(results.rows.item(i).img=='true'){
				return $('<img/>',{
					'src': getLocalConfig("appContentPath")+'/images/PPublicas/'+results.rows.item(i).id+'.jpg',
					'class':'thumb'
				})}})
				.append($('<a/>',{    //here appending `<a>` into `<li>`
					'href': 'javascript:goToFicha('+results.rows.item(i).id+',"PPublicas")',
					'data-transition': 'slide',
					'text': results.rows.item(i).Titulo
				})));

		$('#PPublicasCat'+catid).listview('refresh');
		//alert($('#PPublicasCat'+catid).html());
	}
	//alert($('#PPublicasCat'+catid).html());
}
function getPPublicasList(catid){ 
	db.transaction(function(tx){getDBPPublicasList(tx,catid);} , errorCB);
}
/*
 * Parte correspondiente a la lista en la pagina PoliticasPublicas html 
 */
function getDBPPublicasCatList(tx){
	tx.executeSql('Select id,Titulo from PPublicasCategorias', [], querySuccessPPublicasCat, errorCB);


}

//modificate here to get the full item results
function querySuccessPPublicasCat(tx, results) {

	var len = results.rows.length;
	console.log("Tabla PPublicasCategorias: " + len + " filas encontradas.");
	$('#listPPCategorias').empty();
	for (var i=0; i<len; i++){
		//	alert(results.rows.item(i).img);
		$('#listPPCategorias').append($('<li/>', { 
			
			'data-id':results.rows.item(i).id,//here appending `<li>`
			'text': results.rows.item(i).Titulo
		}).append($('<ul/>', { 
			'id': "PPublicasCat"+results.rows.item(i).id,
			'data-id':results.rows.item(i).id,//here appending `<li>`
			})));
		/*.append(function(){
			if(results.rows.item(i).img=='true'){
				return $('<img/>',{
					'src': getLocalConfig("appContentPath")+'/images/PPublicas/'+results.rows.item(i).id+'.jpg',
					'class':'thumb'
				})}})
		/*.append($('<a/>',{    //here appending `<a>` into `<li>`
					//'href': 'javascript:goToFicha('+results.rows.item(i).id+',"PPublicas")',
					'href': '#',
					'data-transition': 'slide',
					'text': results.rows.item(i).Titulo
				}))
		*/
			
			
		
		//getPPublicasList(results.rows.item(i).id);
		$('#listPPCategorias').listview('refresh');
		//alert($('#listPPCategorias').html());
		
		getPPublicasList(results.rows.item(i).id);
	}
	//alert($('#listPPCategorias').html());
}
function getPPublicasCatList(){ 
	db.transaction(getDBPPublicasCatList , errorCB);
}
/*
 * Parte Actualisacion
 */
/*
 * Parte del codigo responsable de la actualisacion de la base PPublicasContent
 * 
 */
function insertPPublicasDB(tx,obj){
	alert(obj);
	for(var i = 0; typeof(obj[i])!= "undefined"; i++){
		tx.executeSql('INSERT INTO PPublicasContent (id, catid ,Titulo ,fulltext ,introtext) VALUES ("'
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
function updatePPublicasDB(data){
	var obj = JSON.parse(data);
	//obj=JSON.parse(obj);
	//alert(obj);
	alert(obj.data);
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
	var type='PPublicas';
	if(obj.data !=null)
	db.transaction(function(tx){insertPPublicasDB(tx,obj.data)},function (err){errorUpdate(err,"PPublicasContent")},function (){successUpdate("PPublicasContent");updateExtraPPublicas(obj.extras);}); 
//	db.transaction(function(tx){insertPPublicasDB(tx,obj[1])},function (err){errorUpdate(err,"PPublicasContent")},function (){successUpdate("PPublicasContent");}); 
}

function updatePPublicas(catid){
	console.log("inside update PPublicas");
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	$.ajax({
		type : 'GET', // Le type de ma requete
		url : 'http://www.proyectored.com.ar/mobile/getPPContent.php?idCategoria='+catid, // L'url vers laquelle la requete sera envoyee
		success : function(data, textStatus, jqXHR){
			alert(data);
			updatePPublicasDB(data);
			//updateExtraPPublicas();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Problema de connexion' + textStatus+ " : " + errorThrown);
		}
	});
}
/*
 * Parte Actualisacion
 */
/*
 * Parte del codigo responsable de la actualisacion de la base PPublicasCategorias
 * 
 */
function insertPPublicasCatDB(tx,obj){
	for(var i = 0; typeof(obj[i])!= "undefined"; i++){
		tx.executeSql('INSERT INTO PPublicasCategorias (id, Titulo) VALUES ("'
				+ obj[i].id
				+ '","'
				+ obj[i].title
				+ '")');
		updatePPublicas(obj[i].id);

	}
	
}
function updatePPublicasCatDB(data){
	var obj = JSON.parse(data);
	alert(obj);
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
	var type='PPublicas';
	db.transaction(function(tx){insertPPublicasCatDB(tx,obj)},function (err){errorUpdate(err,"PPublicasCat")},function (){successUpdate("PPublicasCat");}); 

}

function updatePPublicasCat(){
	console.log("inside update PPublicasCat");
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	$.ajax({
		type : 'GET', // Le type de ma requete
		url : 'http://www.proyectored.com.ar/mobile/getPPItems.php', // L'url vers laquelle la requete sera envoyee
		success : function(data, textStatus, jqXHR){
			alert(data);
			updatePPublicasCatDB(data);
			//updateExtraPPublicas();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Problema de connexion' + textStatus+ " : " + errorThrown);
		}
	});
}
/*
 * Parte del codigo responsable de la actualisacion de los Extras de la base PPublicas
 * 
 */
function insertExtraPPublicasDB(tx,obj){
	//for(var j=0; typeof(obj[j])!= "undefined";j++){
	alert("inside  insert Extra PPublicas");
	alert(obj);
	for(var i = 0; i<obj.length; i++){

		for(var j=0;j<obj[i].length;j++){
			alert(obj[i][j]);
			alert(obj[i][j].externalId  + obj[i][j].key +obj[i][j].value)
			if(obj[i][j].externalId && obj[i][j].key && obj[i][j].value){	
				if(obj[i][j].key=="img"){ 
						enableImg(obj[i][j].externalId,"PPublicasContent");
						downloadImg(obj[i][j],"PPublicas");
					tx.executeSql('INSERT INTO ExtraPPublicas (externalId, key, value) VALUES ("'
							+ obj[i][j].externalId
							+ '","'
							+ obj[i][j].key
							+ '","'
							+ obj[i][j].externalId // Como las imagenes son guardadas sigun el id del elementos a que se refieren value=externalId
							+ '")');
					}
				else{
				tx.executeSql('INSERT INTO ExtraPPublicas (externalId, key, value) VALUES ("'
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
	successUpdate("PPublicasCat");
	//	}
}

function updateExtraPPublicasDB(data){
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
//	db.transaction(function(tx){insertExtraPPublicasDB(tx,obj);},function (err){errorUpdate(err,"ExtrasPPublicas")},function (){successUpdate("ExtrasPPublicas");});
}

function updateExtraPPublicas(obj) {
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	db.transaction(function(tx){insertExtraPPublicasDB(tx,obj);},function (err){errorUpdate(err,"ExtrasPPublicas")},function (){successUpdate("ExtrasPPublicas");});
}