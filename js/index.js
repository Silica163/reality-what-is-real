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

function initRoom16(){
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
}

function drawMenu(time){
    drawText(time, "menu");
}

function drawDialog(time){
    drawText(time, "dialog");
}

function gameStart(){
    createRenderProgram(gl, "camera", "camera", "camera");
    createRenderProgram(gl, "roomProg", "vShaderSource", "roomFSource");
    createRenderProgram(gl, "room16", "room16v", "room16f");

    initTextProg("menu");
    initTextProg("dialog");
    initRoom16();

    for(let i in cubes){
        const shaderProg = createRenderProgram(gl, `cubeProg${i}`, "vShaderSource", "cubeFSource");

        const cubeSize = [.2,.2,.2];
        const cubeVBuff = gl.createBuffer();
        const cubeVPos = cubeVertex(cubes[i].p,cubeSize);
        cubes[i].s = cubeSize;
        cubes[i].b = cubeEdge(cubes[i].p,cubeSize);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVPos.flat()), gl.STATIC_DRAW);
        shaderProg.vBuff = cubeVBuff;
        shaderProg.eBuff = connectBuff;
        shaderProg.eLength = connect.length;
    }

    const roomVBuff = gl.createBuffer();
    const roomVPos = cubeVertex(room.p,room.s);
    room.b = cubeEdge(room.p,room.s);
    gl.bindBuffer(gl.ARRAY_BUFFER, roomVBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(roomVPos.flat()), gl.STATIC_DRAW);
    shaderProgs["roomProg"].vBuff = roomVBuff;
    shaderProgs[`roomProg`].eBuff = connectBuff;
    shaderProgs[`roomProg`].eLength = connect.length;
 
    shaderProgs["camera"].vBuff = gl.createBuffer();
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

        getAttrib(currentProgram, "aWorldVertex");
        getAttrib(currentProgram, "aSurfNormal");
        getAttrib(currentProgram, "aTexCoord");
    }

    window.requestAnimationFrame(render);
}

function drawGame(time){
    let inverseColor = (gameState.roomId > 7) * 1;

    clearBuffer();

    for(let i in shaderProgs){
        let currentProgram = shaderProgs[i];

        if(i == "menu" || i == "dialog")continue;
        if(i == "camera" && cameraSettings.first_player){
            continue;
        } else if(i == "camera"){
            const camVPos = cubeVertex(worldCamPos,[.1,.1,.1]);
            gl.bindBuffer(gl.ARRAY_BUFFER, currentProgram.vBuff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(camVPos.flat()), gl.STATIC_DRAW);
        }

        if(gameState.roomId < 0){
            if(i != "room16"){
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

        if(currentProgram.attribs["aWorldVertex"] >= 0.){
            gl.bindBuffer(gl.ARRAY_BUFFER, currentProgram.vBuff);
            gl.enableVertexAttribArray(currentProgram.attribs["aWorldVertex"]);
            gl.vertexAttribPointer(currentProgram.attribs["aWorldVertex"], 3, gl.FLOAT, false, 0, 0);
        }

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
    const oldRoomId = gameState.roomId;
    if(gameState.roomId < 8 && gameState.room16 != 1){
        cameraSettings.first_player = true;
    }
    gameTime.now = time;

    camDirMovement[0] = movement.x;
    camDirMovement[2] = movement.z;

    lookAngle.lr = mouse.x * PI ;
    lookAngle.ud = mouse.y * PI/2. ;

    // move camera
    var camDirLen = Math.sqrt(camDirMovement[0]*camDirMovement[0] + camDirMovement[2]*camDirMovement[2]);
    if(camDirLen > 0.)
        vec3.scale(camDirMovement,camDirMovement,1./camDirLen);
    vec3.scale(camDirMovement,camDirMovement,moveSpeed*(run ? 2 : 1));

    // rotate camera
    if(gameState.roomId < 0)
        vec3.rotateX(camDirMovement,camDirMovement,[0,0,0],lookAngle.ud);
    vec3.rotateY(camDirMovement,camDirMovement,[0,0,0],lookAngle.lr);
    vec3.add(worldCamPos,worldCamPos,camDirMovement);

    intOffset = cameraSettings.first_player ? .2 : .1;

    function solve_box_collision(cube_boundary, side /* 0-5 */, sign /* 1 outside -1 inside*/){
        worldCamPos[side%3] = cube_boundary[side] + intOffset * (side < 3 ? 1 : -1) * sign;
    }

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
                    if(roomId == 0){ 
                        teleRoomCamPos[2] = 2. + intOffset*1.5;
                        gameState.bonus = 1;
                    } else {
                        let prevSide = teleSide[roomId - 1];
                        teleRoomCamPos = prevRoomTele[prevSide](worldCamPos);
                        switch(prevSide){
                            case 0:
                                mouse.x += .5 ;
                                break;
                            case 1:
                                break;
                            case 2:
                                mouse.x -= .5 ;
                                break;
                        } 
                    }
                    roomChange--;
                }
    
                if(goNext){
                    let nextSide = teleSide[roomId];
                    if(gameState.bonus && roomId == 15){
                        switch(roomSide){
                            case 0:
                                teleRoomCamPos[0] = - worldCamPos[2];
                                teleRoomCamPos[2] = -2 - intOffset*1.5;
                                break;
                            case 1:
                                teleRoomCamPos[2] = worldCamPos[2] - intOffset*1.5;
                                break;
                            case 2:
                                teleRoomCamPos[0] = worldCamPos[2];
                                teleRoomCamPos[2] = -2 - intOffset*1.5;
                                break;
                        }
                        roomChange = -16;
                    } else {
                        teleRoomCamPos = nextRoomTele[nextSide](worldCamPos);
                        roomChange++;
                    }
                    switch(roomSide){
                        case 0:
                            mouse.x -= .5 ;
                            break;
                        case 2:
                            mouse.x += .5 ;
                            break;
                    }
                }
    
                if(goNext || goBack){
                    teleRoomCamPos[1] = cameraSettings.y;
                    vec3.copy(worldCamPos, teleRoomCamPos);
                } else {
                    solve_box_collision(room.b, i, -1);
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
                    solve_box_collision(cubes[i].b, j, 1);
                    break;
                }
            }
        }
    }

    if(gameState.roomId == -1){
        var roomInt = isPointOutsideBox(worldCamPos, room.b, room.p, intOffset);
        var floorInt = worldCamPos[1] < (intOffset);

        if(floorInt){
            worldCamPos[1] = intOffset;
        }

        for(let i in roomInt.side){
//            infoDivs0[i].innerText = roomInt.side[i];
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
                    switch(roomSide){
                        case 0:
                            teleRoomCamPos[0] = -2 + intOffset*1.5;
                            teleRoomCamPos[2] = -worldCamPos[0];
                            mouse.x += .5;
                            break;
                        case 1:
                            teleRoomCamPos[2] = worldCamPos[2] + intOffset*1.5;
                            break;
                        case 2:
                            teleRoomCamPos[0] = 2 - intOffset*1.5;
                            teleRoomCamPos[2] = worldCamPos[0];
                            mouse.x -= .5;
                            break;
                    }
                    gameState.bonus = 1;
                }


                if(goRoom0 || goRoom15){
                    teleRoomCamPos[1] = cameraSettings.y;
                    vec3.copy(worldCamPos, teleRoomCamPos);
                } else { 
                    solve_box_collision(room.b, i, 1);
                }

                gameState.roomId = roomId;
                break;
            }
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

    if(gameState.roomId != oldRoomId){
        roomChangeEvent = new CustomEvent("roomchange",{detail:oldRoomId});
        window.dispatchEvent(roomChangeEvent);
    }

    if(gameTime.startPlaying == 0 && gameState.playing){
        gameTime.startPlaying = time;
    }

    if(gameState.playing && !gameState.dispDialog && menuData[2] == 0){
       setTimeout(()=>{
           gameState.dispDialog = true;
       }, 500);
    }

    drawFrame(time);
    window.requestAnimationFrame(render);
}

function drawFrame(time){
    if(gameState.dispMenu){
        if(!gameState.renderMenuBg){
            drawGame2Buffer(time);
            gameState.renderMenuBg = 1;
        }
        drawMenu(time);
    } else if (gameState.dispDialog){
        drawGame2Buffer(time);
        drawDialog(time);
    } else {
        drawGame(time);
    }
}

function drawGame2Buffer(time){
    gl.bindFramebuffer(gl.FRAMEBUFFER, gameFrameBuffer);
    drawGame(time);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
 
window.addEventListener("shaderloaded",gameStart);
window.addEventListener("roomchange", roomChange)
loadUrlShaders();
