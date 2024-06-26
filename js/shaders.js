const vertexShaderList = [
    "vShaderSource",
    "camera",
    "room16v",
    "vFullCanvas",
];

const fragmentShaderList = [
    "cubeFSource",
    "roomFSource",
    "camera",
    "room16f",
    "menu",
    "dialog"
];

const vShaders = {};
const fShaders = {};
let shaderLoaded = 0;
const shaderLoadedEvent = new CustomEvent("shaderloaded");

function loadUrlShader(url, shaderName){
    function fetchErr(e){
        console.warn(url, e);
    }
    fetch(url).then((stream) => {
        stream.text().then((texts)=>{
            if(url.indexOf("frag") > -1)
                fShaders[shaderName] = texts;
            if(url.indexOf("vert") > -1)
                vShaders[shaderName] = texts;
            shaderLoaded++;
            if(shaderLoaded == (vertexShaderList.length + fragmentShaderList.length)){
                window.dispatchEvent(shaderLoadedEvent);
            }
        }).catch(fetchErr);
    }).catch(fetchErr);
}

function loadUrlShaders(){
    for(let i of vertexShaderList){
        loadUrlShader(`./shaders/${i}.vert`,i);
    }
    for(let i of fragmentShaderList){
        loadUrlShader(`./shaders/${i}.frag`,i);
    }

}

let commonFShader = `
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
`;

