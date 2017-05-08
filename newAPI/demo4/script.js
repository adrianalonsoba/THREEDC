"use strict";
$.getJSON("../../jsons/scm-commits.json", function(data) {
	//CROSSFILTER VARS

	var cf;

	var dimByMonth;

	var groupByMonth;

	var dimByOrg;

	var groupByOrg;

	var json_data;

	json_data=data;


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


	 var scenediv=document.getElementById( 'ThreeJS' );

	 var myDashBoard = THREEDC.dashBoard(scenediv);


	  var myPieChart= THREEDC.pieChart();

	  myPieChart.data(data);

	  myDashBoard.addChart(myPieChart);


	var bars =  THREEDC.barsChart();
	bars.group(groupByMonth)
	.dimension(dimByMonth)
	.width(200)
	.numberOfXLabels(5)
	.numberOfYLabels(5)
	.gridsOn()
	.height(200)
	.depth(20)
	.color(0xff0000);


	var line =  THREEDC.lineChart();
	line.group(groupByMonth)
	.dimension(dimByMonth)
	.width(200)
	.numberOfXLabels(5)
	.numberOfYLabels(5)
	.gridsOn()
	.height(200)
	.depth(20)
	.color(0xff00ff);

	var pie =  THREEDC.pieChart();
	pie.group(groupByOrg)
	  .dimension(dimByOrg)
	  .depth(20)
	  .radius(125);


	//myDashBoard.addChart(bars,{x:50,y:0,z:0});


	var panel= THREEDC.Panel({numberOfRows:2,numberOfColumns:2});

	myDashBoard.addPanel(panel,{x:0,y:0,z:0});

	panel.addChart(bars,{row:1,column:1});

	panel.addChart(line,{row:2,column:1});

	//panel.addChart(line);

	//myDashBoard.removePanel(panel);


  var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

            {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

            {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

            {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

      //4Ddata without CF

  var data2= [{key1:'january',key2:'apple',value:23,value2:Math.random()*50},{key1:'february',key2:'apple',value:31,value2:Math.random()*50},{key1:'march',key2:'apple',value:10,value2:Math.random()*50},{key1:'april',key2:'apple',value:59,value2:Math.random()*50},

            {key1:'january',key2:'google',value:34,value2:Math.random()*50},{key1:'february',key2:'google',value:89,value2:Math.random()*50},{key1:'march',key2:'google',value:53,value2:Math.random()*50},{key1:'april',key2:'google',value:76,value2:Math.random()*50},

            {key1:'january',key2:'sony',value:34,value2:Math.random()*50},{key1:'february',key2:'sony',value:89,value2:Math.random()*50},{key1:'march',key2:'sony',value:53,value2:Math.random()*50},{key1:'april',key2:'sony',value:76,value2:Math.random()*50}

 
  ];


	  var bubbles= THREEDC.TDbarsChart();

  bubbles.data(data)
         .width(200)
         .height(200)
         .gridsOn()
         .depth(250);

panel.addChart(pie,{row:1,column:2});

	var imagePrefix = "../../examples/Three.js/images/dawnmountain-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	myDashBoard.scene.add( skyBox );




});



