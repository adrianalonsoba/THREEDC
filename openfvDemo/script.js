 

// initialization
//getJSON call, draw meshes with data
$.getJSON("../jsons/opnfv-commits.json", function (data) {
    var json_data = data;
    init(json_data);
});

 function init (data) {


 	console.log(data);
 var scenediv=document.getElementById( 'ThreeJS' );

 var cf= crossfilter(data);


   //create a dimension by month

  dimByWeek= cf.dimension(function(p) {return p.tz;});

  groupByWeek= dimByWeek.group();


	 var myDashBoard = THREEDC.dashBoard(scenediv);

	 var data1 = [{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 },
	             { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }];

	  var myPieChart= THREEDC.pieChart();

	  myPieChart.dimension(dimByWeek).group(groupByWeek).radius(100);

	  myDashBoard.addChart(myPieChart);
 }


