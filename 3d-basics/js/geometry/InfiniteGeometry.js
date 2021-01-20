"use strict";
const InfiniteGeometry = function(gl) {
  this.gl = gl;

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER,
    // Vertex position
    new Float32Array([
      0, 0, 0, 1,  // Origin
      1, 0, 0, 0,   // Infinity in direction of x
      0, 0, 1, 0,   // Infinity to z
      -1, 0, 0, 0,  // Infinity to opposite direction
      0, 0, -1, 0,  // Infinity to opposiste direction
    ]),
    gl.STATIC_DRAW);

  this.vertexNormalBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array([ 
      0, 0, 1, 
      0, 0, 1, 
      0, 0, 1, 
      0, 0, 1, 
      0, 0, 1, 
    ]), 
    gl.STATIC_DRAW); 

  this.vertexTexCoordBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array([ 
      0, 0, 0, 1, 
      1, 0, 0, 0, 
      0, 1, 0, 0,
      -1, 0, 0, 0, 
      0, -1, 0, 0,
    ]), 
    gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,  // Connect using triangles.
      0, 2, 3, 
      0, 3, 4,
      0, 4, 1,
    ]),
    gl.STATIC_DRAW);

  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    4, gl.FLOAT, //< four pieces of float
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.enableVertexAttribArray(1); 
  gl.vertexAttribPointer(1, 
    3, gl.FLOAT, //< three pieces of float 
    false,
    0,
    0
  ); 

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.enableVertexAttribArray(2); 
  gl.vertexAttribPointer(2, 
    4, gl.FLOAT, //< four pieces of float 
    false, 
    0,
    0
  );

  gl.bindVertexArray(null);
};

InfiniteGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

  gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
};
