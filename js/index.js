const cubes = [
    {
        p:[-.6, .2, .6],
    },
    {
        p:[ .6, .2, .6],
    },
    {
        p:[ .6, .2,-.6],
    },
    {
        p:[-.6, .2,-.6],
    },
];

const room = {
    p:[0,2,0],
    s:[2,2,2],
}

const menuDataTexture = gl.createTexture();
const gameTexture = gl.createTexture();
const gameFrameBuffer = gl.createFramebuffer();
const gameRenderBuffer = gl.createRenderbuffer();

function initMenu(){
    createRenderProgram(gl, "menuProg", "vFullCanvas", "menu");
    
    getUniform(shaderProgs["menuProg"], "uMouse");
    getUniform(shaderProgs["menuProg"], "menuDataTex");
    getUniform(shaderProgs["menuProg"], "background");

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
    shaderProgs["menuProg"].vBuff = menuVertex;
    gl.bindBuffer(gl.ARRAY_BUFFER, menuVertex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1,-1,-1, 1,-1]), gl.STATIC_DRAW);

    const menuIndics = gl.createBuffer();
    shaderProgs["menuProg"].eLength = 6;
    shaderProgs["menuProg"].eBuff = menuIndics;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, menuIndics);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,1,3,2]), gl.STATIC_DRAW);
}


function drawMenu(time){
    clearBuffer();
    const program = shaderProgs["menuProg"];
   
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, menuDataTexture);
    gl.uniform1i(program.uniforms["menuDataTex"], 0);
    
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gameTexture);
    gl.uniform1i(program.uniforms["background"],1);

    gl.bindBuffer(gl.ARRAY_BUFFER, program.vBuff);
    gl.enableVertexAttribArray(program.attribs["aWorldVertexPos"]);
    gl.vertexAttribPointer(program.attribs["aWorldVertexPos"], 2, gl.FLOAT, false, 0, 0);

    gl.uniform4fv(program.uniforms["uMouse"], mouseObj);
    gl.uniform2f(program.uniforms["resolution"], canvas.width, canvas.height);

    gl.uniform1f(program.uniforms["time"], time/1000);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.eBuff);
    gl.drawElements(gl.TRIANGLES, program.eLength, gl.UNSIGNED_SHORT, 0);
 
}

function gameStart(){
    createRenderProgram(gl, "camera", "camera", "camera");
    createRenderProgram(gl, "roomProg", "vShaderSource", "roomFSource");
    createRenderProgram(gl, "room16", "room16v", "room16f");
    initMenu();

    const frontCamPlane = gl.createBuffer();
    const frontPlane = gl.createBuffer();
    shaderProgs['room16'].vBuff = frontCamPlane;
    shaderProgs["room16"].eBuff = frontPlane;
    const planeVert = [
         2, 2,-.5,
        -2, 2,-.5,
        -2,-2,-.5,
         2,-2,-.5
    ];
    const planeConn = [0,1,2,0,2,3];
    shaderProgs['room16'].eLength = planeConn.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, frontCamPlane);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVert), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, frontPlane);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeConn), gl.STATIC_DRAW);


    for(let i in cubes){
        createRenderProgram(gl, `cubeProg${i}`, "vShaderSource", "cubeFSource");

        const cubeSize = [.2,.2,.2];
        const cubeVBuff = gl.createBuffer();
        const cubeVPos = cubeVertex(cubes[i].p,cubeSize);
        cubes[i].s = cubeSize;
        cubes[i].b = cubeEdge(cubes[i].p,cubeSize);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVPos.flat()), gl.STATIC_DRAW);
        shaderProgs[`cubeProg${i}`].vBuff = cubeVBuff;
        shaderProgs[`cubeProg${i}`].eBuff = connectBuff;
        shaderProgs[`cubeProg${i}`].eLength = connect.length;
    }

    const roomVBuff = gl.createBuffer();
    const roomVPos = cubeVertex(room.p,room.s);
    room.b = cubeEdge(room.p,room.s);
    gl.bindBuffer(gl.ARRAY_BUFFER, roomVBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(roomVPos.flat()), gl.STATIC_DRAW);
    shaderProgs["roomProg"].vBuff = roomVBuff;
    shaderProgs[`roomProg`].eBuff = connectBuff;
    shaderProgs[`roomProg`].eLength = connect.length;
 
    const cameraVBuff = gl.createBuffer();
    shaderProgs["camera"].vBuff = cameraVBuff;
    shaderProgs[`camera`].eBuff = connectBuff;
    shaderProgs[`camera`].eLength = connect.length;
 
    for(let i in shaderProgs){
        let currentProgram = shaderProgs[i];
        getUniform(currentProgram, "worldCamPos");
        getUniform(currentProgram, "viewCamPos");
        getUniform(currentProgram, "time");
        getUniform(currentProgram, "resolution");
        getUniform(currentProgram, "uProjMat");
        getUniform(currentProgram, "uViewMat");
        getUniform(currentProgram, "invCamRot");
        getUniform(currentProgram, "lightPos");
        getUniform(currentProgram, "roomData");

        getAttrib(currentProgram, "aWorldVextexPos");
        getAttrib(currentProgram, "aSurfNormal");
        getAttrib(currentProgram, "aTexCoord");
    }

    window.requestAnimationFrame(render);
}

function drawFrame(time){
    let inverseColor = (gameState.roomId > 7) * 1;

    clearBuffer();

    for(let i in shaderProgs){
        let currentProgram = shaderProgs[i];

        if(i == "menuProg")continue;
        if(i == "camera" && cameraSettings.first_player){
            continue;
        } else if(i == "camera"){
            const camVPos = cubeVertex(worldCamPos,[.1,.1,.1]);
            gl.bindBuffer(gl.ARRAY_BUFFER, currentProgram.vBuff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(camVPos.flat()), gl.STATIC_DRAW);
        }

        if(gameState.roomId < 0){
            if(i == "room16"){
            } else {
                continue;
            }
        } else if( gameState.roomId >= 0 && i == "room16"){
            continue;
        }

        let cubeId = -1.;
        if(i.match(/cubeProg/) != null){
            cubeId = Number(i[8]);
        }

        if(gameState.roomId == -1){
            lightPos[1] = 10;
        } else {
            lightPos[1] = 3;
        }

        gl.useProgram(currentProgram);

        if(currentProgram.attribs["aTexCoord"] >= 0.){
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuff);
            gl.enableVertexAttribArray(currentProgram.attribs["aTexCoord"]);
            gl.vertexAttribPointer(currentProgram.attribs["aTexCoord"], 2, gl.FLOAT, false, 0, 0);
        }

        if(currentProgram.attribs["aSurfNormal"] >= 0.){
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuff);
            gl.enableVertexAttribArray(currentProgram.attribs["aSurfNormal"]);
            gl.vertexAttribPointer(currentProgram.attribs["aSurfNormal"], 3, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, currentProgram.vBuff);
        gl.enableVertexAttribArray(currentProgram.attribs["aWorldVertexPos"]);
        gl.vertexAttribPointer(currentProgram.attribs["aWorldVertexPos"], 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(currentProgram.uniforms["uProjMat"], false, projMat);
        gl.uniformMatrix4fv(currentProgram.uniforms["invCamRot"], false, invCamRot );
        gl.uniformMatrix4fv(currentProgram.uniforms["uViewMat"], false, modelViewMat);

        gl.uniform3fv(currentProgram.uniforms["lightPos"], lightPos);
        gl.uniform3fv(currentProgram.uniforms["worldCamPos"], worldCamPos);
        gl.uniform3fv(currentProgram.uniforms["viewCamPos"], viewCamPos);

        gl.uniform4f(currentProgram.uniforms["roomData"], gameState.roomId, cubeId, inverseColor, cameraSettings.first_player*1);
        gl.uniform2f(currentProgram.uniforms["resolution"], canvas.width, canvas.height);

        gl.uniform1f(currentProgram.uniforms["time"], time/1000);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currentProgram.eBuff);
        gl.drawElements(gl.TRIANGLES, currentProgram.eLength, gl.UNSIGNED_SHORT, 0);
    }
}

function render(time){

    camDirMovement[0] = movement.x;
    camDirMovement[2] = movement.z;

    lookAngle.lr = mouse.x * PI * mouseSpeed;
    lookAngle.ud = mouse.y * PI/Math.SQRT2 * mouseSpeed;

    // move camera
    var camDirLen = Math.sqrt(camDirMovement[0]*camDirMovement[0] + camDirMovement[2]*camDirMovement[2]);
    if(camDirLen > 0.)
        vec3.scale(camDirMovement,camDirMovement,1./camDirLen);
    vec3.scale(camDirMovement,camDirMovement,moveSpeed*(run ? 2 : 1));
    if(gameState.roomId < 0)
        vec3.rotateX(camDirMovement,camDirMovement,[0,0,0],lookAngle.ud);
    vec3.rotateY(camDirMovement,camDirMovement,[0,0,0],lookAngle.lr);
    vec3.add(worldCamPos,worldCamPos,camDirMovement);


    intOffset = cameraSettings.first_player ? .2 : .1;
    if(gameState.roomId >= 0){
        var roomInt = isPointInsideBox(worldCamPos, room.b, intOffset);
        var cubeInts = [];
    
        for(let i in cubes){
            cubeInts[i] = isPointOutsideBox(worldCamPos, cubes[i].b, cubes[i].p, intOffset);
        }
    
        for(let i in roomInt){    
            let roomSide = ((i == 0) * 3 + (i == 3) * 1 + (i == 2) * 4 + (i == 5) * 2) - 1;
            let teleRoomCamPos = vec3.clone(worldCamPos);
    
            if(roomInt[i]){
                let roomId = gameState.roomId;
                let roomChange = 0;
                let goBack = (roomId > 0 || gameState.room16) && roomSide == 3;
                let goNext = (roomId < 15 || gameState.bonus) && roomSide == teleSide[roomId] && roomSide != 3;
    
                if(goBack){
                    if(roomId > 0){
                        let prevSide = teleSide[roomId - 1];
                        teleRoomCamPos = prevRoomTele[prevSide](worldCamPos);
                        switch(prevSide){
                            case 0:
                                mouse.x += .5 / mouseSpeed;
                                break;
                            case 1:
                                break;
                            case 2:
                                mouse.x -= .5 / mouseSpeed;
                                break;
                        } 
                    } else {
                        teleRoomCamPos[2] = 2. + intOffset*1.5;
                        gameState.bonus = 1;
                    }
                    roomChange--;
                }
    
                if(goNext){
                    let nextSide = teleSide[roomId];
                    if(gameState.bonus && roomId == 15){
                        if(roomSide == 0){
                            teleRoomCamPos[0] = - worldCamPos[2];
                            teleRoomCamPos[2] = -2 - intOffset*1.5;
                        }
                        if(roomSide == 2){
                            teleRoomCamPos[0] = worldCamPos[2];
                            teleRoomCamPos[2] = -2 - intOffset*1.5;
                        }
                        roomChange = -16;
                    } else {
                        teleRoomCamPos = nextRoomTele[nextSide](worldCamPos);
                        roomChange++;
                    }
                    switch(roomSide){
                        case 0:
                            mouse.x -= .5 / mouseSpeed;
                            break;
                        case 1:
                            break;
                        case 2:
                            mouse.x += .5 / mouseSpeed;
                            break;
                    }
                }
    
                if(goNext || goBack){
                    worldCamPos[0] = teleRoomCamPos[0];
                    worldCamPos[2] = teleRoomCamPos[2];
                } else {
                    worldCamPos[i%3] = room.b[i] + intOffset * (i < 3 ? -1 : 1);
                }
    
                gameState.roomId += roomChange;
    
                if(gameState.roomId == 15){
                    gameState.room16 = 1;
                }
            }
        }
      
        for(let i in cubeInts){
            let cubeInt = cubeInts[i];
            for(let j in cubeInt.side){
                if(cubeInt.side[j]){
                    worldCamPos[j%3] = cubes[i].b[j] + intOffset * (j < 3 ? 1 : -1);
                }
            }
        }
    }

    if(gameState.roomId == -1){
        var roomInt = isPointOutsideBox(worldCamPos, room.b, room.p, intOffset);
        var floorInt = worldCamPos[1] < (intOffset);
        for(let i in roomInt.side){
            if(roomInt.side[i]){
                let teleRoomCamPos = vec3.clone(worldCamPos);
                let goRoom0 = i == 2;
                let goRoom15 = i == 5;
                let roomId = -1;

                if(goRoom0){
                    roomId = 0;
                    teleRoomCamPos[2] = room.b[2] - intOffset;
                }

                if(goRoom15){
                    roomId = 15;
                    let roomSide = teleSide[15];
                    if(roomSide == 0){
                        teleRoomCamPos[0] = -2 + intOffset*1.5;
                        teleRoomCamPos[2] = -worldCamPos[0];

                        mouse.x += .5/mouseSpeed;
                    }
                    if(roomSide == 2){
                        teleRoomCamPos[0] = 2 - intOffset*1.5;
                        teleRoomCamPos[2] = worldCamPos[0];
                        mouse.x -= .5/mouseSpeed;
                    }
                    gameState.bonus = 1;
                }

                gameState.roomId = roomId;

                if(!(goRoom0 || goRoom15)){
                    worldCamPos[i%3] = room.b[i] + intOffset * (i < 3 ? 1 : -1);
                } else {
                    worldCamPos[0] = teleRoomCamPos[0];
                    worldCamPos[1] = cameraSettings.y;
                    worldCamPos[2] = teleRoomCamPos[2];
                }
            }
        }

        if(floorInt){
            worldCamPos[1] = intOffset;
        }
    }

    // rotate camera
    vec3.rotateX(lookDir,[0,0,-1],[0,0,0],lookAngle.ud);
    vec3.rotateY(lookDir,lookDir,[0,0,0],lookAngle.lr);    
    mat4.lookAt(camRotMat,[0,0,0],lookDir,[0,1,0]);

    mat4.invert(invCamRot,camRotMat);

    if(cameraSettings.first_player){
        viewCamPos = worldCamPos;
    } else {
        viewCamPos = vec3.add([0],worldCamPos,vec3.scale([0],lookDir,-cameraSettings.third_player_dist));
    }

    mat4.translate(
        modelViewMat,
        camRotMat,
        vec3.negate([0],viewCamPos)
    );

    if(gameState.dispMenu){
        if(!gameState.renderMenuBg){
            gl.bindFramebuffer(gl.FRAMEBUFFER, gameFrameBuffer);
            drawFrame(time);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gameState.renderMenuBg = 1;
        }

        drawMenu(time);
    } else {
        drawFrame(time);
    }
    window.requestAnimationFrame(render);
}

window.addEventListener("shaderloaded",gameStart);
loadUrlShaders();
