/**
 * Answer service
 */
window.angular.module('game.services.answer', [])
.factory('AnswerService', [
'$resource',
'API',
function( $resource, API ) {

    return $resource(
        API.root + 'answer/',
        {},
        {
            query: {
                cache: true,
                isArray: false
            }
        }
    );
}]);
