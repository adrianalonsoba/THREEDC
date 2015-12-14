
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
   light.position.set(0,200,250);
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


  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
    new THREE.MeshBasicMaterial( { transparent:true,opacity:0.5,side: THREE.DoubleSide,visible: false } )
  );
  plane.rotation.x = Math.PI / 2; //xz plane

   pie= new THREEDC.pieChart([-150,0,0]);
   pie.group(groupByOrg)
     .radius(100)
     .dimension(dimByOrg);
     //pie.removeEvents();

  var bars2 =  THREEDC.barsChart([0,0,0]);
  bars2.group(groupByMonth)
      .dimension(dimByMonth)
      .width(200)
      .height(200)
      .color(0xff0000);

  var bars =  THREEDC.barsChart([0,0,100]);
  bars.group(groupByOrg)
      .dimension(dimByOrg)

var line =THREEDC.lineChart([100,100,100]);
    line.dimension(dimByMonth)
        .group(groupByMonth);

  THREEDC.renderAll();


  //GUI//
  var gui = new dat.GUI();

  parameters =
  {
    plane:"XZ",
    activate:false
  };

  var folder1 = gui.addFolder('Drag');
  var activateDrag = folder1.add( parameters, 'activate' ).name('On/Off').listen();
  activateDrag.onChange(function(value) 
    { dragTrigger(); });
  var dragChange = folder1.add( parameters, 'plane', [ "XZ", "XY" ] ).name('Plane').listen();
  dragChange.onChange(function(value) 
  {   changePLane();   });
  folder1.close();

  gui.close();

}

function dragTrigger () {
  if(parameters.activate){
    scene.add( plane );
    domEvents.bind(plane, 'mouseup', function(object3d){
      console.log('mouseup de plano');
      if(THREEDC.chartToDrag){
        THREEDC.chartToDrag.reBuild();
        controls.enabled=true;
        container.style.cursor = 'auto';
        SELECTED=null;
        THREEDC.chartToDrag=null;
        plane.material.visible=false;
      }
    });    
    window.addEventListener( 'mousemove', onMouseMove, false );
  }else{
    window.removeEventListener( 'mousemove', onMouseMove, false );
    scene.remove( plane );
    domEvents.unbind(plane, 'mouseup');
  }
}

function changePLane () {
  if (parameters.plane==='XY'){
    plane.rotation.set(0,0,0); //xy plane
  }else if(parameters.plane==='XZ'){
    plane.rotation.x = Math.PI / 2; //xz plane
  }
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;   

  raycaster.setFromCamera( mouse, camera );

  if(SELECTED){
    plane.material.visible=true;
    var intersects = raycaster.intersectObject( plane );
    if ( intersects.length > 0 ) {
      //SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
      // AL HACERLO PUNTO A PUNTO SE CREA UN DESPLAZAMIENTO QUE NO PASA CON EL position.copy
      //SELECTED.position.x=intersects[ 0 ].point.sub( offset ).x;
      //SELECTED.position.y=intersects[ 0 ].point.sub( offset ).y;
      //SELECTED.position.z=intersects[ 0 ].point.sub( offset ).z;

     // THREEDC.chartToDrag.coords[0]=intersects[ 0 ].point.sub( offset ).x;
      //THREEDC.chartToDrag.coords[1]=intersects[ 0 ].point.sub( offset ).y;
      //THREEDC.chartToDrag.coords[2]=intersects[ 0 ].point.sub( offset ).z;
      //for (var i = 0; i < THREEDC.chartToDrag.parts.length; i++) {
        //THREEDC.chartToDrag.parts[i].position.copy(intersects[ 0 ].point.sub( offset ) );
      //};
      THREEDC.chartToDrag.coords.copy(intersects[ 0 ].point.sub( offset ));
      THREEDC.chartToDrag.reBuild();
    }
    return;
  }
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