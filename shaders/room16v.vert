#version 300 es
precision highp float;

uniform mat4 invCamRot;
uniform mat4 uProjMat;
uniform vec4 roomData;
uniform vec3 viewCamPos;

out vec4 vWorldPos;

in vec4 aWorldVertex;
in vec3 aSurfNormal;
in vec2 aTexCoord;

void main(){
    gl_Position = uProjMat * aWorldVertex;
    vWorldPos = (invCamRot * aWorldVertex) - vec4(-viewCamPos,0);
}

