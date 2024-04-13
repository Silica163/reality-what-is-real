function initTextProg(name){
    const shaderProg = createRenderProgram(gl, name, "vFullCanvas", name);
    
    getUniform(shaderProg, "uMouse");
    getUniform(shaderProg, "menuDataTex");
    getUniform(shaderProg, "menuData");
    getUniform(shaderProg, "background");

    const image = new Image();
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, menuDataTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    image.src = "img/texture.png";
   
    gl.bindTexture(gl.TEXTURE_2D, gameTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        canvas.width,
        canvas.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, gameFrameBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, gameRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gameRenderBuffer);

    gl.bindTexture(gl.TEXTURE_2D, gameTexture);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, 
        gl.COLOR_ATTACHMENT0, 
        gl.TEXTURE_2D, 
        gameTexture, 
        0
    ); 
    const menuVertex = gl.createBuffer();
    shaderProg.vBuff = menuVertex;
    gl.bindBuffer(gl.ARRAY_BUFFER, menuVertex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1,-1,-1, 1,-1]), gl.STATIC_DRAW);

    const menuIndics = gl.createBuffer();
    shaderProg.eLength = 6;
    shaderProg.eBuff = menuIndics;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, menuIndics);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,1,3,2]), gl.STATIC_DRAW);
}

function drawText(time, name){
    clearBuffer();
    const program = shaderProgs[name];
   
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, menuDataTexture);
    gl.uniform1i(program.uniforms["menuDataTex"], 0);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gameTexture);
    gl.uniform1i(program.uniforms["background"],1);

    gl.bindBuffer(gl.ARRAY_BUFFER, program.vBuff);
    gl.enableVertexAttribArray(program.attribs["aWorldVertex"]);
    gl.vertexAttribPointer(program.attribs["aWorldVertex"], 2, gl.FLOAT, false, 0, 0);

    gl.uniform4fv(program.uniforms["uMouse"], mouseObj);
    gl.uniform4fv(program.uniforms["menuData"], menuData);
    gl.uniform2f(program.uniforms["resolution"], canvas.width, canvas.height);

    gl.uniform1f(program.uniforms["time"], time/1000);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.eBuff);
    gl.drawElements(gl.TRIANGLES, program.eLength, gl.UNSIGNED_SHORT, 0);
}
