/**
 * Splashboard controller
 */
window.angular.module('home.controllers.home', [])
.controller('HomeCtrl', [
'$scope',
'GameService',
'AnswerService',
function( $scope, GameService, AnswerService ) {

    $scope.categories = []

    $scope.activeQuestion = null;

    GameService.query({}, function( response ) {
        $scope.categories = response.objects;
    });

    $scope.showQuestion = function(question) {
        $scope.activeQuestion = question;
    };

    $scope.selectAnswer = function(answer) {
        AnswerService.query({answer_id: answer.id}, function (response) {
            console.log(response);
        });
    };


}]);
