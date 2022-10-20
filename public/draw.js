var pos = {
    drawable: false,
    x: -1,
    y: -1
};
var canvas, context;
 
canvas = document.getElementById("a");
context = canvas.getContext("2d",{willReadFrequently: true});

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener("mousedown", commonListener);
canvas.addEventListener("mousemove", commonListener);
canvas.addEventListener("mouseup", commonListener);
canvas.addEventListener("mouseout", commonListener);

 
function commonListener(event){
    switch(event.type){
        case "mousedown":
            initDraw(event);
            break;
 
        case "mousemove":
            if(pos.drawable) //클릭상태인지 확인
                draw(event);
            break;
 
        case "mouseout":
        case "mouseup":
            finishDraw();
            break;
    }
}

  
function initDraw(event){
    context.beginPath(); //새로운 경로 지정
    pos.drawable = true;
    var coors = getPosition(event);
    pos.X = coors.X;
    pos.Y = coors.Y;
    context.moveTo(pos.X, pos.Y);
}
 
function draw(event){
    var coors = getPosition(event);
    context.lineTo(coors.X, coors.Y);
    pos.X = coors.X;
    pos.Y = coors.Y;
    context.stroke();
}
 
function finishDraw(){
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
}
 
function getPosition(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    return {X: x, Y: y};
}