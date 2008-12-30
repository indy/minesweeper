

var Board = function() {

  var _width;
  var _height;
  var _numMines;

  var _cells;                   // 2d array of cells
  var _board;                   // html board

  var _hitMine = false;

  function _createCells(width, height) {
    var i, j;

    var cell,  row;
    _board = e("dynamic-board");

    _width = width;
    _height = height;
    _cells = [];

    for(j=0;j<_height;j++) {
      _cells[j] = [];
      row = _board.insertRow(-1);
      for(i=0;i<_width;i++) {

        cell = row.insertCell(0);

        _cells[j][i] = new CellNode(j, i, cell);
        _cells[j][i].setImage("empty");
        

      }
    }

    // fill info about internal structure
    for(j=0;j<_height;j++) {
      for(i=0;i<_width;i++) {
        _determineCellNeighbours(j, i);
      }
    };
  }

  function _determineCellNeighbours(row, col) {
    var y = row;
    var x = col;
    var startx, endx, starty, endy;
    startx = (x > 0) ? (x - 1) : 0;
    endx = (x < (_width - 1)) ? (x + 1) : (_width - 1);

    starty = (y > 0) ? (y - 1) : 0;
    endy = (y < (_height - 1)) ? (y + 1) : (_height - 1);

    var i, j;

    var c = _cells[row][col];
    for(j=starty;j<=endy;++j) {
      for(i=startx;i<=endx;++i) {    
        if(!(j == y && i == x)) {
          c.addNeighbour(_cells[j][i]);
        }
      }
    }
    
  }

  // add the requested number of mines into random positions on the board 
  function _addMines(numMines) {
    _numMines = numMines;
    if(_numMines >= (_width * _height)) {
      throw "Too many mines";
    }

    var numCells = _width * _height;

    var hasMine = new Array(numCells);
    for(var m in hasMine) {
      hasMine[m] = false;
    }

    var randomCellIndex = function() {
      return parseInt(Math.random() * numCells);
    };

    var mineCell = function(mineme) {
      var row = parseInt(mineme / _width);
      var col = mineme % _width;
      _cells[row][col].setMined(true);
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
    };

    for(var i=0;i<numMines;i++) {
      mineCell(nextMineableCell(randomCellIndex()));
    }

    _eachCell(function(cell) { cell.calcNeighbouringMines(); });

  }

  function _getCell(row, col) {
    if(row >= _height || col >= _width) {
      throw "cell: out of range";
    }
    return _cells[row][col];
  }

  function _eachCell(fn) {
    for(var j=0;j<_height;j++) {
      for(var i=0;i<_width;i++) {
        fn(_cells[j][i]);
      }
    }
    
  }
  function _cellSum(fn) {
    var total = 0;
    _eachCell(function(cell) { 
                if(fn(cell) == true) {
                  total++;
                }
              });
    return total;
  }

  return {

    setup : function(width, height, numMines) {
      _createCells(width, height);
      _addMines(numMines);
    },
    getWidth : function() {
      return _width;
    },
    getHeight : function() {
      return _height;
    },
    getNumMines : function() {
      return _numMines;
    },

    uncoverCell : function(row, col) { 
      var cell = _getCell(row, col);
      _hitMine = cell.manualUncover();
    },

    // has the player hit a mine
    hitMine : function() {
      return _hitMine;
    },

    toggleFlag : function(row, col) {
      var cell = _getCell(row, col);
      cell.toggleFlag();
    },

    flagCell : function(row, cell) {
      var cell = _getCell(row, col);
      cell.setFlagged(true);
    },

    unflagCell : function(row, cell) {
      var cell = _getCell(row, col);
      cell.setFlagged(false);
    },

    allMinesFlagged : function() {
      var allFlagged = true;
      _eachCell(function(cell) {
                  if(cell.isMined() == true && cell.isFlagged() == false) {
                    allFlagged = false;
                    // todo: break from this somehow?
                  }
                });
      return allFlagged;

    },

    // return the number of neighbours a cell has
    probeNumNeighbours : function(row, col) {
      return _cells[row][col].probeNumNeighbours();
    },
    // returns the number of mines on the board
    probeMineScan : function() {
      return _cellSum(function(cell) {
                        return cell.isMined(); 
                      });
    },
    // returns the number of flags on the board
    probeFlagScan : function() {
      return _cellSum(function(cell) {
                        return cell.isFlagged(); 
                      });
    },
    // adds a mine at a particular location
    probeAddMine : function(row, col) {
      var cellNode = _cells[row][col];
      if(cellNode.isMined() == false) {
        cellNode.setMined(true);
        _numMines++;
      }
      _eachCell(function(cell) { cell.calcNeighbouringMines(); });
    },
    // returns the number of cells which are in an 'uncovered' state
    probeUncoveredScan : function() {
      return _cellSum(function(cell) {
                        return cell.isCovered() == false;
                      });

    },

    probeNeighbouringMines : function(row, col) {
      var cell = _cells[row][col];
      return cell.neighbouringMines();
    },
    
    probeGetCell : function(row, col) {
      return _cells[row][col];
    }

    

    
  };

};