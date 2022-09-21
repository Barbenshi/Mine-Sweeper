'use strict'




var gElTable = document.querySelector('table')

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = getMat(gLevel.SIZE)
console.log(gBoard);

initGame()
function initGame() {
    // Model
    gBoard = buildBoard(gBoard)

    // DOM
    renderBoard(gBoard)
}


function buildBoard(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            const cell = {
                minesAroundCount: 4, //gonna calculate that later with function 
                isShown: false, // depends on left click later
                isMine: false, // all false except mines
                isMarked: false // Depends on right click
            }
            board[i][j] = cell
        }
    }

    randomizeMines(gLevel.MINES)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }

    return board
}

function renderBoard(mat) {

    var strHTML = '<table border="10"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]

            var currElement = cell.minesAroundCount ? cell.minesAroundCount : EMPTY
            if (cell.isMine) currElement = '*'

            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})">${cell.isShown ? currElement : EMPTY}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    gElTable.innerHTML = strHTML

}


function setMinesNegsCount(board, i, j) {
    var count = 0

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue
            if (row === i && col === j) continue
            if (board[row][col].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell,i, j) {
    if (!gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        elCell.classList.add('clicked')
    }
    renderBoard(gBoard, 'table')
    console.log(elCell);
}

function randomizeMines(num){

    for(var i =0;i<num;i++){
        var pos = getRandomPos()
        gBoard[pos.i][pos.j].isMine? i-- : gBoard[pos.i][pos.j].isMine = true
    }
}


