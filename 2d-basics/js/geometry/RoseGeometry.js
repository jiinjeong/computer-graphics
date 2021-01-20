/******************************************************************************/
/* FILE   : RoseGeometry.js                                                   */
/* AUTHOR : Ethan Sorkin                                                      */
/* DESC   : Q2 (Rose-shape geometry for coat racks)                           */
/*                                                                            */
/******************************************************************************/

"use strict";
const RoseGeometry = function(gl) {
  this.gl = gl;

  /****************************** VERTEX BUFFER ******************************/
  // Equation for making rose-curve vertex points.
  var vertices = [0, 0, 0];
  var k = 4;
  for (var i = 0; i < 2*Math.PI + 0.01; i += 0.01) {
    vertices.push(Math.cos(k*i)*Math.cos(i));
    vertices.push(Math.cos(k*i)*Math.sin(i));
    vertices.push(0);
  }

  // Vertex buffer.
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  /****************************** INDEX BUFFER ******************************/
  // Equation for making rose-curve index points.
  var indices = [];
  for(var i = 0; i < vertices.length - 1; i += 1) {
    indices.push(0);
    indices.push(i);
    indices.push(i + 1);
  }

  // Index buffer.
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  /****************************** COLOR BUFFER ******************************/
  // Equation for making rose-curve color points.
  var colors = [];
  for (var i = 0; i < vertices.length; i += 1) {
    colors.push(1);
  }

  // Color buffer.
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

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

RoseGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  
  gl.drawElements(gl.TRIANGLES, 1890, gl.UNSIGNED_SHORT, 0);
};
