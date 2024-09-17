function GameBoard() {
    const board = [];
    const rows = columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = 0;
        }
    }

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            console.log(board[i]);
        }
    }

    const getBoard = () => board;

    const putMarker = (row, column, marker) => {
        board[row][column] = marker;
    }

    const checkBoard = () => {
        for (let i = 0; i < rows; i++) {
            if (board[i][0] === board[i][1] &&
                board[i][1] === board[i][2] &&
                board[i][2] !== 0) {
                return [[i, 0], [i, 1], [i, 2]];
            } else if (board[0][i] === board[1][i] &&
                board[1][i] === board[2][i] &&
                board[2][i] !== 0) {
                return [[0, i], [1, i], [2, i]];
            } else if (board[0][0] === board[1][1] &&
                board[1][1] === board [2][2] &&
                board[2][2] !== 0) {
                return [[0, 0], [1, 1], [2, 2]];
            } else if (board[0][2] === board[1][1] &&
                board[1][1] === board [2][0] &&
                board[2][0] !== 0) {
                return [[0, 2], [1, 1], [2, 0]];
            }
        }
        if (!board[0].includes(0) &&
            !board[1].includes(0) &&
            !board[2].includes(0)) {
            return -1;
        }
        return false;
    }

    return {
        printBoard,
        getBoard,
        putMarker,
        checkBoard
    };
};

function GameController (playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = GameBoard();
    const players = [
        {
            name: playerOneName,
            marker: "X"
        },
        {
            name: playerTwoName,
            marker: "O"
        }
    ];

    const getPlayers = () => players;

    const changePlayerName = function (number, newName) {
        players[number].name = newName;
    }

    let currentPlayer = players[0];

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const printRound = () => {
        // board.printBoard();
        console.log(`${currentPlayer.name}'s Turn.`)
    }

    const playRound = (row, column) => {
        let chosenCellValue = board.getBoard()[row][column];
        let boardStatus = board.checkBoard();
        if (chosenCellValue === 0 && !boardStatus) {
            board.putMarker(row, column, currentPlayer.marker)
            board.printBoard();
        }
        boardStatus = board.checkBoard();
        if (boardStatus) {
            console.log("Game Ends!");
            if (boardStatus !== -1) {
                console.log(`${currentPlayer.name} wins!`)
            } else {
                console.log("It's a tie!");
            }
            return boardStatus;
        } else {
            switchPlayerTurn();
            printRound();
        }
    }

    return {
        getPlayers,
        changePlayerName,
        getCurrentPlayer,
        playRound
    };
};

function ScreenController() {
    const game = GameController();
    const board = document.querySelector(".board");

    const playerOne = document.querySelector(".player-one");
    const playerTwo = document.querySelector(".player-two");
    const playerOneName = document.querySelector(".player-one-name");
    const playerOneMarker = document.querySelector(".player-one-marker");
    const playerTwoName = document.querySelector(".player-two-name");
    const playerTwoMarker = document.querySelector(".player-two-marker");

    playerOne.classList.add("current-player");

    function changeCurrentPlayerClass () {
        playerOne.classList.toggle("current-player");
        playerTwo.classList.toggle("current-player");
    }function removeCurrentPlayerClass () {
        playerOne.classList.remove("current-player");
        playerTwo.classList.remove("current-player");
    }

    function updatePlayers() {
        playerOneName.textContent = game.getPlayers()[0].name;
        playerTwoName.textContent = game.getPlayers()[1].name;

        playerOneMarker.textContent = game.getPlayers()[0].marker;
        playerTwoMarker.textContent = game.getPlayers()[1].marker;
    }
    updatePlayers();

    function playRound(e) {
        const row = e.target.id[1];
        const column = e.target.id[3];
        if (row && column && !e.target.textContent) {
            e.target.textContent = game.getCurrentPlayer().marker;
            const gameStatus = game.playRound(row, column);
            if (gameStatus) {
                console.log("yea");
                board.removeEventListener("click", playRound);
                paintBoard(gameStatus);
                removeCurrentPlayerClass();
                alert(gameStatus);
                if (gameStatus === -1) {
                    alert("Tie!");
                } else {
                    alert(`${game.getCurrentPlayer().name} wins!`);
                }
            } else {
                changeCurrentPlayerClass();
            }
        }

    }
    board.addEventListener("click", playRound);

    function paintBoard(gameStatus) {
        // board.style.backgroundColor = "gray";
        board.classList.add("game-over");
        if (gameStatus == -1) {
            console.log("tie");
        } else {
            gameStatus.forEach(cell => {
                const paintCell = document.querySelector(`#r${cell[0]}c${cell[1]}`);
                paintCell.classList.add("success-cell");
            });
        }
    }

    playerOneName.addEventListener("click", () => {
        newName = prompt("Enter new name:");
        if (newName) {
            game.changePlayerName(0, newName);
            updatePlayers();
        }
    });
    playerTwoName.addEventListener("click", () => {
        newName = prompt("Enter new name:");
        if (newName) {
            game.changePlayerName(1, newName);
            updatePlayers();
        }
    });
};

ScreenController();
