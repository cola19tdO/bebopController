var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bebop = require('node-bebop');
var drone = bebop.createClient();
var fs = require('fs');

var flightPlanCoordinates = [];

var saveJSON = function(){
  var j = {"latlng":flightPlanCoordinates};
  console.log(j);
  var jsonObject = JSON.stringify(j);
  console.log(jsonObject);
  //save to file

  fs.writeFile('latlng.json', jsonObject, 'utf8', function(){
    console.log("saved to file");
  });
}

//drone controller page declaration
app.get('/drone', function(req, res){
  res.sendfile('client.html');
});

//declaration of jquery
app.get('/jquery.js', function(req, res){
  res.sendfile('jquery.js');
});

app.get('/bebop.js', function(req, res){
  res.sendfile('bebop.js');
});


app.get('/maps', function(req, res){
  res.sendfile('maps.html');
});



drone.connect(function() {  
  drone.GPSSettings.resetHome();
drone.WifiSettings.outdoorSetting(1);
 console.log("connected to drone", drone.Settings.GPSSettings);

   
});

//listener of battery life
drone.on("battery", function(data) {
    console.log("battery data, ", data);
    io.emit('batteryLevel', data.toString()
    );
});

/*drone.on("GPSFixStateChanged", function(data) {
    console.log("GPSFixStateChanged", data);
    io.emit('gps', data.toString());
});*/

drone.on("PositionChanged", function(data) {
  //data.latitude  data.longitude
  if(data.latitude !== 500 && data.longitude !== 500){
    flightPlanCoordinates.push({lat: data.latitude, lng: data.longitude});
  }
  console.log(flightPlanCoordinates);
    console.log(data);
    io.emit('gps', data);
});

//when connection with socket
io.on('connection', function(socket){
  console.log('io connection established');


  fs.readFile('latlng.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    console.log(obj);
    io.emit('latLng', obj.latlng);
    
    }
  });
  
  
  socket.on('takeOff', function(msg){
    console.log('takeOff');
    drone.takeOff();

  });

  socket.on('landing', function(msg){
    console.log('landing');
    drone.land();
    saveJSON();

  });

  socket.on('left', function(msg){
    console.log('left ', parseInt(msg));
    drone.left(parseInt(msg));

  });

  socket.on('right', function(msg){
    console.log('right: ', parseInt(msg));
    drone.left(parseInt(msg));

  });
  
  socket.on('up', function(msg){
    console.log('up ', parseInt(msg));
    drone.up(parseInt(msg));

  });

  socket.on('down', function(msg){
    console.log('down: ', parseInt(msg));
    drone.down(parseInt(msg));

  });

  socket.on('forward', function(msg){
    console.log('forward ', parseInt(msg));
    drone.forward(parseInt(msg));

  });

  socket.on('backward', function(msg){
    console.log('backward: ', parseInt(msg));
    drone.backward(parseInt(msg));

  });

  socket.on('clockwise', function(msg){
    console.log('clockwise ', parseInt(msg));
    drone.clockwise(parseInt(msg));

  });

  socket.on('counterclockwise', function(msg){
    console.log('counterclockwise: ', parseInt(msg));
    drone.counterClockwise(parseInt(msg));

  });

  socket.on('frontFlip', function(msg){
    console.log('frontFlip: ', parseInt(msg));
    drone.frontFlip();

  });

  socket.on('stop', function(msg){
    console.log('stop: ', parseInt(msg));
    drone.stop();

  });

   socket.on('emergency', function(msg){
    console.log('emergency: ', parseInt(msg));
    drone.emergency();

  });

});





http.listen(3000, function(){
  console.log('listening on *:3000');
});