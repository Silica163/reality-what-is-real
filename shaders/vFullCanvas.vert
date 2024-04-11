#version 300 es
precision highp float;

// atribute vec4 aWorldVertexPos
in vec4 aWorldVertexPos;

void main(){
    gl_Position = aWorldVertexPos;
}

