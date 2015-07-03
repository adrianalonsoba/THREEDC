   //Escena
   var scene = new THREE.Scene();                  // Creando el objeto escena, donde se añadirán los demás.
			
   //Cámara
   var camera = new THREE.PerspectiveCamera(
	75,                                        // Ángulo de "grabación" de abajo hacia arriba en grados.
	window.innerWidth/window.innerHeight,      // Relación de aspecto de la ventana de la cámara(Ejemplo: 16:9).
	0.1,                                       // Plano de recorte cercano (más cerca no se renderiza).
	1000                                       // Plano de recorte lejano  (más lejos no se renderiza).
	);
			
   camera.position.z = 5;  //Enviar la cámara hacia atrás para poder ver la geometría. Por defecto es z = 0.
			
   //Renderizador
   var renderer = new THREE.WebGLRenderer({antialias:false}); // Utilizar el renderizador WebGL.
   renderer.setSize(window.innerWidth, window.innerHeight);  // Renderizador del tamaño de la ventana.
   document.body.appendChild(renderer.domElement);           // Añadir el renderizador al elemento DOM body.

  //Geometría
   var geometry = new THREE.CubeGeometry(1,1,1);   // Crear geometría cúbica con dimensiones(x, y, z).
   var material = new THREE.MeshLambertMaterial({color: 0xFF0000}); // Crear el material para la
			                                            // geometría y darle color rojo.
   var cube = new THREE.Mesh(geometry, material);  // Crear una malla que agrupará la geometría
			                           // y el material creados anteriormente.
   scene.add(cube);                                // Añadir la malla al objeto escena.
			
   //Luz (requerida para el material MeshLambertMaterial)
   var light = new THREE.PointLight( 0xFFFF00 ); //  Luz proveniente de un punto en el espacio, 
		                                 //  semejante al sol.
   light.position.set( -10, 5, 10 );             //  Localización de la luz. (x, y, z).
   scene.add( light );                           //  Añadir la luz al objeto escena.
			
   // Función para renderizar 
   var render = function () {
	requestAnimationFrame(render);           // la renderización ocurrirá continuamente si la escena está visible.

	cube.rotation.x += 0.03;                 //Velocidad de rotación en el eje x
	cube.rotation.y += 0.03;                 //Velocidad de rotación en el eje y

	renderer.render(scene, camera);          //Renderizar escena cada vez que se ejecuta la función "render()".
   };

   render();