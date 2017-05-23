 

// initialization
//getJSON call, draw meshes with data
$.getJSON("../jsons/opnfv-commits.json", function (data) {
     window.json_data = data;
    init(json_data);
});

 function init (data) {

	var scenediv=document.getElementById( 'ThreeJS' );

    var keysObj = Object.keys(json_data[0]);
    window.parsed_data = [];
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
    console.log(parsed_data);
    window.cf = crossfilter(parsed_data);


	//create a dimension by week

    var dimbyYandQ = cf.dimension(function (d) {
        return Number.parseInt(
        d.utc_author.getFullYear().toString() +
        (Math.floor(d.utc_author.getMonth() / 3) + 1).toString());
    });

  	var groupbyYandQ = dimbyYandQ.group();


    var groupAuthors = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
        if (!p[v.Author_name]) {
            p[v.Author_name] = (p[v.Author_name] || 0) + 1;
            p.counting = p.counting + 1;
        };
        return p;
    },

    function reduceRemove(p, v) {
        if (p[v.Author_name]) {
            p[v.Author_name] = (p[v.Author_name] || 0) - 1;
            delete p[v.Author_name];
            p.counting = p.counting - 1;

        }
        return p;
    },

    function reduceInitial() {
        return { counting: 0 };
    });

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


  	//create a dimension by tz

    var dimbytz = cf.dimension(function (p) { return p.tz; });
    var groupbytz = dimbytz.group();


    ////create a dimension by org
    var dimByOrg = cf.dimension(function (p) { return p.Author_org_name; });
    var groupByOrg = dimByOrg.group();

    //create a dim by authors
    var dimAuthors = cf.dimension(function (p) { return p.Author_name; });
    var groupAuth = dimAuthors.group();


	var myDashBoard = THREEDC.dashBoard(scenediv);

	var myPieChart= THREEDC.pieChart();

	var mybarchartTzs=THREEDC.barsChart();

    var mybarchart3d = THREEDC.TDbarsChart();

	myPieChart.dimension(dimByOrg).group(groupByOrg).rotation({x:0,y:45,z:0});

	mybarchartTzs.dimension(dimbytz).group(groupbytz).rotation({x:0,y:-45,z:0}).gridsOn().width(200).color(0xff80ff);

    mybarchart3d.dimension(dimbyYandQ).group(grouporgWeek).gridsOn();

	myDashBoard.addChart(myPieChart);

	myDashBoard.addChart(mybarchartTzs,{x:100,y:0,z:0});

    myDashBoard.addChart(mybarchart3d,{x:-100,y:0,z:0});




	var imagePrefix = "../../examples/Three.js/images/moondust-";
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


    var obj = { Clear:function(){ clearFilters(); }};

    myDashBoard.gui.add(obj,'Clear').name('Clear filters');

    function clearFilters() {
        dimByOrg.filterAll();
        dimbytz.filterAll();
        dimbyYandQ.filterAll();
        for (var i = 0; i < myDashBoard.charts.length; i++) {
            myDashBoard.charts[i].reBuild();
        }
    }



 }


