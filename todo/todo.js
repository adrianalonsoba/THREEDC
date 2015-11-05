//smooth curve line chart example
var curve = new THREE.SplineCurve3( [
  new THREE.Vector3( 0, 0, 0 ),
  new THREE.Vector3( 5, 5, 0 ),
  new THREE.Vector3( 5, 0, 0 )
] );

var geometry = new THREE.Geometry();
geometry.vertices = curve.getPoints( 50 );

var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

//Create the final Object3d to add to the scene
var splineObject = new THREE.Line( geometry, material );

scene.add(splineObject);

// line chart  example

  var lineGeometry = new THREE.Geometry();
  var vertArray = lineGeometry.vertices;
  vertArray.push( new THREE.Vector3(-150, -100, 0), new THREE.Vector3(-150, 100, 0) );
  lineGeometry.computeLineDistances();
  var lineMaterial = new THREE.LineBasicMaterial( { color: 0xcc0000 } );
  var line = new THREE.Line( lineGeometry, lineMaterial );
  scene.add(line);
