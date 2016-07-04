
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;

//JSON data saved here
var json_data;

//CROSSFILTER VARS

 var cf;

 var dimByMonth;

 var groupByMonth;

  var dimByOrg;

  var groupByOrg;

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
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(0,200,250);
   scene.add(light);
   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   //scene.add(axes);

  //STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );

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
  console.log(parsed_data);

  //create a dimension by month

  dimByMonth= cf.dimension(function(p) {return p.month;});

  groupByMonth= dimByMonth.group();

  //create a dimension by org

  dimByOrg= cf.dimension(function(p) {return p.org;});

  groupByOrg= dimByOrg.group();


  //create a dimension by author

  dimByAuthor= cf.dimension(function(p) {return p.author;});

  groupByAuthor= dimByAuthor.group();

 //CUSTOM DASHBOARD//

  THREEDC.initializer(camera,scene,renderer);




  var panel=THREEDC.addPanel([0,0,0],3);

  var bars =  THREEDC.barsChart(panel);
  bars.group(groupByOrg)
      .dimension(dimByOrg)
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .gridsOn()
      .depth(30)
      .numberOfYLabels(4)
      .color(0x00ffff);

   var line =  THREEDC.barsChart(panel);
       line.group(groupByAuthor)
      .dimension(dimByAuthor)
      .gridsOn()
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .depth(30)
      .color(0xff0000);


    var line =  THREEDC.lineChart(panel);
       line.group(groupByMonth)
      .dimension(dimByMonth)
      .width(400)
      .numberOfXLabels(7)
      .numberOfYLabels(5)
      .gridsOn()
      .depth(30)

      .height(200)
      .color(0x0000ff);



 




  THREEDC.renderAll();

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
  stats.update();
}