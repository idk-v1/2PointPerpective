var can = document.querySelector("canvas");
can.width = window.innerWidth - 250;
can.height = window.innerHeight;

var ctx = can.getContext("2d");

var boxes = document.querySelector("#boxes");

var colorPicker = document.querySelector("#colorPicker");

var selected = null;

var placeStage = 0;

var rects = [];

var horizon = can.height / 2;

var mousePos = new Point(0, 0);

var dark = localStorage.getItem("theme") === "dark";
document.querySelector("link").href = (dark ? "dark.css" : "light.css");

can.addEventListener("click", function(e) 
{
    getPos(e); 
    lock();
});
can.addEventListener("mousemove", getPos);
document.addEventListener("keydown", function(evt)
{
    switch (evt.key)
    {
        case "ArrowUp":
            horizon += 5;
            break;
        case "ArrowDown":
            horizon -= 5;
            break;
        case "Escape":
            if (selected == null)
            {
                if (rects.length)
                {
                    placeStage--;
                    rects[rects.length - 1].stage--;
    
                    if (rects[rects.length - 1].stage == 0)
                    {
                        boxes.lastChild.remove();
                        rects.pop();
                        placeStage = 0;
                    }
                }
            }
            else
            {
                selected = null;
                colorPicker.style.display = "none";
            }
            break;
        case "d":
            dark = !dark;
            document.querySelector("link").href = (dark ? "dark.css" : "light.css");
            localStorage.setItem("theme", (dark ? "dark" : "light"));
    }
});

var interval = setInterval(function()
{
    place();
    render();
}, 10);

function getPos(evt)
{
    mousePos = new Point(evt.clientX, evt.clientY);
}

function place()
{   
    if (rects.length != 0)
        rects[rects.length - 1].updatePos(mousePos.x, mousePos.y - horizon, can.width);
}

function render()
{
    can.width = window.innerWidth - 250;
    can.height = window.innerHeight;

    ctx.fillStyle = (dark ? "#222" : "#fff");
    ctx.fillRect(0, 0, can.width, can.height);

    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(can.width, horizon);
    ctx.strokeStyle = (dark ? "#fff" : "#000");
    ctx.stroke();
    ctx.closePath();

    for (var i = 0; i < rects.length; i++)
        rects[i].draw(ctx, can.width, horizon);
}

function lock()
{
    if (placeStage == 0)
    {
        createBox();
        rects.push(new Rect(mousePos.x, mousePos.y - horizon, rects.length * 20));

        boxes.scrollTo(0, boxes.scrollHeight);
    }
    else
    {
        rects[rects.length - 1].stage++;
        placeStage = (placeStage + 1) % 4;
    }
}

function createBox()
{
    var box = document.createElement("div");
    var arUp = document.createElement("div");
    var arDn = document.createElement("div");
    var color = document.createElement("div");
    var show = document.createElement("div");

    box.id = rects.length;
    box.classList .add("box");

    arUp.classList.add("arrow", "arUp");
    arUp.textContent = "^";

    arDn.classList.add("arrow", "arDn");
    arDn.textContent = "^";

    color.classList.add("color");
    color.style.backgroundColor = `hsl(${rects.length * 20}, 50%, 50%)`;

    show.classList.add("show");

    boxes.append(box);
    box.appendChild(arUp);
    box.appendChild(arDn);
    box.appendChild(color);
    box.appendChild(show);

    placeStage++;

    arUp.onclick = function(e) {swapUp(Number(box.id))};
    arDn.onclick = function(e) {swapDown(Number(box.id))};
    color.onclick = function(e) 
    {
        selected = Number(box.id); 
        colorPicker.style.display = "block";
    };
    show.onclick = function(e) 
    {
        rects[Number(box.id)].show = !rects[Number(box.id)].show; 
        show.textContent = (rects[Number(box.id)].show ? "✓" : "");
    };
}

function intersect(l, r)
{
    var ua, ub, denom = (0 - r.y) * (can.width - l.x) - (0 - r.x) * (0 - l.y);
    if (denom == 0)
        return null;
    ua = ((0 - r.x) * (l.y - r.y) - (0 - r.y) * (l.x - r.x)) / denom;
    ub = ((can.width - l.x) * (l.y - r.y) - (0 - l.y) * (l.x - r.x)) / denom;
    return new Point(l.x + ua * (can.width - l.x), l.y + ua * (0 - l.y));
}

function swapUp(id)
{
    var tempRect = rects[id];
    var tempBox0 = boxes.children[id].cloneNode(true);
    var tempBox1;

    if (!placeStage && id > 0)
    {
        tempBox1 = boxes.children[id - 1].cloneNode(true);
                
        boxes.replaceChild(tempBox0, boxes.children[id - 1]);
        boxes.replaceChild(tempBox1, boxes.children[id]);

        tempBox0.id = id - 1;
        tempBox1.id = id;

        tempBox0.children[0].onclick = function(e) {swapUp(id - 1)};
        tempBox0.children[1].onclick = function(e) {swapDown(id - 1)};
        tempBox0.children[2].onclick = function(e) 
        {
            selected = Number(id - 1); 
            colorPicker.style.display = "block";
        };
        tempBox0.children[3].onclick = function(e) 
        {
            rects[id - 1].show = !rects[id - 1].show; 
            tempBox0.children[3].textContent = (rects[id - 1].show ? "✓" : "");
        };

        tempBox1.children[0].onclick = function(e) {swapUp(id)};
        tempBox1.children[1].onclick = function(e) {swapDown(id)};
        tempBox1.children[2].onclick = function(e) 
        {
            selected = Number(id); 
            colorPicker.style.display = "block";
        };
        tempBox1.children[3].onclick = function(e) 
        {
            rects[id].show = !rects[id].show; 
            tempBox1.children[3].textContent = (rects[id].show ? "✓" : "");
        };
        
        rects[id] = rects[id - 1];
        rects[id - 1] = tempRect;
    }
}

function swapDown(id)
{
    var tempRect = rects[id];
    var tempBox0 = boxes.children[id].cloneNode(true);
    var tempBox1;

    if (!placeStage && id < rects.length - 1)
    {
        tempBox1 = boxes.children[id + 1].cloneNode(true);
                
        boxes.replaceChild(tempBox0, boxes.children[id + 1]);
        boxes.replaceChild(tempBox1, boxes.children[id])

        tempBox0.id = id + 1;
        tempBox1.id = id;

        tempBox0.children[0].onclick = function(e) {swapUp(id + 1)};
        tempBox0.children[1].onclick = function(e) {swapDown(id + 1)};
        tempBox0.children[2].onclick = function(e) 
        {
            selected = Number(id + 1); 
            colorPicker.style.display = "block";
        };
        tempBox0.children[3].onclick = function(e) 
        {
            rects[id + 1].show = !rects[id + 1].show; 
            tempBox0.children[3].textContent = (rects[id + 1].show ? "✓" : "");
        };

        tempBox1.children[0].onclick = function(e) {swapUp(id)};
        tempBox1.children[1].onclick = function(e) {swapDown(id)};
        tempBox1.children[2].onclick = function(e) 
        {
            selected = Number(id); 
            colorPicker.style.display = "block";
        };
        tempBox1.children[3].onclick = function(e) 
        {
            rects[id].show = !rects[id].show; 
            tempBox1.children[3].textContent = (rects[id].show ? "✓" : "");
        };

        rects[id] = rects[id + 1];
        rects[id + 1] = tempRect;
    }
}