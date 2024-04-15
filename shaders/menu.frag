#version 300 es
precision highp float;
uniform vec4 uMouse;
// x => x, y => y, z=> click, w=>
uniform vec2 resolution;
uniform float time;
uniform vec4 menuData;

uniform sampler2D menuDataTex;
// menudata
// red => charset
// green => charx
// blue => chary
// alpha =>

//charmap 
// red clickable?
// green charX
// blue charY
// alpha menu

uniform sampler2D background;
out vec4 FragColor;

#define PI 3.14159265

vec2 gridSize = vec2(16,8);
vec2 main_menu = vec2(13,10);
vec2 control_menu = vec2(14, 10);
vec2 esc_menu = vec2(15,10);
vec2 how_to_play = vec2(0,9);
vec2 credit = vec2(1,9);

ivec2 getMenuPos(vec2 menu, vec2 centerCord){
    return ivec2(menu*45.) + ivec2(floor((centerCord*gridSize.x)/(gridSize.yx*45.))) + ivec2(0,29);
}

vec4 blur(sampler2D image, vec2 pos){
    vec4 c = vec4(0);
    float kernel[] = float[](1.,6.,15.,20.,15.,6.,1.);
    for(int i = 0;i < 7;i++){
        for(int j = 0; j < 7; j++){
//            c += texelFetch(background,ivec2(pos+vec2(i-3,j-3)),0)*(kernel[i]*kernel[j])/4096.;
            c += texture(background, (pos+vec2(i-3,j-3)*2.+.5)/resolution)*(kernel[i]*kernel[j])/4096.;
        }
    }
    return c;
}

void main(){
    vec2 res = resolution.xy;
    vec2 uv = (2. * gl_FragCoord.xy - res.xy)/res.y;
    vec2 menuFc = (uv*.5+.5)*720.;

    vec2 charGrid = floor(uv*gridSize);
    vec2 gridUv = clamp((fract(uv*gridSize)-.5)*(gridSize.yx/gridSize.x)+.5,2./45.,1.);
    vec2 mouseGrid = floor(uMouse.xy*gridSize);

    vec2 menu = vec2(0);
    switch(int(menuData.x)){
        case 0: menu = main_menu;
                break;
        case 1: menu = esc_menu;
                break;
        case 2: menu = control_menu;
                break;
        case 3: menu = how_to_play;
                break;
        case 4: menu = credit;
                break;
    }
    vec4 cp = texelFetch(menuDataTex, getMenuPos(menu, menuFc), 0);
    vec4 char = texture(menuDataTex,(cp.gb*cp.a)+gridUv/16.);
    bool pxInsideMenu = cp.a == 1.;
    bool menuSelect = charGrid.y == mouseGrid.y && abs(uMouse.x) <= 1. && pxInsideMenu && cp.r == 1.;

    vec3 c = vec3(0);
    c += smoothstep(.4,.5,abs(gridUv.y-.5)*float(menuSelect)) + float(menuSelect)*.2;
    c += char.r*char.a;
    c += cp.a*.2;

    if(uMouse.z > 0. && pxInsideMenu && menuSelect){
        c += .3;
    }

    vec3 bg = blur(background, gl_FragCoord.xy).rgb;
    c = c + bg*(1.-char.a)*.5;

    FragColor = vec4(c,1);
}
