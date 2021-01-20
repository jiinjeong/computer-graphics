"use strict"; 
const MultiMesh3 = function(
  gl, jsonModelFileUrl, materials) {
  this.meshes = [];
  this.premodelMatrix = new Mat4();

  const request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", jsonModelFileUrl);
  request.onreadystatechange = () => {
    if (request.readyState == 4) {
      const json = JSON.parse(request.responseText).geometries;
      for (let i = 0; i < json.length; i++) {
        this.meshes.push(new Mesh(
          new TexturedIndexedTrianglesGeometry3(
            gl, json[i].data),
          materials[i]
        ));
      }
    }

  };
  request.send();
};

MultiMesh3.prototype.draw = function(){ 
  for (let i = 0; i < this.meshes.length; i++) { 
    this.meshes[i].draw(); 
  } 
}; 

MultiMesh3.prototype.drawSelected = function(material){ 
  for (let i = 0; i < this.meshes.length; i++) { 
    this.meshes[i].drawSelected(material); 
  } 
}; 
