"use strict";
const Scene = function(gl) {
  this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");

  this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace);
  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);  

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.traceMaterial = new Material(gl, this.traceProgram);
  this.traceMaterial.envmap.set(new TextureCube(gl, [
    "media/envv/rt.png",
    "media/envv/lf.png",
    "media/envv/up.png",  // ft
    "media/envv/dn.png",  // bk, lf
    "media/envv/ft.png",
    "media/envv/bk.png"]
  	));

  this.traceMesh = new Mesh(this.texturedQuadGeometry, this.traceMaterial);
  this.sphereMesh = new MultiMesh(gl, "media/obj/sphere.json", [this.stripeProgram]);

  this.traceObj = new GameObject(this.traceMesh);

  this.gameObjects = [];
  this.gameObjects.push(this.traceObj);
  // this.gameObjects.push(this.sphere);

  this.camera = new PerspectiveCamera();

  this.sand = new Texture2D(gl, 'media/obj/sand3.jpg');

  // incrementally rendered object to demonstrate combining the incremental rendering and ray casting
  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.texturedProgram = new TexturedProgram(gl, this.vsTrafo, this.fsTextured);
  this.slowpokeMaterials = [
    new Material(gl, this.texturedProgram),
    new Material(gl, this.texturedProgram),
    ];
  this.slowpokeMaterials[0].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonDh.png'));
  this.slowpokeMaterials[1].colorTexture.set(
    new Texture2D(gl, 'media/slowpoke/YadonEyeDh.png'));  

  this.slowpokeMesh = new MultiMesh(
    gl,
    'media/slowpoke/Slowpoke.json',
    this.slowpokeMaterials
    );

  Uniforms.lighting.lightPosition.at(0).set(0, 1, 0, 0);  // Position of directional light.
  Uniforms.lighting.powerDensity.at(0).set(0.1, 0.1, 0.1);  // Density of directional light. Try with density (power & colors.

  Uniforms.lighting.lightPosition.at(1).set(1, 0, 0, 0);  // This is a directional light.
  Uniforms.lighting.powerDensity.at(1).set(0.3, 0.1, 0.1);  // Density of directional light. Try with density (power & colors.

  Uniforms.lighting.lightPosition.at(2).set(0, 0, 1, 0);  // This is a directional light.
  Uniforms.lighting.powerDensity.at(2).set(0.3, 0.3, 0.1);  // Density of directional light. Try with density (power & colors.

  /* DISCO */
  Uniforms.lighting.lightPosition.at(3).set(0, 50, 0, 1);  // This is a pointlight.
  // Uniforms.lighting.powerDensity.at(3).set(0, 1000, 1000);
  Uniforms.lighting.powerDensity.at(3).set(100, 100, 0);  // Density of directional light. Try with density (power & colors.

  Uniforms.scene.kds.at(0).set(0  , 0  , 0  , 0);
  Uniforms.scene.kss.at(0).set(0  , 0  , 0  , 0);
  Uniforms.scene.kds.at(1).set(1  , 1  , 0  , 1);
  Uniforms.scene.kss.at(1).set(2  , 2  , 0  , 5);
  Uniforms.scene.kds.at(2).set(0  , 0  , 1  , 1);
  Uniforms.scene.kss.at(2).set(2  , 2  , 5  , 15);
  Uniforms.scene.kds.at(3).set(0  , 0  , 1  , 1);
  Uniforms.scene.kss.at(3).set(1  , 1  , 10  , 15);
  Uniforms.scene.kds.at(4).set(0  , 0  , 1  , 1);
  Uniforms.scene.kss.at(4).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(5).set(0  , 0  , 1  , 1);
  Uniforms.scene.kss.at(5).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(6).set(0  , 0  , 1  , 1);
  Uniforms.scene.kss.at(6).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(7).set(1  , 0  , 0  , 1);
  Uniforms.scene.kss.at(7).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(8).set(1  , 0  , 0  , 1);
  Uniforms.scene.kss.at(8).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(9).set(1  , 0  , 0  , 1);
  Uniforms.scene.kss.at(9).set(1  , 1  , 1  , 15);
  Uniforms.scene.kds.at(10).set(0.9  , 0.7  , 0.1  , 1);
  Uniforms.scene.kss.at(10).set(6  , 6  , 5  , 5);
  Uniforms.scene.kds.at(11).set(0.1  , 1.0  , 0.1  , 1);
  Uniforms.scene.kss.at(11).set(5  , 6  , 5  , 5);

  Uniforms.scene.reflectances.at(0).set(0.5, 0.5, 0.5);

  gl.enable(gl.DEPTH_TEST);

  this.initial = true;
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false

  const timeAtThisFrame = new Date().getTime();

  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
  this.timeAtLastFrame = timeAtThisFrame;

  if (this.initial){
    this.tLastTurn = timeAtThisFrame;
    this.yStart = .5;
    this.move = .05;
    this.initial = false;
  }

  const lastTurn = (timeAtThisFrame - this.tLastTurn) / 1000.0;


  // clear the screen
  gl.clearColor(0.3, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);

  Uniforms.camera.position.set(this.camera.position);
  Uniforms.camera.viewProjMatrix.set(this.camera.viewProjMatrix);  
  Uniforms.trafo.rayDirMatrix.set(this.camera.rayDirMatrix);
  Uniforms.scene.sandImg.set(this.sand);

  const plane = new ClippedQuadric(
    Uniforms.scene.surfaces.at(0),
    Uniforms.scene.clippers.at(0));

  const cylinder = new ClippedQuadric(
    Uniforms.scene.surfaces.at(1),
    Uniforms.scene.clippers.at(1));

  const clippedSphere = new ClippedQuadric(
    Uniforms.scene.surfaces.at(2),
    Uniforms.scene.clippers.at(2));

  const sphere = new ClippedQuadric(
    Uniforms.scene.surfaces.at(3),
    Uniforms.scene.clippers.at(3));

  const cone1 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(4),
    Uniforms.scene.clippers.at(4));

  const cone2 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(5),
    Uniforms.scene.clippers.at(5));

  const cone3 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(6),
    Uniforms.scene.clippers.at(6));

  const cylinder1 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(7),
    Uniforms.scene.clippers.at(7));

  const cylinder2 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(8),
    Uniforms.scene.clippers.at(8));

  const cylinder3 = new ClippedQuadric(
    Uniforms.scene.surfaces.at(9),
    Uniforms.scene.clippers.at(9));

  const beach = new ClippedQuadric(
    Uniforms.scene.surfaces.at(10),
    Uniforms.scene.clippers.at(10));

  const pinking = new ClippedQuadric(
    Uniforms.scene.surfaces.at(11),
    Uniforms.scene.clippers.at(11));

  plane.setPlane();
  // clippedSphere.transform(new Mat4().scale(2.0, 1));
  plane.transformB(new Mat4().translate(0, -1));

  beach.setQuadric();
  beach.transform(new Mat4().scale(2.0));
  beach.transform(new Mat4().translate(0, -2.5));
  beach.transformB(new Mat4().translate(0, 3));

  // flotsam.setCargo();
  // flotsam.transform(new Mat4().scale(0.5, 0.5));
  // flotsam.transform(new Mat4().translate(-2, 5));
  // flotsam.transformB(new Mat4().translate(0, -2));

  sphere.setUnitSphere();
  sphere.transform(new Mat4().scale(0.5, 0.5));
  // sphere.transform(new Mat4().translate(0.0, 2.0));

  pinking.setUnitSphere();
  pinking.transform(new Mat4().translate(4.5, 3.5));

  cylinder.setUnitCylinder();
  clippedSphere.setClippedSphere();

  cone1.setUnitCone();
  cone1.transform(new Mat4().scale(0.5, 0.5));
  cone1.transform(new Mat4().rotate(Math.PI, 0));
  cone1.transform(new Mat4().translate(2.0, 2.8));
  cone2.setUnitCone();
  cone2.transform(new Mat4().scale(0.5, 0.5));
  cone2.transform(new Mat4().rotate(Math.PI, 0));
  cone2.transform(new Mat4().translate(0.0, 2.8));
  cone3.setUnitCone();
  cone3.transform(new Mat4().scale(0.5, 0.5));
  cone3.transform(new Mat4().rotate(Math.PI, 0));
  cone3.transform(new Mat4().translate(1.0, 3.8));

  cylinder1.setUnitCylinder();
  cylinder1.transform(new Mat4().scale(0.5, 0.5));
  cylinder1.transform(new Mat4().translate(2.0, 1.8));
  cylinder2.setUnitCylinder();
  cylinder2.transform(new Mat4().scale(0.5, 0.5));
  cylinder2.transform(new Mat4().translate(0.0, 1.8));
  cylinder3.setUnitCylinder();
  cylinder3.transform(new Mat4().scale(0.5, 1.5));
  cylinder3.transform(new Mat4().translate(1.0, 1.8));
  // cylinder4.setUnitCylinder();
  // cylinder4.transform(new Mat4().translate(-2.0, 2.5));

  clippedSphere.transform(new Mat4().scale(2.0, 1));
  clippedSphere.transformB(new Mat4().translate(0, 2.5));
  clippedSphere.transform(new Mat4().rotate(0.2, 0));
  clippedSphere.transform(new Mat4().translate(-3.0, 3.0));

  sphere.transform(new Mat4().rotate(.4));
  sphere.transform(new Mat4().translate(0, 4));

  sphere.transform(new Mat4().translate(0, this.yStart + this.move));
  this.yStart += this.move;
  if (lastTurn > 1){
    this.move *= -1;
    this.tLastTurn = timeAtThisFrame;
  }
  // rot
  cylinder.transform(new Mat4().scale(.1, 1.5, 1));
  cylinder.transform(new Mat4().rotate(0.2, 0));
  cylinder.transform(new Mat4().translate(-3.0, 2.7));

  // sphere.transform(new Mat4().translate(0, ));

  for(let i=0; i<this.gameObjects.length; i++){
    this.gameObjects[i].draw(this.camera);
  }
};
