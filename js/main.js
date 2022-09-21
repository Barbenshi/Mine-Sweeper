'use strict'




var gElTable = document.querySelector('table')
var gElRestartBtn = document.querySelector('.restart-btn')

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    timerInterval: null,
}

var gBoard


function initGame() {
    resetGameStats()
    resetTimer()

    // Model
    gBoard = getMat(gLevel.SIZE)
    buildBoard(gBoard)

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
                isMarked: false, // Depends on right click
            }
            board[i][j] = cell
        }
    }

    randomizeMines(board, gLevel.MINES)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }

}

function renderBoard(mat) {

    var strHTML = '<table border="10"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]

            var className = 'cell cell-' + i + '-' + j
            if (cell.isMarked) className += ' marked'
            if (cell.isShown) className += ' shown'
            if (cell.mineClicked) className += ' mine-clicked'

            var currElement = cell.minesAroundCount ? cell.minesAroundCount : EMPTY
            if (cell.isMine) currElement = '*'
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})"
            onmousedown="onRightClick(event,this,${i},${j})">
            ${cell.isShown ? currElement : EMPTY}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    gElTable.innerHTML = strHTML

}

const showNegs = setMinesNegsCount
console.log(showNegs);


function setMinesNegsCount(board, i, j, noNegCell = false) {
    var count = 0

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue
            if (row === i && col === j) continue
            if (noNegCell) board[row][col].isShown = true
            if (board[row][col].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gGame.secsPassed === 0) starTimer()
    if (gBoard[i][j].isMine) gameOver(elCell, i, j)

    // Model
    if (gBoard[i][j].minesAroundCount === 0) showNegs(gBoard, i, j, 'Yes')
    console.log(gBoard[i][j].isShown);

    gBoard[i][j].isShown = true
    gGame.shownCount++

    // DOM
    elCell.classList.add('shown')

    renderBoard(gBoard)


    checkWin()
}

function randomizeMines(board, num) {

    for (var i = 0; i < num; i++) {
        var pos = getRandomPos()
        board[pos.i][pos.j].isMine ? i-- : board[pos.i][pos.j].isMine = true
    }
}


function onRightClick(ev, elCell, i, j) {
    if (ev.which !== 3) return

    if (gGame.secsPassed === 0) starTimer()

    // Model
    gBoard[i][j].isMarked = true
    gGame.markedCount++

    // DOM
    elCell.classList.toggle('marked')

    checkWin()
}

function gameOver(elMine, i, j) {
    clearInterval(gGame.timerInterval)

    gGame.isOn = false
    gBoard[i][j].mineClicked = true

    showMines()
    elMine.classList.add('mine-clicked')

    // resetGameStats()
}

function checkWin() {
    if (gGame.markedCount !== gLevel.MINES ||
        gGame.shownCount !== gLevel.SIZE ** 2 - gLevel.MINES) return false

    console.log('You win!');
    return true
}

function showMines() {
    // Model
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
        }
    }
}

function resetGameStats() {
    clearInterval(gGame.timerInterval)

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        // isFirstClick: true,
        // firstClickTS: null,
        timerInterval: null,
    }
}

function changeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    initGame()
}

function resetTimer() {
    document.querySelector(".seconds").innerHTML = '00'
    document.querySelector(".minutes").innerHTML = '00'
}

function starTimer() {
    gGame.timerInterval = setInterval(() => {
        document.querySelector(".seconds").innerHTML = pad(++gGame.secsPassed % 60)
        document.querySelector(".minutes").innerHTML = pad(parseInt(gGame.secsPassed / 60, 10))
    }, 1000)
}
// padding zeros if value lower than 9
function pad(val) { return val > 9 ? val : "0" + val; }

