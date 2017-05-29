 

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

    var geometry = new THREE.PlaneBufferGeometry( 100, 60);
    var logoTexture = THREE.ImageUtils.loadTexture( '../images/paint.jpg' );
    var material = new THREE.MeshBasicMaterial( {map:logoTexture, side: THREE.FrontSide,BackGround:0xffffff} );
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

    var helper = new THREE.BoundingBoxHelper(text.mesh, 0xffffff);
    helper.update();
    helper.visible=true;
    helper.opacity=0;
    myDashBoard.scene.add(helper);

    myDashBoard.domEvents.bind(helper, 'mousedown', function(object3d){
        clearFilters();
    });

    //CHANGE BACKGROUND TEXT

    var text= THREEDC.textChart();
    text.data('Change background').color('black').size(5);
    myDashBoard.addChart(text,{x:-55,y:0,z:-49});

    var helper = new THREE.BoundingBoxHelper(text.mesh, 0xffffff);
    helper.update();
    helper.visible=true;
    helper.opacity=0;
    myDashBoard.scene.add(helper);

    myDashBoard.domEvents.bind(helper, 'mousedown', function(object3d){
       ChangeBackGround();
    });

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
   pieTitle.data('Commits per Org').color('orange').size(5);
   myDashBoard.addChart(pieTitle,{x:-26,y:30,z:-30});



// LINE CHART, COMMITS PER WEEK
    var dimByMonth= cf.dimension(function(p) {return p.week;});

    var groupByMonth= dimByMonth.group();

    var lineMonths=THREEDC.lineChart();

    lineMonths.dimension(dimByMonth)
              .group(groupByMonth)
              .gridsOn(0xffffff)
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
              .gridsOn(0xffffff)
              .color(0xFF0040)
              .width(400);

    myDashBoard.addChart(barAuthors,{x:-250,y:0,z:0});


   var barTitle= THREEDC.textChart();
   barTitle.data('Commits per Author').color(0xFF0040);
   myDashBoard.addChart(barTitle,{x:-375,y:-20,z:0});


    //3D BARS CHART
    //create a dimension by week
    var dimbyYandQ = cf.dimension(function (d) {
        return Number.parseInt(
        d.utc_author.getFullYear().toString() +
        (Math.floor(d.utc_author.getMonth() / 3) + 1).toString());
    });

    var groupbyYandQ = dimbyYandQ.group();


    var grouporgWeek = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
        var findorg = function (element) {
            if (!element.key) return false;
            return element.key === v.Author_org_name;
        };
        var elementIndex = p.findIndex(findorg);
        if (elementIndex === -1) {
            //init
            p.push({ key: v.Author_org_name, value: 1 });
        } else {
            p[elementIndex].value = p[elementIndex].value + 1;
        }
        return p;
    },

    function reduceRemove(p, v) {
        var findorg = function (element) {
            if (!element.key) return false;
            return element.key === v.Author_org_name;
        };
        var elementIndex = p.findIndex(findorg);
        if (elementIndex !== -1) {
            p[elementIndex].value = p[elementIndex].value - 1;
            if (p[elementIndex].value <= 0) {
                //remove that element.
                p.splice(elementIndex, 1);
            }
        }


        return p;
    },

    function reduceInitial() {
        return [];
    });

    console.log( groupbyYandQ.all());
    console.log( grouporgWeek.all());

    var orgs = groupByOrg.top(Infinity);
    var mydata = grouporgWeek.all();
    var data1 = [];
    var findorg = function (d) { return d.key === orgs[j].key; };
    for (var i = 0 ; i < mydata.length; i++) {
        for (var j = 0; j < orgs.length; j++) {
            var found = mydata[i].value.find(findorg);
            if (found) {
                data1.push({ key1: mydata[i].key, key2: found.key, value: found.value });
            } else {
                data1.push({ key1: mydata[i].key, key2: orgs[j].key, value: 0 });
            }
        }
    }


    window.mybar3d = THREEDC.TDbarsChart();

   // window.mybar3d.dimension(dimbyYandQ).gridsOn(0xffffff).group(grouporgWeek);

    window.mybar3d.data(data1).gridsOn(0xffffff);


   myDashBoard.addChart(window.mybar3d,{x:-100,y:20,z:100});

    //CLEAR FILTERS BUTTON

    var obj = { Clear:function(){ update(); }};

    myDashBoard.gui.add(obj,'Clear').name('Update');

    function update() {
       // dimByAuthor.filterAll();
      //  dimByMonth.filterAll();
       // dimByOrg.filterAll();
        //for (var i = 0; i < myDashBoard.charts.length; i++) {
        //    myDashBoard.charts[i].reBuild();
        //}
        console.log(window.mybar3d)
        myDashBoard.removeChart(window.window.mybar3d);
        var orgs = groupByOrg.top(Infinity);
        var mydata = grouporgWeek.all();
        var data1 = [];
        var findorg = function (d) { return d.key === orgs[j].key; };
        for (var i = 0 ; i < mydata.length; i++) {
            for (var j = 0; j < orgs.length; j++) {
                var found = mydata[i].value.find(findorg);
                if (found) {
                    data1.push({ key1: mydata[i].key, key2: found.key, value: found.value });
                } else {
                    data1.push({ key1: mydata[i].key, key2: orgs[j].key, value: 0 });
                }
            }
        }
     window.mybar3d = THREEDC.TDbarsChart();

   // window.mybar3d.dimension(dimbyYandQ).gridsOn(0xffffff).group(grouporgWeek);

    window.mybar3d.data(data1).gridsOn(0xffffff);


   myDashBoard.addChart(window.mybar3d,{x:-100,y:20,z:100});



    }

    function clearFilters() {
        dimByAuthor.filterAll();
        dimByMonth.filterAll();
        dimByOrg.filterAll();
        for (var i = 0; i < myDashBoard.charts.length; i++) {
            myDashBoard.charts[i].reBuild();
        }

    }
//BACKGROUNDS

     var alternate=true;
     var skyBox;

    var imagePrefix = "../images/dawnmountain-";
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
    skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    myDashBoard.scene.add( skyBox );

    function ChangeBackGround() {
        myDashBoard.scene.remove( skyBox );
        var imagePrefix;
        var imageSuffix;
        if (alternate) {
            imagePrefix = "../images/skycubemap-";
            imageSuffix = ".jpg";
        }else{
            imagePrefix = "../images/dawnmountain-";
            imageSuffix = ".png";
        }
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );   
        
        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        myDashBoard.scene.add( skyBox );
        alternate=!alternate;

    }



}