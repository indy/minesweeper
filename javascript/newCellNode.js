

var uncoverArray = [];

var CellNode = function(row, col, htmlCell) {

  var _neighbours = [];
  var _isMined = false;
  var _isCovered = true;
  var _isFlagged = false;
  var _neighbouringMines = 0;

  var _htmlCell = htmlCell;
  var _row = row;
  var _col = col;

  // when a html cell is clicked use this information to 
  // find the right CellNode
  htmlCell.minesweeper = {
    row: row,
    col: col
  };

  function _uncover() {
    if(_isCovered == false) {
      return false;
    }

    if(_isFlagged ==  true) {
      // unflag before uncovering
      _toggleFlag();
    }

    _isCovered = false;

    if(_isMined == true) {
      // hit a mine, game over
      _setImage("mine");
      return true;
    } else {
      _setImage(gCellImages[_neighbouringMines]);
      if(_neighbouringMines == 0) {
        _uncoverAllNeighbours();
      }
    }
    return false;
  }
  
  function _uncoverAllNeighbours() {
    // recursively uncover neighbours
    for(var i in _neighbours) {
      if(_neighbours[i].isFlagged() == false) {
//        _neighbours[i].uncover();
        uncoverArray.push(_neighbours[i]);
      }
    }
  }


  function _setImage(name) {
    _htmlCell.innerHTML = ["<img src=\"images/", name, ".png\"",
                           " alt=\"", name, "\" />"].join("");
  }

  function _toggleFlag() {
    if(_isCovered == false) {
      return;
    }
    if(_isFlagged == true) {
      gFlagsRemaining++;
      _setImage("empty");
      _isFlagged = false;
    } else if(gFlagsRemaining > 0) {
      gFlagsRemaining--;
      _setImage("flag");
      _isFlagged = true;
    }
    updateFlagsUI();
  }



  return {
    id : _row + " : " + _col,

    addNeighbour : function(neighbour) {
      _neighbours.push(neighbour);
    },

    setMined : function(val) {
      _isMined = val;
    },

    isMined : function() {
      return _isMined;
    },

    isCovered : function() {
      return _isCovered;
    },

    isFlagged : function() {
      return _isFlagged;
    },

    neighbouringMines : function() {
      return _neighbouringMines;
    },

    calcNeighbouringMines : function() {
      _neighbouringMines = 0;
      for(var i=0;i<_neighbours.length;i++) {
        if(_neighbours[i].isMined() == true) {
          _neighbouringMines++;
        }
      }
    },

    toggleFlag : function() {
      _toggleFlag();
    },

    manualUncover : function() {
      uncoverArray = [];
      var res = _uncover();
      if(res == true) {
        return true;            // game over
      }

      while(uncoverArray.length != 0) {
        var c = uncoverArray.pop();
        c.uncover();
      }

      return false;
    },

    uncover : function() {
      return _uncover();
    },


    setImage : function(name) {
      _setImage(name);
    },


    probeNumNeighbours : function() {
      return _neighbours.length;
    },
    probeGetNeighbours : function() {
      return _neighbours;
    }
  };
}