const $ = document.querySelector.bind(document);
const $$ = selector => {
  return Array.from(document.querySelectorAll.call(document, selector));
};
const arrayCreator = length => Array.from({ length }).map((_, idx) => idx);
const app = $("#app");
const container = $(".container");
const setNewStarter = currentNode => {
  path = path || [];
  starter = currentNode;
  starter.className = "component ele starter";
  stones
    .filter(stone => stone !== starter)
    .forEach(stone => {
      stone.classList.remove("starter");
    });
  const index = path.indexOf(starter);
  if (index !== -1) {
    invalidPath = path.filter((_, idx) => idx > index);
    invalidPath.forEach(node => {
      node.className = "component ele";
    });
    path = path.filter((_, idx) => idx <= index);
  }
};
const coordsCreator = (row, col) => {
  return arrayCreator(row)
    .map(row => {
      return arrayCreator(col).map(col => {
        return { x: row, y: col };
      });
    })
    .reduce((accum, arr) => accum.concat(arr), []);
};
const originCoords = coordsCreator(3, 3);
console.log(originCoords);

let starterCoord = { x: 1, y: 1 };
let starter;
let path;
const getCoordinates = component => {
  return [component.parentNode.dataset.row, component.dataset.col];
};
const handleClick = function(event) {
  const myLocation = event.changedTouches[0];
  const currentNode = document.elementFromPoint(
    myLocation.clientX,
    myLocation.clientY
  );
  if (!this.contains(currentNode)) {
    return;
  }
  const nodeExisted = path.some(node => {
    return node === currentNode;
  });
  if (nodeExisted) {
    setNewStarter(currentNode);
  }
  const nodeCoodinates = getCoordinates(currentNode).map(Number);
  const starterCoordinates = getCoordinates(starter).map(Number);
  if (
    starterCoordinates[0] === nodeCoodinates[0] &&
    starterCoordinates[1] + 1 === nodeCoodinates[1] &&
    currentNode.classList.contains("ele")
  ) {
    starter.classList.add("right");
    path.push(currentNode);
    setNewStarter(currentNode);
  }
  if (
    starterCoordinates[0] - 1 === nodeCoodinates[0] &&
    starterCoordinates[1] === nodeCoodinates[1] &&
    currentNode.classList.contains("ele")
  ) {
    starter.classList.add("top");
    path.push(currentNode);
    setNewStarter(currentNode);
  }
  if (
    starterCoordinates[0] + 1 === nodeCoodinates[0] &&
    starterCoordinates[1] === nodeCoodinates[1] &&
    currentNode.classList.contains("ele")
  ) {
    starter.classList.add("down");
    path.push(currentNode);
    setNewStarter(currentNode);
  }
  if (
    starterCoordinates[0] === nodeCoodinates[0] &&
    starterCoordinates[1] - 1 === nodeCoodinates[1] &&
    currentNode.classList.contains("ele")
  ) {
    starter.classList.add("left");
    path.push(currentNode);
    setNewStarter(currentNode);
  }
  if (path.length === originCoords.length) {
    setTimeout(alert, 500, "You win");
    setNewStarter(path[0]);
  }
};

function component(col) {
  return `
    <div class="component" data-col=${col}>
      
    </div>
  `;
}
function createRow(rowNumber, rowHTML) {
  const row = document.createElement("div");
  row.className = `row`;
  row.dataset.row = rowNumber;
  row.innerHTML = rowHTML;
  return row;
}
const getX = arr => arr.x;
const getY = arr => arr.y;
const rowsNum = Math.max(...originCoords.map(getX));
const colsNum = Math.max(...originCoords.map(getY));
const rowsArray = arrayCreator(rowsNum + 1);
const colsArray = arrayCreator(colsNum + 1);
const backgroundDivs = rowsArray.map(row => {
  const rowsHTMLString = colsArray
    .map(col => {
      return component(col);
    })
    .join("");
  return createRow(row, rowsHTMLString);
});
const renderDivs = divsArr => {
  divsArr.forEach(div => {
    container.appendChild(div);
  });
};
renderDivs(backgroundDivs);

const components = $$(".component");
const stones = components.filter(component => {
  const [row, col] = getCoordinates(component);
  return originCoords.find(coord => {
    return coord.x == row && coord.y == col;
  });
});
stones.forEach(component => {
  component.classList.add("ele");
});
container.addEventListener("touchstart", handleClick);
container.addEventListener("touchmove", handleClick);
starter =
  starter ||
  $$(".ele").find(stone => {
    const [row, col] = getCoordinates(stone);
    return row == starterCoord.x && col == starterCoord.y;
  });
path = path || [starter];
setNewStarter(starter);
