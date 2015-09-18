//Bundling game dependencies.
window.angular.module('game', [
    'game.controllers.game',
    'game.services.game',
    'game.services.answer',
    'game.services.final',
]);
