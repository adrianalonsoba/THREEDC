
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer;
var myDashBoard;

init();
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
   renderer = new THREE.WebGLRenderer( {antialias:true} );
   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer.setClearColor( 0xd8d8d8 );

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

   ///////////
   // LIGHTS //
   ///////////
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(0,2500,2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(0,2500,2500);
  scene.add( lightbulb );
  
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(-2500,2500,-2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(-2500,2500,-2500);
  scene.add( lightbulb );

   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(2500,2500,-2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(2500,2500,-2500);
  scene.add( lightbulb );


   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);


  myDashBoard = THREEDC.addDashBoard(scene,renderer.domElement);


   var data = [{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 },
               { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }];


  var myPieChart= THREEDC.pieChart();

  myPieChart.data(data);

  myDashBoard.addChart(myPieChart);


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
  myDashBoard.controls.update();
}
