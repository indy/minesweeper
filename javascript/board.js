// why cant this be in MSBoard?, doing so just results in an error when trying to call from clickedBoard
function toggleFlagBar(cell) {
  if(cell.flagged == true) {
    cell.unflag();
    ++gFlagsRemaining;
  } else {
    if(gFlagsRemaining > 0) {
      cell.flag();
      --gFlagsRemaining;
    }
  }
  updateFlagsUI();
};


var MSBoard = function(width, height, numMines) {
  this.width = width;
  this.height = height;
  this.numMines = numMines;

  this.cells = new Array();

  this.clickedBoard = function(nsEvent) {
    var event = getEvent(nsEvent);
    var toggleKey = event.ctrlKey || event.shiftKey;
    var target = findNode(getTarget(event), "TD", "TABLE");

    if(target != false) {
      var cell = target.cellNode;

      if(toggleKey == true) {
        toggleFlagBar(cell);
      } else if(cell.processCell() == false) {
        playerHasLost();
      }
    }
    // check if the game has been won
    if(hasPlayerWon() == true) {
      playerHasWon();
    }
  };

  this.unlinkCells = function() {
    var i, j;
    for(j=0;j<this.height;j+=1) {
      for(i=0;i<this.width;i+=1) {
        this.cells[j][i].cell = null;
      }
    }
  }

  this.getCellNode = function(row, col) {
    return this.cells[row][col];
  };

  this.addMines = function(amount) {
    var board = this;
    var numCells = board.width * board.height;

    var hasMine = new Array(numCells)
    for(var m in hasMine) {
      hasMine[m] = false;
    }

    var randomCellIndex = function() {
      return parseInt(Math.random() * numCells);
    };

    var mineCell = function(mineme) {
      var row = parseInt(mineme / board.width);
      var col = mineme % board.width;
      board.cells[row][col].mine = true;
      hasMine[mineme] = true;
    };

    var nextMineableCell = function(mineme) {
      while(hasMine[mineme] == true) {
        mineme += 1;
        if(mineme == numCells) {
          mineme = 0;
        }
      }
      return mineme;
    }

    for(var i=0;i<amount;i++) {
      mineCell(nextMineableCell(randomCellIndex()));
    }

    gFlagsRemaining = amount;
  };

  this.setupCells = function() {
    board = e("dynamic-board");
    var row, cell, text;
    var i, j;
    var tRow, tCol;

    // create both visual and internal structures
    for(j=0;j<height;j+=1) {
      this.cells[j] = new Array();
      row = board.insertRow(-1);
      for(i=0;i<width;i+=1) {

        tRow = j;
        tCol = width - i - 1;

        cell = row.insertCell(0);
        var cellNode = new CellNode(cell, tRow, tCol);
        this.cells[tRow][tCol] = cellNode;

        // add pointer from td back upto CellNode, needed for handling clickedBoard
        // remember to unlink this at the end to avoid a circular graph
        cell.cellNode = cellNode;
        cellNode.setImage("empty");
      }
    };

    // fill info about internal structure
    for(j=0;j<height;j+=1) {
      for(i=0;i<width;i+=1) {
        this.cells[j][i].determineNeighbours(this);
      }
    };

    // add some mines
    this.addMines(this.numMines);

    // count neighbouring mines
    for(j=0;j<height;j+=1) {
      for(i=0;i<width;i+=1) {
        this.cells[j][i].numNeighbouringMines = this.cells[j][i].neighbouringMines();
      }
    };

    // events
    board.onclick = this.clickedBoard; // shouldn't really be here
  };

}
