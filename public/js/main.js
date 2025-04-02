const gameBoard = (() => {
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    const getBoard = () => board;

    const resetBoard = () => {
        board = [["", "", ""], ["", "", ""], ["", "", ""]];
    };

    const placeMark = (row, col, mark) => {
        if (board[row][col] === "") {
            board[row][col] = mark;
            return true;
        }  
        return false;
    };

    return { getBoard, resetBoard, placeMark };
})();

const gameController = (() => {
    let gameOver = false;
    let currentPlayer = "X";

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";  
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();

        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2]) return board[i][0];
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[2][i]) return board[0][i];
        }
        if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2]) return board[0][0];
        if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[2][2]) return board[0][2];

        if (board.flat().every(cell => cell !== "")) return "Draw";
        return null;
    };

    const handleMove = (row, col) => {
        if (gameOver) return;
        
        if (gameBoard.placeMark(row, col, currentPlayer)) {
            displayController.renderBoard();
            const winner = checkWinner();
            if (winner) {
                displayController.displayResult(winner);
                gameOver = true;
            }
            else {
                switchPlayer();
                displayController.updateTurn(currentPlayer);
            }
        }
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        currentPlayer = "X";
        gameOver = false;
        displayController.renderBoard();
        displayController.updateTurn(currentPlayer);
        displayController.clearResult();
    };

    return { handleMove, restartGame };
})();

const displayController = (() => {
    const boardElement = document.getElementById("game-board");
    const resultElement = document.getElementById("result");
    const turnElement = document.getElementById("turn");
    const restartElement = document.getElementById("restart-btn");

    const renderBoard = () => {
        boardElement.innerHTML = "";
        const board = gameBoard.getBoard();
        console.log(board);
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                cellElement.textContent = cell;
                cellElement.addEventListener("click", () => {
                    gameController.handleMove(rowIndex, colIndex);
                });
                boardElement.appendChild(cellElement);
            })
        });
    };

    const displayResult = (winner) => {
        resultElement.textContent = winner === "Draw" ? "It's a draw" : `${winner} wins`;
    };

    const clearResult = () => {
        resultElement.textContent = "";
    };

    const updateTurn = (player) =>{
        turnElement.textContent = `Player ${player}'s turn.`;
    };

    restartElement.addEventListener("click", () => {
        gameController.restartGame();
    });

    return { renderBoard, displayResult, clearResult, updateTurn };
})();

window.onload = () => {
    displayController.renderBoard();
    displayController.updateTurn("X");
}