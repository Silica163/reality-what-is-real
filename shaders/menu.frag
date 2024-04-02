#version 300 es
precision highp float;
uniform vec4 uMouse;
// x => x, y => y, z=> click, w=>
uniform vec2 resolution;
uniform float time;

uniform sampler2D menuData;
// menudata
// red => charset
// green => charx
// blue => chary
// alpha => 

out vec4 FragColor;

vec2 charData = vec2(13,10);

void main(){
    vec2 res = resolution.xy;
    vec2 uv = (2. * gl_FragCoord.xy - res.xy)/res.y;
    vec2 sqFc = gl_FragCoord.xy - floor((res-res.y) / 2.);

    vec2 gridSize = vec2(16,8);
    vec2 charGrid = floor(uv*gridSize);
    vec2 gridUv = (fract(uv*gridSize)-.5)*(gridSize.yx/gridSize.x)+.5;
    
    vec2 mouseGrid = floor(uMouse.xy*gridSize);

    vec3 c = vec3(0);
    c.rg = uv;

    if(abs(uv.x) <= 1.){
        vec3 cp = texelFetch(menuData, ivec2(charData/16.*720.) + ivec2((sqFc/(gridSize*2.))*vec2((gridSize*2.)/45.)*(gridSize.x/gridSize.yx)) + ivec2(0,29), 0).rgb;

//        c = texture(menuData,charData/16.+((sqFc/res.y)/16.)*vec2(gridSize.x*2./45.,16./45.) + vec2(0,(45.-16.)/45.)/16.).rgb;
//
        c = texture(menuData,(cp.gb*cp.r)+gridUv/16.).rrr;
//        c = texture(menuData,(charGrid+8.)/16.+gridUv/16.).rgb;
//        c = cp;
    }

    c.b = max(c.b,float(charGrid.y == mouseGrid.y));
    if(uMouse.z > 0. && float(charGrid.y == mouseGrid.y) > 0.){
        c = vec3(1.-c.x) * c.b;
    }
//    c.rg = gridUv;
    FragColor = vec4(c,1);
}
