var THREEDC={
	version:'0'
};

var _allCharts=[];

//DA ERROR DE TRIANGULACION POR ??FONTUTILS¿¿
THREEDC.pieChart = function (coords) {
	this.coords=coords;
	this.showCoords=function() {
		console.log('Coords: '+this.coords);
	}

	var  extrudeOpts = {curveSegments:30, amount: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };


    var _valTotal;
    var _pieRadius=50;
    var _angPrev=0;
    var _angToMove=0;

    this.draw= function() {
    	_valTotal=this.group.top(Infinity).length;
    	console.log(_valTotal);
    	this.group.top(Infinity).forEach(function(p,i) {
	   		if(p.value){
	   			console.log(p.value);
				var hex_color=get_random_color();
				var origin_color='0x'+decimalToHexString(hex_color.slice(1,hex_color.length));
				var material = new THREE.MeshPhongMaterial();
				// Creats the shape, based on the value and the radius
				var shape = new THREE.Shape();
				var angToMove = (Math.PI*2*(p.value/_valTotal));
				shape.moveTo(0,0);
				shape.arc(0,0,_pieRadius,_angPrev,
				        _angPrev+_angToMove,false);
				shape.lineTo(0,0);
				var nextAng = _angPrev + _angToMove;

				var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );
				var pieobj = new THREE.Mesh( geometry, material );
				pieobj.material.color.setHex(origin_color);
				pieobj.origin_color=origin_color;
				pieobj.rotation.set(0,0,0);
				pieobj.position.set(-75,0,0);
				pieobj.name = "Commits:"+p.value+" Org:"+p.key;
				pieobj.info={
					org:p.key,
					commits:p.value
				}
				//scene.add(pieobj );
				angPrev=nextAng;
			}
		});
    }
}

THREEDC.barsChart = function (coords){

	this.coords=coords;
	this.showCoords=function() {
		console.log('Coords: '+this.coords);
	}

   this.draw=function () {
	   var z=1;
	   var y=0;
	   var x=1;

	   if(this.group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   
	   this.group.top(Infinity).forEach(function(p,i) {
	      //commit values are normalized to optimal visualization(/10)
	      if(p.value){
	 		var geometry = new THREE.CubeGeometry( 1, p.value/10, 10);
			y=p.value/10/2;
			var origin_color=0x0000ff;
			var material = new THREE.MeshLambertMaterial( {color: origin_color} );
			var cube = new THREE.Mesh(geometry, material);
			cube.origin_color=origin_color;
			cube.position.set(x+coords[0],y+coords[1],z+coords[2]);
			cube.name = "Commits:"+p.value+" "+p.key;
			cube.info={
				month:p.key,
				commits:p.value
			};
			scene.add(cube);
			x+=1;
		   }
		});
   }

}

function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return '#'+c()+c()+c();
}

function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

function showInfo (mesh) {

	  scene.remove(labelobj);
      var txt = mesh.name;
      var curveSeg = 3;
      var material = new THREE.MeshPhongMaterial( {color:0xf3860a,shading: THREE.FlatShading } );
      
      // Create a three.js text geometry
      var geometry = new THREE.TextGeometry( txt, {
        size: 8,
        height: 2,
        curveSegments: 3,
        font: "helvetiker",
        weight: "bold",
        style: "normal",
        bevelEnabled: false
      });
      // Positions the text and adds it to the scene
      labelobj = new THREE.Mesh( geometry, material );
      labelobj.position.z = mesh.position.z;
      labelobj.position.x = mesh.position.x-25;
      labelobj.position.y = mesh.position.y+60;
      //labelobj.rotation.set(3*Math.PI/2,0,0);
      scene.add(labelobj );
      
}