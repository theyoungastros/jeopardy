/**
 * Game service
 */
window.angular.module('game.services.game', [])
.factory('GameService', [
'$resource',
'API',
function( $resource, API ) {

    return $resource(
        API.root + 'game/',
        {},
        {
            query: {
                cache: true,
                isArray: false
            }
        }
    );
}]);
