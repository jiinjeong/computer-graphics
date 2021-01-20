/******************************************************************************/
/* FILE   : GameObject.js                                                     */
/* DESC   : Creates game object using mesh.                                   */
/*                                                                            */
/******************************************************************************/

"use strict"; 

const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1);
  this.modelMatrix = new Mat4();
  this.children = [];
  this.parents = null;
  this.waving = false;
  this.selectStatus = false
  this.deleteStatus = true
};

GameObject.prototype.updateModelMatrix = function(){
  this.modelMatrix.set();
  this.modelMatrix.scale(this.scale);
  this.modelMatrix.rotate(this.orientation);
  this.modelMatrix.translate(this.position);
};

GameObject.prototype.draw = function(camera){
	this.updateModelMatrix();
	this.mesh.material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);  // Name of uniform.
	this.mesh.draw();
}

// ------------ #5. Selection (Jiin Jeong) ------------
// Draws object with the selection material.
GameObject.prototype.drawSelected = function(camera, material){
  this.updateModelMatrix();
  material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);  // Name of uniform.
  this.mesh.drawSelected(material);
}
