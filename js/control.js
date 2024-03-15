window.addEventListener("keydown",moveCamera);
window.addEventListener("keyup",moveCamera);
function moveCamera(e){
    console.log(e.code);
    if(!e.defaultPrevented){
        var move = false;
        if(e.type == "keydown")move = true;
        switch(e.code){
            case "ArrowRight" : 
            case "KeyL" :
            case "KeyD":
                movement.x = move ? 1 : 0;
                break;
            case "ArrowLeft" :
            case "KeyJ" :
            case "KeyA" :
                movement.x = move ? -1 : 0;
                break;
            case "ArrowDown" :
            case "KeyK" :
            case "KeyS" :
                movement.z = move ? 1 : 0;
                break;
            case "ArrowUp" :
            case "KeyI" :
            case "KeyW":
                movement.z = move ? -1 : 0;
                break;
            default : 
                break ;
        }

        if(e.code == "KeyV" && e.type == "keyup")cameraSettings.first_player = !cameraSettings.first_player;
        if(e.code == "KeyM" && e.type == "keyup")enableLock = !enableLock;
        if(e.code == "KeyR" && e.type == "keyup"){
            worldCamPos[0] = 0;
            worldCamPos[1] = .5;
            worldCamPos[2] = 0;
        }
//        if(e.code == "Space" && e.type == "keydown" && movement.y <= 0.)movement.y += 2.;
    }
}

canvas.addEventListener("mousemove",e => {
    if(document.pointerLockElement !== canvas) pointerLock = false;
    if(pointerLock || (e.buttons && (!enableLock)) ){
        mouse.x += e.movementX/glContext.canvas.height;
        mouse.y += e.movementY/glContext.canvas.height;
        mouse.y = Math.min(1,Math.max(-1,mouse.y));
    } else {
/*        if(enableLock){
            mouse = {
                x:(2.*e.x-glContext.canvas.width)/glContext.canvas.height,
                y:(2.*e.y-glContext.canvas.height)/glContext.canvas.height
            };
        }*/
    }
});


canvas.addEventListener("mousedown",(e)=>{
    if(!enableLock)return;
    canvas.requestPointerLock();
    pointerLock = true;
});

