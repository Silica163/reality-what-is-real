function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log(gl.getShaderInfoLog(shader));
        logger(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function attachShader(gl, shaderProgram, vSource, fSource){
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
}

function linkProgram(gl, shaderProgram){
    gl.linkProgram(shaderProgram);
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        console.log(gl.getProgramInfoLog(shaderProgram));
        logger(gl.getShaderInfoLog(shader));
    }
}

function getUniform(shaderProgram, label){
    if(shaderProgram.uniforms == undefined){
        shaderProgram.uniforms = {};
    }
    shaderProgram.uniforms[label] = glContext.getUniformLocation(shaderProgram, label);
}

function getAttrib(shaderProgram, label){
    if(shaderProgram.attribs == undefined){
        shaderProgram.attribs = {};
    }
    shaderProgram.attribs[label] = glContext.getAttribLocation(shaderProgram, label);
}

function clearBuffer(){
    glContext.clearColor(0,0,0,1);
    glContext.clearDepth(1);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.depthFunc(glContext.LEQUAL);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
}

const shaderProgs = {};
function createRenderProgram(gl, name, vertexShaderName, fragmentShaderName){
    const program = gl.createProgram();
    attachShader(gl, program, shaders[vertexShaderName], shaders[fragmentShaderName]);
    linkProgram(gl, program);
    shaderProgs[name] = program;
    return program;
}


