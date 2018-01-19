!function(t,e){if("function"==typeof define&&define.amd)define(["module","exports","angular","chartist"],e);else if("undefined"!=typeof exports)e(module,exports,require("angular"),require("chartist"));else{var n={exports:{}};e(n,n.exports,t.angular,t.Chartist),t.angularChartist=n.exports}}(this,function(t,e,n,s){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var a=i(n),o=i(s),h=function(){function t(t,e){for(var n=0;n<e.length;n++){var s=e[n];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,n,s){return n&&t(e.prototype,n),s&&t(e,s),e}}(),c=a.default.module("angular-chartist",[]),u=function(){function t(e,n){"ngInject";var s=this;r(this,t),this.data=e.data,this.chartType=e.chartType,this.events=e.events()||{},this.options=e.chartOptions()||null,this.responsiveOptions=e.responsiveOptions()||null,this.element=n[0],this.renderChart(),e.$watch(function(){return{data:e.data,chartType:e.chartType,chartOptions:e.chartOptions(),responsiveOptions:e.responsiveOptions(),events:e.events()}},this.update.bind(this),!0),e.$on("$destroy",function(){s.chart&&s.chart.detach()})}return t.$inject=["$scope","$element"],h(t,[{key:"bindEvents",value:function(){var t=this;Object.keys(this.events).forEach(function(e){t.chart.on(e,t.events[e])})}},{key:"unbindEvents",value:function(t){var e=this;Object.keys(t).forEach(function(n){e.chart.off(n,t[n])})}},{key:"renderChart",value:function(){if(this.data)return this.chart=o.default[this.chartType](this.element,this.data,this.options,this.responsiveOptions),this.bindEvents(),this.chart}},{key:"update",value:function(t,e){this.chartType=t.chartType,this.data=t.data,this.options=t.chartOptions,this.responsiveOptions=t.responsiveOptions,this.events=t.events,this.chart&&t.chartType===e.chartType?(a.default.equals(t.events,e.events)||(this.unbindEvents(e.events),this.bindEvents()),this.chart.update(this.data,this.options)):this.renderChart()}}]),t}();c.controller("AngularChartistCtrl",u).directive("chartist",function(){"ngInject";return{restrict:"EA",scope:{data:"=chartistData",chartType:"@chartistChartType",events:"&chartistEvents",chartOptions:"&chartistChartOptions",responsiveOptions:"&chartistResponsiveOptions"},controller:"AngularChartistCtrl"}}),e.default=c.name,t.exports=e.default});