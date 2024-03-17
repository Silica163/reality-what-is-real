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

float arrow(vec2 uv){
    float c = 0.;
    uv.x = abs(uv.x);
    c = min(max((uv.y - (1.-uv.x))*.5,-uv.y), max((uv.x-.5),abs(uv.y+.5)-.5));
    return smoothstep(0.,.001,c);
}

float arrowPattern(vec2 uv, float scale){
    uv *= scale;
    float c = 0.;
    vec2 id = floor(uv);
    vec2 uf = fract(uv);
    c = arrow(uf*2.-1.);
    return c;
}

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

float cubeId = 0.;
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
    cubeId = roomData.y;
    roomNum = roomData.x;
    vec4 fourBit = float24bit(mod(roomNum,16.));
    float c = 0.;
    if(cubeId == 0.)
        c = fourBit.x;
    if(cubeId == 1. )
        c = fourBit.y;
    if(cubeId == 2. )
        c = fourBit.z;
    if(cubeId == 3. )
        c = fourBit.w;
    c += (blinnPhong(N,L,V,1.) + .05)*.2;
    gl_FragColor = vec4(vec3(c),1);
}
