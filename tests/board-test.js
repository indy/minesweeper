
// www.scruffyget.com/minesweeper/tests/testSuite.html

function createBoard(w, h, m) {
  var b = new Board();
  b.setup(w, h, m);
  return b;
}

function testBoardCreation() {
  var width = 5;
  var height = 4;
  var numMines = 3;
  var b = createBoard(width, height, numMines);
  
  assertEquals(width, b.getWidth());
  assertEquals(height, b.getHeight());
  assertEquals(numMines, b.getNumMines());
}


function testCellNeighbours() {
  var b = createBoard(5, 4, 3);

  assertEquals(3, b.probeNumNeighbours(0, 0));
  assertEquals(3, b.probeNumNeighbours(3, 4));
  assertEquals(5, b.probeNumNeighbours(0, 1));
  assertEquals(8, b.probeNumNeighbours(1, 1));
}

function assertNonJsUnitException(comment, allegedNonJsUnitException) {
    assertNotNull(comment, allegedNonJsUnitException);
    assertUndefined(comment, allegedNonJsUnitException.isJsUnitException);
    assertNotUndefined(comment, allegedNonJsUnitException.description);
}

function testTooManyMines() {
  var excep = null;
  try {
    var b = createBoard(2, 2, 5);
  } catch (e1) {
    excep = e1;
  }
  assertEquals("Too many mines", excep);
}

function testMinePlacements() {
  var numMines = 10;
  var b = createBoard(5, 5, numMines);
  assertEquals(numMines, b.probeMineScan());
}


function testCellUncovering() {
  var b = createBoard(5, 5, 0);
  b.probeAddMine(0, 0);

  var excep = null
  try {
    b.uncoverCell(6, 3);
  } catch (e) {
    excep = e;
  }
  assertEquals("cell: out of range", excep);

  // click on a 'safe' cell
  b = createBoard(5, 5, 0);
  b.probeAddMine(0, 0);
  b.uncoverCell(4, 4);
  assertEquals(24, b.probeUncoveredScan()); // 4 - (w * h)
}



function testNumNeighbouringMines() {
  var b = createBoard(5, 5, 0);
  b.probeAddMine(0, 0);

  assertEquals(0, b.probeNeighbouringMines(0, 0));
  assertEquals(1, b.probeNeighbouringMines(1, 0));
  assertEquals(1, b.probeNeighbouringMines(1, 1));
  assertEquals(0, b.probeNeighbouringMines(3, 3));

  b.probeAddMine(0, 1);
  assertEquals(2, b.probeNeighbouringMines(1, 0));
}
