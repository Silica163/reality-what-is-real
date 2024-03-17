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

#define STEPS 32
#define MAX 10.
#define MIN .0001
vec3 V = vec3(0);
vec3 L = vec3(0);
vec3 N = vec3(0);
void main(){
    N = surfNormal;
    V = normalize(vWorldPos.xyz - viewCamPos);
    
    vec3 rp = vWorldPos.xyz;
    float rl = length(rp - viewCamPos);
    for(int i = 0; i < STEPS; i++){
        float d = length(rp - worldCamPos) - .1;
        if(d > MAX){
            discard;
            break;
        }
        if(d <= MIN){
            break;
        }
        rl += d;
        rp = viewCamPos + V * rl;
    }

    L = normalize(lightPos - rp);
    V = normalize(rp - viewCamPos);
    N = normalize(rp - worldCamPos);
    
    float c = 0.;
    c += diffuse(N,L);
    c += phong(N,L,V,32.);
    c = c/3. + .3;

    gl_FragColor = vec4(vec3(c),1);
}
