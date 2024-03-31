precision highp float;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

varying vec4 vWorldPos;

attribute vec4 aWorldVertexPos;

void main(){
    gl_Position = uProjMat * uViewMat* aWorldVertexPos;
    vWorldPos = aWorldVertexPos;
}

