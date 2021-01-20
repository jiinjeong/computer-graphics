"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.rotationAxis = new Vec3();
  this.scale = new Vec3(1, 1, 1); 

  this.parent = null; 

  this.modelMatrix = new Mat4();

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

GameObject.prototype.updateModelMatrix = function(){
  // Uniforms.gameObject.animScale.set(1, 1);

  // Scale --> Rotate --> Translate
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation, this.rotationAxis).
    translate(this.position);

  if (this.parent) {
    this.parent.updateModelMatrix();
    this.modelMatrix.mul(this.parent.modelMatrix);
  }
};

GameObject.prototype.draw = function(camera){
	this.updateModelMatrix();
  Uniforms.gameObject.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
	this.mesh.draw();
};

// Draw shadow.
GameObject.prototype.drawShadow = function(camera, material){
  this.updateModelMatrix();
  this.modelMatrix.scale(new Vec3(1, 0, 1)).translate(new Vec3(0, 0.01, 0));
  Uniforms.gameObject.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Uniforms.gameObject.modelMatrix.set(this.modelMatrix);
  this.mesh.drawSelected(material);
}
