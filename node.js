//libraries for data exhange inside node js server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//bebop drone client libraries
var bebop = require('node-bebop');
var drone = bebop.createClient();
//library for file stream (i/o)
var fs = require('fs');

//latlng coordinates of a single drone fly
var latLngCoordinates = [];

var saveJSON = function(){
  var j = {"latlng":latLngCoordinates};
  console.log(j);
  var jsonObject = JSON.stringify(j);
  console.log(jsonObject);
  //save to file

  fs.writeFile('latlng.json', jsonObject, 'utf8', function(){
    console.log("saved to file");
  });
}

/**SERVER HTTP API**/
//drone page declaration
app.get('/drone', function(req, res){
  res.sendfile('client.html');
});

//declaration of jquery library
app.get('/jquery.js', function(req, res){
  res.sendfile('jquery.js');
});

//set of js functions for handling and displaing data on client.html page
app.get('/bebop.js', function(req, res){
  res.sendfile('bebop.js');
});

//page which uses latlng.json file (stored in server root dir) to present fly path on google maps
app.get('/maps', function(req, res){
  res.sendfile('maps.html');
});


//when drone is connected this callback funct is called.
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


//listener of gps change
drone.on("PositionChanged", function(data) {
  //if data is different than 500 means it reads gps signal properly
  if(data.latitude !== 500 && data.longitude !== 500){
    //new gps data is pushed to array
    latLngCoordinates.push({lat: data.latitude, lng: data.longitude});
  }
  console.log(latLngCoordinates);
  //emmiting key-value to html pages
  io.emit('gps', data);
});

//when connection with socket appears (when someone opens /bebop or /maps page)
io.on('connection', function(socket){
  console.log('io connection established');

  //Reading json file with coordinates to show on map
  fs.readFile('latlng.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    console.log("json loaded");
    io.emit('latLng', obj.latlng);
    
    }
  });
  
  //when sockets gets such message from client site it triggers proper actions in drone
  socket.on('takeOff', function(msg){
    console.log('takeOff');
    drone.takeOff();

  });

  socket.on('landing', function(msg){
    console.log('landing');
    drone.land();
    //Json with data is saved after landing button is pressed
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

//http server is set to port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});