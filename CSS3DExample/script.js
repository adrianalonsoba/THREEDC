
// standard global variables
var container, scene, camera, renderer, sceneCSS,rendererCSS,containerCSS3D;

//objetc which will contain the library functions 
var dash;



var Element = function ( id, x, y, z, ry ) {

  var div = document.createElement( 'div' );
  div.style.width = '480px';
  div.style.height = '360px';
  div.style.backgroundColor = '#000';

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = '480px';
  iframe.style.height = '360px';
  iframe.style.border = '0px';
  iframe.src = [ 'web-THREEDC/index.html' ].join( '' );
  div.appendChild( iframe );

  var object = new THREE.CSS3DObject( div );
  object.position.set( x, y, z );
  object.rotation.y = ry;

  return object;
};

init();
animate();

function init () {

   ///////////
   // SCENES //
   ///////////
   scene = new THREE.Scene();
   sceneCSS = new THREE.Scene();

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
   //scene.add(camera);
   // the camera defaults to position (0,0,0)
   //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
   camera.position.set(-553,584,868);

   //////////////
   // RENDERER WEBGL //
   //////////////
   renderer = new THREE.WebGLRenderer( {antialias:true} );
   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer.setClearColor( 0xd8d8d8 );

    //////////////
   // RENDERER CSS3D //
   //////////////

  rendererCSS = new THREE.CSS3DRenderer();
  rendererCSS.setSize( window.innerWidth, window.innerHeight );
  rendererCSS.domElement.style.position = 'absolute';
 // rendererCSS.domElement.style.visibility = 'hidden';

  rendererCSS.domElement.style.top = 0;
  containerCSS3D = document.getElementById( 'CSS3D' );
  containerCSS3D.appendChild( rendererCSS.domElement );

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );


  ////////////
  // EVENTS //
  ////////////


  // Block iframe events when dragging camera

  var blocker = document.getElementById( 'blocker' );
  blocker.style.display = 'none';

  document.addEventListener( 'mousedown', function () { blocker.style.display = ''; } );
  document.addEventListener( 'mouseup', function () { blocker.style.display = 'none'; } );


  // automatically resize renderer
  THREEx.WindowResize(renderer, camera);
  THREEx.WindowResize(rendererCSS, camera);

   ///////////
   // LIGHTS //
   ///////////
   var light1 = new THREE.PointLight(0xffffff,0.8);
   light1.position.set(0,2500,2500);
   scene.add(light1);

   var light2 = new THREE.PointLight(0xffffff,0.8);
   light2.position.set(-2500,2500,-2500);
   scene.add(light2);

   var light3 = new THREE.PointLight(0xffffff,0.8);
   light3.position.set(2500,2500,-2500);
   scene.add(light3);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);


   //////////////
   //CSS3D ELEMENTS//
   //////////////


  group = new THREE.Group();
  group.add( new Element( 'njCDZWTI-xg', 0, 0, 0, 0 ) );
 // group.add( new Element( 'HDh4uK9PvJU', 240, 0, 0, Math.PI / 2 ) );
  //group.add( new Element( 'OX9I1KyNa8M', 0, 0, - 240, Math.PI ) );
  //group.add( new Element( 'nhORZ6Ep_jE', - 240, 0, 0, - Math.PI / 2 ) );
  group.position.set(-600,0,0)
  //sceneCSS.add( group );

   //////////////
   //CUSTOM CHARTS//
   //////////////

  //data for the example

  var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

          {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

          {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

          {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

  //the empty object will be returned with the library functions
  dash = THREEDC({},camera,scene,renderer,container,sceneCSS);

  //create a 3D bars chart with the data above at the position (0,0,0)



  var panel =dash.addPanel([0,0,0],4,[800,400]);
  panel.addIframe('web-THREEDC/index.html');

   dash.renderAll();

}

function animate(){
   requestAnimationFrame( animate );
   render();
   update();
}

function render(){
   renderer.render( scene, camera );
   rendererCSS.render( sceneCSS, camera );
}

function update(){
  
  dash.controls.update();
  //group.position.set(camera.position.x,camera.position.y,camera.position.z);
}