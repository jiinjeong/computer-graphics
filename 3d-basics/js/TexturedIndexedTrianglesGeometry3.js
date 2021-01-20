"use strict";
const TexturedIndexedTrianglesGeometry3 = function(gl, jsonObject) {
  this.gl = gl;

  const points = new Vec3Array(jsonObject.vertices);
  const normals = new Vec3Array(jsonObject.normals);  
  const uvs = new Vec2Array(jsonObject.uvs[0]);
  const faces = jsonObject.faces;

  this.n_faces = jsonObject.metadata.faces;
  this.indexCount = this.n_faces*3;

  const vertexData = new Vec3Array(65000);
  const normalData = new Vec3Array(65000);
  const uvData = new Vec2Array(65000);    
  const indexData = new Uint16Array(this.indexCount);

  const puvnToVertices = {};
  this.n_vertices = 0;
  for(let iIndex=0; iIndex<this.n_faces*3; iIndex++){
    const iPoint  = faces[Math.floor(iIndex/3)*11+1 + (iIndex%3)];
    const iTex    = faces[Math.floor(iIndex/3)*11+5 + (iIndex%3)];
    const iNormal = faces[Math.floor(iIndex/3)*11+8 + (iIndex%3)];
    const vertexCode = "" +
      iPoint + "#" + 
      iTex + "#" +
      iNormal;
    const iVertex = puvnToVertices[vertexCode];
    if(iVertex !== undefined) {
      indexData[iIndex] = iVertex;
    } else {
      vertexData.at(this.n_vertices).set( points.at(iPoint) );
      uvData.at(this.n_vertices).set( uvs.at(iTex) );
      normalData.at(this.n_vertices).set( normals.at(iNormal) );
      indexData[iIndex] = this.n_vertices;
      puvnToVertices[vertexCode] = this.n_vertices;
      this.n_vertices++;
    }
  }

  // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    vertexData.subarray(0, this.n_vertices).storage, 
    gl.STATIC_DRAW);

  this.vertexNormalBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, 
    normalData.subarray(0, this.n_vertices).storage, 
    gl.STATIC_DRAW);

  this.vertexTexCoordBuffer = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, 
    uvData.subarray(0, this.n_vertices).storage, 
    gl.STATIC_DRAW);
 
  // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indexData,
    gl.STATIC_DRAW);

  // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  ); 

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
  gl.enableVertexAttribArray(2); 
  gl.vertexAttribPointer(2, 
    2, gl.FLOAT, //< two pieces of float 
    false, //< do not normalize (make unit length) 
    0, //< tightly packed 
    0 //< data starts at array start 
  ); 

  gl.bindVertexArray(null);
};

TexturedIndexedTrianglesGeometry3.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

  gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
};
