//////////  
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
//JSON data saved here
var json_data;

// initialization
  //getJSON call, draw cubes with data
   $.getJSON("../jsons/example.json", function(data) {
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
   scene.add(skyBox);
  // scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

   //////////////
   // GEOMETRY //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")

  var  extrudeOpts = {curveSegments:30, amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

    var val=3;
    var valTotal=50;
    var pieRadius=50;
    var angPrev=0;
    var angToMove;

    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );


    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(val/valTotal));
    shape.moveTo(0,0);
    shape.arc(0,0,pieRadius,angPrev,
              angPrev+angToMove,false);
    shape.lineTo(0,0);
    nextAng = angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );

    var pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(Math.PI/2,0,0);
    // Adds shadows if selected as an option

    scene.add(pieobj );

    angPrev=nextAng;
    val=20;

    var material = new THREE.MeshPhongMaterial( {color: 0x0000ff} );


    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(val/valTotal));
    shape.moveTo(0,0);
    shape.arc(0,0,pieRadius,angPrev,
              angPrev+angToMove,false);
    shape.lineTo(0,0);
    nextAng = angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );

    var pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(Math.PI/2,0,0);
    // Adds shadows if selected as an option

    scene.add(pieobj );
  
    angPrev=nextAng;
    val=7;

    var material = new THREE.MeshPhongMaterial( {color: 0xff00ff} );


    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(val/valTotal));
    shape.moveTo(0,0);
    shape.arc(0,0,pieRadius,angPrev,
              angPrev+angToMove,false);
    shape.lineTo(0,0);
    nextAng = angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );

    var pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(Math.PI/2,0,0);
    // Adds shadows if selected as an option

    scene.add(pieobj );


    angPrev=nextAng;
    val=20;

    var material = new THREE.MeshPhongMaterial( {color: 0xffffff} );


    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(val/valTotal));
    shape.moveTo(0,0);
    shape.arc(0,0,pieRadius,angPrev,
              angPrev+angToMove,false);
    shape.lineTo(0,0);
    nextAng = angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );

    var pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    pieobj = new THREE.Mesh( geometry, material );
    pieobj.rotation.set(Math.PI/2,0,0);
    // Adds shadows if selected as an option

    scene.add(pieobj );

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