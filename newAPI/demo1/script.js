 
 var scenediv=document.getElementById( 'ThreeJS' );

 var myDashBoard = THREEDC.dashBoard(scenediv);


 var data = [{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 },
             { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }];


  var myPieChart= THREEDC.pieChart();

  myPieChart.data(data);

  myDashBoard.addChart(myPieChart);