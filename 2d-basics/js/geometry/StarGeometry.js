/******************************************************************************/
/* FILE   : StarGeometry.js                                                   */
/* AUTHOR : Ethan Sorkin                                                      */
/* DESC   : Q2 (Star-shape geometry for plants)                               */
/*                                                                            */
/******************************************************************************/

"use strict";

const StarGeometry = function(gl) {
  this.gl = gl;

  /****************************** VERTEX BUFFER ******************************/
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      -0.5, -0.35, 0,
       0.5, -0.35, 0,
         0,  0.65, 0,

      -0.5,  0.35, 0,
       0.5,  0.35, 0,
         0, -0.65, 0,  
    ]),
    gl.STATIC_DRAW);

  /****************************** INDEX BUFFER ******************************/
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      3, 4, 5,
    ]),
    gl.STATIC_DRAW);

  /****************************** COLOR BUFFER ******************************/
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
       1, 1, 1,
       1, 1, 1,
       1, 1, 1,
       1, 1, 1,
       1, 1, 1,
       1, 1, 1,
    ]),
    gl.STATIC_DRAW);

  /****************************** BINDINGS ******************************/
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

StarGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
