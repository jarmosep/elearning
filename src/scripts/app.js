/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'ngSanitize', 'ngAnimate']);
