// code to rotate linechart

	_chart.build = function() {


		var topValue=_chart._group.top(1)[0].value;

		var numberOfValues=_chart._group.top(Infinity).length;

		var barWidth=_chart._width/numberOfValues;

		var x=0;
		var z=0;

	   	unsort_data=_chart._group.top(Infinity);

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
				}
			};
		};

	   	for (var i = 0; i < _data.length; i++) {
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
				 						 amount: _chart._depth,
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
				linePart.origin_color=origin_color;
				linePart.position.set(x+_chart.coords.x,_chart.coords.y,z+_chart.coords.z);
				linePart.name="key:"+_data[i].key+" value: "+_data[i].value;
				linePart.data={
					key:_data[i].key,
					value:_data[i].value
				};
				z+=barWidth;
				linePart.rotation.y=-Math.PI / 2;
				_chart.parts.push(linePart);
	   		}
	   	};

		_chart.addEvents();
		_chart.addLabels();
		if (_chart._gridsOn) _chart.addGrids();
	    

    }

    // code to rotate pie

    THREEDC.pieChart = function (coords,panel) {

   if(coords==undefined){
   	coords=[0,0,0];
   }
	//by default
	var _radius=50;
	
	var _chart = THREEDC.baseMixin({});
	_chart._width=_radius;
	_chart._height=_radius;
	//by default
	_chart._depth=5;
	var _data;

	if(panel){
		for (var i = 0; i < panel.anchorPoints.length; i++) {
			if(!panel.anchorPoints[i].filled){
				_chart.coords=panel.anchorPoints[i].coords;
				_chart.coords.x=_chart.coords.x+_chart._width;
				_chart.coords.y=_chart.coords.y+_chart._height;
				panel.anchorPoints[i].filled=true;
				panel.charts.push(_chart);
				_chart.panel=panel;
				break;
			}
		};
	}else{
		_chart.coords= new THREE.Vector3( coords[0], coords[1], coords[2] );
	}

	THREEDC.allCharts.push(_chart);

	_chart.radius=function(radius){
		_radius=radius;
		_chart._width=radius;
		_chart._height=radius;
		return _chart;
	}

    _chart.build=function () {
		_chart._dimension.filterAll();
    	var _data=_chart._group.top(Infinity).filter(function(d) { return d.value > 0; });
   	    var valTotal=_chart._dimension.top(Infinity).length;
		var  extrudeOpts = {curveSegments:30,
							amount: _chart._depth,
							bevelEnabled: true,
							bevelSegments: 4,
							steps: 2,
							bevelSize: 1,
							bevelThickness: 1 };
   	    console.log('length dimension'+_chart._dimension.top(Infinity).length);
   	    console.log('length group'+_chart._group.top(Infinity).length);

		var angPrev=0;
		var angToMove=0;

		if(_chart._group===undefined){
			console.log('You must define a group for this chart');
			return;
		}
		for (var i = 0; i < _data.length; i++) {
			if(_data[i].value===0){
				//break;
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
			piePart.rotation.y=-Math.PI / 2;
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

//code rotate bars

THREEDC.barsChart = function (coords,panel){

	if(coords==undefined){
		coords=[0,0,0];
	}



	var _chart = THREEDC.baseMixin({});

		//by default
	_chart._depth=5;
	
	var unsort_data;


	if(panel){
		for (var i = 0; i < panel.anchorPoints.length; i++) {
			if(!panel.anchorPoints[i].filled){
				_chart.coords=panel.anchorPoints[i].coords;
				panel.anchorPoints[i].filled=true;
				panel.charts.push(_chart);
				_chart.panel=panel;
				break;
			}
		};
	}else{
		_chart.coords= new THREE.Vector3( coords[0], coords[1], coords[2] );
	}
	_chart._color=0x0000ff;

	THREEDC.allCharts.push(_chart);

	_chart.build = function() {

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }

	   unsort_data=_chart._group.top(Infinity);

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
				}
			};
		};
		
	   var numberOfValues=_chart._group.top(Infinity).length;

	   var topValue=_chart._group.top(1)[0].value;


	   var barWidth=_chart._width/numberOfValues;

	   var y;
	   var x=barWidth/2;
	   var z=barWidth/2;

		for (var i = 0; i < _data.length; i++) {
	      	var barHeight=(_chart._height*_data[i].value)/topValue;
	 		var geometry = new THREE.CubeGeometry( barWidth, barHeight, _chart._depth);
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
			bar.position.set(x+_chart.coords.x,y+_chart.coords.y,z+_chart.coords.z+_chart._depth/2);
			bar.name = "key:"+_data[i].key+" value: "+_data[i].value;
			bar.data={
				key:_data[i].key,
				value:_data[i].value
			};
			_chart.parts.push(bar);
			z+=barWidth;

		};

	    _chart.addEvents();
	    _chart.addLabels();
		if (_chart._gridsOn) _chart.addGrids();
    }
   
    return _chart;
}
