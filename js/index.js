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

function gameStart(){
    createRenderProgram(glContext, "camera", "vShaderSource", "cameraFSource");
    createRenderProgram(glContext, "roomProg", "vShaderSource", "roomFSource");
    createRenderProgram(glContext, "room16", "room16v", "room16f");

    const frontCamPlane = glContext.createBuffer();
    const frontPlane = glContext.createBuffer();
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
    glContext.bindBuffer(glContext.ARRAY_BUFFER, frontCamPlane);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(planeVert), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, frontPlane);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeConn), glContext.STATIC_DRAW);


    for(let i in cubes){
        createRenderProgram(glContext, `cubeProg${i}`, "vShaderSource", "cubeFSource");

        const cubeSize = [.2,.2,.2];
        const cubeVBuff = glContext.createBuffer();
        const cubeVPos = cubeVertex(cubes[i].p,cubeSize);
        cubes[i].s = cubeSize;
        cubes[i].b = cubeEdge(cubes[i].p,cubeSize);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, cubeVBuff);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(cubeVPos.flat()), glContext.STATIC_DRAW);
        shaderProgs[`cubeProg${i}`].vBuff = cubeVBuff;
        shaderProgs[`cubeProg${i}`].eBuff = connectBuff;
        shaderProgs[`cubeProg${i}`].eLength = connect.length;
    }

    const roomVBuff = glContext.createBuffer();
    const roomVPos = cubeVertex(room.p,room.s);
    room.b = cubeEdge(room.p,room.s);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, roomVBuff);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(roomVPos.flat()), glContext.STATIC_DRAW);
    shaderProgs["roomProg"].vBuff = roomVBuff;
    shaderProgs[`roomProg`].eBuff = connectBuff;
    shaderProgs[`roomProg`].eLength = connect.length;
 
    const cameraVBuff = glContext.createBuffer();
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

        if(i == "camera" && cameraSettings.first_player){
            continue;
        } else if(i == "camera"){
            const camVPos = cubeVertex(worldCamPos,[.1,.1,.1]);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, currentProgram.vBuff);
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(camVPos.flat()), glContext.STATIC_DRAW);
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

        glContext.useProgram(currentProgram);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, texCoordBuff);
        glContext.enableVertexAttribArray(currentProgram.attribs["aTexCoord"]);
        glContext.vertexAttribPointer(currentProgram.attribs["aTexCoord"], 2, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, normalBuff);
        glContext.enableVertexAttribArray(currentProgram.attribs["aSurfNormal"]);
        glContext.vertexAttribPointer(currentProgram.attribs["aSurfNormal"], 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, currentProgram.vBuff);
        glContext.enableVertexAttribArray(currentProgram.attribs["aWorldVertexPos"]);
        glContext.vertexAttribPointer(currentProgram.attribs["aWorldVertexPos"], 3, glContext.FLOAT, false, 0, 0);

        glContext.uniformMatrix4fv(currentProgram.uniforms["uProjMat"], false, projMat);
        glContext.uniformMatrix4fv(currentProgram.uniforms["invCamRot"], false, invCamRot );
        glContext.uniformMatrix4fv(currentProgram.uniforms["uViewMat"], false, modelViewMat);

        glContext.uniform3fv(currentProgram.uniforms["lightPos"], lightPos);
        glContext.uniform3fv(currentProgram.uniforms["worldCamPos"], worldCamPos);
        glContext.uniform3fv(currentProgram.uniforms["viewCamPos"], viewCamPos);

        glContext.uniform4f(currentProgram.uniforms["roomData"], gameState.roomId, cubeId, inverseColor, Number(cameraSettings.first_player));
        glContext.uniform2f(currentProgram.uniforms["resolution"], canvas.width, canvas.height);

        glContext.uniform1f(currentProgram.uniforms["time"], time/1000);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, currentProgram.eBuff);
        glContext.drawElements(glContext.TRIANGLES, currentProgram.eLength, glContext.UNSIGNED_SHORT, 0);
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
    vec3.scale(camDirMovement,camDirMovement,moveSpeed);
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
            let teleRoomCamPos = worldCamPos;
    
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
                let teleRoomCamPos = worldCamPos;
                let goRoom0 = i == 2;
                let goRoom15 = i == 5;
                let roomId = -1;

                if(goRoom0){
                    roomId = 0;
                    teleRoomCamPos[2] = room.b[2] - intOffset*1.5;
                }

                if(goRoom15){
                    roomId = 15;
                    let roomSide = teleSide[15];
                    if(roomSide == 0){
                        mouse.x += .5/mouseSpeed;
                    }
                    if(roomSide == 2){
                        mouse.x -= .5/mouseSpeed;
                    }
                    teleRoomCamPos[2] = 2.;
                    teleRoomCamPos = prevRoomTele[roomSide](teleRoomCamPos);
                }

                gameState.roomId = roomId;

                if(!(goRoom0 || goRoom15)){
                    worldCamPos[i%3] = room.b[i] + intOffset * (i < 3 ? 1 : -1);
                } else {
                    worldCamPos[0] = teleRoomCamPos[0];
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

    drawFrame(time);
    window.requestAnimationFrame(render);
}

window.addEventListener("shaderloaded",gameStart);
loadUrlShaders();
