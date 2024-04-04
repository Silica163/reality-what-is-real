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
    return smoothstep(0.,.005,c);
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
#define MAX 10.
#define MIN .00001
#define STEPS 128

vec3 N = vec3(0);
vec3 V = vec3(0);
vec3 L = vec3(0);
vec3 CharV = vec3(0);

float sphere(vec3 p, vec3 pos, float r){
    return length(p - pos) - r;
}

float max3(vec3 a){
    return max(a.x,max(a.y,a.z));
}

float cube(vec3 p, vec3 pos, vec3 s){
    vec3 cu = abs(p - pos) - s;
    return length(max(cu,0.)) + min(max3(cu),0.);
}

vec2 dist(vec3 p){
    float d = MAX;
    int mat = 0;
    vec3 door = p;
    door.xz = abs(p.xz);
    float door0 = cube(door, vec3(1.9,1,4), vec3(.1,1,.5));
    float door1 = cube(door, vec3(1.9,1,8), vec3(.1,1,.5));
    float doorFrame0 =  max(door0, -cube(door, vec3(1.9,.7,4), vec3(.11,1,.3)));
    float doorFrame1 =  max(door1, -cube(door, vec3(1.9,.7,8), vec3(.11,1,.3)));
    d = min(d, door0);
    d = min(d, door1);
    d = min(d, -cube(p, vec3(0,2,0), vec3(2,2,10)));
    if(doorFrame0 > door0)mat = 1;
    if(doorFrame1 > door1)mat = 1;
    if(d == doorFrame0)mat = 2;
    if(d == doorFrame1)mat = 2;
    return vec2(d,mat);
}

vec3 normal(vec3 p){
    vec2 e = vec2(.001,0);
    return normalize(vec3(
        dist(p + e.xyy).x,
        dist(p + e.yxy).x,
        dist(p + e.yyx).x
    ));
}

float march(vec3 ro, vec3 rp, vec3 rd){
    float rl = length(ro - rp);
    for(int i = 0; i < STEPS; i++){
        float d = dist(rp).x;
        if(d > MAX)break;
        rl += d;
        rp = ro + rd * rl;
        if(d <= MIN)break;
    }
    return rl;
}

void main(){
    CharV = normalize(vWorldPos.xyz - worldCamPos);
    V = normalize(vWorldPos.xyz - viewCamPos);
    L = normalize(lightPos - vWorldPos.xyz);
    vec3 OL = L;
    vec3 c = vec3(0);
    vec3 rp = vWorldPos.xyz;
    vec3 ro = worldCamPos;
    vec3 rd = CharV;
    float rl = march(ro, rp, rd);
    rp = ro + rl * rd;
    c += 1./rl;
//    c = (1./rp)*.5+.5;
    N = normal(rp);
    L = normalize(lightPos - rp);
    CharV = normalize(rp - worldCamPos);

    int mat = int(dist(rp).y);
    if( mat ==  0 ){
            c = vec3(1./(rl+.9));
            if(roomData.z > 0.)
                c = 1. - c;
            if(floor(N.y+.5) == 1.){
                c = vec3(1)*arrowPattern(rp.xz/4., 16.)/2.;
                c += blinnPhong(N, L, CharV, 2.)/2.;
            }
    } else if ( mat ==  1){
            c = vec3(1)*diffuse(N,L)*2.;
            if(roomData.z > 0.)
                c = 1. - c;
    } else if ( mat == 2){
            c = vec3(0);
            if(roomData.z > 0.)
                c = 1. - c;
    }

    if(surfNormal.y == -1.){
        c = vec3(1)*arrowPattern(vUv, 16.)/2.;
        c += blinnPhong(surfNormal, OL, V, 2.)/2.;
    }
    gl_FragColor = vec4(c,1);
}
