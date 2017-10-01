var preX = 0;
var preY = 0;
var preTime = undefined;

let centerX = 100;
let centerY = 200;

var curRad = 0;
var cumulate = 0;


function start() {
    draw();
    //document.addEventListener('mousemove', showMousePosition, false);
    //a = [-84, -225, 117, -40]
    //alert(a + ' : ' + deltaRad(a[0], a[1], a[2], a[3]));
    preX = 0;
    preY = 0;
    preTime = undefined;
    curRad = 0;
    cumulate = 0;
}

// using callback to get the position of mouse and update speed and cumulate
function showMousePosition(event) {   
    // y-axle is reversed compare to normal x-y coordinate
    var x = event.screenX - centerX;
    var y = centerY - event.screenY;
    var time = Date.now();
    
    // for first time move mouse
    if(typeof preTime === "undefined"){
        preX = x;
        preY = y;
        preTime = time;
        return;
    }
    calc_speed(x, y, time - preTime);
    preTime = time;
    preX = x;
    preY = y;
}

// calculate speed and update cumulate
function calc_speed(x, y, deltaTime) {
    var rad = - deltaRad(preX, preY, x, y);
    if (Math.abs(rad) < 0.000001) return;

    var speed = rad / deltaTime;
    curRad = curRad + rad;

    document.getElementById("x").innerHTML=x;
    document.getElementById("y").innerHTML=y;
    document.getElementById("rad").innerHTML=curRad;

    // when move counter-clockwise for a whole circle
    if (cumulate - curRad > 2 * Math.PI) curRad = curRad + 2 * Math.PI;
    // clockwise only
    if (curRad > cumulate) {
        cumulate = curRad;
        document.getElementById("speed").innerHTML=speed;
        document.getElementById("cumulate").innerHTML=cumulate / 2 / Math.PI;   // Rads to Circles
    }    

}
// spin_center(x0, y0)
// pre_position(x1, y1)
// now_position(x2, y2)
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
