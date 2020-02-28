let socket=io.connect("http://localhost:3000");
let therm= document.querySelector("#thermometer");
let button=document.querySelector("#light_button");
let motion=document.querySelector('#motion_toggle');

socket.on('temperature',function(temperature){
	console.log(temperature);
	therm.innerHTML=temperature;
});
function toggleLight(){
	socket.emit('light_status');
	console.log("emit light")
}
function readMotion(){
	socket.emit('motion_status');
	console.log("motion");
}
button.addEventListener("click",toggleLight);
