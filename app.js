const container = document.querySelector(".container");
const update = document.querySelector(".popUp");

//resize grid
const resizeContainer = document.querySelector(".resize-container");
const resizeContainerBounds = resizeContainer.getBoundingClientRect();
const resizeContainerBorder = 2 ;
const resizeHandle = document.querySelector(".resize-handle");
const resizeHandleBounds = resizeHandle.getBoundingClientRect();
const resizeHandleStartPosX = resizeHandleBounds.x;
const resizeHandleHalfWidth = resizeHandleBounds.width / 2;
const resizeHandleEndPosX = resizeHandleStartPosX + resizeContainerBounds.width - resizeHandleBounds.width - resizeContainerBorder;
const gridSizeText = document.querySelector(".grid-size-text");
const startSize = 2;
let currentSize = startSize;

let cells = [];
let clicking = false;

//pens
const penBtns = document.querySelectorAll(".pen");
const pens = 
[
    {
        mode: "black",
        paint: (cell) => 
        {
            PaintCell(cell,"black");
        }
    },
    {
        mode: "clear",
        paint: (cell) => 
        {
            PaintCell(cell,"white");
        }
    },
    {
        mode:"rainbow",
        paint: (cell) =>
        {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);

            PaintCell(cell,`rgb(${r},${g},${b})`);
        }
    }
]

let currentPen = pens[0];

for(let i = 0; i < penBtns.length; i++)
{
    penBtns[i].addEventListener("click", () => {
        currentPen = pens[parseInt(penBtns[i].dataset.value)];
        console.log(parseInt(penBtns[i].dataset.value));
    })
}

//prevents unexpected dragging from happening
document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

//checks user holding mouse
window.addEventListener("mousedown", () => clicking = true);
window.addEventListener("mouseup", () => clicking = false);

//resizing handle movement
resizeContainer.addEventListener("mousemove", (event) =>{
    if(!clicking) return;

    RepositionHandle(event);
});
resizeContainer.addEventListener("click", RepositionHandle)

//Asks users for size to create new grid
update.addEventListener("click", RegenerateGrid);

//Initial grid
GenerateGrid(startSize);
UpdateGridSizeUI();

function RegenerateGrid()
{
    ClearGrid();
    GenerateGrid(currentSize);
}

function ClearGrid()
{
    for(cell of cells)
    {
        container.removeChild(cell);
    }

    cells = [];
}

function GenerateGrid(pSize)
{
    let newCellSize = CalculateCellSize(pSize).toString();

    for(let i = 0; i < pSize * pSize; i++)
    {
        let newDiv = document.createElement("div"); 
        
        newDiv.style.cssText = "width: " + newCellSize + "%; height: " + newCellSize + "%; border: 1px solid gray;";
        newDiv.addEventListener("mouseover", () => {
            if(!clicking) return; 
            currentPen.paint(newDiv);
        });
        newDiv.addEventListener("mousedown", () => { 
            currentPen.paint(newDiv);
        });

        cells.push(newDiv);
        container.append(newDiv);
    }
}

function CalculateCellSize(pSize)
{
    return 100 / pSize;
}

function RepositionHandle(event)
{
    let currentMousePos = event.clientX; 
    
    let newPos = currentMousePos > resizeHandleEndPosX + resizeHandleHalfWidth ?
                resizeHandleEndPosX :
                currentMousePos < resizeHandleStartPosX + resizeHandleHalfWidth ?
                resizeHandleStartPosX :
                currentMousePos - resizeHandleHalfWidth;
    
    resizeHandle.style.left = newPos + "px";

    CalculateGridSize(newPos);
}

function CalculateGridSize(pHandlePos)
{
    let relativePos = pHandlePos - resizeHandleStartPosX;
    currentSize = Math.round(relativePos / 4) + 1;

    UpdateGridSizeUI();
}

function UpdateGridSizeUI()
{
    gridSizeText.textContent = `${currentSize} X ${currentSize}`;
}

function PaintCell(cell, color)
{
    cell.style.backgroundColor = color;
}