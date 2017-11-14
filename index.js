var complex = require('simplicial-complex');

module.exports = function(cells) {
  cells = Array.from(cells);
  complex.normalize(cells);
  var patches = [];
  var edges = complex.unique(complex.skeleton(cells, 1));
  var visitedEdges = new Array(edges.length).fill(false);
  var edgeToCellIncidence = complex.incidence(edges, cells);
  var visitedCells = new Array(cells.length).fill(false);

  function collectManifoldPatch(seedCellIndex) {
    var cellsToVisit = [seedCellIndex];
    var patch = [];
    while (cellsToVisit.length > 0) {
      var cellIndex = cellsToVisit.pop();
      var cell = cells[cellIndex];
      patch.push(cell);
      visitedCells[cellIndex] = true;

      for (var i = 0; i < cell.length; i++) {
        var j = (i + 1) % cell.length;
        var edge = [cell[i], cell[j]];
        var edgeIndex = complex.findCell(edges, edge);

        if (visitedEdges[edgeIndex]) {
          continue;
        } else {
          visitedEdges[edgeIndex] = true;
        }

        var neighboringCells = edgeToCellIncidence[edgeIndex];
        if (neighboringCells.length > 2) {
          // non-manifold edge
          continue;
        } else if (neighboringCells.length == 1) {
          // boundary edge
          continue;
        }

        var neighborIndex = neighboringCells[(neighboringCells.indexOf(cellIndex) + 1) % 2];
        cellsToVisit.push(neighborIndex);
      }
    }

    return patch;
  }

  patches.push(collectManifoldPatch(0));

  function notYetVisited(c) {
    return !c;
  };
  var nextCellIndex;
  while ((nextCellIndex = visitedCells.findIndex(notYetVisited)) && nextCellIndex !== -1) {
    // orient each manifold patch using an arbitrary representative as seed cell
    patches.push(collectManifoldPatch(nextCellIndex));
  }

  return patches;
}
