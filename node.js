var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bebop = require('node-bebop');
var drone = bebop.createClient();



//drone controller page declaration
app.get('/drone', function(req, res){
  res.sendfile('client.html');
});

//declaration of jquery
app.get('/jquery.js', function(req, res){
  res.sendfile('jquery.js');
});


//drone connection, enabling video
drone.connect(function() {  
 console.log("connected to drone");
   
});

//listener of battery life
drone.on("battery", function(data) {
    console.log("battery data, ", data);
    io.emit('batteryLevel', data.toString()
    );
});

//when connection with socket
io.on('connection', function(socket){
  console.log('io connection established');
  
  socket.on('takeOff', function(msg){
    console.log('takeOff');
    drone.takeOff();

  });

  socket.on('landing', function(msg){
    console.log('landing');
    drone.land();

  });

  socket.on('left', function(msg){
    console.log('left');
    drone.left(5);

  });

  socket.on('right', function(msg){
    console.log('right');
    drone.right(5);

  });
  

});



http.listen(3000, function(){
  console.log('listening on *:3000');
});