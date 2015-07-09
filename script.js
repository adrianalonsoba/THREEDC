
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

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")

   //COMMITS
   var z=1;
   var y=0;
   var x=1;

   for(var j=0;j<5;j++){
	   for (var i = 0; i < json_data.commits.length; i++) {
   		//commit values are normalized to optimal visualization(/10)
			var geometry = new THREE.CubeGeometry( 1, json_data.commits[i]/10, 1);
			y=json_data.commits[i]/10/2;
			var material = new THREE.MeshLambertMaterial( {color: "#0000ff"} );
			var cube = new THREE.Mesh(geometry, material);
			cube.position.set(x, y, z);
			scene.add(cube);
			x+=1;
	   };
	   x=0;
	   z+=1;
   }
   //AUTHORS
   var z=20;
   var y=0;
   var x=1;

   for(var j=0;j<5;j++){
	   for (var i = 0; i < json_data.authors.length; i++) {
   		//author values are normalized to optimal visualization(/10)
			var geometry = new THREE.CubeGeometry( 1, json_data.authors[i]/10, 1);
			y=json_data.authors[i]/10/2;
			var material = new THREE.MeshLambertMaterial( {color: "#ff0000"} );
			var cube = new THREE.Mesh(geometry, material);
			cube.position.set(x, y, z);
			scene.add(cube);
			x+=1;
	   };
	   x=0;
	   z+=1;
   }


}

function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return "#"+c()+c()+c();
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
   // delta = change in time since last call (in seconds)
   var delta = clock.getDelta(); 
   controls.update();
}

function makeTextSprite( message, parameters )
{
   if ( parameters === undefined ) parameters = {};
   
   var fontface = parameters.hasOwnProperty("fontface") ? 
      parameters["fontface"] : "Arial";
   
   var fontsize = parameters.hasOwnProperty("fontsize") ? 
      parameters["fontsize"] : 18;
   
   var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
      parameters["borderThickness"] : 4;
   
   var borderColor = parameters.hasOwnProperty("borderColor") ?
      parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
   
   var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

   var spriteAlignment = THREE.SpriteAlignment.topLeft;
      
   var canvas = document.createElement('canvas');
   var context = canvas.getContext('2d');
   context.font = "Bold " + fontsize + "px " + fontface;
    
   // get size data (height depends only on font size)
   var metrics = context.measureText( message );
   var textWidth = metrics.width;
   
   // background color
   context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                          + backgroundColor.b + "," + backgroundColor.a + ")";
   // border color
   context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                          + borderColor.b + "," + borderColor.a + ")";

   context.lineWidth = borderThickness;
   roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
   // 1.4 is extra height factor for text below baseline: g,j,p,q.
   
   // text color
   context.fillStyle = "rgba(0, 0, 0, 1.0)";

   context.fillText( message, borderThickness, fontsize + borderThickness);
   
   // canvas contents will be used for a texture
   var texture = new THREE.Texture(canvas) 
   texture.needsUpdate = true;

   var spriteMaterial = new THREE.SpriteMaterial( 
      { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
   var sprite = new THREE.Sprite( spriteMaterial );
   sprite.scale.set(100,50,1.0);
   return sprite; 
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
   ctx.stroke();   
}