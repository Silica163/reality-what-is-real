precision highp float;
uniform vec4 uMouse;
// x => x, y => y, z=> click, w=>
uniform vec2 resolution;
uniform float time;

uniform sampler2D menuData;
// menudata
// red => charset
// green => menu box id
// blue => menu box uv for char
// alpha => char in menu box

void main(){
    vec2 uv = (2. * gl_FragCoord.xy - resolution.xy)/resolution.y;
    vec3 c = vec3(0);
    vec2 uU = floor(uv*8.), uM = floor(uMouse.xy*8.);
    c.rg = uv;
    c.b = float(uU.y == uM.y && abs(uMouse.x) <= 1. && abs(uv.x) <= 1.);
    if(uMouse.z > 0. && c.b > 0.){
        c = vec3(1) * c.b;
    }
    if(abs(uv.x) <= 1.){
        c = vec3((mod(uU.y+.5,2.)-1.)*(mod(uU.x+.5,2.)-1.)+.5);
    }
    gl_FragColor = vec4(c,1);
}
