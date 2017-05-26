 

// initialization
//getJSON call, draw meshes with data
$.getJSON("../jsons/opnfv-commits.json", function (data) {
     window.json_data = data;
    init(json_data);
});

 function init (data) {

    var keysObj = Object.keys(json_data[0]);
    var parsed_data = [];
    json_data.forEach(function (value) {
        var record = {};

        keysObj.forEach(function (name) {
            if (name == "utc_author") {
                var date = new Date(value[name]);
                record[name] = date;
            } else {
                record[name] = value[name];
            }
        });
        parsed_data.push(record);
    });

    console.log('parsed',parsed_data[0]);
    var cf = crossfilter(parsed_data);

    console.log(cf.size());

    // CREATE A DASHBOARD
    var scenediv=document.getElementById( 'ThreeJS' );

    var myDashBoard= THREEDC.dashBoard(scenediv);

    // PIE CHART, COMMITS PER ORG

    dimByOrg= cf.dimension(function(p) {return p.Author_org_name;});

    groupByOrg= dimByOrg.group();

    var pieOrgs =THREEDC.pieChart();

    pieOrgs.dimension(dimByOrg)
           .group(groupByOrg)
           .radius(50);

   myDashBoard.addChart(pieOrgs,{x:0,y:0,z:0});

   var pieTitle= THREEDC.textChart();
   pieTitle.data('Commits per Org').color('green');
   myDashBoard.addChart(pieTitle,{x:0,y:-20,z:0});



// LINE CHART, COMMITS PER WEEK
    var dimByMonth= cf.dimension(function(p) {return p.week;});

    var groupByMonth= dimByMonth.group();

    var lineMonths=THREEDC.lineChart();

    lineMonths.dimension(dimByMonth)
              .group(groupByMonth)
              .gridsOn()
              .width(400);

    myDashBoard.addChart(lineMonths,{x:100,y:0,z:0});

    var lineTitle= THREEDC.textChart();
    lineTitle.data('Commits per Week');
    myDashBoard.addChart(lineTitle,{x:350,y:-20,z:0});

// BARS CHART, COMMITS PER AUTHOR
    var dimByAuthor= cf.dimension(function(p) {return p.Author_name;});

    var groupByAuthor= dimByAuthor.group();

    var barAuthors=THREEDC.barsChart();

    barAuthors.dimension(dimByAuthor)
              .group(groupByAuthor)
              .gridsOn()
              .color(0xFF0040)
              .width(400);

    myDashBoard.addChart(barAuthors,{x:-250,y:0,z:0});


   var barTitle= THREEDC.textChart();
   barTitle.data('Commits per Author').color(0xFF0040);
   myDashBoard.addChart(barTitle,{x:-375,y:-20,z:0});



//CLEAR FILTERS BUTTON

var obj = { Clear:function(){ clearFilters(); }};

myDashBoard.gui.add(obj,'Clear').name('Clear filters');

function clearFilters() {
    dimByAuthor.filterAll();
    dimByMonth.filterAll();
    dimByOrg.filterAll();
    for (var i = 0; i < myDashBoard.charts.length; i++) {
        myDashBoard.charts[i].reBuild();
    }
}


}