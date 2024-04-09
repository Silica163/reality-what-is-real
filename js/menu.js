function toggleMenu(){
    gameState.dispMenu = !gameState.dispMenu;
    gameState.renderMenuBg = 0;
}

const 
MENU_NONE = -1,
MENU_PLA = 0,
MENU_QUI = 1,
MENU_CTR = 2,
MENU_CRE = 3,
MENU_HTP = 4,
MENU_BAC = 5;

const menuItems = {
    0:[
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE, MENU_CRE, MENU_QUI,
         MENU_CTR, MENU_HTP, MENU_PLA,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
    ],
    1:[
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE, MENU_QUI, 
         MENU_CTR, MENU_PLA,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
    ],
    2:[
        MENU_NONE,MENU_NONE,MENU_NONE, MENU_BAC,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
    ],
    3:[
        MENU_NONE,MENU_NONE,MENU_NONE, MENU_BAC,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
    ],
    4:[
        MENU_NONE,MENU_NONE,MENU_NONE, MENU_BAC,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
        MENU_NONE,MENU_NONE,MENU_NONE,MENU_NONE,
    ]
}

const 
MTYPE_MAIN = 0,
MTYPE_ESC = 1,
MTYPE_CTRL = 2,
MTYPE_HTP = 3,
MTYPE_CREDIT = 4,
MTYPE_DIALOG = 5;

function menuClick(){
    const m = {x:mouseObj[0],y:mouseObj[1]};
    if(m > 1 || m < -1) return;
    m.y = floor(m.y*8)+8.;
    if(!gameState.dispMenu)return;
    const btn = menuItems[gameState.menuType][m.y];
    switch(btn){
        case MENU_PLA:
            toggleMenu();
            gameState.menuType = MTYPE_ESC;
            break;
        case MENU_QUI:
            gameState.menuType = MTYPE_MAIN;
            gameReset();
            break;
        case MENU_CTR:
            gameState.menuType = MTYPE_CTRL;
            menuData[1] = menuData[0];
            break;
        case MENU_BAC:
            gameState.menuType = menuData[1];
            menuData[0] = menuData[1];
            break;
        case MENU_CRE:
            gameState.menuType = MTYPE_CREDIT;
            menuData[1] = menuData[0]
            break;
        case MENU_HTP:
            gameState.menuType = MTYPE_HTP;
            menuData[1] = menuData[0];
            break;
        case MENU_NONE:
            break;
    }
    menuData[0] = gameState.menuType;
}
