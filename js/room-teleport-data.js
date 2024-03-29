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
        return [-p[2] + intOffset, p[1], -p[0]];
    },
    function (p){
        return [             p[0], p[1], -p[2] + intOffset];
    },
    function (p){
        return [ p[2] - intOffset, p[1],  p[0]];
    }
];

let teleSide = [
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1
];
function genMap(){
    for(let i in teleSide){
        let num = Math.round(Math.random()*100.) % 3;
        teleSide[i] = num;
    }
}

genMap();
