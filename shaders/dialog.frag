#version 300 es
precision highp float;
uniform vec4 menuData;
// red => menu id,
// green => prev menu id,
// blur => dialog id
uniform vec2 resolution;
uniform vec4 uMouse;
uniform float time;

uniform sampler2D menuDataTex;
uniform sampler2D background;

out vec4 FragColor;

vec2 gridSize = vec2(16,8);
vec2 diagSize = vec2(44,4);

ivec2 diagStart = ivec2(2,9);

ivec2 diagId2Pos(int id){
    int cellId = diagStart.x + (15-diagStart.y)*16;
    cellId += id;
    ivec2 diagPos = ivec2(
        cellId%16,
        15 - cellId/16
    );
    return diagPos;
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

// dialog width 44 chars
// height 4 chars
void main(){
    vec2 uv = (2.*gl_FragCoord.xy - resolution.xy)/resolution.y;
    
    vec2 charGrid = floor(uv*gridSize);
    vec2 gridUv = (fract(uv*gridSize)-.5)*(gridSize.yx/gridSize.x) +.5;
   
    ivec2 dialog = diagId2Pos(int(menuData.z));
    ivec2 menuPos =  ivec2(floor(charGrid)) + ivec2(22,7);
    vec4 charPos = texelFetch(menuDataTex, dialog*45 + menuPos + ivec2(0,40), 0);
    vec4 char = texture(menuDataTex, charPos.gb + gridUv/16.)*charPos.a;

    float diagBg = step(abs(uv.y+.5),.25);
    float drawDiag = diagBg*step(abs(uv.x),1.+6./16.);

    vec3 c = blur(background, gl_FragCoord.xy).xyz * diagBg*.2 + 
             texelFetch(background, ivec2(gl_FragCoord.xy), 0).xyz * (1.-diagBg) + 
             diagBg*.4
    ;

   c += char.x*char.a*drawDiag;
//   c = charPos.xyz;

    FragColor = vec4(vec3(c),1);
}
