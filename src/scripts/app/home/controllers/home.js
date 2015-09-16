/**
 * Home controller
 */
window.angular.module('home.controllers.home', [])
.controller('HomeCtrl', [
'$scope',
'$timeout',
'GameService',
'AnswerService',
function( $scope, $timeout, GameService, AnswerService ) {

    var timer = null;
    var defaultTime = 3;

    $scope.categories = [];

    $scope.activeQuestion = null;
    $scope.buzzedIn = false;
    
    $scope.timeRemaining = defaultTime;
    $scope.showTimer = false;

    $scope.bigMessage = null;

    $scope.score = 0;
    $scope.dailyDoubleBet = null;

    GameService.query({}, function( response ) {
        $scope.categories = response.objects;

        determineDailyDouble();
        console.log($scope.categories);

    });

    $scope.showQuestion = function( question ) {
        if(question.removed){
            return;
        }

        if(question.dailyDouble){
            $scope.bigMessage = "Daily Double!";

            $timeout(function(){
                $scope.bigMessage = null;
                $scope.dailyDoubleBet = parseInt(prompt("How much would you like to wager?"));
                $scope.activeQuestion = question;
                $scope.buzzedIn = true;
                startTimer(defaultTime);
            }, 3000);


        } else {
            $scope.activeQuestion = question;
            startTimer(defaultTime);
        }

    };

    $scope.selectAnswer = function( answer ) {

        stopTimer();

        AnswerService.query({ answer_id: answer.id }, function ( response ) {

            var points = $scope.activeQuestion.dailyDouble ? $scope.dailyDoubleBet : $scope.activeQuestion.points;

            if(response.objects.correct){
                awardPoints(points);
            } else {
                removePoints(points);
            }

            removeQuestion($scope.activeQuestion);
            resetToBoard();

        });
    };

    $scope.buzz = function( ) {
        playSound('buzz');
        $scope.buzzedIn = true;
        stopTimer();

        startTimer(defaultTime);
    };

    function resetToBoard() {
        $scope.showTimer = false;
        $scope.activeQuestion = null;
        $scope.buzzedIn = false;
        $scope.timeRemaining = defaultTime;
    }

    function startTimer( seconds ) {
        $scope.timeRemaining = defaultTime;
        countTimerDown();
    };

    function countTimerDown() {

        if ($scope.timeRemaining <= 0){
            timeRanOut();
            return;
        }

        $scope.showTimer = true;

        $scope.timeRemaining--;

        timer = $timeout(function(){
            countTimerDown();
        }, 1000);

    }

    function stopTimer( ) {
        $timeout.cancel(timer);
        $scope.showTimer = false;
        $scope.timeRemaining = defaultTime;
    };

    function timeRanOut( ) {

        playSound('time-up');

        if($scope.buzzedIn){
            if($scope.activeQuestion.dailyDouble){
                removePoints($scope.dailyDoubleBet);
            } else {
                removePoints($scope.activeQuestion.points);
            }
        }

        removeQuestion($scope.activeQuestion);
        resetToBoard();

        $scope.bigMessage = "Time Up!"

        $timeout(function(){
            $scope.bigMessage = null;
        }, 2000);

    };

    function removeQuestion( question ) {
        question.removed = true;
    };


    function awardPoints( amount ) {
        $scope.score += amount;
    };

    function removePoints( amount ) {
        $scope.score -= amount;
    };

    function determineDailyDouble() {

        var category = getRandomInt(0, 5);
        var question = getRandomInt(0, 4);

        //DEBUG
        category = 0;
        question = 0;

        $scope.categories[category].questions[question].dailyDouble = true;

    };


    function playSound(type) {

        var filename = null;
        switch(type){
            case "buzz":
                filename = 'ring-in.mp3';
                break;
            case "round-begin":
                filename = 'board-fill.mp3';
                break;
            case "round-end":
                filename = 'round-end.mp3';
                break;
            case "daily-double":
                filename = 'daily-double.mp3';
                break;
            case "time-up":
                filename = 'time-out.mp3';
                break;
        }

        if(!filename){
            return;
        };

        var sfxRoot = '/static/sfx/';
        var snd = new Audio(sfxRoot + filename);
        snd.play();

    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}]);
