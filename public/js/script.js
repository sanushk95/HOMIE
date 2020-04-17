(function () {

	let socket = io.connect("http://localhost:3000");
	let motionElement = document.querySelector("#motionElement");
	let thermElement = document.querySelector("#thermElement");
	let lightElement = document.querySelector("#lightElement");
	let humidityElement = document.querySelector("#humidityElement");

	let motionBody = document.querySelector("#motionBody");

	socket.on("motionElement", function (data) {

		if (data == true) {
			motionElement.innerHTML = `<em>Active</em>`;
			motionBody.style.opacity = "1.0";
		}
		else {
			motionElement.innerHTML = `<i>Inactive</i>`;
			motionBody.style.opacity = "0.05";
		}
	});
	socket.on("temp", (data) => {
		thermElement.innerHTML = data + ' ℃';
		setOpacity('#temperatureBody', 0.2 + (data / 40));
	});
	socket.on("humidity", function (data) {
		humidityElement.innerHTML = data + '%';
		setOpacity('#humidityBody', 0.2 + (data / 40));
	});
	socket.on("lightsensor", (data) => {
		lightElement.innerHTML = data + ' LDR';
		setOpacity('#lightBody', 0.2 + (data / 1023));
	});

	function setOpacity(elementName, value) {
		let element = document.querySelector(elementName);
		element.style.opacity = value;
	}

	document.getElementById("settingsForm").addEventListener("submit", function(event) {
		event.preventDefault();

		let motion_notif = event.srcElement["0"].checked;
		let temp_notif = event.srcElement["1"].checked;
		let weather_notif = event.srcElement["2"].checked;

		let low_temp = event.srcElement["3"].value;
		let high_temp = event.srcElement["4"].value;
		let room_name = event.srcElement["5"].value;

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(this.status == 200 && this.readyState == 4) {
				let response = JSON.parse(this.responseText);

				if(response.status == "success") {
					alert("Saved Successfully!");
				}
			}
		}

		xhr.open('post', '/preferences');

		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		//let x = JSON.stringify( { room_name: room_name, motion_notif: motion_notif, temp_notif: temp_notif, weather_notif: weather_notif, low_temp: low_temp, high_temp: high_temp } );
		let x = `room_name=${room_name}&motion_notif=${motion_notif}&temp_notif=${temp_notif}&weather_notif=${weather_notif}&low_temp=${low_temp}&high_temp=${high_temp}`;
		
		xhr.send(x);
	});
})();



