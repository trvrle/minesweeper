window.addEventListener('load', main);

let game = new MSGame()

function main() {
    game.init(8, 10, 10);
    prepare_dom();
    render();
}

function render() {
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${game.ncols}, 1fr)`;
    for (let i = 0; i < grid.children.length; i++) {
        const cellRow = get_cell_row(i);
        const cellCol = get_cell_col(i);
        render_cell(cellRow, cellCol, i);
    }
}

function render_cell(row, col, i) {
    const rendering = game.getRendering();
    const grid = document.querySelector(".grid");
    const cellRendering = rendering[row][col];
    if(cellRendering === "F") {
        grid.childNodes[i].style.backgroundColor = "pink";
    }
    else if (cellRendering === "0") {
        grid.childNodes[i].style.backgroundColor = "blue";
    }
    else if (cellRendering != "H") {
        grid.childNodes[i].style.backgroundColor = "black";
    }
}

function prepare_dom() {
    const grid = document.querySelector(".grid");
    const nCells = game.nrows * game.ncols; 
    for (let i = 0; i < nCells ; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("cellIndex", i);
        cell.addEventListener("click", () => {
            cell_click(i);
        });
        cell.addEventListener("contextmenu", e => {
            e.preventDefault();
            cell_mark(i);
        })
        grid.appendChild(cell);
    }
}

function cell_click(index) {
    const cellRow = get_cell_row(index);
    const cellCol = get_cell_col(index);
    game.uncover(cellRow, cellCol);
    render();
}

function cell_mark(index) {
    const cellRow = get_cell_row(index);
    const cellCol = get_cell_col(index);
    game.mark(cellRow, cellCol);
    render();
}

function get_cell_row(index) {
    return Math.floor(index / game.ncols);
}

function get_cell_col(index) {
    return index % game.ncols;
}