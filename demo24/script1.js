
//////////
// MAIN //
//////////

// standard global variables
var container1, scene1, camera1, renderer1;

var d1;

init1();
animate1();

function init1 () {
   ///////////
   // scene1 //
   ///////////
   scene1 = new THREE.Scene();

   ////////////
   // camera1 //
   ////////////
   // set the view size in pixels (custom or according to window size)
   var SCREEN_WIDTH = 600;
   var SCREEN_HEIGHT = 600;
   // camera1 attributes
   var VIEW_ANGLE = 45;
   var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
   var NEAR = 0.1;
   var FAR = 20000;
      // set up camera1
   camera1 = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
   // add the camera1 to the scene1
   scene1.add(camera1);
   // the camera1 defaults to position (0,0,0)
   //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene1 origin
   camera1.position.set(0,150,400);
   camera1.lookAt(scene1.position);

  //////////////
   // renderer1 //
   //////////////
   renderer1 = new THREE.WebGLRenderer( {antialias:true} );
   renderer1.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer1.setClearColor( 0xd8d8d8 );

   // attach div element to variable to contain the renderer1
   container1 = document.getElementById( 'ThreeJS1' );
   // attach renderer1 to the container1 div
   container1.appendChild( renderer1.domElement );

   ///////////
   // LIGHT //
   ///////////
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(0,2500,2500);
   scene1.add(light);

   var axes = new THREE.AxisHelper(1000);
   scene1.add(axes);


   //////////////
   // CUSTOM //
   //////////////

   // most objects displayed are a "mesh":
   //  a collection of points ("geometry") and
   //  a set of surface parameters ("material")


    //3Ddata without CF

  var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

            {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

            {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

            {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ]; 

   d1 = THREEDC({},camera1,scene1,renderer1,container1);

   var panel=d1.addPanel([0,0,0],3);

  bars = d1.TDbarsChart([0,0,0]);
  bars
      .data(data)
      .width(400)
      .height(500)
      .depth(400)
      .barSeparation(0.8)
    //  .addCustomEvents(testFunction)
      .opacity(0.95)
      .color(0xffaa00)
      .gridsOn(0xffffff);

      d1.renderAll();

}

function animate1()
{
   requestAnimationFrame( animate1 );
   render1();
   update1();
}

function render1()
{
   renderer1.render( scene1, camera1 );
}

function update1()
{
  d1.controls.update();
}