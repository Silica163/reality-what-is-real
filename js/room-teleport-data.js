let nextRoomTele = [
    function (p){
        return [ p[2], p[1], 2 - intOffset];
    },
    function (p){
        return [ p[0], p[1], 2 - intOffset];
    },
    function (p){
        return [ p[2], p[1], 2 - intOffset];
    }
];

let prevRoomTele = [
    function (p){
        return [-2 + intOffset, p[1], -p[0]];
    },
    function (p){
        return [             p[0], p[1], -2 + intOffset];
    },
    function (p){
        return [ 2 - intOffset, p[1],  p[0]];
    }
];

let teleSide = [
    0,1,2,1,
    2,1,0,1,
    1,2,2,0,
    0,1,0,2
];
function genMap(){
    for(let i in teleSide){
        let num = Math.floor(Math.random()*3);
        teleSide[i] = num;
    }
}

genMap();
