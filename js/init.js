const { mat4, mat3, mat2, quat, quat2, vec2, vec3, vec4} = glMatrix;
const { abs, sign, max, sqrt, min, floor } = Math;
function max3(v){
    return max(v[0],max(v[1],v[2]));
}

const canvas = document.getElementById("webgl");
let glContext = canvas.getContext("webgl2",{ preserveDrawingBuffer: true, alpha: true, depth: true, antialias: false});
if(!glContext){
    logger("webgl 2.0 is not support.");
}

let mouse = {x:0,y:0};
const mouseSpeed = .7;
let moveSpeed = .025;
const movement = {x:0,y:0,z:0};
const gameState = {
    roomId: 0,
    jump: 0,
}
let lightPos = vec3.fromValues(0,3,0);
let posOffset = vec3.fromValues(0,0,0);
const FOV = Math.PI/1.7;
const aspect = canvas.width/canvas.height;
const zNear = 0.1;
const zFar = 10;
const projMat = mat4.create();
mat4.perspective(projMat, FOV, aspect, zNear, zFar);

let first_player = true;
let thirdCamDist = .4;

let lookAngle = {lr:0,ud:0};
let lookDir = vec3.fromValues(0,0,-1);

let viewCamPos = vec3.fromValues(0,0,0);
const worldCamPos = vec3.fromValues(0,.2,0);
const camRotMat = mat4.lookAt([0],[0,0,0],lookDir,[0,1,0])
const invCamRot = mat4.invert([0],camRotMat);
const camDirMovement = vec3.fromValues(0,0,0);

const modelViewMat = mat4.create();
mat4.translate(
    modelViewMat,
    camRotMat,
    vec3.negate([0],worldCamPos)
);

const PI = Math.PI;
let pointerLock = false;
let enableLock = false;
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
