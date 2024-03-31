const { mat4, mat3, mat2, quat, quat2, vec2, vec3, vec4} = glMatrix;
const { PI, abs, sign, max, sqrt, min, floor } = Math;
function max3(v){
    return max(v[0],max(v[1],v[2]));
}

const canvas = document.getElementById("webgl");
let glContext = canvas.getContext("webgl2",{ preserveDrawingBuffer: true, alpha: true, depth: true, antialias: false});
if(!glContext){
    logger("webgl 2.0 is not support.");
}

let mouseObj = new Float32Array([0,0,0,0]);
let pointer = 0;

// mouse for in-game control
let mouse = {x:0,y:0};
const mouseSpeed = .7;
let moveSpeed = .025;
let run = false;
const movement = {x:0,y:0,z:0};
const lookAngle = {lr:0,ud:0};
const gameState = {
    dispMenu: true,
    roomId: 0,
    room16: 0,
    bonus: 0,
}
const cameraSettings  = {
    y: .4,
    first_player: true,
    third_player_dist: .4,
    FOV: PI/1.7,
    aspect: canvas.width/canvas.height,
    zNear: 0.1,
    zFar: 20,
}

let lightPos = vec3.fromValues(0,3,0);

const projMat = mat4.create();
mat4.perspective(
    projMat, 
    cameraSettings.FOV, 
    cameraSettings.aspect, 
    cameraSettings.zNear, 
    cameraSettings.zFar
);

let lookDir = vec3.fromValues(0,0,-1);

let viewCamPos = vec3.fromValues(0,0,0);
const worldCamPos = vec3.fromValues(0,.4,0);
const camRotMat = mat4.lookAt([0],[0,0,0],lookDir,[0,1,0])
const invCamRot = mat4.invert([0],camRotMat);
const camDirMovement = vec3.fromValues(0,0,0);

const modelViewMat = mat4.create();
vec3.copy(viewCamPos, worldCamPos);
mat4.translate(
    modelViewMat,
    camRotMat,
    vec3.negate([0],viewCamPos),
);

let pointerLock = false;
let enableLock = true;
let intOffset = 0; 

const logDiv = document.getElementById("log");
function logger(...argv){
    console.log(argv.join(" "));
    logDiv.innerText += argv.join(' ');
    logDiv.innerText += "\n";
}
const infoDivs0 = document.getElementsByClassName("info0");
const infoDivs1 = document.getElementsByClassName("info1");
const infoDivs2 = document.getElementsByClassName("info2");
const infoDivs3 = document.getElementsByClassName("info3");
