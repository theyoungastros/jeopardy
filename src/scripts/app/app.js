/**
 * Bundle Bside Dashboard dependencies
 */
window.app = angular.module( 'App', [
    //Angular modules
    'ngCookies',
    'ngSanitize',
    'ngResource',
    'ngRoute',

    //3rd Party modules
    'ui.bootstrap',
    'ui.router',
    'ui.map',
    'angular-loading-bar',
    'angularFileUpload',

    //App modules
    'root',
    'utils',
    'api',
    'nav',
    'auth',
    'templates',
    'game',

    //View Controllers
    'home',
]);