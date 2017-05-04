var socket = io();

    var speed = 5;
    

    var refreshOperation = function(name){
       $("#operation").text("");
      $("#operation").append("Actual operation: <b>" + name +"</b>");
    }
   
    var takeOff = function() {
      console.log("takeoff func");
      refreshOperation("takeOff");
      socket.emit('takeOff', 'takeOff msg');

    }

    var landing = function(){
       console.log("landing func");
       refreshOperation("landing");
      socket.emit('landing', 'landing msg');
    }

    var left = function(){
       console.log("left func");
       refreshOperation("left");
      socket.emit('left', speed);
    }

    var right = function(){
       console.log("right func");
       refreshOperation("right");
      socket.emit('right', speed);
    }

    var forward = function(){
       console.log("forward func");
       refreshOperation("forward");
      socket.emit('forward', speed);
    }

    var backward = function(){
       console.log("backward func");
       refreshOperation("backward");
      socket.emit('backward', speed);
    }

    var up = function(){
       console.log("up func");
       refreshOperation("up");
      socket.emit('up', speed);
    }

    var down = function(){
       console.log("down func");
       refreshOperation("down");
      socket.emit('down', speed);
    }

    var clockwise = function(){
       console.log("clockwise func");
       refreshOperation("clockwise");
      socket.emit('clockwise', speed);
    }
    
    var counterclockwise = function(){
       console.log("counterclockwise func");
       refreshOperation("counterclockwise");
      socket.emit('counterclockwise', speed);
    }

    var frontFlip = function(){
       console.log("frontFlip func");
        refreshOperation("frontFlip");
      socket.emit('frontFlip', speed);
    }

     var stop = function(){
       console.log("stop func");
        refreshOperation("stop");
      socket.emit('stop', speed);
    }

     var emergency = function(){
       console.log("emergency func");
        refreshOperation("emergency");
      socket.emit('emergency', speed);
    }

    var increaseSpeed = function(){
       console.log("increaseSpeed func");
      speed+=5;
      $("#speed").text("Actual speed: " + speed);
    }

    var decreaseSpeed = function(){
       console.log("decreaseSpeed func");
      speed-=5;
      $("#speed").text("Actual speed: " + speed);
    }


    socket.on('batteryLevel', function(data){
        $("#batteryLevel").text("Battery level: " + data);
    });
//{ latitude: 500, longitude: 500, altitude: 500 }
     socket.on('gps', function(data){
        $("#gps").text("Latitude: " + data.latitude + ", longitude: " + data.longitude + ", altitude: " + data.altitude);
    });

    $("body").keydown(function (event) {
      
      switch(event.keyCode){
        case 38:
              forward();
              break;
        case 40:
              backward();
              break;
        case 37:
              left();
              break;
        case 39:
              right();
              break;
        case 32:
              landing();
        case 50:
              increaseSpeed();
              break;
        case 49:
              decreaseSpeed();
              break;
        case 87:
              up();
              break;
        case 83:
              down();
              break;
        case 65:
              clockwise();
              break;
        case 68:
              counterclockwise();
              break;
        case 66:
              frontFlip();
              break;
        case 76:
              stop();
              break;


      }
      //38 up
      //40 down
      //37 left
      //39 right
      //32 space
      //49 1
      //50 2
      //87 w
      //83 s
      //65 a
      //68 d
      //66 b
      //76 l
    });
   $("#speed").text("Actual speed: <b>" + speed+"</b>");
    