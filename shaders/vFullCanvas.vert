#version 300 es
precision highp float;

in vec4 aWorldVertex;

void main(){
    gl_Position = aWorldVertex;
}

