'use strict'
const EMPTY = ''

function getMat(size) {
    var board = []

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY
        }
    }
    return board
}


function getRandomPos() {
    return { i: getRandomInt(0, gBoard.length), j: getRandomInt(0, gBoard.length) }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
