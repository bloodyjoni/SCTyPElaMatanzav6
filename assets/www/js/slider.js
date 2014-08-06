$(function(){	

	function gonext() {
		var current = $('a.selectedimg');
		if (current.hasClass('last')) {
			var next = $('a.first');
		} else {
			var next = current.next();
		}			
		var src = next.find('img').attr("src");
		var alt = next.find('img').attr("alt");
		var name = next.find('img').attr("name");
		var fechaini = next.find('img').attr("data-fechaini");
		var fechafin = next.find('img').attr("data-fechafin");
		var id= next.find('img').attr("data-id");
		next.addClass('selectedimg');
		current.removeClass('selectedimg');
		$('#dialogcontent').empty().append("<a href='javascript:goToFicha("+id+',"Eventos")'+"'>"+'<img src="' + src + '" style="width:100%; height:100%;"/></a>');
		$('#dialoghead').empty().append('<center><h3>' + alt +'</br>' +fechaini+' / '+fechafin+'</h3></center>' );
	} 
	
	function goprev() {
	var current = $('a.selectedimg');
		if (current.hasClass('first')) {
			var prev = $('a.last');
		} else {
			var prev = current.prev();
			
		}
		var src = prev.find('img').attr("src");
		var alt = prev.find('img').attr("alt");
		var name = prev.find('img').attr("name");
		var fechaini = prev.find('img').attr("data-fechaini");
		var fechafin = prev.find('img').attr("data-fechafin");
		var id=  prev.find('img').attr("data-id");
		prev.addClass('selectedimg');
		current.removeClass('selectedimg');
		$('#dialogcontent').empty().append("<a href='javascript:goToFicha("+id+',"Eventos")'+"'>"+'<img src="' + src + '" style="width:100%; height:100%;"/></a>');
		$('#dialoghead').empty().append('<center><h3>' + alt +'</br>' +fechaini+' / '+fechafin+'</h3></center>' );
	}
	// esta parte fue copiada en bdd.js para que el slider foncione con la connecion a la base de datos
	/*$('.gallerycontent img').bind('tap',function(event, ui){
		var src = $(this).attr("src");
		var alt = $(this).attr("alt");
		var name = $(this).attr("name");
		$('#dialogcontent').empty().append('<a href="Eventos/'+ name +'.html"><img src="' + src + '" style="width:100%; height:100%;"/></a>' );
		$('#dialoghead').empty().append('<center><h3>' + alt + '</h3></center>' );
		$(this).parent().addClass('selectedimg');
		});
	//*///----------------------------------------------			
	$('#nextbtn').bind('tap',function(event, ui){
		gonext();
	});
				
	$('#imgshow').bind('swipeleft',function(event, ui){
		gonext();
	});
				
	$('#prevbtn').bind('tap',function(event, ui){
		goprev();
	});
				
	$('#imgshow').bind('swiperight',function(event, ui){
		goprev();
	});
/*	$('#dialogcontent').bind('tap',function(event, ui){
		alert($('#dialogcontent').html());
		$('#dialogcontent a').click();
	});
	*/
});