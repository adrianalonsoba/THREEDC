
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
//JSON data saved here
var json_data;
//var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
var sprite1;
//graphical user interface
var gui;
var parameters;


var canvas1, context1, texture1;
var current_mini_chart1;
var current_mini_chart2;
//displacement of fixed minichart
var dis=60;
var fixed_minicharts=[];

var  extrudeOpts = {curveSegments:300, amount: 8, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

var domEvents;


//CROSSFILTER VARS


 var cf;

 var dimByMonth;

 var groupByMonth;

  var dimByOrg;

  var groupByOrg;

  var scene_objects1=[];

  var scene_objects2=[];

// initialization
  //getJSON call, draw meshes with data
   $.getJSON("../jsons/scm-commits.json", function(data) {
      json_data=data;
      init();
      // animation loop / game loop
      animate();
   });

///////////////
// FUNCTIONS //
///////////////

function init () {

   ///////////
   // SCENE //
   ///////////
   scene = new THREE.Scene();

   ////////////
   // CAMERA //
   ////////////
   // set the view size in pixels (custom or according to window size)
   var SCREEN_WIDTH = window.innerWidth;
   var SCREEN_HEIGHT = window.innerHeight;
   // camera attributes
   var VIEW_ANGLE = 45;
   var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
   var NEAR = 0.1;
   var FAR = 20000;
      // set up camera
   camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
   // add the camera to the scene
   scene.add(camera);
   // the camera defaults to position (0,0,0)
   //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
   camera.position.set(0,150,400);
   camera.lookAt(scene.position);

   //////////////
   // RENDERER //
   //////////////
   renderer = new THREE.WebGLRenderer( {antialias:true} );
   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer.setClearColor( 0xf0f0f0 );

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );

    ////////////
  // EVENTS //
  ////////////

  //with this, we can use standard dom events without raycasting
  domEvents  = new THREEx.DomEvents(camera, renderer.domElement)


  // automatically resize renderer
  THREEx.WindowResize(renderer, camera);
    // toggle full-screen on given key press
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

   //////////////
   // CONTROLS //
   //////////////

   // move mouse and: left   click to rotate,
   //                 middle click to zoom,
   //                 right  click to pan
   controls = new THREE.OrbitControls( camera, renderer.domElement );

   ///////////
   // LIGHT //
   ///////////
   var light = new THREE.PointLight(0xffffff,1);
   light.position.set(250,250,250);
   scene.add(light);
   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);

   // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
   var floorTexture = new THREE.ImageUtils.loadTexture( '../images/checkerboard.jpg' );
   floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
   floorTexture.repeat.set( 10, 10 );
   // DoubleSide: render texture on both sides of mesh
   var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
   var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
   var floor = new THREE.Mesh(floorGeometry, floorMaterial);
   floor.position.y = -0.5;
   floor.rotation.x = Math.PI / 2;
  // scene.add(floor);

   var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
   // BackSide: render faces from inside of the cube, instead of from outside (default).
   var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
   var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
   //scene.add(skyBox);

  //clear texture of infobox
  /*
  domEvents.addEventListener(skyBox,'mouseover',function(event) {
      context1.clearRect(0,0,300,300);
      texture1.needsUpdate = true;
  },false);
*/

   //scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

   //////////////
   // CUSTOM //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")

   var parsed_data=[];

    // Crossfilter and dc.js format
    json_data.values.forEach(function (value) {
      var record = {}
      json_data.names.forEach(function (name, index) {
          if (name == "date") {
            var date = new Date(value[index]*1000);
            record[name] = date;
            record.month = new Date(date.getFullYear(), date.getMonth(), 1);
            record.hour = date.getUTCHours();
          } else {
            record[name] = value[index];
          }
      });
      parsed_data.push(record);
    });

   cf=crossfilter(parsed_data);

   //create a dimension by month

    dimByMonth= cf.dimension(function(p) {return p.month;});

    groupByMonth= dimByMonth.group();

   //create a dimension by org

   dimByOrg= cf.dimension(function(p) {return p.org;});

   groupByOrg= dimByOrg.group();

     //by month
  drawBars();

  //by org

  drawPie();


  // initialize object to perform world/screen calculations
  //projector = new THREE.Projector();

  // when the mouse moves, call the given function
  //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  /////// draw text on canvas /////////

  // create a canvas element
  canvas1 = document.createElement('canvas');
  context1 = canvas1.getContext('2d');
  context1.font = "Bold 20px Arial";
  context1.fillStyle = "rgba(0,0,0,0.95)";
  context1.fillText('123456789123456789', 0, 20);

  // canvas contents will be used for a texture
  texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;


  var spriteMaterial = new THREE.SpriteMaterial( { map: texture1 } );
  
  sprite1 = new THREE.Sprite( spriteMaterial );
  sprite1.scale.set(100,50,1.0);
  sprite1.position.set( 50, 50, 0 );
  scene.add( sprite1 ); 

  ////////////////////////////////////////


  //////////////////////////////////////////

  //GUI//
  var gui = new dat.GUI();

  parameters =
  {
    reset: function() { clearFilters() }
  };


  gui.add( parameters, 'reset' ).name("Clear filters");

  gui.close();
  //////

}

function createLabel(text, x, y, z, size, color, backGroundColor, backgroundMargin) {
	if(!backgroundMargin)
		backgroundMargin = 50;
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	context.font = size + "pt Arial";
	var textWidth = context.measureText(text).width;
	canvas.width = textWidth + backgroundMargin;
	canvas.height = size + backgroundMargin;
	context = canvas.getContext("2d");
	context.font = size + "pt Arial";
	if(backGroundColor) {
		context.fillStyle = backGroundColor;
		context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
	}
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = color;
	context.fillText(text, canvas.width / 2, canvas.height / 2);
	// context.strokeStyle = "black";
	// context.strokeRect(0, 0, canvas.width, canvas.height);
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var material = new THREE.MeshBasicMaterial({
		map : texture
	});
	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
	// mesh.overdraw = true;
	mesh.doubleSided = true;
	mesh.position.x = x - canvas.width;
	mesh.position.y = y - canvas.height;
	mesh.position.z = z;
	return mesh;
}

function drawPie () {

    var valTotal=dimByMonth.top(Infinity).length;
    var pieRadius=50;
    var angPrev=0;
    var angToMove=0;

   scene_objects1=[];

   groupByOrg.top(Infinity).forEach(function(p,i) {
   		if(p.value){
			var hex_color=get_random_color();
			var origin_color='0x'+decimalToHexString(hex_color.slice(1,hex_color.length));
			var material = new THREE.MeshPhongMaterial();
			// Creats the shape, based on the value and the radius
			var shape = new THREE.Shape();
			var angToMove = (Math.PI*2*(p.value/valTotal));
			shape.moveTo(0,0);
			shape.arc(0,0,pieRadius,angPrev,
			        angPrev+angToMove,false);
			shape.lineTo(0,0);
			var nextAng = angPrev + angToMove;

			var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );
			var pieobj = new THREE.Mesh( geometry, material );
			pieobj.material.color.setHex(origin_color);
			pieobj.origin_color=origin_color;
			pieobj.rotation.set(0,0,0);
			pieobj.position.set(-75,0,0);
			pieobj.name = "Commits:"+p.value+" Org:"+p.key;
			pieobj.info={
			org:p.key,
			commits:p.value
			}
			scene.add(pieobj );

			scene_objects1.push(pieobj);
			angPrev=nextAng;


			domEvents.bind(pieobj, 'click', function(object3d){ 
				redraw2(pieobj.info.org);
			});

			domEvents.bind(pieobj, 'mouseover', function(object3d){ 
				changeMeshColor(pieobj);
				showInfo(pieobj);
			});

			domEvents.bind(pieobj, 'mouseout', function(object3d){ 
				pieobj.material.color.setHex(pieobj.origin_color);
			});
   		}
   });
}

function drawBars () {

   var z=1;
   var y=0;
   var x=1;

   scene_objects2=[];

   groupByMonth.top(Infinity).forEach(function(p,i) {
      //commit values are normalized to optimal visualization(/10)
      if(p.value){
 		var geometry = new THREE.CubeGeometry( 1, p.value/10, 10);
		y=p.value/10/2;
		var origin_color=0x0000ff;
		var material = new THREE.MeshLambertMaterial( {color: origin_color} );
		var cube = new THREE.Mesh(geometry, material);
		cube.origin_color=origin_color;
		cube.position.set(x, y, z);
		cube.name = "Commits:"+p.value+" "+p.key;
		cube.info={
		month:p.key,
		commits:p.value
		};
		scene_objects2.push(cube);
		scene.add(cube);
		x+=1;

		domEvents.bind(cube, 'click', function(object3d){ 
			redraw1(cube.info.month);
		});

		domEvents.bind(cube, 'mouseover', function(object3d){ 
			changeMeshColor(cube);
			showInfo(cube);
		});

		domEvents.bind(cube, 'mouseout', function(object3d){ 
			cube.material.color.setHex(cube.origin_color);
		});
      }

   });
}

function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

//shows message in a sprite
function showInfo (mesh) {
  context1.clearRect(0,0,640,480);
  var message = mesh.name;
  var metrics = context1.measureText(message);
  var width = metrics.width;
  context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
  context1.fillRect( 0,0, width+8,20+8);
  context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
  context1.fillRect( 2,2, width+4,20+4 );
  context1.fillStyle = "rgba(0,0,0,1)"; // text color
  context1.fillText( message, 4,20 );
  sprite1.position.set( 50,100,0);
  texture1.needsUpdate = true;
}

//changes mesh color when selected
function changeMeshColor (mesh) {
  mesh.material.color.setHex(0xffff00);
}

function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return '#'+c()+c()+c();
}

function clearFilters () {
  for (var i = 0; i < scene_objects1.length; i++) {
	domEvents.unbind(scene_objects1[i], 'click', function(object3d){ 
		redraw2(scene_objects1[i].info.org);
	});

	domEvents.unbind(scene_objects1[i], 'mouseover', function(object3d){ 
		changeMeshColor(scene_objects1[i]);
		showInfo(scene_objects1[i]);
	});

	domEvents.unbind(scene_objects1[i], 'mouseout', function(object3d){ 
		scene_objects1[i].material.color.setHex(scene_objects1[i].origin_color);
	});
    scene.remove(scene_objects1[i]);
  };

  for (var i = 0; i < scene_objects2.length; i++) {
    domEvents.unbind(scene_objects2[i], 'click', function(object3d){
    	redraw1(cube.info.month);
    });
    domEvents.unbind(scene_objects2[i], 'mouseover', function(object3d){ 
    	changeMeshColor(scene_objects2[i]);
    	showInfo(scene_objects2[i]);
    });
	domEvents.unbind(scene_objects2[i], 'mouseout', function(object3d){ 
		scene_objects2[i].material.color.setHex(scene_objects2[i].origin_color);
	});
    scene.remove(scene_objects2[i]);

  };
  dimByMonth.filterAll();
  dimByOrg.filterAll();
  drawBars();
  drawPie();
}

function redraw1 (argument) {

   dimByMonth.filterAll();

  dimByMonth.filter(argument);

  for (var i = 0; i < scene_objects1.length; i++) {
 	domEvents.unbind(scene_objects1[i], 'click', function(object3d){ 
		redraw2(scene_objects1[i].info.org);
	});

	domEvents.unbind(scene_objects1[i], 'mouseover', function(object3d){ 
		changeMeshColor(scene_objects1[i]);
		showInfo(scene_objects1[i]);
	});

	domEvents.unbind(scene_objects1[i], 'mouseout', function(object3d){ 
		scene_objects1[i].material.color.setHex(scene_objects1[i].origin_color);
	});
  	scene.remove(scene_objects1[i]);
  };

  drawPie();

}

function redraw2 (argument) {

  dimByOrg.filterAll();

  dimByOrg.filter(argument);

  for (var i = 0; i < scene_objects2.length; i++) {
    domEvents.unbind(scene_objects2[i], 'click', function(object3d){
    	redraw1(scene_objects2[i]);
    });
    domEvents.unbind(scene_objects2[i], 'mouseover', function(object3d){ 
    	changeMeshColor(scene_objects2[i]);
    	showInfo(scene_objects2[i]);
    });
	domEvents.unbind(scene_objects2[i], 'mouseout', function(object3d){ 
		scene_objects2[i].material.color.setHex(scene_objects2[i].origin_color);
	});
    scene.remove(scene_objects2[i]);
  };

  drawBars();
}

function animate()
{
   requestAnimationFrame( animate );
   render();
   update();
}

function render()
{
   renderer.render( scene, camera );
}

function update()
{
  controls.update();
}