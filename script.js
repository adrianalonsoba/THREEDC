
//////////  
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
//var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();


// custom global variables
var cube;

// initialization
init();


// animation loop / game loop
animate();

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
   renderer = new THREE.WebGLRenderer( {antialias:false} );
   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );

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
   var light = new THREE.PointLight(0xffffff);
   light.position.set(0,250,0);
   scene.add(light);
      var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);


   //////////////
   // GEOMETRY //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")

   // Sphere parameters: radius, segments along width, segments along height
   var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 );
   var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0xbf00ff} );
   //create the sphere
   var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
   sphere.position.set(100, 50, -50);
   scene.add(sphere);



   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(100);
   scene.add( axes );

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
   scene.add(floor);
   
   var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
   // BackSide: render faces from inside of the cube, instead of from outside (default).
   var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
   var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
   scene.add(skyBox);

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