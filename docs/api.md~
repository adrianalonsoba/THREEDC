<a name="THREEDC"></a >

# THREEDC API reference
* [Main utilities](#util)
* [Base mixin](#base-mixin)
* [Bars chart](#bars-chart)
* [Line chart](#line-chart)
* [Pie chart](#pie-chart)
* [Smooth curve chart](#curve-chart)
* [Panels](#panel)

#### Function Chain
As in dc.js, majority of THREEDC functions are designed to allow function chaining, meaning it will return the current chart instance
whenever it is appropriate. Therefore configuration of a chart can be written in the following style:
```js
chart.width(300)
     .height(300)
     .depth(0.9)
...
```
## <a name="util" href="#util">#</a>  Main utilities

#### THREEDC.initializer(camera,scene,renderer) **mandatory**
This method tells to THREEDC which are the main THREE.js objects used in your custom scene.

Parameters:
* camera : The [camera](http://threejs.org/docs/#Reference/Cameras/Camera) instance of the scene, it could be any THREE.js camera type.

* scene : The [scene](http://threejs.org/docs/#Reference/Scenes/Scene) instance. 
* renderer : The [renderer](http://threejs.org/docs/#Reference/Renderers/WebGLRenderer) instance. It must be the webGL renderer in our case. 

#### THREEDC.renderAll()
Render all the chart instances (the charts contained into panels and the independent charts).

#### THREEDC.removelAll()
Remove all charts fromt the scene.

#### THREEDC.removeEvents()
Remove all events and interactions from the charts, then they can just be visualized.

## <a name="base-mixin" href="#base-mixin">#</a> Base Mixin [Abstract]
It is like a chart father class, each chart type will inherit its properties and functions and it will add its own ones if it needs them.

#### .render()
Render the chart instance.

#### .remove()
Remove the chart instance.

#### Chaining methods

#### .width(value)
Set the chart width in the Three.js’s relative units, 100 by default.

#### .height(value)
Set the chart height in the Three.js’s relative units, 100 by default.

#### .depth(value)
Set the depth of the charts, in Three.js’s relative units. Different default values for each chart type.

#### .dimension(value) - **mandatory**
Set the [crossfilter dimension](https://github.com/square/crossfilter/wiki/API-Reference#wiki-dimension), necessary to build the charts.

#### .group(value) - **mandatory**
Set the [crossfilter group](https://github.com/square/crossfilter/wiki/API-Reference#wiki-group) of the chart, necessary to build the charts. Usually the group should be
created from the particular dimension associated with the same chart.

#### .gridsOn()
Enable the grids of the chart, they are disabled by default.

#### .gridsOff()
Disable the grids of the chart.

#### .numberOfXLabels(value)
Set the number of labels that we want to be rendered on the x axis,9
by default.

#### .numberOfYLabels(value)
Set the number of labels that we want to be rendered on the Y axis,9
by default.

#### .color(value)
Establishes the main color of the chart,(if it isn’t a pie) it can be a string with the main colors (”red”,”blue”...f.e) but it is recommended use the hexadecimal HTML color codes to achieve a properly events functionality.
For example:
```js
chart.width(300)
     .height(300)
     //red color
     .color(0xff0000);
...
```
#### .opacity(value)
Set the chart opacity, 0.8 by default. 1 = 100% opaque, 0 = invisible.


## <a name="bars-chart" href="#bars-chart">#</a> Bars Chart

#### THREEDC.barsChart(location)
Create a bars chart instance and attach it to the given location.

Parameter:
* location : coordinates|panel - Array of cordinates ([z,y,z]) or a panel instantiation.

Return:
* A newly created bars chart instance.

```js

//create a bars chart on concrete coordinates
var bars1 = THREEDC.barsChart([100,50,200]);
// create a bars chart on the given panel
var bars2 = THREEDC.barsChart(panel);

```
## <a name="line-chart" href="#line-chart">#</a> Line Chart

#### THREEDC.barsChart(location)
Create a line chart instance and attach it to the given location.

Parameter:
* location : coordinates|panel - Array of cordinates ([z,y,z]) or a panel instantiation.

Return:
* A newly created line chart instance.

```js

//create a line chart on concrete coordinates
var line1 = THREEDC.lineChart([0,0,0]);
// create a line chart on the given panel
var line2 = THREEDC.lineChart(panel);

```

## <a name="pie-chart" href="#pie-chart">#</a> Pie Chart

#### THREEDC.barsChart(location)
Create a pie chart instance and attach it to the given location.

Parameter:
* location : coordinates|panel - Array of cordinates ([z,y,z]) or a panel instantiation.

Return:
* A newly created pie chart instance.

```js

//create a pie chart on concrete coordinates
var pie1 = THREEDC.pieChart([0,0,0]);
// create a pie chart on the given panel
var pie2 = THREEDC.pieChart(panel);

```
#### .radius(value)
Set the radius of the pie, it replaces width and heigth, 50 by default.


## <a name="curve-chart" href="#curve-chart">#</a> Smooth Curve Chart

#### THREEDC.smoothCurveChart(location)
Create a smooth curve chart instance and attach it to the given location.

Parameter:
* location : coordinates|panel - Array of cordinates ([z,y,z]) or a panel instance.

Return:
* A newly created smooth curve chart instance.

```js

//create a smooth curve chart on concrete coordinates
var curve1 = THREEDC.smoothCurveChart([0,0,0]);
// create a smooth curve chart on the given panel
var curve2 = THREEDC.smoothCurveChart(panel);

```

## <a name="panels" href="#panel">#</a> Panels

#### THREEDC.addPanel(coords,numberOfCharts,size,opacity)
Create a panel instance and attach it to the given coordinates.

Parameters:
* coordinates : array- The panel’s geometric center where it will be placed, it must be a vector([x,y,z]), [0,0,0] by default.

* numberOfCharts : number- The number of charts that the panel will contain, it can be 4,3 or 2, 4 by default.

* size : number- The size of the panel in the Three.js’s relative units, it must be a vector ([width,height]), [500,500] by default.

* opacity : number- Set the panel opacity. 1 = 100% opaque, 0 = invisible, 0.8 by default.

Return:
* A newly created panel instance.

```js

//create a panel on the given coordinates, with 3 anchor points, 200x200 and half-invisible. 
  var panel=THREEDC.addPanel([200,0,200],3,[200,200],0.5);

```



