/**
 * Home controller
 */
window.angular.module('home.controllers.home', [])
.controller('HomeCtrl', [
'$scope',
'$timeout',
'GameService',
'AnswerService',
'FinalService',
'Utils',
function( $scope, $timeout, GameService, AnswerService, FinalService, Utils ) {

    var debug = true;
    var timer = null;
    var roundTimer = null;
    var defaultTime = 10;
    var defaultRoundTime = 60 * 5;
    var mute = true;
    var totalRounds = 2;
    var roundReady = false;
    var roundNumber = 0;

    $scope.newMessage = "";
    $scope.messages = [];

    $scope.gameHasStarted = false;
    $scope.playerIsHost = false;
    $scope.playerCanChoose = false;
    $scope.playerCanAnswer = false;

    socketInit();
    resetAndInit();

    function socketInit() {
        $scope.ws = new WebSocket("ws://localhost:9000/chat");

        var join = confirm("Would you like to join an existing game?");

        if(join) {
            if(debug){
                var roomName = "testroom123";
                var playerName = "Player " + getRandomInt(1, 9);
            } else {
                var roomName = prompt("Enter the room name now");
                var playerName = prompt("What is your name?");
            }
            var data = {
                type: "join",
                roomName: roomName,
                playerName: playerName
            };
            $scope.ws.send(JSON.stringify(data));
        } else {
            if(debug){
                var roomName = "testroom123";
                var playerName = "Player " + getRandomInt(1, 9);
            } else {
                var roomName = prompt("What would you like to call this room?");
                var playerName = prompt("What is your name?");
            }
            var data = {
                type: "create",
                roomName: roomName,
                playerName: playerName
            };
            $scope.ws.send(JSON.stringify(data));
            $scope.playerIsHost = true;
        }


        $scope.playerName = playerName;
        $scope.roomName = roomName;


        $scope.ws.onmessage = function(event) {
            var data = JSON.parse(event.data);
            
            switch(data.type){
                case "create":
                    var msg = {name: "System", body: data.playerName + " has created the room " + data.roomName + "."};
                    $scope.messages.push(msg);
                    $scope.$apply();
                    break;
                case "join":
                    var msg = {name: "System", body: data.playerName + " has joined the room."};
                    $scope.messages.push(msg);
                    $scope.$apply();
                    break;
                case "message":
                    var msg = {name: data.playerName, body: data.body};
                    $scope.messages.push(msg);
                    $scope.$apply();
                    break;
                case "start":
                    roundNumber++;

                    $scope.players = data.players;

                    if(roundNumber > totalRounds){
                        finalJeopardy();
                        return;
                    }

                    playSound('round-begin');

                    $scope.categories = data.categories;
                    determineDailyDouble();
                    $scope.gameHasStarted = true;

                    for(var i=0; i<6; i++) {
                        for(var j=0; j<5;j++) {

                            var delay = getRandomInt(0, 3500);

                            var call = function(_i, _j, _delay){
                                $timeout(function(){
                                    setQuestionToReady(_i, _j);
                                }, _delay);
                            }
                            call(i, j, delay);
                        }
                    }

                    $timeout(function(){
                        roundReady = true;
                        startRoundTimer();

                        if($scope.playerIsHost) {
                            $scope.playerCanChoose = true;
                        }

                    }, 4000);

                    break;

                case "question":
                    var q = null;
                    console.log("data:", data);
                    console.log("categories:", $scope.categories);
                    for(var i=0, category; category=$scope.categories[i]; i++){
                        for(var j=0, question; question=category.questions[j]; j++) {
                            if(data.question.id == question.id){
                                q = question;
                                break;
                            }
                        }
                        if(q){
                            break;
                        }
                    }

                    if(q){
                        $scope.showQuestion(q);
                    } else {
                        alert("Question not found!");
                    }

                    break;
                case "buzz":
                    playSound('buzz');
                    $scope.buzzedIn = true;
                    stopTimer();
                    startTimer(defaultTime);
                    
                    if(data.playerName == $scope.playerName){
                        $scope.playerCanAnswer = true;
                    } else {
                        $scope.playerCanAnswer = false;
                    }
                    break;
            }
        }

        $scope.sendChatMessage = function( ) {

            var body = $scope.newMessage;

            var data = {
                type: "message",
                playerName: $scope.playerName,
                body: body
            };

            $scope.ws.send(JSON.stringify(data));
            $scope.newMessage = "";
        };

        

    }

    $scope.startGame = function ( ) {
        resetAndInit();

        var data = {
            type: "start",
            roomName: $scope.roomName,
            playerName: $scope.playerName
        };

        $scope.ws.send(JSON.stringify(data));

    };

    function resetAndInit() {
        $scope.categories = [];

        $scope.activeQuestion = null;
        $scope.buzzedIn = false;
        
        $scope.timeRemaining = defaultTime;
        $scope.showTimer = false;

        $scope.roundTimeRemaining = defaultRoundTime;
        $scope.showRoundTimer = true;

        $scope.bigMessage = null;

        $scope.score = $scope.score || 0;
        $scope.dailyDoubleBet = null;
        
    }



    function setQuestionToReady(i, j){
        $scope.categories[i].questions[j].ready = true;
    }

    /* Scope Functions */

    $scope.selectQuestion = function( question ) {
        if(!$scope.playerCanChoose){
            alert("It's not your turn");
            return;
        }
        if(question.removed){
            return;
        }

        if(!roundReady){
            return;
        }

        var data = {
            type: "question",
            question: question,
            roomName: $scope.roomName,
            playerName: $scope.playerName
        };

        $scope.ws.send(JSON.stringify(data));

    };

    $scope.showQuestion = function ( question ) {

        if(question.dailyDouble){
            playSound('daily-double');
            $scope.bigMessage = "Daily Double!";

            $timeout(function(){
                $scope.bigMessage = null;
                $scope.dailyDoubleBet = promptDailyDouble();
                $scope.activeQuestion = question;
                $scope.buzzedIn = true;
                startTimer(defaultTime);
            }, 1500);

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
        var data = {
            type: "buzz",
            roomName: $scope.roomName,
            playerName: $scope.playerName
        };

        $scope.ws.send(JSON.stringify(data));

        
    };

    /* Private Functions */

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

    function startRoundTimer( seconds ) {
        $scope.roundTimeRemaining = defaultRoundTime;
        countRoundTimerDown();
    };

    function startFinalTimer( seconds ) {
        $scope.timeRemaining = 30;
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

    function countRoundTimerDown() {

        if ($scope.roundTimeRemaining <= 0){
            endRound();
            return;
        }

        $scope.showRoundTimer = true;
        $scope.roundTimeRemaining--;

        roundTimer = $timeout(function(){
            countRoundTimerDown();
        }, 1000);

    }

    function stopTimer( ) {
        $timeout.cancel(timer);
        $scope.showTimer = false;
        $scope.timeRemaining = defaultTime;
    };

    function stopRoundTimer( ) {
        $timeout.cancel(roundTimer);
        $scope.showRoundTimer = false;
        $scope.roundTimeRemaining = defaultRoundTime;
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

    function endRound() {
        resetAndInit();
    }

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

        if(debug) {
            category = 0;
            question = 0;
        }

        $scope.categories[category].questions[question].dailyDouble = true;

    };

    function promptDailyDouble(prepend) {

        var str = prepend ? prepend + "\n" : "";
        str += "How much would you like to wager?"

        var amount = prompt(str);
        var max = ($scope.score < 1000) ? 1000 : $scope.score;

        if(!Utils.isNumberWithinRange(amount, 0, max)){
            return promptDailyDouble("Invalid Amount");
        }

        return parseInt(Math.floor(amount));

    }


    function finalJeopardy() {
        $scope.categories = [0];
        $scope.bigMessage = "Final Jeopardy";

        $timeout(function(){
            $scope.bigMessage = null;
            // show category

            FinalService.query({}, function(response){
                $scope.finalJeopardyCategory = response.objects;

                $timeout(function(){
                    var wager = promptDailyDouble();

                    $scope.showFinalJeopardyQuestion = true;
                    var rand = getRandomInt(0,4);
                    $scope.activeQuestion = $scope.finalJeopardyCategory.questions[rand];
                    $scope.buzzedIn = true;

                    startFinalTimer();


                }, 1500);

            });

            // $scope.finalJeopardyCategory = {
            //     title: "Potent Potables",
            //     difficulty: "final",
            //     id: 99999,
            //     question: {
            //         title: 'This is a test',
            //         id: 88888,
            //         answers: [
            //             {
            //                 id: 77777,
            //                 title: "Foo"
            //             },
            //             {
            //                 id: 77776,
            //                 title: "Bar"
            //             },
            //             {
            //                 id: 77775,
            //                 title: "Test"
            //             },
            //             {
            //                 id: 77774,
            //                 title: "Yo"
            //             }
            //         ]
            //     } 
            // };

          


        }, 1500);



        //show `question`

        //ask for answer



    }


    function playSound(type) {

        if(mute){
            return false;
        }

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
