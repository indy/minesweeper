window.onload=init;

// some globals
var gFlagsRemaining = 0;

var gCellImages = new Array();

var mBoard = null;

function setupGameToggle() {
  toggleElements(e("hide-click"),
                 e("game-display"),
                 e("game-setup"));
}

function sanityCheckMineDensity(mines, height, width) {
  var numCells = height * width;
  return (numCells < mines) ? numCells : mines;
}

function startNewGame() {
  var numMines = document.gameSettings.mines.value;
  var width = document.gameSettings.width.value;
  var height = document.gameSettings.height.value;

  numMines = sanityCheckMineDensity(numMines, height, width);

  deleteBoard(mBoard);
  mBoard = createBoard(width, height, numMines);
  hide(e("game-setup"));
  show(e("game-display"));
}

function clickedBoard(nsEvent) {
  var event = getEvent(nsEvent);
  var toggleKey = event.ctrlKey || event.shiftKey;
  var target = findNode(getTarget(event), "TD", "TABLE");

  if(target != false) {

    var row = target.minesweeper.row;
    var col = target.minesweeper.col;

    if(toggleKey == true) {
      mBoard.toggleFlag(row, col);
    } else {
      mBoard.uncoverCell(row, col);
    }

    // check if the game has been won
    if(hasPlayerWon() == true) {
      playerHasWon();
    } else if(hasPlayerLost() == true) {
      playerHasLost();
    }

  }

};


function createBoard(width, height, numMines) {
  var b = new Board();
  b.setup(width, height, numMines);


  updateFlagsUI(numMines);

  var htmlBoard = e("dynamic-board");
  htmlBoard.onclick = clickedBoard;
  return b;
}

function deleteBoard(b) {
  if(b == null) {
    return;
  }
  b = null;
//  b.unlinkCells();
  e("dynamic-board").innerHTML = "";
}

function xxxtestClone() {
  var dest = e("tile-dest");
  var src = e("tile-flag");
  
  var clone = src.cloneNode(true);

  var child = dest.firstChild;
  while(child != null) {
    if(child.nodeName == "IMG") {
      dest.replaceChild(clone, child);      
      break;
    }
    child = child.nextSibling;
  }


//  dest.appendChild(clone);
  
}

function init() {
  var numMines = document.gameSettings.mines.value;
  var width = document.gameSettings.width.value;
  var height = document.gameSettings.height.value;

  setupCellImages();
  mBoard = createBoard(width, height, numMines);

  setupGameToggle();
  e("start-new-game").onclick = startNewGame;

//  e("testtest").onclick = testClone;

}

function updateFlagsUI(num) {
  if(num != undefined) {
    gFlagsRemaining = num;
  }
  var ui = e("flags-remaining");
  ui.innerHTML = "<p>" + gFlagsRemaining + "</p>";
}

function playerHasWon() {
  alert("you win");
  show(e("game-setup"));
  hide(e("game-display"));
}

function playerHasLost() {
  alert("GAME OVER");
  show(e("game-setup"));
  hide(e("game-display"));
}

function hasPlayerLost() {
  return mBoard.hitMine();
}

// returns true if the player has won
function hasPlayerWon() {
  if(gFlagsRemaining != 0) {
    return false;
  }
  return mBoard.allMinesFlagged();
}

function setupCellImages() {
  gCellImages[0] = "zero";
  gCellImages[1] = "one";
  gCellImages[2] = "two";
  gCellImages[3] = "three";
  gCellImages[4] = "four";
  gCellImages[5] = "five";
  gCellImages[6] = "six";
  gCellImages[7] = "seven";
  gCellImages[8] = "eight";
}

