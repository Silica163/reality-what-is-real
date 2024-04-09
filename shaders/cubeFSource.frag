#version 300 es
precision highp float;

uniform vec4 roomData;
uniform vec3 viewCamPos;
uniform vec3 lightPos;

in vec4 vWorldPos;
in vec3 surfNormal;

out vec4 FragColor;

float diffuse(vec3 N, vec3 L){
    return clamp(dot(N,L),0.,1.);
}

float blinnPhong(vec3 N, vec3 L, vec3 V, float k){
    vec3 R = reflect(V,N);
    return pow(diffuse(R,L),k);
}

float phong(vec3 N, vec3 L, vec3 V, float k){
    vec3 H = normalize(N-V);
    return pow(diffuse(H,L),k);
}

vec3 V = vec3(0);
vec3 L = vec3(0);
vec3 N = vec3(0);

int cubeId = 0;
float roomNum = 0.;

vec4 float24bit(float a){
    vec4 ret = vec4(0);
    ret.x = mod(floor(a/8.),2.);
    ret.y = mod(floor(a/4.),2.);
    ret.z = mod(floor(a/2.),2.);
    ret.a = mod(a,2.);
    return ret;
}

void main(){
    V = normalize(vWorldPos.xyz - viewCamPos);
    L = normalize(lightPos - vWorldPos.xyz);
    N = surfNormal;
    int cubeId = int(roomData.y);
    roomNum = roomData.x;
    vec4 fourBit = float24bit(mod(roomNum,16.));
    float c = 0.;
    switch(cubeId){
        case 0:
            c = fourBit.x;
            break;
        case 1:
            c = fourBit.y;
            break;
        case 2:
            c = fourBit.z;
            break;
        case 3:
            c = fourBit.w;
            break;
    }
    c += (blinnPhong(N,L,V,1.) + .05)*.2;
    FragColor = vec4(vec3(c),1);
}
