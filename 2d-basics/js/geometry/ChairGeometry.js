/******************************************************************************/
/* FILE   : ChairGeometry.js                                                  */
/* AUTHOR : Henry Cohen                                                       */
/* DESC   : Q1 (Rectangle geometry for chairs)                                */
/*                                                                            */
/******************************************************************************/

"use strict";

const ChairGeometry = function(gl) {
  this.gl = gl;

  // Vertex buffer (vertex position).
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
        0,  0, 0.5,
       .5,  0, 0.5,
        0, .5, 0.5,
       .5, .5, 0.5,
      -.1,  0, 0.5,
      -.2,  0, 0.5,
      -.1, .5, 0.5,
      -.2, .5, 0.5,
    ]),
    gl.STATIC_DRAW);

  // Index buffer.
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      1, 2, 3,
      4, 5, 6,
      5, 6, 7,
    ]),
    gl.STATIC_DRAW);

  // Color buffer.
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW);

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

ChairGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
};
