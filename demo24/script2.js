
//////////
// MAIN //
//////////

// standard global variables
var container2, scene2, camera2, renderer2;

var d2;

init2();
animate2();

function init2 () {
   ///////////
   // scene2 //
   ///////////
   scene2 = new THREE.Scene();

   ////////////
   // camera2 //
   ////////////
   // set the view size in pixels (custom or according to window size)
   var SCREEN_WIDTH = 600;
   var SCREEN_HEIGHT = 600;
   // camera2 attributes
   var VIEW_ANGLE = 45;
   var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
   var NEAR = 0.1;
   var FAR = 20000;
      // set up camera2
   camera2 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
   // add the camera2 to the scene2
   scene2.add(camera2);
   // the camera2 defaults to position (0,0,0)
   //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene2 origin
   camera2.position.set(0,150,400);
   camera2.lookAt(scene2.position);

  //////////////
   // renderer2 //
   //////////////
   renderer2 = new THREE.WebGLRenderer( {antialias:true} );
   renderer2.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer2.setClearColor( 0xd8d8d8 );

   // attach div element to variable to contain the renderer2
   container2 = document.getElementById( 'ThreeJS2' );
   // attach renderer2 to the container2 div
   container2.appendChild( renderer2.domElement );

   ///////////
   // LIGHT //
   ///////////
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(0,2500,2500);
   scene2.add(light);

   var axes = new THREE.AxisHelper(1000);
   scene2.add(axes);

   //////////////
   // CUSTOM //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")


    //3Ddata without CF

  var data= [{key:'january',value:23},{key:'february',value:31},{key:'march',value:10},{key:'april',value:59}];


   d2 =  THREEDC(camera2,scene2,renderer2,container2);

  pie= d2.pieChart([-100,0,0]);
  pie
    .radius(100)
    .data(data)

      d2.renderAll();

}

function animate2()
{
   requestAnimationFrame( animate2 );
   render2();
   update2();
}

function render2()
{
   renderer2.render( scene2, camera2 );
}

function update2()
{
 d2.controls.update();
}