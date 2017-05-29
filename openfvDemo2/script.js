 

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


    //TOTEM INFO

    var geometry = new THREE.PlaneBufferGeometry( 150, 250);
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    var totem = new THREE.Mesh( geometry, material );
    totem.position.set(0,100,-50);
    myDashBoard.scene.add( totem );

    //LOGO

    var geometry = new THREE.PlaneBufferGeometry( 75, 40);
    var logoTexture = THREE.ImageUtils.loadTexture( '../images/opnfv.png' );
    var material = new THREE.MeshBasicMaterial( {map:logoTexture, side: THREE.FrontSide} );
    var logoContainer = new THREE.Mesh( geometry, material );
    logoContainer.position.set(0,175,-49);
    myDashBoard.scene.add( logoContainer );

    //TEXT
    var pieTitle= THREEDC.textChart();
    pieTitle.data('GIT ANALYTICS').color('black').size(5);
    myDashBoard.addChart(pieTitle,{x:-30,y:140,z:-49});


    var text= THREEDC.textChart();
    text.data('Clik on pie parts, bars and bubbles to filter').color('black').size(4);
    myDashBoard.addChart(text,{x:-55,y:120,z:-49});



    //CLEAR FILTERS TEXT

    var text= THREEDC.textChart();
    text.data('Clear filters').color('black').size(5);
    myDashBoard.addChart(text,{x:-55,y:10,z:-49});
    console.log(text);

    // PIE CHART, COMMITS PER ORG

    dimByOrg= cf.dimension(function(p) {return p.Author_org_name;});

    groupByOrg= dimByOrg.group();

    var pieOrgs =THREEDC.pieChart();

    pieOrgs.dimension(dimByOrg)
           .group(groupByOrg)
           .opacity(1)
           .radius(30);

   myDashBoard.addChart(pieOrgs,{x:-15,y:20,z:-20});

   var pieTitle= THREEDC.textChart();
   pieTitle.data('Commits per Org').color('green').size(5);
   myDashBoard.addChart(pieTitle,{x:-26,y:30,z:-30});



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



//BACKGROUNDS

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



}