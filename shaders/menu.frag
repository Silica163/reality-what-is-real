precision highp float;
uniform vec4 roomData;
uniform vec2 resolution;
uniform float time;
uniform sampler2D menuData;
// menudata
// red => charset
// green => menu box id
// blue => menu box uv for char
// alpha => char in menu box

void main(){
    vec2 uv = (2.*gl_FragCoord.xy - resolution.xy)/resolution.y;
    vec3 c = vec3(0);
    c.rg = uv;
    gl_FragColor = vec4(c,1);
}
