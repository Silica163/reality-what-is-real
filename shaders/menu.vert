precision highp float;
uniform vec4 roomData;
uniform vec2 resolution;
uniform float time;
uniform sampler2D menuData;

attribute vec4 aWorldVertexPos;
attribute vec3 aSurfNormal;
attribute vec2 aTexCoord;

void main(){
    gl_Position = aWorldVertexPos;
}

