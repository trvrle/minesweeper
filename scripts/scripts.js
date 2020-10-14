window.addEventListener('load', main);

let game = new MSGame()

function main() {
    game.init(12, 14, 10);
    prepare_dom();
    render();
}

function render() {
    let rendering = game.getRendering();
    let status = game.getStatus();
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${game.ncols}, 1fr)`;
}

function prepare_dom() {
    const grid = document.querySelector(".grid");
    const nCells = game.nrows * game.ncols; 
    for (let i = 0; i < nCells ; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("cellIndex", i);
        cell.addEventListener("click", () => {
            cell_click();
        });
        grid.appendChild(cell);
    }
}

function cell_click() {
    // game.uncover()
    render();
}