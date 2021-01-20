/******************************************************************************/
/* FILE   : Scene.js                                                          */
/* AUTHOR : Jiin Jeong                                                        */
/* DESC   : Main program.                                                     */
/*                                                                            */
/******************************************************************************/

"use strict";

const Scene = function(gl) {

  // ------------ Shaders ------------ 
  this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");

  this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background_vs.essl");

  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  // ------------ Programs ------------
  this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);
  this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsTextured);  
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  // ------------ Geometries & Materials ------------ 
  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.tileGeometry = new TileGeometry(gl);

  // Material for movable objects.
  this.backgroundMaterial = new Material(gl, this.backgroundProgram);
  this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/background.jpg"));
  this.raiderMaterial = new Material(gl, this.texturedProgram);
  this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/raider.png"));
  this.jewelMaterial = new Material(gl, this.texturedProgram);
  this.jewelMaterial.colorTexture.set(new Texture2D(gl, "media/jewel.png"));
  this.enemyMaterial = new Material(gl, this.texturedProgram);
  this.enemyMaterial.colorTexture.set(new Texture2D(gl, "media/enemy.png"))

  // Material for gem tiles.
  this.tileMaterial = new Material(gl, this.solidProgram);
  this.tileMaterial.solidColor.set(0, 0, 0.9, 0.25);
  this.blueJewelMaterial = new Material(gl, this.texturedProgram);
  this.blueJewelMaterial.colorTexture.set(new Texture2D(gl, "media/blue.png"))
  this.greenJewelMaterial = new Material(gl, this.texturedProgram);
  this.greenJewelMaterial.colorTexture.set(new Texture2D(gl, "media/green.png"))
  this.orangeJewelMaterial = new Material(gl, this.texturedProgram);
  this.orangeJewelMaterial.colorTexture.set(new Texture2D(gl, "media/orange.png"))
  this.purpleJewelMaterial = new Material(gl, this.texturedProgram);
  this.purpleJewelMaterial.colorTexture.set(new Texture2D(gl, "media/purple.png"))
  this.yellowJewelMaterial = new Material(gl, this.texturedProgram);
  this.yellowJewelMaterial.colorTexture.set(new Texture2D(gl, "media/yellow.png"))

  // ------------ Mesh ------------
  this.backgroundMesh = new Mesh(this.texturedQuadGeometry, this.backgroundMaterial);
  this.raiderMesh = new Mesh(this.texturedQuadGeometry, this.raiderMaterial);
  this.jewelMesh = new Mesh(this.texturedQuadGeometry, this.jewelMaterial);
  this.enemyMesh = new Mesh(this.texturedQuadGeometry, this.enemyMaterial);

  this.tileMesh = new Mesh(this.tileGeometry, this.tileMaterial);
  this.blueJewelMesh = new Mesh(this.texturedQuadGeometry, this.blueJewelMaterial);
  this.greenJewelMesh = new Mesh(this.texturedQuadGeometry, this.greenJewelMaterial);
  this.orangeJewelMesh = new Mesh(this.texturedQuadGeometry, this.orangeJewelMaterial);
  this.purpleJewelMesh = new Mesh(this.texturedQuadGeometry, this.purpleJewelMaterial);
  this.yellowJewelMesh = new Mesh(this.texturedQuadGeometry, this.yellowJewelMaterial);

  // ------------ Game Objects ------------
  this.gameObjects = [];
  this.selectedObjects = [];
  this.tileGrid = [];
  
  this.background = new GameObject( this.backgroundMesh );

  this.avatar = new GameObject( this.raiderMesh );
  this.avatar.position.set(20, 20);

  this.enemy = new GameObject( this.enemyMesh );

  this.gameObjects.push(this.background, this.avatar, this.enemy);

  //------------ Tiles & Objects ------------
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      this.tile = new GameObject(this.tileMesh);
      this.tile.position.set(i + 23, j + 16);
      this.tile.scale.set(0.4, 0.4, 1);
      this.gameObjects.push(this.tile);
    }
  }

  /************** 1 - GRID **************/
  // Randomly create grid (array of arrays).
  for (let i = 0; i < 10; i++) {
    let tileRow = [];
    for (let j = 0; j < 10; j++) {
      this.type = getRandomInt(5);

      if(this.type == 0) {
        this.obj = new GameObject(this.blueJewelMesh);
        this.obj.type = "BLUE";
        this.obj.scale.set(0.4, 0.4, 1);
      }

      if(this.type == 1) {
        this.obj = new GameObject(this.greenJewelMesh);
        this.obj.type = "GREEN";
        this.obj.scale.set(0.4, 0.4, 1);
      }

      if(this.type == 2) {
        this.obj = new GameObject(this.orangeJewelMesh);
        this.obj.type = "ORANGE";
        this.obj.scale.set(0.4, 0.4, 1);
      }

      if(this.type == 3) {
        this.obj = new GameObject(this.purpleJewelMesh);
        this.obj.type = "PURPLE";
        this.obj.scale.set(0.4, 0.4, 1);
      }

      if(this.type == 4) {
        this.obj = new GameObject(this.yellowJewelMesh);
        this.obj.type = "YELLOW";
        this.obj.scale.set(0.4, 0.4, 1);
      }

      this.obj.position.set(i + 23, j + 16);
      this.obj.logicalPosition = new Vec2(i + 23, j + 16);

      this.gameObjects.push(this.obj);

      // List of tile object types (useful for type checking).
      tileRow.push(this.obj);
    };
    this.tileGrid.push(tileRow);
  };

  // ------------ Camera, Time, and Setting ------------
  this.camera = new OrthoCamera();

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);

  // ------------ Movement ------------
  const genericMove = function(t, dt){

    // ACCELERATION
    const acceleration = new Vec3(this.force).mul(this.invMass);
    this.velocity.addScaled(dt, acceleration);

    // ROTATION
    const angularAcceleration = this.torque * this.invAngularMass;
    this.angularVelocity += dt * angularAcceleration;;
    this.orientation += dt * this.angularVelocity;

    // DRAG & DIRECTIONAL DRAG
    this.velocity.mul(Math.pow(this.backDrag, dt));
    this.angularVelocity *= Math.pow(this.angularDrag, dt);

    const ahead = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation), 0);
    const aheadVelocity = ahead.times(ahead.dot(this.velocity))
    const sideVelocity = this.velocity.minus(aheadVelocity);
    this.velocity = new Vec3(0, 0, 0);
    this.velocity.addScaled(Math.pow(this.backDrag, dt), aheadVelocity);
    this.velocity.addScaled(Math.pow(this.sideDrag, dt), sideVelocity);

    this.position.addScaled(dt, this.velocity);
  };

  /************** 2 - PATH ANIMATION **************/
  const eggMove = function(t, dt){
    this.position.x = 15 + (.5*Math.cos(t) + (.5 + .7 *Math.cos(t)) * Math.cos(t));
    this.position.y = 15 + (.5 + .7*Math.cos(t)) * Math.sin(t);
    // Enemy velocity to set orientation. (Derivative gives you the velocity; second der gives acceleration).
    let velocity_x = (-.5 * Math.sin(t) - (.5 + .7 * Math.cos(t))*Math.sin(t) - .7 * Math.cos(t) * Math.cos(t));
    let velocity_y = (.5 + .7 * Math.cos(t))*Math.cos(t) + (-.7*Math.sin(t)) * Math.sin(t);
    this.orientation = Math.atan2(velocity_y, velocity_x);
  }

  // ------------ Control ------------
  this.avatar.control = function(t, dt, keysPressed, colliders){
    this.thrust = 0;
    this.sideThrust = 0;

    /************** 3 - ROCKET SCIENCE, 4 - TILT, 5 - DENSE ATMOSPHERE **************/
    // Up-down direction.
    if(keysPressed.UP) {
      this.thrust += 3;
    } 
    if(keysPressed.DOWN) {
      this.thrust -= 3;
    }

    // Side direction.
    if(keysPressed.LEFT){
      this.sideThrust -= 3;
    }
    if(keysPressed.RIGHT){
      this.sideThrust +=3;
    }

    // Tilt.
    this.torque = 0;
    if(keysPressed.L) {
      this.torque += 3;
    }
    if(keysPressed.R) {
      this.torque -= 3;
    }

    const ahead = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation), 0);
    this.force.set(ahead).mul(this.thrust);
    const sideAhead = new Vec3(Math.sin(this.orientation), -Math.cos(this.orientation), 0);
    this.force.addScaled(this.sideThrust, sideAhead);
  }

  // ------------ Game Movement ------------
  // Jewel.
  for (let i=0; i < 64; i++) {
    const jewel = new GameObject( this.jewelMesh );
    jewel.position.setRandom(new Vec3(5, 5, 0.5), new Vec3(35, 25, 0.5) );
    jewel.velocity.setRandom(new Vec3(-2, -2, 0), new Vec3(2, 2, 0));
    jewel.scale.set(0.5, 0.5, 1);
    jewel.angularVelocity = Math.random(-2, 2);
    this.gameObjects.push(jewel);
    
    jewel.move = genericMove;
  }

  this.avatar.backDrag = 0.5;
  this.avatar.sideDrag = 0.5;
  this.avatar.angularDrag = 0.5;

  this.avatar.move = genericMove;
  this.enemy.move = eggMove;

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
};


Scene.prototype.update = function(gl, keysPressed) {

  // ------------ Time ------------
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
  this.timeAtLastFrame = timeAtThisFrame;

  // ------------ Clears screen. ------------
  gl.clearColor(0.3, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ------------ Control & Move ------------
  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].control(t, dt, keysPressed, this.gameObjects);
  }

  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].move(t, dt);
  }

  /************** 6 - ORTHOCAM **************/
  this.camera.position = this.avatar.position;
  this.camera.updateViewProjMatrix();

  Uniforms.trafo.viewProjMatrixInverse.set(this.camera.viewProjMatrix).invert();

  /************** 7 - TURN THE TABLES **************/
  if (keysPressed.A){
    this.camera.rotation += 0.01;
    this.camera.updateViewProjMatrix();
  }

  if (keysPressed.D){
    this.camera.rotation -= 0.01;
    this.camera.updateViewProjMatrix();
  }

  if (keysPressed.Z){
    this.camera.windowSize.mul(0.99, 0.99);
    this.camera.updateViewProjMatrix();
  }

  if (keysPressed.X){
    this.camera.windowSize.mul(1.01, 1.01);
    this.camera.updateViewProjMatrix();
  }

  /************** 8 - QUAKE **************/
  if (keysPressed.Q){
    this.camera.position.x += Math.sin(120 * t);
    this.camera.position.y += Math.sin(120 * t);

    // 0.1% probability.
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.randomInt = getRandomInt(1000);
        if (this.randomInt == 806 && !(this.tileGrid[i][j].dead)) {
            this.tileGrid[i][j].dead = true;
            // Adds an invisible object.
            this.invisibleTile = new GameObject(this.invisibleMesh);
            this.invisibleTile.position.set(i + 23, j + 16);
            this.invisibleTile.scale.set(0.4, 0.4, 1);
            this.tileGrid[i][j] = this.invisibleTile;
        }
      }
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // ------------ Draw objects ------------
  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

  /************** 9 - DRAMATIC EXIT **************/
  for (let i = 0; i < this.gameObjects.length; i++) {
    if (this.gameObjects[i].dead){
      this.gameObjects[i].scale.x -= 0.025;
      this.gameObjects[i].scale.y -= 0.025;
      this.gameObjects[i].orientation += 0.25;
    }
  }

  // Delete from game obj.
  for (let i = 0; i < this.gameObjects.length; i ++){
    if (this.gameObjects[i].dead && this.gameObjects[i].scale.x < 0){
      this.gameObjects.splice(i, 1);
    }
  }
};

/************** 10 - SWAP **************/
Scene.prototype.selectionMouse = function(event, keysPressed){
  var canvas = document.getElementById("canvas");
  var selectX = (event.clientX / canvas.width - 0.5) * 2;
  var selectY = (event.clientY / canvas.height - 0.5) * (-2);

  let vpi = new Mat4(this.camera.viewProjMatrix).invert();
  let screenToWorld = (new Vec2(selectX, selectY)).xy01times(vpi);

  // Parameters are mapped to whatever.
  const selectObject = ()=>{
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Vector difference of two points. Compare against all obj positions.
        if (screenToWorld.minus(this.tileGrid[i][j].position).length() < 0.25) {
          this.selectedObjects.push(this.tileGrid[i][j]);
          this.index = [i, j];
        }
      }
    }
  }

  const swap = ()=>{
    let first_index = this.index;
    selectObject();
    let second_index = this.index;
    let first_pos = this.selectedObjects[0].position;
    let first_log_pos = this.selectedObjects[0].logicalPosition;
    let second_pos = this.selectedObjects[1].position;
    let second_log_pos = this.selectedObjects[1].logicalPosition;
    let temp = this.tileGrid[first_index[0]][first_index[1]];
    this.selectedObjects[0].position = second_pos;
    this.selectedObjects[1].position = first_pos;
    this.selectedObjects[0].logicalPosition = second_log_pos;
    this.selectedObjects[1].logicalPosition = first_log_pos;
    this.tileGrid[first_index[0]][first_index[1]] = this.tileGrid[second_index[0]][second_index[1]];
    this.tileGrid[second_index[0]][second_index[1]] = temp;
  }

  if (this.selectedObjects.length == 0) {
    selectObject();
  } else if (this.selectedObjects.length == 1) {
    swap();
    this.selectedObjects = [];
  }
}

/************** 11 - SWAP **************/
Scene.prototype.moveMouse = function(event){ 
  var canvas = document.getElementById("canvas");

  // Movement x and y (already a difference).
  var moveX = (event.movementX / canvas.width) * 2;
  var moveY = (event.movementY / canvas.height) * (-2);

  // Adjusting for camera.
  let vpi = new Mat4(this.camera.viewProjMatrix).invert();
  let screenToWorld = (new Vec2(moveX, moveY)).xy00times(vpi);

  for (let i = 0; i < this.selectedObjects.length; i++) {
    this.selectedObjects[i].position.x += screenToWorld.x;
    this.selectedObjects[i].position.y += screenToWorld.y;
  }
}

/************** 12 - BOMB **************/
Scene.prototype.bomb = function(event, keysPressed){
  var canvas = document.getElementById("canvas");
  var selectX = (event.clientX / canvas.width - 0.5) * 2;
  var selectY = (event.clientY / canvas.height - 0.5) * (-2);

  let vpi = new Mat4(this.camera.viewProjMatrix).invert();
  let screenToWorld = (new Vec2(selectX, selectY)).xy01times(vpi);

  // Parameters are mapped to whatever.
  const selectObject = ()=>{
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {

        // Vector difference of two points. Compare against all obj positions.
        if (screenToWorld.minus(this.tileGrid[i][j].position).length() < 0.25) {
          this.selectedObjects.push(this.tileGrid[i][j]);
          this.index = [i, j];
        }
      }
    }
  }
  
  selectObject();

  // Delete if bomb is pressed.
  for (let i = 0; i < this.selectedObjects.length; i++) {
    this.selectedObjects[i].dead = true;
  }

  // Delete from tile grid.
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (this.tileGrid[i][j].dead){

        // Adds an invisible object.
        this.invisibleTile = new GameObject(this.invisibleMesh);
        this.invisibleTile.position.set(i + 23, j + 16);
        this.invisibleTile.scale.set(0.4, 0.4, 1);
        this.tileGrid[i][j] = this.invisibleTile;
      }
    }
  }
  this.selectedObjects = [];
}
