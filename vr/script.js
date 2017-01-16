

      if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

      var container;

      var camera, scene, renderer, effect;

      var mesh, lightMesh, geometry;
      var spheres = [];

      var directionalLight, pointLight;

      var mouseX = 0, mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );


      init();
      animate();

      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
     camera.position.set(0,150,800);



        scene = new THREE.Scene();


   camera.lookAt(scene.position);
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

        var geometry = new THREE.SphereGeometry( 100, 32, 16 );

        var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

        for ( var i = 0; i < 50; i ++ ) {

          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = Math.random() * 10000 - 5000;
          mesh.position.y = Math.random() * 10000 - 5000;
          mesh.position.z = Math.random() * 10000 - 5000;
          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
          scene.add( mesh );

          spheres.push( mesh );

        }

      
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xd8d8d8 );
        container.appendChild( renderer.domElement );

        effect = new THREE.StereoEffect( renderer );
        effect.setSize( window.innerWidth, window.innerHeight );


        window.addEventListener( 'resize', onWindowResize, false );


    //3Ddata without CF

  var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

            {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

            {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

            {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

  //4D data

      var data2= [{key1:'january',key2:'apple',value:23,value2:Math.random()*50},{key1:'february',key2:'apple',value:31,value2:Math.random()*50},{key1:'march',key2:'apple',value:10,value2:Math.random()*50},{key1:'april',key2:'apple',value:59,value2:Math.random()*50},

              {key1:'january',key2:'google',value:34,value2:Math.random()*50},{key1:'february',key2:'google',value:89,value2:Math.random()*50},{key1:'march',key2:'google',value:53,value2:Math.random()*50},{key1:'april',key2:'google',value:76,value2:Math.random()*50},

              {key1:'january',key2:'sony',value:34,value2:Math.random()*50},{key1:'february',key2:'sony',value:89,value2:Math.random()*50},{key1:'march',key2:'sony',value:53,value2:Math.random()*50},{key1:'april',key2:'sony',value:76,value2:Math.random()*50}


      ];


    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

      dash = THREEDC({},camera,scene,renderer,container);

      dash.controls.enabled=false;


      var bubbles= dash.bubbleChart([-100,0,0]);

      bubbles.data(data2)
           .width(500)
           .height(400)
           .gridsOn()
           .depth(400);

         var bars= dash.TDbarsChart([700,0,0]);

      bars.data(data)
           .width(500)
           .opacity(0.9)
           .height(400)
           .gridsOn(0xffaa00)
           .depth(400);



     dash.renderAll();


      }

      function onWindowResize() {th

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        effect.setSize( window.innerWidth, window.innerHeight );

      }

      function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;

      }

      //

      function animate() {

        requestAnimationFrame( animate );

        render();
        update();

      }

      function render() {

        var timer = 0.0001 * Date.now();

        /*

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        */

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {

          var sphere = spheres[ i ];

          sphere.position.x = 5000 * Math.cos( timer + i );
          sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

        }

        effect.render( scene, camera );

      }

function update()
{
    controls.update();
 // dash.controls.update();
  //stats.update();
}