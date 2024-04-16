let roomChangeEvent = new CustomEvent("roomchange");

const DIALOG_BLANK = 19;

const roomDiagData = {
    "0": {
        min:0,
        max:2,
        displayed:false
    },
    "1": {
        min:3,
        max:4,
        displayed:false
    },
    "8": {
        min:5,
        max:6,
        displayed:false
    },
    "15": {
        min:7,
        max:8,
        displayed:false
    },
    "-1": {
        min:9,
        max:14,
        displayed:false
    },
    "15-bonus":{
        min:15,
        max:17,
        displayed: false,
    },
    "-2": {
        min:18,
        max:18,
        displayed:false
    },
    "__dpList":['0','1','8','15','-1',"15-bonus",'-2']
};

const diagDelays = {
    2:2000,
    4:1500,
    3:500,
    5:500,
    7:500,
    9:500,
    12:15000,
    14:1000,
    17:500,
};

function dialogReset(){
    for(let i in roomDiagData){
        roomDiagData[i].displayed = false;
    }
}

function isDialogInRoom(diagId){
    let r = false;
    let roomId = gameState.roomId.toString();

    if(roomId == "15" && gameState.bonus == 1){
        roomId += "-bonus";
    }

    if(roomId in roomDiagData){
        if(!roomDiagData[roomId].displayed){
            if(roomDiagData[roomId].min <= diagId && roomDiagData[roomId].max >= diagId){
                r = true;
            }
        }
    }
    return r;
}

function completeDialogInRoom(roomId){
    roomId = roomId.toString();

    if(roomId == "15" && gameState.bonus == 1){
        roomId += "-bonus";
    }

    let diagListIdx = roomDiagData["__dpList"].indexOf(roomId);

    if(roomId in roomDiagData){
        roomDiagData[roomId].displayed = true;
    }

    if(diagListIdx != -1 && diagListIdx < roomDiagData["__dpList"].length - 1 && !roomDiagData[roomDiagData["__dpList"][diagListIdx + 1]].displayed){
        menuData[2] = roomDiagData[roomId].max;
    }
}

function nextDialog(){
    let dialogNow = menuData[2];
    if(dialogNow == DIALOG_BLANK){
        dialogNow = menuData[3];
    }
    dialogNow ++;
    if(isDialogInRoom(dialogNow)){
        if(dialogNow in diagDelays && !gameTime.delaySet){
            displayDelayDialog(diagDelays[dialogNow]);
        } else {
            menuData[2] = dialogNow;
            if(dialogNow == 6){
                gameState.dispDialog = false;
            } else {
                gameState.dispDialog = true;
            }
        }
    } else {
        completeDialogInRoom(gameState.roomId);
        gameState.dispDialog = false;
    }
}

function displayDelayDialog(ms){
    delayDialog(ms);
}

function delayDialog(ms){
    let delaySet = gameTime.delaySet;

    function nextDelay(){
        if(gameTime.delaySet){
            nextDialog();
            gameTime.delaySet = false;
        }
    }

    if(!delaySet){
        gameState.dispDialog = false;
        gameTime.delaySet = true;
        gameTime.timeOut = setTimeout(nextDelay,ms);
    }
}

function blankDialog(){
    menuData[3] = menuData[2];
    menuData[2] = DIALOG_BLANK;
}

function roomChange(e){
    let oldRoomId = e.detail;
    completeDialogInRoom(oldRoomId);
    nextDialog();
}
