window.addEventListener('load', main);

let game = new MSGame()

function main() {
    document.querySelectorAll(".menu-button").forEach( (button) => {
        const rows = button.getAttribute("rows");
        const cols = button.getAttribute("cols");
        const mines = button.getAttribute("mines");
        button.addEventListener("click", menu_button_click.bind(null, rows, cols, mines));
    });
    menu_button_click(8, 10, 10); // default 8x10, 10 mines
}

function menu_button_click(rows, cols, mines) {
    game.init(rows, cols, mines);
    resetTimer();
    prepare_dom();
    render();
}

function render() {
    const grid = document.querySelector(".grid");
    const gameRendering = game.getRendering();
    grid.style.gridTemplateColumns = `repeat(${game.ncols}, 1fr)`;
    for (let i = 0; i < game.nrows * game.ncols; i++) {
        const cellRow = get_cell_row(i);
        const cellCol = get_cell_col(i);
        const cellValue = gameRendering[cellRow][cellCol];
        render_cell(i, cellValue);
    }
    update_flag_count();
}

function render_cell(i, cellValue) {
    const cell = document.querySelector(".grid").childNodes[i];

    if (game.exploded && cellValue === "M") // game has exploded and cell is a mine
        cell.style.backgroundColor = "red"

    if(cellValue === "H") // cell is hidden
        cell.style.backgroundImage = "none";

    if(cellValue === "F") // cell is marked
        cell.style.backgroundImage = "url(img/flag.svg)";

    if(cellValue != "H" && cellValue != "F" && cellValue != "M") { // cell is a number 0-9 
        if (cellValue != 0)
            cell.innerHTML = cellValue
        cell.style.backgroundImage = "none";
        cell.style.backgroundColor = "blue";
    }
}

function update_flag_count() {
    document.querySelectorAll(".flagCount").forEach(
        (e) => {
            const flagCount = game.nmines - game.nmarked;
            e.textContent = String(flagCount);
        }
    );
}

function prepare_dom() {
    const grid = document.querySelector(".grid");
    grid.innerHTML = ""; // remove all cells in grid
    const nCells = game.nrows * game.ncols;
    for (let i = 0; i < nCells ; i++) { // create cells
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
    if (game.nuncovered == 0)
        startTimer();
    const cellRow = get_cell_row(index);
    const cellCol = get_cell_col(index);
    game.uncover(cellRow, cellCol);
    render();
    if(game.getStatus().done)
        stopTimer();
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

let t = 0;
let timer = null;

function startTimer() {
    timer = setInterval(function() {
        t++;
        const x = document.querySelectorAll(".timer").forEach(
            (e) => {
                e.innerHTML = t;
            }
        )
    }, 1000);
}

function stopTimer() {
    if (timer) window.clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    t = 0;
    document.querySelectorAll(".timer").forEach( (e) => {
        e.innerHTML = t;
    });
}