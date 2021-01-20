/******************************************************************************/
/* FILE   : Mesh.js                                                           */
/* DESC   : Creates mesh with given geometry and material.                    */
/*                                                                            */
/******************************************************************************/

"use strict"; 
const Mesh = function(geometry, material){
  this.geometry = geometry;
  this.material = material;
};
 
Mesh.prototype.draw = function(){
  this.material.commit();
  this.geometry.draw();
};

Mesh.prototype.drawSelected = function(material){
  material.commit();
  this.geometry.draw();
}
