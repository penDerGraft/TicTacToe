'use strict';

var game = {
	playerTurn: true,
	playerImage: new Image(),
	computerImage: new Image(),
	board: [],
	// Characters for the board
	UNOCCUPIED: ' ',
	HUMAN: 'X',
	COMPUTER: 'O',
	BOARD_SIZE: 9
};

$(document).ready(function () {
	for (var i = 0; i < 9; i++) {
		$("#" + i + "square").click(game.makeMove);
	};
	$("#newgame").click(game.newGame);
	game.newGame();
 });

game.playerImage.src = "x.png";
game.computerImage.src = "o.png";

// Represents the game board using characters
game.newGame = function () {
	for (var i = 0; i < game.BOARD_SIZE; i++) {
		game.board[i] = game.UNOCCUPIED;
		document.images[i].src = "blank.png";
	}
	
	game.playerTurn = true;
	$("#turnInfo").html("Your turn.").removeClass().addClass("red");
};

game.makeMove = function (e) {
	// Determine the position in the array from the square's ID
	var pos = parseInt(e.target.id);	
	
	// Make sure it's the human's move and the position isn't already occupied
	if (game.playerTurn && game.board[pos] == game.UNOCCUPIED) {		
		game.board[pos] = game.HUMAN;
		document.images[pos].src = game.playerImage.src;
		game.playerTurn = !game.playerTurn;
		
		// If the game's not over, make computer move in one second 
		if (!game.gameOver()) {			
			$("#turnInfo").html("Computer's turn.").removeClass().addClass("blue");	

			// Make the computer move after waiting a second
			setTimeout(game.makeComputerMove, 1000);
		}
	}	
};

game.makeComputerMove = function () {	
	// Generate random move, but keep count of how many times we try so we avoid
	// accidentally getting stuck in the loop.
	var count = 0;
	var move;
	do {
		move = Math.floor(Math.random() * game.BOARD_SIZE);
		count++;
	} while ((game.board[move] == game.HUMAN || game.board[move] == game.COMPUTER) && count < 100);

	if (count == 100)
		alert("There's something wrong... computer can't find an open move.");
	else {
		game.board[move] = game.COMPUTER;
		document.images[move].src = game.computerImage.src;
	}
	
	if (!game.gameOver()) {
		game.playerTurn = !game.playerTurn;
		$("#turnInfo").html("Your turn.").removeClass().addClass("red");
	}
};

// Returns true if game is over and outputs appropriate ending message, otherwise returns false.
game.gameOver = function () {
	var winner = game.checkForWinner();
	var compWins = parseInt($("#comp-wins").text());
	var userWins = parseInt($("#user-wins").text());

	if (winner == 1)
		$("#turnInfo").removeClass().html("It's a tie!");	
	else if (winner == 2) {
		$("#turnInfo").html("You Win!");
		$("#user-wins").html(" " + ++userWins);	
		$("#win").get(0).play();
	}
	else if (winner == 3) {
		$("#turnInfo").html("The computer won!");
		$("#comp-wins").html(" " + ++compWins);
		$("#lose").get(0).play();
	}
	else
		return false;

	return true;
};

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if X won
//   3 if O won
game.checkForWinner = function () {
	// Check for horizontal wins
	for (var i = 0; i <= 6; i += 3) {
		if (game.board[i] == game.HUMAN && game.board[i+1] == game.HUMAN && game.board[i+2] == game.HUMAN)
			return 2;
		if (game.board[i] == game.COMPUTER && game.board[i+1] == game.COMPUTER && game.board[i+2] == game.COMPUTER)
			return 3;
	}

	// Check for vertical wins
	for (var i = 0; i <= 2; i++) {
		if (game.board[i] == game.HUMAN && game.board[i+3] == game.HUMAN && game.board[i+6] == game.HUMAN)
			return 2;
		if (game.board[i] == game.COMPUTER && game.board[i+3] == game.COMPUTER && game.board[i+6] == game.COMPUTER)
			return 3;
	}

	// Check for diagonal wins
	if ((game.board[0] == game.HUMAN && game.board[4] == game.HUMAN && game.board[8] == game.HUMAN) ||
		(game.board[2] == game.HUMAN && game.board[4] == game.HUMAN && game.board[6] == game.HUMAN))
		return 2;
	if ((game.board[0] == game.COMPUTER && game.board[4] == game.COMPUTER && game.board[8] == game.COMPUTER) ||
		(game.board[2] == game.COMPUTER && game.board[4] == game.COMPUTER && game.board[6] == game.COMPUTER))
		return 3;

	// Check for tie
	for (var i = 0; i < game.BOARD_SIZE; i++) {
		// If we find a number, then no one has won yet
		if (game.board[i] != game.HUMAN && game.board[i] != game.COMPUTER)
			return 0;
	}

	// If we make it through the previous loop, all places are taken, so it's a tie
	return 1;
};
