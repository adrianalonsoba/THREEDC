  var boxEl = document.querySelector('a-box');
  boxEl.addEventListener('click', function () {
    boxEl.setAttribute('scale', {x: 20, y: 2, z: 2});
  });

    var data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

          {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

          {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

          {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

  	var scene= document.querySelector('a-scene').object3D;
  	var camera= document.querySelector('a-camera').object3D;
  	console.log(scene);
  	console.log(camera);

  	var renderer={};
  	var container={};

  //the empty object will be returned with the library functions
  var dash = THREEDC({},camera,scene,renderer,container);

  //create a 3D bars chart with the data above at the position (0,0,0)
  var bars= dash.TDbarsChart([0,0,0]);
  bars
      .data(data)
      .width(100)
      .height(100)
      .depth(100)
      .barSeparation(0.8)
      .opacity(0.95)
      .color(0xffaa00)
      .gridsOn(0xffffff);

   dash.renderAll();