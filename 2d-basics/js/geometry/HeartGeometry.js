/******************************************************************************/
/* FILE   : HeartGeometry.js                                                  */
/* AUTHOR : Jiin Jeong                                                        */
/* DESC   : Q2 (Heart curve geometry for beanbags)                            */
/*                                                                            */
/******************************************************************************/

"use strict";

const HeartGeometry = function(gl) {
  this.gl = gl;

  /****************************** VERTEX BUFFER ******************************/
  // Equation for making heart vertex points.
  let points = [0, 0, 0];
  var phi;
  for (phi = 0; phi <= 2 * (Math.PI); phi += ((Math.PI) / 32)) { 
    points.push(16 * (Math.sin(phi))** 3,
                13 * Math.cos(phi) - 5 * Math.cos(2 * phi) - 2 * Math.cos(3 * phi) - Math.cos(4 * phi),
                0);
  }

  // Vertex buffer (vertex position).
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(points),
    gl.STATIC_DRAW);

  /****************************** INDEX BUFFER ******************************/
  // Equation for making heart index points.
  let i;
  let indexPoints = [];
  for (i = 0; i < 64; i++) { 
    indexPoints.push(0, i + 1, i + 2);
  }

  // Index buffer.
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexPoints),
    gl.STATIC_DRAW);

  /****************************** COLOR BUFFER ******************************/
  // Equation for making heart color points.
  let q = 0;
  let colorPoints = [];
  while (q < 66){
    colorPoints.push(1.0, 1.0, 1.0);
    q += 1;
  }

  // Color buffer.
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(colorPoints),
    gl.STATIC_DRAW);

  /****************************** BINDINGS ******************************/
  // Binds input layout with input buffer bindings.
  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindVertexArray(null);
};

HeartGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, 192, gl.UNSIGNED_SHORT, 0);
};