(function () {

	let socket=io.connect("http://localhost:3000");
	let motionElement= document.querySelector("#motionElement");
	let thermElement= document.querySelector("#thermElement");
	let lightElement =document.querySelector("#lightElement");
	let humidityElement = document.querySelector("#humidityElement");

	let motionBody = document.querySelector("#motionBody");

	socket.on("motionElement",function(data){	
			
		if(data==true)
		{
			motionElement.innerHTML = `<em>Active</em>`;
			motionBody.style.opacity = "1.0";
		}
		else
		{
			motionElement.innerHTML = `<i>Inactive</i>`;
			motionBody.style.opacity = "0.05";
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



