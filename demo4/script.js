
//////////  
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
//JSON data saved here
var json_data;
//var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var projector, mouse = { x: 0, y: 0 }, INTERSECTED;


// initialization
  //getJSON call, draw cubes with data
   $.getJSON("../jsons/scm-evolutionary.json", function(data) {
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
  // scene.add(skyBox);
   scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

   //////////////
   // GEOMETRY //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")

   //data in json_data

  //COMMITS
  var charShape = new THREE.Shape();
  charShape.moveTo( 0,0 );

  var x=0;

  for (var i = 0; i < json_data.commits.length; i++) {
    charShape.lineTo( x, json_data.commits[i]/10 );
    x+=1.5;
  };
  charShape.lineTo( x, 0 );
  charShape.lineTo( 0, 0 );


  var extrusionSettings = {
    size: 30, height: 4, curveSegments: 3,
    bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
    material: 0, extrudeMaterial: 1
  };

  var charGeometry = new THREE.ExtrudeGeometry( charShape, extrusionSettings );
  
  //var materialFront = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
  var materialSide = new THREE.MeshLambertMaterial( { color: 0x0000ff,transparent:true,opacity:0.5 } );
  //var materialArray = [ materialFront, materialSide ];
 // var extrudeChartMaterial = new THREE.MeshFaceMaterial(materialArray);
  
  var extrudeChart = new THREE.Mesh( charGeometry, materialSide );
  extrudeChart.position.set(0,0,0);
  scene.add(extrudeChart);

  //AUTHORS
  var charShape = new THREE.Shape();
  charShape.moveTo( 0,0 );

  var x=0;

  for (var i = 0; i < json_data.commits.length; i++) {
    charShape.lineTo( x, json_data.authors[i]/10 );
    x+=1.5;
  };
  charShape.lineTo( x, 0 );
  charShape.lineTo( 0, 0 );


  var extrusionSettings = {
    size: 30, height: 4, curveSegments: 3,
    bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
    material: 0, extrudeMaterial: 1
  };

  var charGeometry = new THREE.ExtrudeGeometry( charShape, extrusionSettings );
  
  //var materialFront = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  var materialSide = new THREE.MeshLambertMaterial( { color: 0xff0000,transparent:true,opacity:0.5} );
  //var materialArray = [ materialFront, materialSide ];
  //var extrudeChartMaterial = new THREE.MeshFaceMaterial(materialArray);
  
  var extrudeChart = new THREE.Mesh( charGeometry,  materialSide  );
  extrudeChart.position.set(0,0,100);
  scene.add(extrudeChart);
  

 // var rectGeom = new THREE.ShapeGeometry( charShape );
 //var rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshLambertMaterial( { color: 0xff0000 } ) ) ;   

 // scene.add( rectMesh );


  // initialize object to perform world/screen calculations
  projector = new THREE.Projector();
  
  // when the mouse moves, call the given function
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );


}

function onDocumentMouseMove( event ) 
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();
  
  // update the mouse variable
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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
  // find intersections

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  projector.unprojectVector( vector, camera );
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects( scene.children );

  // INTERSECTED = the object in the scene currently closest to the camera 
  //    and intersected by the Ray projected from the mouse position  
  
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    // if the closest object intersected is not the currently stored intersection object
    if ( intersects[ 0 ].object != INTERSECTED ) 
    {
        // restore previous intersection object (if it exists) to its original color
      if ( INTERSECTED ) 
        //INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        INTERSECTED.material.opacity= 0.5;

      // store reference to closest object as current intersection object
      INTERSECTED = intersects[ 0 ].object;
      // store color of closest object (for later restoration)
      //INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

      // set a new color for closest object
     // INTERSECTED.material.color.setHex( 0xffff00 );
      INTERSECTED.material.opacity=1;

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
  }
  
  controls.update();
  //stats.update();
}

