#version 300 es

precision highp float;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

out vec4 vWorldPos;

in vec4 aWorldVertexPos;

void main(){
    gl_Position = uProjMat * uViewMat* aWorldVertexPos;
    vWorldPos = aWorldVertexPos;
}

