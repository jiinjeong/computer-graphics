"use strict"; 
const GameObject = function(mesh, type) { 
  this.mesh = mesh;
  this.type = type;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 

  this.parent = null; 

  this.move = function(){};
  this.control = function(){};
  this.force = new Vec3();
  this.torque = 0;
  this.velocity = new Vec3();
  this.invMass = 1;
  this.backDrag = 1;
  this.sideDrag = 1;
  this.invAngularMass = 1;
  this.angularVelocity = 0;
  this.angularDrag = 1;
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
    translate(this.position);

  if (this.parent) {
    this.parent.updateModelMatrix();
    this.modelMatrix.mul(this.parent.modelMatrix);
  }
};

GameObject.prototype.draw = function(camera){ 

  this.updateModelMatrix();
  Uniforms.trafo.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.draw(); 
};

// Draws object with the selection material.
GameObject.prototype.drawSelected = function(camera, material){
  this.updateModelMatrix();
  Uniforms.trafo.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.drawSelected(material);
}
