const normalBuff = glContext.createBuffer();
glContext.bindBuffer(glContext.ARRAY_BUFFER,normalBuff);
const normal = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
 
    0, 0,-1,
    0, 0,-1,
    0, 0,-1,
    0, 0,-1,

    0,-1, 0,
    0,-1, 0,
    0,-1, 0,
    0,-1, 0,

   -1, 0, 0,
   -1, 0, 0,
   -1, 0, 0,
   -1, 0, 0,
];
glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(normal), glContext.STATIC_DRAW);

const texCoordBuff = glContext.createBuffer();
glContext.bindBuffer(glContext.ARRAY_BUFFER,texCoordBuff);
const texCoord = [
    1, 1,
    0, 1,
    0, 0,
    1, 0,

    1, 1,
    0, 1,
    0, 0,
    1, 0,

    0, 1,
    0, 0,
    1, 0,
    1, 1,

    0, 1,
    1, 1,
    1, 0,
    0, 0,

    1, 1,
    0, 1,
    0, 0,
    1, 0,

    1, 1,
    1, 0,
    0, 0,
    0, 1,
];
glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(texCoord), glContext.STATIC_DRAW);

const connectBuff = glContext.createBuffer();
const connect = [
     0, 1, 2, 
     0, 2, 3,

     4, 5, 6, 
     4, 6, 7,

     8, 9,10,
     8,10,11,

    12,13,14,
    12,14,15,

    16,17,18,
    16,18,19,

    20,21,22,
    20,22,23,
];
glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, connectBuff);
glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(connect), glContext.STATIC_DRAW);
