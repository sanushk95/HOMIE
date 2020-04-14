var isActive = false;
function Sensor(data) {
  this.value = 0;
  this.read = function () {
    setInterval(this.updateReadings.bind(this), data.interval);
  };
  this.randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  this.updateReadings = function () {
    if (isActive) {
      this.value = this.randomInteger(data.range[0], data.range[1]);
      data.onchange(this);
    }
  };
}
module.exports = {
  EmulatorAdaptor: {
    sensors: [],
    addSensor: function (data) {
      var sensor = new Sensor(data);
      sensor.read();
      this.sensors.push(sensor);
    },
    enable: function () {
      isActive = true;
    },
    disable: function () {
      isActive = false;
    }
  },
  AurdinoUtils: {
    isNumber: function (number) {
      return !isNaN(parseFloat(number)) && !isNaN(number - 0);
    },
    clampInteger: function (value, min, max) {
      value = parseInt(value);
      return Math.min(Math.max(value, min), max);
    },
    getTime: function () {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

}
