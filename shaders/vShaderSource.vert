precision highp float;
uniform mat4 invCamRot;
uniform mat4 uViewMat;
uniform mat4 uProjMat;
uniform vec4 roomData;
uniform vec3 viewCamPos;
uniform vec3 worldCamPos;
uniform vec3 lightPos;
uniform vec2 resolution;
uniform float time;

varying vec4 vWorldPos;
varying vec4 vScreenPos;
varying vec3 surfNormal;
varying vec3 surfPos;
varying vec3 tmp;
varying vec2 vUv;

attribute vec4 aWorldVertexPos;
attribute vec3 aSurfNormal;
attribute vec2 aTexCoord;

void main(){
    gl_Position = uProjMat * uViewMat* aWorldVertexPos;
    vWorldPos = aWorldVertexPos;
    vScreenPos = gl_Position;
    surfNormal = aSurfNormal;
    vUv = aTexCoord;
}

