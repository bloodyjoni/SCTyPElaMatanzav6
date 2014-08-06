/*CROSS-TYPE
* Parte del codigo responsable de la actualisacion grafica y del empezamiento del processo de actualizacion
*
*/
function errorUpdate(err,type) {
	$( "#updt"+type ).text(type+" Nada para actualizar");
}
function successUpdate(type) {
	$( "#updt"+type ).text(type+" HECHO");
}
function updateAll(){
  //  alert("inside update all");
	updateEventos();
	updateNoticias();
	updatePPublicasCat();
}
/*
 * Parte del codigo responsable de la actualisacion de la base Noticias
 * 
 */
function insertNoticiasDB(tx,obj){
	for(var i = 0; typeof(obj[i])!= "undefined"; i++){
		tx.executeSql('INSERT INTO Noticias (id, Titulo, text, FechaIni, FechaFin) VALUES ("'
				+ obj[i].id
				+ '","'
				+ obj[i].Titulo
				+ '","'
				+ obj[i].text
				+ '","'
				+ obj[i].FechaIni
				+ '","'
				+ obj[i].FechaFin
				+ '")');
	}

}
function updateNoticiasDB(data){
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
	var type='Noticias';
	db.transaction(function(tx){insertNoticiasDB(tx,obj)},function (err){errorUpdate(err,"Noticias")},function (){successUpdate("Noticias");}); 

}

function updateNoticias(diferenceStr){
	console.log("inside update noticias");
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	$.ajax({
		type : 'GET', // Le type de ma requete
		url : 'http://www.proyectored.com.ar/mobile/UPDTNoticias.php', // L'url vers laquelle la requete sera envoyee
		data : {
			currid:  getCurrentDBId('Noticias'),
			minid: getMinDBId('Noticias'),
			diference: diferenceStr,
		},
		success : function(data, textStatus, jqXHR){
			//alert(data);
			updateNoticiasDB(data);
			updateExtraNoticias();
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
	for(var i = 0; i<obj.length; i++){
		for(var j=0;j<obj[i].length;j++){
		//	alert(obj[i][j]);
		//	alert(obj[i][j].externalId  + obj[i][j].key +obj[i][j].value)
			if(obj[i][j].externalId && obj[i][j].key && obj[i][j].value){	
				tx.executeSql('INSERT INTO ExtraNoticias (externalId, key, value) VALUES ("'
						+ obj[i][j].externalId
						+ '","'
						+ obj[i][j].key
						+ '","'
						+ obj[i][j].value
						+ '")');
				if(obj[i][j].key=="img"){ 
					enableImg(obj[i][j].externalId,"Noticias");
					downloadImg(obj[i][j].externalId,"Noticias");
				}
			}
		}
	}
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
	db.transaction(function(tx){insertExtraNoticiasDB(tx,obj);},function (err){errorUpdate(err,"ExtrasNoticias")},function (){successUpdate("ExtrasNoticias");});
}

function updateExtraNoticias() {
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	getNoticiasIds();
}
/*
 * Parte del codigo responsable de la actualisacion de la base Eventos
 * 
 */
function insertEventosDB(tx,obj){
	for(var i = 0; typeof(obj[i])!= "undefined"; i++){
		tx.executeSql('INSERT INTO Eventos (id, Titulo, text, FechaIni, FechaFin) VALUES ("'
				+ obj[i].id
				+ '","'
				+ obj[i].Titulo
				+ '","'
				+ obj[i].text
				+ '","'
				+ obj[i].FechaIni
				+ '","'
				+ obj[i].FechaFin
				+ '")');
	}

}
function updateEventosDB(data){
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
	var type='Eventos';
	db.transaction(function(tx){insertEventosDB(tx,obj)},function (err){errorUpdate(err,"Eventos")},function (){successUpdate("Eventos");}); 
}

function updateEventos(diferenceStr){
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	console.log("inside update noticias");
	$.ajax({
		type : 'GET', // Le type de ma requete
		url : 'http://www.proyectored.com.ar/mobile/UPDTEventos.php', // L'url vers laquelle la requete sera envoyee
		data : {
			currid:  getCurrentDBId('Eventos'),
			minid: getMinDBId('Eventos'),
			diference: diferenceStr,
		},
		success : function(data, textStatus, jqXHR){
			//alert(data);
			updateEventosDB(data);
			updateExtraEventos();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Problema de connexion al servidor' + textStatus+ " : " + errorThrown);
		}
	});
}
/*
 * Parte del codigo responsable de la actualisacion de los Extras de la base Eventos
 * 
 */
function insertExtraEventosDB(tx,obj){
	//for(var j=0; typeof(obj[j])!= "undefined";j++){
//	alert("inside  insert Extra Eventos");
	for(var i = 0; i<obj.length; i++){
		for(var j=0;j<obj[i].length;j++){
			//alert(obj[i][j]);
			//alert(obj[i][j].externalId  + obj[i][j].key +obj[i][j].value)
			if(obj[i][j].externalId && obj[i][j].key && obj[i][j].value){	
				tx.executeSql('INSERT INTO ExtraEventos (externalId, key, value) VALUES ("'
						+ obj[i][j].externalId
						+ '","'
						+ obj[i][j].key
						+ '","'
						+ obj[i][j].value
						+ '")');
				if(obj[i][j].key=="img"){ 
					enableImg(obj[i][j].externalId,"Eventos");
					downloadImg(obj[i][j].externalId,"Eventos");
				}
			}
		}
	}
	//	}
}
function success(dirEntry) {
	console.log("Directory Name: " + dirEntry.name);
}

function updateExtraEventosDB(data){
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
	db.transaction(function(tx){insertExtraEventosDB(tx,obj)},function (err){errorUpdate(err,"ExtrasEventos")},function (){successUpdate("ExtrasEventos");});

}

function updateExtraEventos() {
	//if(typeof(diferenceStr)==='undefined') diferenceStr = "+0 day";
	getEventosIds();

}

//Retrieve an existing directory, or create it if it does not already exist
/*CROSS-TYPE
 * Parte del codigo responsable del descargamiento de imagenes Extras y guardamiento de aquellas en el File system
 * 
 * 
 */
function downloadImg(obj,type){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){onFileSystemSuccess(fileSystem,type,obj);}, fail);
}

function onFileSystemSuccess(fileSystem,type,obj) {
	//alert("directory is "+fileSystem.root.fullPath+type);
	//GeneralConf.appContentPath= fileSystem.root.fullPath;
	fileSystem.root.getDirectory("Android/data/com.elovillo.cytype", {create: true}, function (dirEntry){ onCytypeDirSuccess(dirEntry,type,obj); },onFileSystemSuccessInternal(fileSystem,type,obj)); // si no esta disponible la tarjeta SD and por memoria interna

}
function onFileSystemSuccessInternal(fileSystem,type,obj) {
	//alert("directory is "+fileSystem.root.fullPath+type);
	//GeneralConf.appContentPath= fileSystem.root.fullPath;
	fileSystem.root.getDirectory("/data/data/com.elovillo.cytype", {create: true}, function (dirEntry){ onCytypeDirSuccess(dirEntry,type,obj); },fail);

}
function onCytypeDirSuccess(dirEntry,type,obj){
	
	dirEntry.getDirectory("files", {create: true}, function(dirEntry){ onFilesDirSuccess(dirEntry,type,obj);}, fail);
}
function onFilesDirSuccess(dirEntry,type,obj){
	dirEntry.getDirectory("content", {create: true}, function(dirEntry){ onContentDirSuccess(dirEntry,type,obj);}, fail);
}
function onContentDirSuccess(dirEntry,type,obj){
	console.log(getLocalConfig("appContentPath"));
	if(getLocalConfig("appContentPath")=="file://.") // si no content path ya defenido 
		setLocalConfig("appContentPath",dirEntry.fullPath);
	dirEntry.getDirectory("images", {create: true}, function(dirEntry){ onImagesDirSuccess(dirEntry,type,obj);}, fail);
}
function onImagesDirSuccess(dirEntry,type,obj){
	dirEntry.getDirectory(type, {create: true}, function (dirEntry){onTypeDirSuccess(dirEntry,type,obj);},fail);
}
function onTypeDirSuccess(dirEntry,type,obj){
	console.log("directory is "+dirEntry.fullPath);
	dirEntry.getFile(
			"dummy"+type+".html", {create: true, exclusive: false}, function (fileEntry){gotTypeFileEntry(fileEntry,type,obj);}	,fail);
}
function gotTypeFileEntry(fileEntry,type,obj) {
	var sPath = fileEntry.fullPath.replace("dummy"+type+".html","");
	var fileTransfer = new FileTransfer();
	//fileEntry.remove();

	fileTransfer.download(
			getLocalConfig("rootURL2")+obj.value,
			sPath + obj.externalId+".jpg",
			function(theFile) {
				console.log("download complete: " + theFile.toURL());
			},
			function(error) {
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code: " + error.code);
			});
}
function fail(error){
console.log(" download img fail" +error);
}


