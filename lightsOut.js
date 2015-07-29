GAME_SIZE = 5;

start = {};
start.eval = function(data, chatConnection) {
	game = generateMatrix(GAME_SIZE, GAME_SIZE, parseInt(data.arguments[0]));
	games[data.nick] = game;
	chatConnection.sendMessage("Lights Out game for " + data.nick + ". (difficulty " + parseInt(data.arguments[0]) + ")\nGame board:\n" + displayMatrix(game));
}
start.help = "Usage: start <difficulty>\n<difficulty> is the approximate number of moves required to solve\nStarts (or restarts) a game of Lights Out for your username\nBoards are randomly generated";

play = {};
play.eval = function(data, chatConnection) {
	var game = games[data.nick];
	if(!game) {
		chatConnection.sendMessage("You have not yet started a Lights Out game.\nUse .start to begin a game.");
		return;
	}
	
	if(data.arguments.length < 2)
		return;
	
	var x = parseInt(data.arguments[0]);
	var y = parseInt(data.arguments[1]);
	
	game = makePlay(game, x, y);
	
	if(checkWin(game)) {
		chatConnection.sendMessage("You win, " + data.nick + "!");
		return;
	}
	
	chatConnection.sendMessage("@" + data.nick + ", your board is:\n" + displayMatrix(game));
}
play.help = "Usage: play <x> <y>\nMake a play at <x> and <y> according to the rules of Lights Out";

board = {};
board.eval = function(data, chatConnection) {
	chatConnection.sendMessage("@" + data.nick + ", your board is:\n" + displayMatrix(game));
}
board.help = "Displays your Lights Out board";

var games = {};

function generateMatrix(width, height, difficulty) {
	//initialize array
	array = [];
	for(i = 0; i < height; i++) {
		array[i] = [];
		for(j = 0; j < width; j++) {
			array[i][j] = false;
		}
	}
		
	for(i = 0; i < difficulty; i++){
		array = makePlay(array, randomInt(0, width-1), randomInt(0, height-1));
	}
	
	return array;
}

function displayMatrix(game) {
	string = "\n  0 1 2 3 4";
	for(i = 0; i < game.length; i++) {
		string += "\n" + i + " ";
		for(j = 0; j < game[0].length; j++) {
			if(game[i][j]) {
				string += "■ ";
			}else {
				string += "□ ";
			}
		}
	}
	return string;
}

function makePlay(game, x, y) {
	game = invert(game, x, y);
	game = invert(game, x+1, y);
	game = invert(game, x, y+1);
	game = invert(game, x-1, y);
	game = invert(game, x, y-1);
	return game;
}

function invert(game, x, y) {
	if(x >= GAME_SIZE || x < 0 || x == undefined)
		return game;
	if(y >= GAME_SIZE || y < 0 || x == undefined)
		return game;
	game[y][x] = !game[y][x];
	return game;
}

function randomInt(min, max) {
    return (Math.floor((Math.random() * max) + min));
}

function checkWin(game) {
	for(i = 0; i < game.length; i++) {
		for(j = 0; j < game[0].length; j++) {
			if(game[i][j])
				return false;
		}
	}
	return true;
}

module.exports = {start: start, play: play, board: board};