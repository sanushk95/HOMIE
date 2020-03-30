(function () {

	let socket=io.connect("http://localhost:3000");
	let motionElement= document.querySelector("#motionElement");
	let thermElement= document.querySelector("#thermElement");
	//let button=document.querySelector("#light_button");
	
	socket.on("motion",function(e){
		console.log();
		if(e){
			motionElement.innerHTML='Motion Active';
		}else{
			motionElement.innerHTML='Motion InActive';
		}
		
	});
	
	socket.on("multi",function(e){
		console.log(e);
		thermElement.innerHTML=multi;
		if(e){
			thermElement.innerHTML='Temperture Active';
		}else{
			thermElement.innerHTML='Temperture InActive';
		}
	});
})();

