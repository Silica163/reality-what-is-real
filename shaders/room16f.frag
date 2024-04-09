#version 300 es
precision highp float;

uniform vec4 roomData;
uniform vec3 viewCamPos;
uniform vec3 worldCamPos;
uniform vec3 lightPos;

in vec4 vWorldPos;

out vec4 FragColor;

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
#define MIN .0001
#define STEPS 64

vec3 N = vec3(0);
vec3 V = vec3(0);
vec3 L = vec3(0);

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

vec2 dist(vec3 p, float s){
    float d = MAX;
    int mat = 0;
    float cubeDist = cube(p, vec3(0,2,0), vec3(2));
    float cam = MAX;
    float floorDist = p.y;
    float light = sphere(p, lightPos, .5);
    if(roomData.a == 0. && s < .5)
        cam = sphere(p, worldCamPos, .1);

    if(s > .5){
        d = min(d,cube(p, worldCamPos, vec3(.1)));
    }

    d = min(d, cubeDist);
    d = min(d, cam);
    d = min(d, floorDist);
    d = min(d, light);
    if(d == floorDist) mat = 1;
    if(d == cam && roomData.a == 0.) mat = 3;
    if(d == cubeDist) mat = 2;
    if(d == light) mat = 4;
    return vec2(d,mat);
}

vec3 normal(vec3 p){
    vec2 e = vec2(.001,0);
    return normalize(vec3(
        dist(p + e.xyy, 0.).x,
        dist(p + e.yxy, 0.).x,
        dist(p + e.yyx, 0.).x
    ));
}

float march(vec3 ro, vec3 rp, vec3 rd){
    float rl = length(ro - rp);
    for(int i = 0; i < STEPS; i++){
        float d = dist(rp, 0.).x;
        if(d > MAX)break;
        rl += d;
        rp = ro + rd * rl;
        if(d <= MIN)break;
    }
    return rl;
}

float shadowMarch(vec3 ro, float ss){
    float rl = 0., s = 1.;
    float lDist = length(ro - lightPos) - 1.;
    for(int i = 0; i < STEPS; i++){
        vec3 rp = ro + rl*L;
        float d  = dist(rp, ss).x;
        rl += d;
        s = min(s, 32.*d/rl);
        if(d <= MIN)break;
        if(rl >= lDist)break;
    }
    if( rl < lDist)s = 0.;
    return clamp(s,0.,1.);
}

void main(){
    V = normalize(vWorldPos.xyz - viewCamPos);
    float c = 0.;
    vec3 ro = viewCamPos;
    vec3 rp = ro;
    float rl = march(ro, rp, V);

    rp = ro + V * rl;
    N = normal(rp);
    L = normalize(lightPos - rp);
    float mat = dist(rp, 0.).y;
    float lightDist = length(lightPos - rp)/4.;
    float s = 1.;
    if(mat == 3.)s = 0.;
    float shadow = shadowMarch(rp + N*MIN*1.5, s) + .3;
    if(mat == 1.){
        c = (1./lightDist)*arrowPattern(rp.xz, 4.) * diffuse(vec3(0,1,0),L) * shadow;
    } else if( mat == 2.){
        c = (
            1./(rl+.9) + .2
        )*shadow;
    } else if( mat == 3.){
        c = 0.;
        c += diffuse(N, L) * min(shadow+.2,1.);
        c += phong(N,L,V,32.);
        c = c/3.+.3;
        c /= lightDist;
        c += (1.-diffuse(N,-V))*.2;
    } else if(mat == 4.){
        c = 1.;
    } else if( mat == 0.){
        c = 0.;
    }
    FragColor = vec4(vec3(c),1);
}
