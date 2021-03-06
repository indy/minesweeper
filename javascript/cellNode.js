

var CellNode = function(cell, tRow, tCol) {
  this.cell = cell;
  this.neighbours = new Array();
  this.covered = true;
  this.mine = false;
  this.flagged = false;

  this.row = tRow;
  this.col = tCol;

  this.numNeighbouringMines = 0;

  this.setImage = function(name) {
    cell.innerHTML = "<img src=\"images/" + name + ".png\" alt=\"" + name + "\" />";    
  };

  // maybe this should be in the board object?
  this.determineNeighbours = function(board) {
    var boardWidth = board.width;
    var boardHeight = board.height;
    var y = this.row;
    var x = this.col;
    var startx, endx, starty, endy;
    startx = (x > 0) ? (x - 1) : 0;
    endx = (x < (boardWidth - 1)) ? (x + 1) : (boardWidth - 1);

    starty = (y > 0) ? (y - 1) : 0;
    endy = (y < (boardHeight - 1)) ? (y + 1) : (boardHeight - 1);

    var i, j;

    for(j=starty;j<=endy;++j) {
      for(i=startx;i<=endx;++i) {    
        if(!(j == y && i == x)) {
          this.neighbours.push(board.getCellNode(j, i));
        }
      }
    }
  };

// pre-processing step
  this.neighbouringMines = function() {
    var c = 0;
    for(var i in this.neighbours) {
      if(this.neighbours[i].mine == true) {
        c++;
      }
    }
    return c;
  };

  this.flag = function() {
    this.flagged = true;
    this.setImage("flag");
  };

  this.unflag = function() {
    this.flagged = false;
    this.setImage("empty");
  };

  this.processCell = function() {
    if(this.covered == false) {
      return true;
    }
    this.covered = false;

    if(this.mine == true) {
      // hit a mine, return game over
      this.setImage("mine");
      return false;
    } else {
      this.setImage(gCellImages[this.numNeighbouringMines]);
      if(this.numNeighbouringMines == 0) {
        this.uncoverSafeNeighbours();
      }
    }
    return true;
  };

  this.uncoverSafeNeighbours = function() {
    // recursively uncover 'safe' neighbours
    for(var i in this.neighbours) {
      if(this.neighbours[i].mine == false) {
        if(this.neighbours[i].numNeighbouringMines == 0) {
          this.neighbours[i].processCell();
        }
      }
    }
  };

}
