<a name="THREEDC"></a >

# THREEDC API reference


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

#### THREEDC.renderAll()
Render all the instantiated charts, the charts contained into panels and the independent charts.

#### THREEDC.removelAll()
Remove all charts fromt the scene.

#### THREEDC.removeEvents()
Remove all events and interactions from the charts, then they can just be visualized.

## <a name="base-mixin" href="#base-mixin">#</a> Base Mixin [Abstract]
It is like a chart father class, each chart type will inherit its properties and functions and it will add its own ones if it needs them.

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

//create a bars chart on a concrete coordinates
var bars1 = THREEDC.barsChart([100,50,200]);
// create a bars chart on the given panel
var bars2 = dc.barChart(panel);

```







