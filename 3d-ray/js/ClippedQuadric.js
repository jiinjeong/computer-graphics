const ClippedQuadric = function(A, B) {
  this.A = A;
  this.B = B;
}

ClippedQuadric.prototype.setUnitSphere = function(){
  this.A.set(
  	1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.B.set(
  	0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCylinder = function(){
  this.A.set(
  	1, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.B.set(
  	0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setClippedSphere = function(){
  this.A.set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
  this.B.set(
    0, 0, 0, 0,
    0, 5, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -2);

  // Horizontal plane
   // this.B.set(
   //  0, -1, 0, 0,
   //  0, -1, 0, 0,
   //  0, -1, 0, 0,
   //  0, -5, 0, 0);
}

ClippedQuadric.prototype.setUnitCone = function(){
  this.A.set(
    -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 0);
  this.B.set(
    0, 0, 0, 0,
    0, 1, 0, -0.5,
    0, 0, 0, 0,
    0, -0.5, 0, 0);
}

ClippedQuadric.prototype.setPlane = function(){
  this.A.set(
    0, 0, 0, 0,
    0, 5, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -2);
  this.B.set(
    0, 0, 0, 0,
    0, 5, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -2);
}

ClippedQuadric.prototype.setQuadric = function(){
  this.A.set(
    1, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -9);
  this.B.set(
    0, 0, 0, 0,
    0, 5, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -2);
}

ClippedQuadric.prototype.setCargo = function(){
  this.A.set(
    1, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -9);
  this.B.set(
    0, 0, 0, 0,
    0, 5, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -2);
}

ClippedQuadric.prototype.transform = function(T){
  T.invert();    // T is now T-1
  this.A.premul(T);   // A is now T-1 * A
  this.B.premul(T);   // A is now T-1 * A
  T.transpose(); // T is now T-1T
  this.A.mul(T);      // A is now A'
  this.B.mul(T);      // A is now A'
}

ClippedQuadric.prototype.transformB = function(T){
  T.invert();    // T is now T-1
  this.B.premul(T);   // A is now T-1 * A
  T.transpose(); // T is now T-1T
  this.B.mul(T);      // A is now A'
}
