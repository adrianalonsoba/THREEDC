

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
        camera.position.z = 3200;

        scene = new THREE.Scene();

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

        for ( var i = 0; i < 500; i ++ ) {

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
        container.appendChild( renderer.domElement );

        effect = new THREE.StereoEffect( renderer );
        effect.setSize( window.innerWidth, window.innerHeight );


        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

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

      }

      function render() {

        var timer = 0.0001 * Date.now();

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {

          var sphere = spheres[ i ];

          sphere.position.x = 5000 * Math.cos( timer + i );
          sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

        }

        effect.render( scene, camera );

      }