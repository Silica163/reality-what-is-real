document.onpointerlockchange = function(e){
    if(document.pointerLockElement == null && pointer.enableLock){
        toggleMenu();
    }
};
document.addEventListener("keydown",control);
document.addEventListener("keyup",control);
function control(e){
    console.log(e.code);
    if(!e.defaultPrevented){
        var control = !gameState.dispMenu;
        var keyDown = (e.type == "keydown");
        switch(e.code){
            case "ArrowRight" : 
            case "KeyL" :
            case "KeyD":
                movement.x = keyDown&&control ? 1 : 0;
                break;
            case "ArrowLeft" :
            case "KeyJ" :
            case "KeyA" :
                movement.x = keyDown&&control ? -1 : 0;
                break;
            case "ArrowDown" :
            case "KeyK" :
            case "KeyS" :
                movement.z = keyDown&&control ? 1 : 0;
                break;
            case "ArrowUp" :
            case "KeyI" :
            case "KeyW":
                movement.z = keyDown&&control ? -1 : 0;
                break;
            default : 
                break ;
        }

        if(!control){
            movement.x = 0;
            movement.z = 0;
        }

        if(e.code == "KeyV" && !keyDown )cameraSettings.first_player = !cameraSettings.first_player;
        if(e.code == "KeyN" && !keyDown )cameraSettings.first_player = !cameraSettings.first_player;
        if(e.code == "KeyM" && !keyDown ){
            if(pointer.lock){
                document.exitPointerLock();
            }
            pointer.enableLock = !pointer.enableLock;
        }
        if(e.code == "Escape" && keyDown){
            if(gameState.dispMenu){
                document.exitPointerLock();
            }
            toggleMenu();
        }
/*        if(e.code == "KeyR" && e.type == "keyup"){
            worldCamPos[0] = 0;
            worldCamPos[1] = cameraSettings.y;
            worldCamPos[2] = 0;
        }*/
        if(e.code == "Semicolon" && keyDown){
            run = true || e.shiftKey;
        } else {
            run = false || e.shiftKey;
        }
//        if(e.code == "Space" && e.type == "keydown" && movement.y <= 0.)movement.y += 2.;
    }
}

function updateMouseObj(e){
    pointer.id = e.pointerId;
    mouseObj[0] = (2.*e.offsetX - canvas.width)/canvas.height;
    mouseObj[1] = -(2.*e.offsetY - canvas.height)/canvas.height;
    mouseObj[2] = e.buttons;
}

canvas.addEventListener("pointermove",e => {
    updateMouseObj(e);
    if(document.pointerLockElement !== canvas) pointer.lock = false;
    if(pointer.lock || (e.buttons && (!pointer.enableLock)) ){
        if(!gameState.dispMenu){
            mouse.x += e.movementX/canvas.height;
            mouse.y += e.movementY/canvas.height;
            mouse.y = Math.min(1,Math.max(-1,mouse.y));
        }
    }
});

canvas.addEventListener("pointerup",updateMouseObj);

canvas.addEventListener("pointerdown",(e)=>{
    updateMouseObj(e);
    
    if(!pointer.enableLock || gameState.dispMenu)return;
    canvas.requestPointerLock();
    pointer.lock = true;
});

function toggleMenu(){
    gameState.dispMenu = !gameState.dispMenu;
    gameState.renderMenuBg = 0;
}

