
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
  var cf2=crossfilter(parsed_data);

  //create a dimension by month

  dimByMonth= cf.dimension(function(p) {return p.month;});

  groupByMonth= dimByMonth.group();

  //create a dimension by org

  dimByOrg= cf.dimension(function(p) {return p.org;});

  groupByOrg= dimByOrg.group();


  //create a dimension by author

  dimByAuthor= cf.dimension(function(p) {return p.author;});

  groupByAuthor= dimByAuthor.group();



    //create a dimension by month

  var dimByMonth2= cf2.dimension(function(p) {return p.month;});

 var groupByMonth2= dimByMonth2.group();

  //create a dimension by org

  var dimByOrg2= cf2.dimension(function(p) {return p.org;});

   var groupByOrg2= dimByOrg2.group();


  //create a dimension by author

 var dimByAuthor2= cf2.dimension(function(p) {return p.author;});

  var groupByAuthor2= dimByAuthor2.group();

 //CUSTOM DASHBOARD//

  THREEDC(camera,scene,renderer,container);


//PANEL 1

  var panel1=THREEDC.addPanel([0,0,-200],2,[300,500],0.2);



    var bars1 =  THREEDC.barsChart(panel1);
     bars1.group(groupByOrg)
     .width(300)
     .height(250)
     .color(0xffff00)
      .dimension(dimByOrg)
      .depth(20);

    var line1 =  THREEDC.smoothCurveChart(panel1);
       line1.group(groupByMonth)
      .dimension(dimByMonth)
      .gridsOn()
      .numberOfXLabels(5)
      .numberOfYLabels(8)
      .width(300)
      .height(250)
      .color(0xff00ff);




//PANEL 2
   var panel2=THREEDC.addPanel([0,0,0],3);

  var bars2 =  THREEDC.barsChart(panel2);
  bars2.group(groupByOrg2)
      .dimension(dimByOrg2)
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .gridsOn()
      .depth(30)
      .numberOfYLabels(4)
      .color(0x00ffff);

   var line2 =  THREEDC.barsChart(panel2);
       line2.group(groupByAuthor2)
      .dimension(dimByAuthor2)
      .gridsOn()
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .depth(30)
      .color(0xff8000);


    var line22 =  THREEDC.lineChart(panel2);
       line22.group(groupByMonth2)
      .dimension(dimByMonth2)
      .width(400)
      .numberOfXLabels(7)
      .numberOfYLabels(5)
      .gridsOn()
      .depth(30)

      .height(200)
      .color(0x0000ff);


//PANEL 3

 var panel3=THREEDC.addPanel([-600,0,0],3,[400,200]);


    var bars3 =  THREEDC.barsChart(panel3);
       bars3.group(groupByAuthor)
      .dimension(dimByAuthor)
      .width(200)
      .numberOfXLabels(50)
      .numberOfYLabels(5)
      .gridsOn()
      .height(100)
      .depth(20)
      .color(0x00ffff);
  var pie3 =  THREEDC.pieChart(panel3);
     pie3.group(groupByOrg)
      .dimension(dimByOrg)
      .radius(50)
      .depth(20);

    var line3 =  THREEDC.barsChart(panel3);
       line3.group(groupByMonth)
      .dimension(dimByMonth)
      .width(400)
      .numberOfXLabels(10)
      .numberOfYLabels(5)
      .gridsOn()
      .depth(20)
      .height(100)
      .color(0xff0000);


//panel4

  var panel4=THREEDC.addPanel([700,0,0],4);

  var bars4 =  THREEDC.barsChart(panel4);
  bars4.group(groupByOrg)
      .dimension(dimByOrg)
      .width(200)
      .opacity(1)
      .height(200)
      .numberOfXLabels(7)
      .gridsOn()
      .numberOfYLabels(4)
      .color(0xff8000);

    var line4 =  THREEDC.lineChart(panel4);
       line4.group(groupByMonth)
      .dimension(dimByMonth)
      .width(200)
      .numberOfXLabels(50)
      .numberOfYLabels(5)
      .gridsOn()
      .depth(50)
      .height(200)
      .color(0x40ff00);



    var line4 =  THREEDC.smoothCurveChart(panel4);
       line4.group(groupByMonth)
      .dimension(dimByMonth)
      .gridsOn()
      .width(200)
      .height(200)
      .color(0xff0040);

  var bars4 =  THREEDC.pieChart(panel4);
  bars4.group(groupByOrg)
      .dimension(dimByOrg)
      .radius(100);



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