
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
var pie;
// custom global variables
var projector, mouse = { x: 0, y: 0 };
var sprite1;
//graphical user interface
var gui;
var parameters;

var  extrudeOpts = {curveSegments:30, amount: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };

var domEvents;

// drag variables
var objects = [], plane;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

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
   $.getJSON("jsons/scm-commits.json", function(data) {
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
   renderer.setClearColor( 0x9999ff );

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );

    ////////////
  // EVENTS //
  ////////////

  //with this, we can use standard dom events without raycasting
  domEvents  = new THREEx.DomEvents(camera, renderer.domElement)

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
   light.position.set(0,100,250);
   scene.add(light);
   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);

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

  //create a dimension by month

  dimByMonth= cf.dimension(function(p) {return p.month;});

  groupByMonth= dimByMonth.group();

  //create a dimension by org

  dimByOrg= cf.dimension(function(p) {return p.org;});

  groupByOrg= dimByOrg.group();

/*
  var pie3 = new THREEDC.pieChart([-50,-50,-50]);
  pie3.showCoords();
  pie3.group=groupByOrg;
  pie3.draw();

  var pie3 = new THREEDC.pieChart([50,50,50]);
  pie3.showCoords();
  pie3.group=groupByOrg;
  pie3.draw();



  var bars = new THREEDC.barsChart([50,50,50]);
  bars.group(groupByMonth)
      .dimension(dimByMonth);

  var pie= new THREEDC.pieChart([0,0,0]);
  pie.group(groupByOrg)
  	 .dimension(dimByOrg);


  var pie= new THREEDC.pieChart([-100,0,0]);
  pie.group(groupByMonth)
     .dimension(dimByMonth);

  var line = new THREEDC.lineChart([-50,50,50]);
  line.group(groupByMonth);

  

  var bubbles= new THREEDC.bubbleChart([100,0,0]);

  bubbles.group(groupByOrg)
         .dimension(dimByOrg);


  var pie= new THREEDC.pieChart([-100,0,0]);
  pie.group(groupByOrg)
     .dimension(dimByOrg);


  var pie2= new THREEDC.pieChart([300,300,0]);
  pie2.group(groupByOrg)
     .dimension(dimByOrg)
     .radius(500);


  var bars = new THREEDC.barsChart([50,50,50]);
  bars.group(groupByMonth)
      .dimension(dimByMonth);

   var bars = new THREEDC.barsChart([-50,50,50]);
  bars.group(groupByMonth)
      .dimension(dimByMonth);

  var line = new THREEDC.simpleLineChart([-50,-50,50]);
  line.group(groupByMonth);

    var line = new THREEDC.lineChart([+150,-50,50]);
  line.group(groupByMonth);


*/
  var bars1 =  THREEDC.barsChart([0,0,0]);
  bars1.group(groupByMonth)
      .dimension(dimByMonth)
      .width(200)
      .height(200);

  var bars2 =  THREEDC.barsChart([-50,-220,0]);
  bars2.group(groupByOrg)
      .dimension(dimByOrg)
      .width(200)
      .height(200)
      .color(0xff0000);



   pie= new THREEDC.pieChart([-120,100,0]);
   pie.group(groupByOrg)
     .radius(100)
     .dimension(dimByOrg);
     //pie.removeEvents();

  THREEDC.renderAll();

  var geometry = new THREE.CubeGeometry( 500, 500, 2);
  var origin_color=0x0000ff;
  var material = new THREE.MeshPhongMaterial( {
                                               specular: 0x999999,
                                               shininess: 100,
                                               shading : THREE.SmoothShading,
                                               opacity:0.3,
                                               transparent: true
    } );

  var bar = new THREE.Mesh(geometry, material);
  scene.add(bar);

   var gridXY = new THREE.GridHelper(250, 10);
  gridXY.rotation.x = Math.PI/2;
  scene.add(gridXY);

  //pie.reBuild();

  //THREEDC.removeAll();

  //pie.removeEvents();




/*
  var geometry = new THREE.CubeGeometry( 100, 100, 100);
  var material = new THREE.MeshPhongMaterial( {color: 0x0000ff} );
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
domEvents.bind(cube, 'mouseover', function(object3d){ 
	console.log(11111);
});

domEvents.bind(cube, 'click', function(object3d){ 
	domEvents.unbind(cube, 'mouseover', function(object3d){ 
		console.log(11111);
	});
});

*/
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