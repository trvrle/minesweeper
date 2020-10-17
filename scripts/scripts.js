window.addEventListener('load', main);

let game = new MSGame()

function main() {
    // register callbacks for menu buttons
    document.querySelectorAll(".menu-button").forEach( (button) => {
        const rows = button.getAttribute("rows");
        const cols = button.getAttribute("cols");
        const mines = button.getAttribute("mines");
        button.addEventListener("click", menu_button_click.bind(null, rows, cols, mines));
    });

    // register callback for overlay 
    document.querySelector("#overlay").addEventListener("click", () => {
        document.querySelector("#overlay").classList.remove("active");
        menu_button_click(game.nrows, game.ncols, game.nmines); // reset game
    });

    document.querySelector(".menu-button").click(); // click first button to start default game
}

function menu_button_click(rows, cols, mines) {
    game.init(rows, cols, mines);
    reset_timer();
    prepare_dom();
    render();
}

function render() {
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${game.ncols}, 1fr)`;
    const gameRendering = game.getRendering();
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

    if (cellValue === "M") // game has exploded and cell is a mine
        cell.style.backgroundImage = "url(img/bomb.svg)";

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

function prepare_dom() {
    const grid = document.querySelector(".grid");
    grid.innerHTML = ""; // remove all cells in grid
    const nCells = game.nrows * game.ncols;
    for (let i = 0; i < nCells ; i++) { // create cells
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.addEventListener("click", () => {
            cell_click(i);
        });
        cell.addEventListener("contextmenu", e => {
            e.preventDefault();
            cell_mark(i);
        })
        grid.appendChild(cell);
    }
    resizeCells();
}

function resizeCells() {
    // use game.nrows and viewport height to determine cell size
    // ex. if viewport height is 610 pixels, then subtract 210 and divide by 8 rows
    // (610 - 210)/8 = 400/8 = 50 -> cell size is 50x50
    const clientHeight = document.querySelector("html").clientHeight; // 610
    const cellSize = (clientHeight - 210) / game.nrows;
    document.querySelectorAll(".cell").forEach( (cell) => {
        cell.style.height = cellSize + "px";
        cell.style.width = cellSize + "px";
    });
}

function cell_click(index) {
    if (game.nuncovered == 0)
        start_timer();

    const cellRow = get_cell_row(index);
    const cellCol = get_cell_col(index);
    game.uncover(cellRow, cellCol);
    render();

    if (game.getStatus().done) {
        stop_timer();
        if (game.exploded)
            show_lose();
        else
            show_win();
        document.querySelector("#overlay").classList.toggle("active");
    }
}

function cell_mark(index) {
    if (game.getStatus().done) return;
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

function show_lose() {
    document.querySelector(".win-lose").innerHTML = "You lost!"
}

function show_win() {
    document.querySelector(".win-lose").innerHTML = "You won!"
}

let t = 0;
let timer = null;

function start_timer() {
    timer = setInterval(function() {
        t++;
        const x = document.querySelectorAll(".timer").forEach(
            (e) => {
                e.innerHTML = t;
            }
        )
    }, 1000);
}

function stop_timer() {
    if (timer) window.clearInterval(timer);
}

function reset_timer() {
    stop_timer();
    t = 0;
    document.querySelectorAll(".timer").forEach( (e) => {
        e.innerHTML = t;
    });
}

function update_flag_count() {
    document.querySelectorAll(".flag-count").forEach(
        (e) => {
            const flagCount = game.nmines - game.nmarked;
            e.textContent = String(flagCount);
        }
    );
}