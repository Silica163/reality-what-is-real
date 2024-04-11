#version 300 es
precision highp float;
uniform vec3 viewCamPos;
uniform vec3 worldCamPos;
uniform vec3 lightPos;

in vec4 vWorldPos;

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

#define STEPS 32
#define MAX 10.
#define MIN .0001
vec3 V = vec3(0);
vec3 L = vec3(0);
vec3 N = vec3(0);
void main(){
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
    N = normalize(rp - worldCamPos);
    
    float c = 0.;
    c += diffuse(N,L);
    c += phong(N,L,V,32.);
    c = c/3. + .3;

    FragColor = vec4(vec3(c),1);
}
