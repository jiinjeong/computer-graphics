/******************************************************************************/
/* FILE   : MiniCamera.js                                                     */
/* AUTHOR : Jiin Jeong                                                        */
/* DESC   : Camera for the minimap.                                           */
/*                                                                            */
/******************************************************************************/

const MiniCamera = function() { 
  this.position = new Vec2(0, 0); 
  this.rotation = 0; 
  this.windowSize = new Vec2(5, 5); 
  
  this.viewProjMatrix = new Mat4(); 
  this.updateViewProjMatrix(); 
};

MiniCamera.prototype.updateViewProjMatrix = function(){ 
  this.viewProjMatrix.set(). 
    scale(0.5). 
    scale(this.windowSize). 
    rotate(this.rotation). 
    translate(this.position). 
    invert(); 
}; 

MiniCamera.prototype.setAspectRatio = function(ar) 
{ 
  this.windowSize.x = this.windowSize.y * ar;
  this.updateViewProjMatrix();
}; 
