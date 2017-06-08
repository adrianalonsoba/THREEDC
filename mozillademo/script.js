 
function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

// initialization
//getJSON call, draw meshes with data
$.getJSON("../jsons/webvr-git-parsed.json", function (data) {

     window.json_data = data;
    init(json_data);
});

 function init (data) {

    var cf = crossfilter(data);

    console.log(cf.size(),data);

    // CREATE A DASHBOARD
    var scenediv=document.getElementById( 'ThreeJS' );

    var myDashBoard= THREEDC.dashBoard(scenediv);


    //TOTEM INFO

    var geometry = new THREE.PlaneBufferGeometry( 150, 250);
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    var totem = new THREE.Mesh( geometry, material );
    totem.position.set(0,100,-50);
    myDashBoard.scene.add( totem );

    //FLOOR
    var geometry = new THREE.PlaneBufferGeometry( 5000, 5000);
    var material = new THREE.MeshBasicMaterial( {map:THREE.ImageUtils.loadTexture( '../images/ground2.jpg'), side: THREE.DoubleSide} );
    var floor = new THREE.Mesh( geometry, material );
    floor.position.set(0,-400,0);
    floor.rotation.x=Math.PI / 2;
    myDashBoard.scene.add(floor);


    //LOGO

    var geometry = new THREE.PlaneBufferGeometry( 100, 50);
    var logoTexture = THREE.ImageUtils.loadTexture( '../images/mozilla.png' );
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
    text.data('Switch background').color('black').size(5);
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
           .color('orange')
           .setTitle('Commits per org')
           .radius(30);

   myDashBoard.addChart(pieOrgs,{x:-15,y:20,z:-20});




   // BARS CHART, COMMITS PER TIMEZONE
   
    var dimByTz= cf.dimension(function(p) {return p.tz;});

    var groupByTz= dimByTz.group();

    var barsTz=THREEDC.barsChart();

    barsTz.dimension(dimByTz)
              .group(groupByTz)
              .setTitle('Commits per time zone')
              .gridsOn(0xffffff)
			  .rotation({x:0,y:-55,z:0})
              .width(300);

    myDashBoard.addChart(barsTz,{x:70,y:0,z:-30});



// BARS CHART, COMMITS PER AUTHOR
    var dimByAuthor= cf.dimension(function(p) {return p.Author_name;});

    var groupByAuthor= dimByAuthor.group();
    console.log('numero de autores: ',groupByAuthor.all().length);

    var barAuthors=THREEDC.barsChart();

    barAuthors.dimension(dimByAuthor)
              .group(groupByAuthor)
              .gridsOn(0xffffff)
              .color(0xFF0040)
			  .rotation({x:0,y:55,z:0})
              .setTitle('Commits Per Author')
              .width(300);

    myDashBoard.addChart(barAuthors,{x:-200,y:0,z:20});


    //CLEAR FILTERS BUTTON


    
    function clearFilters() {
        dimByOrg.filterAll();
        dimByAuthor.filterAll();
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