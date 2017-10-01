var curX = 0;
var curY = 0;
var preX = 0;
var preY = 0;
var curTime = undefined;
var preTime = undefined;

let pic_width  = 20;
var centerX = 300 + pic_width; 
var centerY = 300 + pic_width; 

var curRad = 0;
var cumulate = 0;

var damping_coefficient = 2;
var mouse_end_speed = 0;
var mouse_cur_speed = 0;

var intervalID=self.setInterval("intervalTask()", 200)

function intervalTask() {
    //document.getElementById("speed").innerHTML=speed;
    document.getElementById("x").innerHTML=preX + " : " + curX;
    document.getElementById("y").innerHTML=preY + " : " + curY;
    document.getElementById("rad").innerHTML=curRad;
    if(typeof preTime != "undefined") {
        update_speed(preX, preY, preTime, curX, curY, curTime);
    }

    preX = curX;
    preY = curY;
    preTime = curTime;
}

function start() {
    document.addEventListener('mousemove', showMousePosition, false);
    var spinX = parseInt(document.getElementById("spinX").value);
    var spinY = parseInt(document.getElementById("spinY").value)
    width = screen.availWidth;
    height = screen.availHeight;
    if (spinX <=0 || spinX >= width)  spinX = width / 2;
    if (spinY <=0 || spinY >= height) spinY = height / 2;

    document.getElementById("spinCenter").style.left = spinX + 'px';
    document.getElementById("spinCenter").style.top = spinY + 'px';
    
    centerX = spinX + pic_width;
    centerY = spinY + pic_width;

    curX = 0;
    curY = 0;
    preX = 0;
    preY = 0;
    curTime = undefined;
    preTime = undefined;
}

// using callback to get the position of mouse and update speed and cumulate
function showMousePosition(event) {   
    // y-axle is reversed compare to normal x-y coordinate
    curX = event.clientX - centerX;
    curY = centerY - event.clientY;
    curTime = Date.now();
    
    // for first time move mouse
    // if(typeof preTime === "undefined"){
    //     preX = curX;
    //     preY = curY;
    //     preTime = curTime;
    //     return;
    // }
    //calc_speed(curX, curY, curTime - preTime);
}

// calculate speed and update cumulate
//function calc_speed(x, y, deltaTime) {
// pre(x, y, t), cur(x, y, t)
function update_speed(x1, y1, t1, x2, y2, t2) {
    var rad = - deltaRad(x1, y1, x2, y2);
    deltaTime = t2 - t1;
    if (Math.abs(rad) < 0.000001) return;

    var speed = rad / deltaTime;
    curRad = curRad + rad;

    // when move counter-clockwise for a whole circle
    if (cumulate - curRad > 2 * Math.PI) curRad = curRad + 2 * Math.PI;
    // clockwise only
    if (curRad > cumulate) {
        cumulate = curRad;
        mouse_end_speed = speed;
        document.getElementById("speed").innerHTML=speed;
        document.getElementById("cumulate").innerHTML=cumulate / 2 / Math.PI;   // Rads to Circles
    }    

}
// pre_position(x1, y1)
// cur_position(x2, y2)
function deltaRad(x1, y1, x2, y2) {

    var preRad = arctan(x1, y1);
    var x_rotate = x2 * Math.cos(preRad) + y2 * Math.sin(preRad);
    var y_rotate = y2 * Math.cos(preRad) - x2 * Math.sin(preRad);

    return arctan(x_rotate, y_rotate);
}
// in case x ~ 0
function arctan(x, y) {
    if (Math.abs(x) < 0.0000001) {
        return Math.PI / 2;
    } else {
        return Math.atan(y / x)
    }
}
