
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, stats;

//JSON data saved here
var json_data;

//CROSSFILTER VARS

 var cf;

 var dimByMonth;

 var groupByMonth;

  var dimByOrg;

  var groupByOrg;


  var dimByRepo;

  var groupByRepo;

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
   // LIGHT //
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



  //create a dimension by repository

  dimByRepo= cf.dimension(function(p) {return p.repo;});

  groupByRepo= dimByRepo.group();


  //data without CF

  var data1= [{key:'monday',value:20},{key:'tuesday',value:80},{key:'friday',value:30}];

  var data2= [{key:'may',value:200},{key:'june',value:100},{key:'july',value:250}];

  //example data for cloud

  function getRandomPoints(numberOfPoints){
    var points=[];
    for (var i = 0; i < numberOfPoints; i++) {

      points[i]={x:Math.random()*100,y:Math.random()*100,z:Math.random()*100};
     // console.log(points[i]);
    };
    return points;
  }

    //3Ddata without CF

  var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

            {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

            {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

            {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

      //4Ddata without CF

  var data2= [{key1:'january',key2:'apple',key3:1,value:23},{key1:'february',key2:'apple',key3:2,value:31},{key1:'march',key2:'apple',key3:3,value:10},{key1:'april',key2:'apple',key3:4,value:59},

            {key1:'january',key2:'google',key3:4,value:34},{key1:'february',key2:'google',key3:7,value:89},{key1:'march',key2:'google',key3:9,value:53},{key1:'april',key2:'google',key3:10,value:76},

      
  ];


 //CUSTOM DASHBOARD//

  THREEDC.initializer(camera,scene,renderer,container);

  var bars= THREEDC.TDbarsChart([0,0,0]);
  bars
      .data(data)
      .width(300)
      .height(500)
      .depth(300)
      .opacity(0.8)
      .color(0xffaa00)
      .gridsOn();

  //var cloud= THREEDC.pointsCloudChart([0,0,0]);
  //cloud.getPoints(getRandomPoints(1000));

 // var bars= THREEDC.barsChart([0,0,0]);
  //bars.group(groupByRepo);

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
  THREEDC.controls.update();
  stats.update();
}