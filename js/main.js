'use strict'


// Constants
const EMPTY = ''

const WIN_IMG = '<img src="img/spider.png">'
const LOSE_IMG = '<img src="img/fire.png">'
const NORMAL_IMG = '<img src="img/gob-face.png">'

const MINE_IMG = '<img src="img/mine.png">'

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
    isFirstClick : true,
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

    gElRestartBtn.innerHTML = NORMAL_IMG
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
            if (cell.isMine) currElement = MINE_IMG
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
// function recurseNegs(){
//     for (var row = i - 1; row <= i + 1; row++) {
//         if (row < 0 || row >= board.length) continue

//         for (var col = j - 1; col <= j + 1; col++) {
//             if (col < 0 || col >= board.length) continue
//             if (row === i && col === j) continue
//             if (noMinesNegs) {
//                 // board[row][col].isShown = true
//                 // showNegs(gBoard, row+1, col+1, 'Yes')
//                 // board[row][col].isShown = true
//                 if (!gBoard[row][col].minesAroundCount &&
//                     !gBoard[row][col].isMine) showNegs(gBoard, row +1, col+1, 'Yes')
//             }
//         }
//     }
// }

function setMinesNegsCount(board, i, j, noMinesNegs = false) {
    var count = 0

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue
            if (row === i && col === j) continue
            if (noMinesNegs) {
                board[row][col].isShown = true
                gGame.shownCount++
                checkWin()
            }
            if (board[row][col].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gGame.isFirstClick){
        gGame.isFirstClick = false
        starTimer()
    }

    if (gBoard[i][j].isMine) gameOver(elCell, i, j)

    if (!gBoard[i][j].minesAroundCount &&
        !gBoard[i][j].isMine) showNegs(gBoard, i, j, 'Yes')

    // Model
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

    if (gGame.isFirstClick){
        gGame.isFirstClick = false
        starTimer()
    }

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
    gElRestartBtn.innerHTML = LOSE_IMG 

    
    // resetGameStats()
}

function checkWin() {
    if (gGame.markedCount !== gLevel.MINES ||
        gGame.shownCount !== gLevel.SIZE ** 2 - gLevel.MINES) return false
    
    gElRestartBtn.innerHTML = WIN_IMG    
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
        isFirstClick: true,
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
        console.log(gGame.isOn);
    }, 1000)
}
// padding zeros if value lower than 9
function pad(val) { return val > 9 ? val : "0" + val; }

