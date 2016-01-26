var THREEDC={
	version:'0.1-b',
	allCharts:[],
	textLabel:null,
	chartToDrag:null
};

THREEDC.renderAll=function() {
	for (var i = 0; i < THREEDC.allCharts.length; i++) {
		THREEDC.allCharts[i].render();
	};
}

THREEDC.removeAll=function() {
	for (var i = 0; i < THREEDC.allCharts.length; i++) {
		THREEDC.allCharts[i].removeEvents();
    	for (var j = 0; j < THREEDC.allCharts[i].parts.length; j++) {
    		scene.remove(THREEDC.allCharts[i].parts[j]);
    	};
	};
	THREEDC.allCharts=[];
}

THREEDC.removeEvents=function(){
	for (var i = 0; i < THREEDC.allCharts.length; i++) {
		THREEDC.allCharts[i].removeEvents();
	};	
}

/*base object whose methods are inherited by each implementation
* the properties of a chart are given by a function chain
*/
THREEDC.baseMixin = function (_chart) {
	_chart={parts:[],
			//by default
			_width:100,
			_height:100};

    _chart.render=function() {
    	//defined by each implementation
    	_chart.build();
    	for (var i = 0; i < _chart.parts.length; i++) {
    		scene.add(_chart.parts[i]);
    	};
    }

    _chart.remove=function(){
    	_chart.removeEvents();
    	for (var i = 0; i < _chart.parts.length; i++) {
    		scene.remove(_chart.parts[i]);
    	};
    	var index = THREEDC.allCharts.indexOf(_chart);

    	THREEDC.allCharts.splice(index, 1);
    }

    _chart.reBuild=function(){
     	_chart.removeEvents();
    	for (var i = 0; i < _chart.parts.length; i++) {
    		scene.remove(_chart.parts[i]);
    	}; 
    	_chart.parts=[];
    	_chart.render();
    }

    _chart.removeEvents=function(){

    	for (var i = 0; i < _chart.parts.length; i++) {
    		removeEvents(_chart.parts[i]);
    	};

		function removeEvents(mesh){
			//removes mouseover events
			domEvents.unbind(mesh, 'mouseover');
			domEvents.unbind(mesh, 'mouseout');
			domEvents.unbind(mesh, 'click');
			domEvents.unbind(mesh, 'mousedown');
		}
    }

    _chart.addEvents=function(){

    	for (var i = 0; i < _chart.parts.length; i++) {
    		addEvents(_chart.parts[i]);
    	};

		function addEvents (mesh) {

			//adds mouseover events
			domEvents.bind(mesh, 'mouseover', function(object3d){ 
				changeMeshColor(mesh);
				showInfo(mesh);
			});

			domEvents.bind(mesh, 'mouseout', function(object3d){ 
				//restores the original color
				mesh.material.emissive.setHex(mesh.currentHex);
			});

			domEvents.bind(mesh, 'click', function(object3d){ 
				addFilter(mesh);
			});

			domEvents.bind(mesh, 'mousedown', function(object3d){ 
				if(parameters.activate){
					container.style.cursor = 'move';
					console.log('mousedown');
					controls.enabled=false;
					SELECTED=mesh;
					THREEDC.chartToDrag=_chart;
				    plane.position.copy( mesh.position );
				    raycaster.setFromCamera( mouse, camera );
				    var intersects = raycaster.intersectObject( plane );
				    if ( intersects.length > 0 ) {
				      offset.copy( intersects[ 0 ].point ).sub( plane.position );
				    }
				}
			});

		}

		function addFilter (mesh) {
			console.log('click');
			//_chart._dimension.filterAll();
			_chart._dimension.filter(mesh.data.key);
			for (var i = 0; i < THREEDC.allCharts.length; i++) {
				THREEDC.allCharts[i].reBuild();
			};
		}	

		//creates a 3D text label
		function showInfo (mesh) {
			  scene.remove(THREEDC.textLabel);
		      var txt = mesh.name;
		      var curveSeg = 3;
		      var material = new THREE.MeshPhongMaterial( {color:0xf3860a,
		      											   specular: 0x999999,
                                            	           shininess: 100,
                                            	           shading : THREE.SmoothShading			      											   
		      } );			                    	      
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
		      THREEDC.textLabel = new THREE.Mesh( geometry, material );
		      THREEDC.textLabel.position.z = mesh.position.z;
		      THREEDC.textLabel.position.x = _chart.coords.x;
		      THREEDC.textLabel.position.y = _chart._height+10+_chart.coords.y;
		      //textLabel.rotation.set(3*Math.PI/2,0,0);
		      scene.add(THREEDC.textLabel);
		}

		function changeMeshColor (mesh) {
		 // mesh.material.color.setHex(0xffff00);
		  mesh.currentHex=mesh.material.emissive.getHex();
		  mesh.material.emissive.setHex(mesh.origin_color);
		}
    }

    _chart.group= function (group) {
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._group=group;
    	return _chart;
    }

    _chart.dimension= function (dimension) {
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._dimension=dimension;
    	return _chart;
    }

    _chart.width=function(width){
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._width=width;
    	return _chart;
    }

    _chart.height=function(height){
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._height=height;
    	return _chart;
    }

    _chart.color= function (color) {
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._color=color;
    	return _chart;
    }

    return _chart;
}

THREEDC.pieChart = function (coords) {

   if(coords==undefined){
   	coords=[0,0,0];
   }

	var  extrudeOpts = {curveSegments:30, amount: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
	//by default
	var _radius=50;
	var _chart = THREEDC.baseMixin({});
	_chart.coords= new THREE.Vector3( coords[0], coords[1], coords[2] );
	_chart._width=_radius;
	_chart._height=_radius;
	var _data;
	

	THREEDC.allCharts.push(_chart);

	_chart.radius=function(radius){
		_radius=radius;
		_chart._width=radius;
		_chart._height=radius;
		return _chart;
	}

    _chart.build=function () {
    	var _data=_chart._group.top(Infinity);

   	    var valTotal=_chart._dimension.top(Infinity).length;
		var angPrev=0;
		var angToMove=0;

		if(_chart._group===undefined){
			console.log('You must define a group for this chart');
			return;
		}
		for (var i = 0; i < _data.length; i++) {
			if(_data[i].value===0){
				break;
			}
			var origin_color=Math.random() * 0xffffff
		        var material = new THREE.MeshPhongMaterial( {color: origin_color,
                                            	        specular: 0x999999,
                                            	        shininess: 100,
                                            	        shading : THREE.SmoothShading,
                                               	 		opacity:0.8,
                                           				transparent: true
            } );				
             // Creats the shape, based on the value and the _radius
			var shape = new THREE.Shape();
			var angToMove = (Math.PI*2*(_data[i].value/valTotal));
			shape.moveTo(0,0);
			shape.arc(0,0,_radius,angPrev,
			        angPrev+angToMove,false);
			shape.lineTo(0,0);
			var nextAng = angPrev + angToMove;

			var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );
			var piePart = new THREE.Mesh( geometry, material );
			piePart.material.color.setHex(origin_color);
			piePart.origin_color=origin_color;
			//piePart.rotation.set(0,0,0);
			piePart.position.set(_chart.coords.x,_chart.coords.y,_chart.coords.z);
			piePart.name ="key:"+_data[i].key+" value:"+_data[i].value;
			piePart.data={
				key:_data[i].key,
				value:_data[i].value
			}
			_chart.parts.push(piePart);
			angPrev=nextAng;
		}

		_chart.addEvents();
    }

	return _chart;
}

THREEDC.barsChart = function (coords){

   if(coords==undefined){
   	coords=[0,0,0];
   }

	var _chart = THREEDC.baseMixin({});
	var unsort_data;
	_chart.coords= new THREE.Vector3( coords[0], coords[1], coords[2] );
	_chart._color=0x0000ff;

	THREEDC.allCharts.push(_chart);


	_chart.build = function() {

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   //key/value del grupo de mayor a menor
	   unsort_data=_chart._group.top(Infinity);
	  // var _data=_chart._group.top(Infinity);

		//var date_min = _chart._dimension.bottom(1)[0].month;
		//var date_max = _chart._dimension.top(1)[0].month;

		var dates=[];
		//en dates guardo las fechas(keys)
		for (var i = 0; i <  unsort_data.length; i++) {
				dates[i]= unsort_data[i].key;
		};
		//ordeno fechas(keys) de menor a mayor
		dates.sort(function(a, b){return a-b});

	    //ordeno el grupo de menor a mayor usando 
	    //las posiciones de dates
		var _data=[];
		for (var i = 0; i < dates.length; i++) {
			for (var j = 0; j <  unsort_data.length; j++) {
				if(dates[i] === unsort_data[j].key){
					_data[i]={key:unsort_data[j].key,
						      value:unsort_data[j].value};
			        console.log(_data[i]);
				}
			};
		};
		
	   var numberOfValues=_chart._group.top(Infinity).length;
	   console.log('numberOfValues: ' +numberOfValues);

	   var topValue=_chart._group.top(1)[0].value;
	   console.log('topValue: '+topValue);


	   var barWidth=_chart._width/numberOfValues;

	   var y;
	   var x=0;

		for (var i = 0; i < _data.length; i++) {
			//if(_data[i].value===0){
			//	break;
			//}
	      	var barHeight=(_chart._height*_data[i].value)/topValue;
	 		var geometry = new THREE.CubeGeometry( barWidth, barHeight, 5);
			y=barHeight/2;
			var origin_color=_chart._color;
   		    var material = new THREE.MeshPhongMaterial( {color: origin_color,
                                                	     specular: 0x999999,
                                                	     shininess: 100,
                                                	     shading : THREE.SmoothShading,
                                                   	     opacity:0.8,
                                               		     transparent: true
            } );
			var bar = new THREE.Mesh(geometry, material);
			bar.origin_color=origin_color;
			bar.position.set(x+_chart.coords.x,y+_chart.coords.y,_chart.coords.z);
			bar.name = "key:"+_data[i].key+" value: "+_data[i].value;
			bar.data={
				key:_data[i].key,
				value:_data[i].value
			};
			_chart.parts.push(bar);
			x+=barWidth;

		};

	    _chart.addEvents();
    }
   
    return _chart;
}

THREEDC.simpleLineChart= function (coords) {

	this.coords=coords;

	var _chart = THREEDC.baseMixin({});

	THREEDC.allCharts.push(_chart);

	_chart.build = function() {
	   	
	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	coords=[0,0,0];
	   }

		var chartShape = new THREE.Shape();
		chartShape.moveTo( 0,0 );
		var x=0;

	   _chart._group.top(Infinity).forEach(function(p,i) {
			chartShape.lineTo( x, p.value/10 );
			x+=1.5;
		});
		chartShape.lineTo( x, 0 );
		chartShape.lineTo( 0, 0 );

		var extrusionSettings = {
			size: 30, height: 4, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var chartGeometry = new THREE.ExtrudeGeometry( chartShape, extrusionSettings );
		var materialSide = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
  		var extrudeChart = new THREE.Mesh( chartGeometry, materialSide );

		extrudeChart.position.set(coords[0],coords[1],coords[2]);
		scene.add(extrudeChart);

    }

    return _chart;

}

THREEDC.lineChart= function (coords) {

	if(coords==undefined){
		coords=[0,0,0];
	}

	var _chart = THREEDC.baseMixin({});
	_chart.coords= new THREE.Vector3( coords[0], coords[1], coords[2] );
	_chart._color=0x0000ff;

	THREEDC.allCharts.push(_chart);

	var _data;

	_chart.build = function() {


		var topValue=_chart._group.top(1)[0].value;

		var numberOfValues=_chart._group.top(Infinity).length;

		var barWidth=_chart._width/numberOfValues;

		var x=0;

	   	_data=_chart._group.top(Infinity);

	   	for (var i = 0; i < _data.length; i++) {
			if(_data[i].value===0){
				break;
			}
	   		if(_data[i+1]){
	   			var barHeight1=(_chart._height*_data[i].value)/topValue;
	   			var barHeight2=(_chart._height*_data[i+1].value)/topValue;

	   			var lineShape = new THREE.Shape();
				lineShape.moveTo(0,0);
				lineShape.lineTo( 0, barHeight1);
				lineShape.lineTo( barWidth, barHeight2 );

				lineShape.lineTo( barWidth, 0 );
				lineShape.lineTo( 0, 0 );
				var extrusionSettings = {curveSegments:1,
				 						 amount: 4,
				 						 bevelEnabled: true,
				 						 bevelSegments: 4,
				 						 steps: 2,
				 						 bevelSize: 1,
				 						 bevelThickness: 1 };
				var charGeometry = new THREE.ExtrudeGeometry( lineShape, extrusionSettings );
				var origin_color=_chart._color;
   		    	var material = new THREE.MeshPhongMaterial( {color: origin_color,
                                                	     	 specular: 0x999999,
                                                	    	 shininess: 100,
                                                	     	 shading : THREE.SmoothShading,
                                                   	     	 opacity:0.8,
                                               		    	 transparent: true
          	  } );
				var linePart = new THREE.Mesh( charGeometry, material );
				linePart.position.set(x+_chart.coords.x,_chart.coords.y,_chart.coords.z);
				linePart.name="key:"+_data[i].key+" value: "+_data[i].value;
				linePart.data={
					key:_data[i].key,
					value:_data[i].value
				};
				x+=barWidth;
				_chart.parts.push(linePart);
	   		}
	   	};

		_chart.addEvents();
    }

    return _chart;

}

THREEDC.bubbleChart= function (coords) {

	var _chart = THREEDC.baseMixin({});

	THREEDC.allCharts.push(_chart);

	_chart.build= function () {

		var x=0;
		var y=0;
		var z=0;

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	this.coords=[0,0,0];
	   }
	   
		_chart._group.top(Infinity).forEach(function(p,i) {
			var geometry = new THREE.SphereGeometry(p.value/100,32,32);
			var material = new THREE.MeshLambertMaterial( {} );
			material.color.setHex( Math.random() * 0xffffff );
			var sphere = new THREE.Mesh( geometry, material );

			sphere.position.set(x+coords[0],y+coords[1],z+coords[2]);
			_chart.parts.push(sphere);
			x+=100;
		});
	}

	return _chart;
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

