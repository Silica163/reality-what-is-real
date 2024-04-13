#version 300 es
precision highp float;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

out vec4 vWorldPos;
out vec4 vScreenPos;
out vec3 surfNormal;
out vec2 vUv;

in vec4 aWorldVertex;
in vec3 aSurfNormal;
in vec2 aTexCoord;

void main(){
    gl_Position = uProjMat * uViewMat* aWorldVertex;
    vWorldPos = aWorldVertex;
    vScreenPos = gl_Position;
    surfNormal = aSurfNormal;
    vUv = aTexCoord;
}

