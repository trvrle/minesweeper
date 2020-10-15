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
    update_flag_count();
}

function render_cell(row, col, i) {
    const rendering = game.getRendering();
    const grid = document.querySelector(".grid");
    const cellRendering = rendering[row][col];

    if (game.exploded && cellRendering === "M") // game has exploded and cell is a mine
        grid.childNodes[i].style.backgroundColor = "red"

    if(cellRendering === "H") // cell is hidden
        grid.childNodes[i].style.backgroundImage = "none";

    if(cellRendering === "F") // cell is marked
        grid.childNodes[i].style.backgroundImage = "url(img/flag.svg)";

    if(cellRendering != "H" && cellRendering != "F" && cellRendering != "M") // cell is a number 0-9
    {
        if (cellRendering != 0)
            grid.childNodes[i].innerHTML = cellRendering
        grid.childNodes[i].style.backgroundImage = "none";
        grid.childNodes[i].style.backgroundColor = "blue";
    }
}

function update_flag_count() {
    document.querySelectorAll(".flagCount").forEach(
        (e) => {
            const flagCount = game.nmines - game.nmarked;
            e.textContent = String(flagCount);
        }
    )
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
    if (game.exploded) return;
    const cellRow = get_cell_row(index);
    const cellCol = get_cell_col(index);
    game.uncover(cellRow, cellCol);
    render();
}

function cell_mark(index) {
    if (game.exploded) return;
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