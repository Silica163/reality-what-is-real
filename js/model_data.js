// return values
// side: side where point is outside a box
function isPointInsideBox(point,box,offset = 0){
    var side = [
        point[0] > (box[0] - offset), // X+ plane
        point[1] > (box[1] - offset), // Y+
        point[2] > (box[2] - offset), // Z+
        point[0] < (box[3] + offset), // X- plane
        point[1] < (box[4] + offset), // Y-
        point[2] < (box[5] + offset), // Z-
    ];
    return side;
}

// return values
// intersect: true if outside a box
// side: side where point is inside a box
function isPointOutsideBox(point, box, boxPos, offset = 0){
    // vecter from boxPos to point
    var pr  = [
        point[0] - boxPos[0],
        point[1] - boxPos[1],
        point[2] - boxPos[2],
    ];
    var side = [
        pr[0] > abs(pr[1]) && pr[0] > abs(pr[2]) && point[0] < (box[0] + offset),
        pr[1] > abs(pr[0]) && pr[1] > abs(pr[2]) && point[1] < (box[1] + offset),
        pr[2] > abs(pr[0]) && pr[2] > abs(pr[1]) && point[2] < (box[2] + offset),
        -pr[0] > abs(pr[1]) && -pr[0] > abs(pr[2]) && point[0] > (box[3] - offset),
        -pr[1] > abs(pr[0]) && -pr[1] > abs(pr[2]) && point[1] > (box[4] - offset),
        -pr[2] > abs(pr[0]) && -pr[2] > abs(pr[1]) && point[2] > (box[5] - offset),
    ];

    return {
        side: side,
        intersect: 
        point[0] < (box[0] + offset) && // X+ plane
        point[1] < (box[1] + offset) && // Y+
        point[2] < (box[2] + offset) && // Z+
        point[0] > (box[3] - offset) && // X- plane
        point[1] > (box[4] - offset) && // Y-
        point[2] > (box[5] - offset), // Z-

    }
}

const unitCube = [
    [ 1, 1, 1], 
    [-1, 1, 1], 
    [-1,-1, 1],
    [ 1,-1, 1],

    [ 1, 1, 1],
    [-1, 1, 1],
    [-1, 1,-1],
    [ 1, 1,-1],

    [ 1, 1, 1],
    [ 1,-1, 1],
    [ 1,-1,-1],
    [ 1, 1,-1],

    [ 1, 1,-1],
    [-1, 1,-1],
    [-1,-1,-1],
    [ 1,-1,-1],

    [ 1,-1, 1],
    [-1,-1, 1],
    [-1,-1,-1],
    [ 1,-1,-1],

    [-1, 1, 1],
    [-1,-1, 1],
    [-1,-1,-1],
    [-1, 1,-1],
];

function cubeVertex(position, size){
    let out = [];
    for(let i in unitCube){
        let v = unitCube[i];
        out[i] = [
            size[0] * v[0] + position[0],
            size[1] * v[1] + position[1], 
            size[2] * v[2] + position[2]
        ];
    }
    return out;
}

const unitEdge = [1,1,1,-1,-1,-1];
function cubeEdge(position, size){
    let out = [0];
    for(let i in unitEdge){
        out[i] = position[i%3] + size[i%3]*unitEdge[i];
    }
    return out;
}

