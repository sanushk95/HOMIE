(function () {

	let socket=io.connect("http://localhost:3000");
	let motionElement= document.querySelector("#motionElement");
	let thermElement= document.querySelector("#thermElement");
	let lightElement =document.querySelector("#lightElement");
	let humidityElement = document.querySelector("#humidityElement");

	socket.on("motionElement",function(data){	
			
		if(data==true)
		{
			motionElement.innerHTML = `<h3>Active</h3>`;
		}
		else
		{
			motionElement.innerHTML = `<h3>Inactive</h3>`;
		}
	});
	socket.on("temp", (data) => {
		thermElement.innerHTML = data;
	});
	socket.on("humidity",function(data){	
		humidityElement.innerHTML=data;	
	});
	socket.on("lightsensor", (data) => {
		lightElement.innerHTML = data;
	});
})();



