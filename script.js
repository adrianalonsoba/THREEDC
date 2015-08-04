
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
var figures1=[];
var figures2=[];
var interval_index=0;

// initialization
  //getJSON call, draw cubes with data
   $.getJSON("jsons/scm-evolutionary.json", function(data) {
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

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );

    ////////////
  // EVENTS //
  ////////////

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
   var light = new THREE.PointLight(0xffffff,1, 100000);
   light.position.set(250,250,250);
   scene.add(light);

   var light = new THREE.PointLight(0xffffff,1, 100000);
   light.position.set(250,-250,250);
   scene.add(light);

   var light = new THREE.PointLight(0xffffff,1, 100000);
   light.position.set(250,250,-250);
   scene.add(light);


   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);

   // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
   var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
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
  // scene.add(skyBox);
   scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

   //////////////
   // GEOMETRY //
   //////////////

//commits
	  var x=0;

	  for (var i = 0; i < json_data.commits.length; i++) {

		  if(json_data.commits[i+1]){
		  	  var charShape = new THREE.Shape();

			  charShape.moveTo(0,0);
		  	  charShape.lineTo( 0, json_data.commits[i]/10 );
		  	  charShape.lineTo( 1.5, json_data.commits[i+1]/10 );

		  	  charShape.lineTo( 1.5, 0 );
			  charShape.lineTo( 0, 0 );

			  var extrusionSettings = {
			    size: 30, height: 4, curveSegments: 3,
			    bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			    material: 0, extrudeMaterial: 1
			  };
			  var charGeometry = new THREE.ExtrudeGeometry( charShape, extrusionSettings );
			  var materialSide = new THREE.MeshLambertMaterial( { color: 0x0000ff} );

			  var extrudeChart = new THREE.Mesh( charGeometry, materialSide );
			  extrudeChart.position.set(x,0,0);
			  x+=1.5;
			  //scene.add(extrudeChart);
			  figures1.push(extrudeChart);
			}
		}

//authors
	  var x=0;

	  for (var i = 0; i < json_data.authors.length; i++) {

		  if(json_data.authors[i+1]){
		  	  var charShape = new THREE.Shape();

			  charShape.moveTo(0,0);
		  	  charShape.lineTo( 0, json_data.authors[i]/10 );
		  	  charShape.lineTo( 1.5, json_data.authors[i+1]/10 );

		  	  charShape.lineTo( 1.5, 0 );
			  charShape.lineTo( 0, 0 );

			  var extrusionSettings = {
			    size: 30, height: 4, curveSegments: 3,
			    bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			    material: 0, extrudeMaterial: 1
			  };
			  var charGeometry = new THREE.ExtrudeGeometry( charShape, extrusionSettings );
			  var materialSide = new THREE.MeshLambertMaterial( { color: 0xff0000} );

			  var extrudeChart = new THREE.Mesh( charGeometry, materialSide );
			  extrudeChart.position.set(x,0,100);
			  x+=1.5;
			  //scene.add(extrudeChart);
			  figures2.push(extrudeChart);
			}
		}

	// initialize object to perform world/screen calculations
	projector = new THREE.Projector();

	// when the mouse moves, call the given function
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	/////// draw text on canvas /////////

	// create a canvas element
	canvas1 = document.createElement('canvas');
	context1 = canvas1.getContext('2d');
	context1.font = "Bold 20px Arial";
	context1.fillStyle = "rgba(0,0,0,0.95)";
    context1.fillText('Hello, world!', 0, 20);
    
	// canvas contents will be used for a texture
	texture1 = new THREE.Texture(canvas1) 
	texture1.needsUpdate = true;
	
	////////////////////////////////////////

	
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft } );
	
	sprite1 = new THREE.Sprite( spriteMaterial );
	sprite1.scale.set(200,100,1.0);
	sprite1.position.set( 50, 50, 0 );
	scene.add( sprite1 );	

	//////////////////////////////////////////

	//GUI//
	var gui = new dat.GUI();
	
	parameters = 
	{
		reset: function() { resetFixedcharts() }
	};
	

	gui.add( parameters, 'reset' ).name("Reset");
	
	gui.close();
	//////


	setInterval(function(){
		if(figures1[interval_index]){
			scene.add(figures1[interval_index]);
			scene.add(figures2[interval_index]);
			interval_index++;
		}
	},5);
	
}

function resetFixedcharts (argument) {
	for (var i = 0; i < figures1.length; i++) {
		scene.remove(figures1[i]);
		scene.remove(figures2[i]);

	};
	interval_index=0;
	setInterval(function(){
		if(figures1[interval_index]){
			scene.add(figures1[interval_index]);
			scene.add(figures2[interval_index]);
			interval_index++;
		}
	},5);
}

function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return "#"+c()+c()+c();
}

function onDocumentMouseMove( event ) 
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	// update sprite position
	sprite1.position.set( event.clientX, event.clientY - 20, 0 );
	
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onDocumentMouseDown( event ) 
{
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( scene.children );
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		create_fixed_chart(intersects[0].object);
	}
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

function create_mini_chart (args) {
	if(args.info){
		scene.remove(current_mini_chart1);
		scene.remove(current_mini_chart2);

		var geometry = new THREE.CubeGeometry( 10,args.info.commits/10 , 10);
		var material = new THREE.MeshLambertMaterial( {color: "#0000ff"} );
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(0, args.info.commits/10/2, 30);
		cube.name = "Commits:"+args.info.commits+" - "+args.info.date;
		scene.add(cube);
		current_mini_chart1=cube;

		geometry = new THREE.CubeGeometry( 10,args.info.authors/10 , 10);
		material = new THREE.MeshLambertMaterial( {color: "#ff0000"} );
		cube = new THREE.Mesh(geometry, material);
		cube.position.set(20, args.info.authors/10/2, 30);
		cube.name = "Autors:"+args.info.authors+" - "+args.info.date;;
		scene.add(cube);
		current_mini_chart2=cube;
	}
}

function create_fixed_chart (args) {
	var geometry = new THREE.CubeGeometry( 10,args.info.commits/10 , 10);
	var material = new THREE.MeshLambertMaterial( {color: "#0000ff"} );
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(0, args.info.commits/10/2, dis);
	cube.name = "Commits:"+args.info.commits+" - "+args.info.date;
	scene.add(cube);

	fixed_minicharts.push(cube);

	geometry = new THREE.CubeGeometry( 10,args.info.authors/10 , 10);
	material = new THREE.MeshLambertMaterial( {color: "#ff0000"} );
	cube = new THREE.Mesh(geometry, material);
	cube.position.set(20, args.info.authors/10/2, dis);
	cube.name = "Autors:"+args.info.authors+" - "+args.info.date;;
	scene.add(cube);

	fixed_minicharts.push(cube);
	dis+=30;
}


function update()
{
	
	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( scene.children );

	// INTERSECTED = the object in the scene currently closest to the camera 
	//		and intersected by the Ray projected from the mouse position 	
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED ) 
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED ) 
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			// set a new color for closest object
			INTERSECTED.material.color.setHex( 0xffff00 );
			
			// update text, if it has a "name" field.
			if ( intersects[ 0 ].object.name )
			{
			    context1.clearRect(0,0,640,480);
				var message = intersects[ 0 ].object.name;
				var metrics = context1.measureText(message);
				var width = metrics.width;
				context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
				context1.fillRect( 0,0, width+8,20+8);
				context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
				context1.fillRect( 2,2, width+4,20+4 );
				context1.fillStyle = "rgba(0,0,0,1)"; // text color
				context1.fillText( message, 4,20 );
				texture1.needsUpdate = true;
				create_mini_chart(intersects[ 0 ].object);
			}
			else
			{
				context1.clearRect(0,0,300,300);
				texture1.needsUpdate = true;
			}
		}
	} 
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ) 
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
		context1.clearRect(0,0,300,300);
		texture1.needsUpdate = true;
	}
	controls.update();
}



