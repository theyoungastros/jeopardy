/**
 * Final Jeopardy service
 */
window.angular.module('game.services.final', [])
.factory('FinalService', [
'$resource',
'API',
function( $resource, API ) {

    return $resource(
        API.root + 'final/',
        {},
        {
            query: {
                cache: true,
                isArray: false
            }
        }
    );
}]);
