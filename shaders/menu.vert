precision highp float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D menuData;

attribute vec4 aWorldVertexPos;

void main(){
    gl_Position = aWorldVertexPos;
    gl_Position.z = -1.;
}

