/******************************************************************************/
/* FILE   : Scene.js                                                          */
/* DESC   : Main program.                                                     */
/*                                                                            */
/******************************************************************************/

const Scene = function(gl) {

  // ------------ Shaders ------------ 
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.vsStripe = new Shader(gl, gl.VERTEX_SHADER, "stripe_vs.essl");
  this.fsStripe = new Shader(gl, gl.FRAGMENT_SHADER, "stripe_fs.essl");
  this.vsHeartbeat = new Shader(gl, gl.VERTEX_SHADER, "heartbeat_vs.essl");
  this.fsHeartbeat = new Shader(gl, gl.FRAGMENT_SHADER, "heartbeat_fs.essl");
  this.vsBull = new Shader(gl, gl.VERTEX_SHADER, "bull_vs.essl");
  this.fsBull = new Shader(gl, gl.FRAGMENT_SHADER, "bull_fs.essl");
  this.vsBlink = new Shader(gl, gl.VERTEX_SHADER, "blink_vs.essl");
  this.fsBlink = new Shader(gl, gl.FRAGMENT_SHADER, "blink_fs.essl");
  this.vsChecker = new Shader(gl, gl.VERTEX_SHADER, "checker_vs.essl");
  this.fsChecker = new Shader(gl, gl.FRAGMENT_SHADER, "checker_fs.essl");

  // ------------ Programs ------------ 
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.stripeProgram = new Program(gl, this.vsStripe, this.fsStripe);
  this.heartbeatProgram = new Program(gl, this.vsHeartbeat, this.fsHeartbeat);
  this.bullProgram = new Program(gl, this.vsBull, this.fsBull);
  this.checkerProgram = new Program(gl, this.vsChecker, this.fsChecker); 
  this.blinkProgram = new Program(gl, this.vsBlink, this.fsBlink);

  // ------------ Geometries ------------ 
  this.circleGeometry = new CircleGeometry(gl);
  this.heartGeometry = new HeartGeometry(gl);
  this.starGeometry = new StarGeometry(gl);
  this.roseGeometry = new RoseGeometry(gl);
  this.chairGeometry = new ChairGeometry(gl);
  this.lampGeometry = new LampGeometry(gl);
  this.rectGeometry = new RectGeometry(gl);

  // ------------ Materials ------------ 
  this.greenNavyMaterial = new Material(gl, this.stripeProgram);
  this.greenNavyMaterial.solidColor.set(0.7, 0.9, 0);
  this.greenNavyMaterial.stripeColor.set(0, 0, 0.9);
  this.greenNavyMaterial.fragmentWidth.set(0.5);

  this.blueMaterial = new Material(gl, this.solidProgram);
  this.blueMaterial.solidColor.set(0, 0.5, 1);

  this.redorangeStripeMaterial = new Material(gl, this.stripeProgram);
  this.redorangeStripeMaterial.stripeColor.set(0.7, 0, 0.1);
  this.redorangeStripeMaterial.solidColor.set(1, 0.5, 0);
  this.redorangeStripeMaterial.fragmentWidth.set(0.25);

  this.redblackBullMaterial = new Material(gl, this.bullProgram);
  this.redblackBullMaterial.bullColor.set(0, 0, 0);
  this.redblackBullMaterial.solidColor.set(1, 0, 0);
  this.redblackBullMaterial.fragmentWidth.set(0.25);
  
  this.blinkMaterial = new Material(gl, this.blinkProgram);
  this.blinkMaterial.solidColor.set(0, 0, 0);
  this.blinkMaterial.blinkColor.set(1, 0, 0);

  this.greenCheckerMaterial = new Material(gl, this.checkerProgram);
  this.greenCheckerMaterial.checkerColor.set(0, 1, 0);
  this.greenCheckerMaterial.solidColor.set(1, 1, 1);
  this.greenCheckerMaterial.fragmentWidth.set(0.5);

  this.heartbeatMaterial = new Material(gl, this.heartbeatProgram);
  this.heartbeatMaterial.solidColor.set(1, 0.7, 0.8);

  this.selectYellowMaterial = new Material(gl, this.solidProgram);
  this.selectYellowMaterial.solidColor.set(1, 1, 0);

  this.semiTransMaterial = new Material(gl, this.solidProgram);
  this.semiTransMaterial.solidColor.set(0.7, 0.9, 0, 0.1);

  // ------------ Mesh ------------
  this.greenNavyMesh = new Mesh(this.circleGeometry, this.greenNavyMaterial);
  this.blinkChairMesh = new Mesh(this.chairGeometry, this.blinkMaterial);
  this.greenLampMesh = new Mesh(this.lampGeometry, this.greenCheckerMaterial);
  this.redorangeMesh = new Mesh(this.circleGeometry, this.redorangeStripeMaterial);
  this.heartbeatMesh = new Mesh(this.heartGeometry, this.heartbeatMaterial);
  this.selectYellowMesh = new Mesh(this.circleGeometry, this.selectYellowMaterial);
  this.redblackMesh = new Mesh(this.roseGeometry, this.redblackBullMaterial);
  this.blueMesh = new Mesh(this.starGeometry, this.blueMaterial);
  this.miniMapMesh = new Mesh(this.rectGeometry, this.semiTransMaterial);

  // ------------ Game Objects ------------
  this.blinkChair = new GameObject(this.blinkChairMesh);
  this.greenLamp = new GameObject(this.greenLampMesh);
  this.greenNavyTable = new GameObject(this.greenNavyMesh);
  this.redorangeStripeTable = new GameObject(this.redorangeMesh);
  this.heartbeatBeanbag = new GameObject(this.heartbeatMesh);
  this.selectYellow = new GameObject(this.selectYellowMesh);
  this.bluePlant = new GameObject(this.blueMesh);
  this.redblackCoatRack = new GameObject(this.redblackMesh);
  this.miniMap = new GameObject(this.miniMapMesh);

  // ------------ Time, Camera, and Canvas ------------
  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = new Date().getTime();
  
  this.camera = new OrthoCamera(gl);
  this.miniCamera = new MiniCamera(gl);
  
  this.canvas = document.getElementById("canvas");

  this.oldScreenToWorld = false;

  // ------------ Settings for Background ------------
  gl.enable(gl.SCISSOR_TEST);
  gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA);

  // ------------ Arrays of Objects ------------
  this.gameObjects = [];
  this.selectedObjects = [];
  this.gameObjects.push(this.greenNavyTable, this.redorangeStripeTable,
                        this.heartbeatBeanbag, this.bluePlant,
                        this.redblackCoatRack, this.blinkChair, this.greenLamp);

  // ------------ #1. Simple Shape (Round Table: Jiin, Plant: Ethan, Chair: Henry) ------------
  this.greenNavyTable.position.set(0, 0.65, 0);
  this.greenNavyTable.scale.set(0.3, 0.3, 1);
  this.blinkChair.position.set(-1.5, 0, 0);
  this.blinkChair.scale.set(.2, .2, 1);
  this.bluePlant.position.set(-0.4, 0, 0);
  this.bluePlant.scale.set(0.5, 0.4, 0.3);
  this.bluePlant.waving = true;

  // ------------ #2. Parametric Shape (Bean Bag: Jiin, Coat Rack: Ethan, Lamp: Henry) ------------
  this.redblackCoatRack.position.set(-1, -0.5, 0);
  this.redblackCoatRack.scale.set(0.4, 0.4, 0.3);
  this.greenLamp.position.set(-1.5, .5, 0);
  this.greenLamp.scale.set(.2, .2, 0);

  // ------------ #3. Patterns (Striped: Jiin, Bullseye: Ethan, Checkered: Henry) ------------
  this.redorangeStripeTable.position.set(0.8, 0.5, 0);
  this.redorangeStripeTable.scale.set(0.4, 0.4, 1);

  // ------------ #4. Animation (Heartbeat: Jiin, Wave: Ethan, Blink: Henry) ------------
  this.heartbeatBeanbag.position.set(-0.5, 0.6, 0);
  this.heartbeatBeanbag.scale.set(0.01, 0.01, 1);
  this.heartbeatBeanbag.orientation = -1.6;

  // ------------ #5. Selection (Mouse: Jiin, Dropdown: Ethan, Tab: Henry) ------------
  this.selectYellow.scale.set(0.1, 0.1, 1);

  this.curSelect = 0;
  this.parents = {};
};


Scene.prototype.update = function(gl, keysPressed) {

  /****************************** BACKGROUND ******************************/
  gl.clearColor(1.0, 1.0, 0.9, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /****************************** TIME ******************************/
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.heartbeatMaterial.time.set(t);
  this.blinkMaterial.time.set(t);

  /****************************** OBJECTS ******************************/
  // Create game objects.
  for (i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

  // ------------ #4. Animation (Waving: Ethan) ------------
  for (i = 0; i < this.gameObjects.length; i++) {
    if (this.gameObjects[i].waving) {
      this.gameObjects[i].position.x += 0.002*Math.sin(10*t);
    }
  }

  // ------------ #5. Selection (Jiin Jeong) ------------
  for (j = 0; j < this.selectedObjects.length; j++) {
    this.selectedObjects[j].drawSelected(this.camera, this.selectYellowMaterial);
  }

  // ------------ #6. Position Manipulation (Arrow Move: Ethan) ------------
  if (keysPressed.LEFT){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.moveObjects(this.selectedObjects[j], "x", -0.02);
    }
  }

  if (keysPressed.RIGHT){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.moveObjects(this.selectedObjects[j], "x", 0.02);
    }
  }

  if (keysPressed.UP){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.moveObjects(this.selectedObjects[j], "y", 0.02);
    }
  }

  if (keysPressed.DOWN){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.moveObjects(this.selectedObjects[j], "y", -0.02);
    }
  }

  // ------------ #7. Orientation Manipulation (Key Rotate: Jiin) ------------
  // Left
  if (keysPressed.A){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.rotateObjects(this.selectedObjects[j], 0.05);
    }
  }

  // Right
  if (keysPressed.D){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.rotateObjects(this.selectedObjects[j], -0.05);
    }
  }

  // ------------ #7. Orientation Manipulation (Queue) ------------
  if (keysPressed.Q){
    for (j = 0; j < this.selectedObjects.length; j++) {
      var amtRotate = (Math.atan2(this.selectedObjects[0].position.y - this.selectedObjects[j].position.y, 
        this.selectedObjects[0].position.x - this.selectedObjects[j].position.x));
      if (j != (this.selectedObjects.length - 1)){
        amtRotate = (Math.atan2(this.selectedObjects[j+1].position.y - this.selectedObjects[j].position.y, 
          this.selectedObjects[j+1].position.x - this.selectedObjects[j].position.x));
      } 
      this.selectedObjects[j].orientation = amtRotate;
    }
  }
  
  // ------------ #8. Editing (Delete: Jiin, Duplicate: Ethan, Add New: Henry) ------------
  // DELETE: Jiin
  if (keysPressed.B){
    for (j = 0; j < this.selectedObjects.length; j++) {
      this.selectedObjects[j].dead = true;
    }

    for (i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].dead) {
        this.gameObjects.splice(i, 1);
      }
    }
    this.selectedObjects = [];
  }

  // DUPLICATE: Ethan
  if (keysPressed.SPACE){
    for (i = 0; i < this.selectedObjects.length; i++) {
      var obj = this.selectedObjects[i];
      this.gameObjects.push(new GameObject(obj.mesh));
      var duplicate = this.gameObjects[this.gameObjects.length - 1];
      duplicate.position.set(obj.position.x + 0.2, obj.position.y);
      duplicate.scale.set(obj.scale);
      duplicate.orientation = obj.orientation;
    }
    keysPressed.SPACE = false;
  }

  // Add New: Henry
  Scene.prototype.addMouse = function(event, keysPressed){
    var selX = (event.clientX / this.canvas.width - 0.5) * 2;
    var selY = (event.clientY / this.canvas.height - 0.5) * (-2);
  
    let vpi = new Mat4(this.camera.viewProjMatrix).invert();
    let screenToWorld = (new Vec2(selX, selY)).xy01times(vpi);
  
    if (keysPressed.E) {
      var addedLamp = new GameObject(this.greenLampMesh);
      addedLamp.scale.set(.3, .3, 0);
      addedLamp.position.set(screenToWorld.x, screenToWorld.y, 0);
      this.gameObjects.push(addedLamp);
    }

    if (keysPressed.C) {
      var addedChair = new GameObject(this.blinkChairMesh);
      addedChair.scale.set(.3, .3, 0);
      addedChair.position.set(screenToWorld.x, screenToWorld.y, 0);
      this.gameObjects.push(addedChair);
    }
  
    for (i = 0; i < this.gameObjects.length; i++) {
      // Vector difference of two points. Compare against all obj positions.
      if (screenToWorld.minus(this.gameObjects[i].position).length() < 0.25) {
        this.selectedObjects.push(this.gameObjects[i]);
        break;
      }
    }
  }

  // ------------ #9. View (Zoom: Jiin) ------------
  if (keysPressed.Z){
    this.camera.windowSize.mul(0.99, 0.99);
    this.camera.updateViewProjMatrix();
  }

  if (keysPressed.X){
    this.camera.windowSize.mul(1.01, 1.01);
    this.camera.updateViewProjMatrix();
  }

  // ------------ #9. View (Scroll: Henry) ------------
  if(keysPressed.I){
    this.camera.position.y -= .01;
    this.camera.updateViewProjMatrix();
  }
  if(keysPressed.K){
    this.camera.position.y += .01;
    this.camera.updateViewProjMatrix();
  }
  if(keysPressed.J){
    this.camera.position.x += .01;
    this.camera.updateViewProjMatrix();
  }
  if(keysPressed.L){
    this.camera.position.x -= .01;
    this.camera.updateViewProjMatrix();
  }

  // ------------ #10. Miscellaneous (Minimap: Jiin) ------------
  // Prepare canvas for minimap.
  gl.viewport(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height / 2);
  gl.scissor(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height / 2);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw minimap objects.
  for (i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.miniCamera);
    this.miniMap.draw(this.miniCamera);
    this.miniMap.position.set(this.camera.position);
    this.miniMap.orientation = this.camera.rotation;
    this.miniMap.scale.set(this.camera.windowSize).mul(0.5); 
  }

  // Reset to original canvas.
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.scissor(0, 0, this.canvas.width, this.canvas.height);

  // ------------ #10. Miscellaneous (Parent: Ethan) ------------
  // Helper function to remove child from list.
  function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  if (keysPressed.Y){
    var star = this.selectedObjects[0];
    var groupies = this.selectedObjects.slice(1, this.selectedObjects.length);

    for (i = 0; i < groupies.length; i++) {
      if (groupies[i].parents != null) {
        // Remove previous parent-child.
        remove(groupies[i].parents.children, groupies[i]);
        groupies[i].parents = null;
      }

      if (!star.children.includes(groupies[i])) {
        star.children.push(groupies[i]);
      }
      groupies[i].parents = star;
    }
    keysPressed.Y = false;
  }

  if (keysPressed.U){
    for (i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].children = [];
    }
  }

};

// Helper Functions for movement/rotation (Parent: Ethan)
Scene.prototype.moveObjects = function(obj, pos, amount) {
  obj.position[pos] += amount;
  for(i = 0; i < obj.children.length; i++) {
    if (!this.selectedObjects.includes(obj.children[i])) {
      this.moveObjects(obj.children[i], pos, amount);
    }
  }
}

Scene.prototype.rotateObjects = function(obj, amount) {
  obj.orientation += amount;
  for(i = 0; i < obj.children.length; i++) {
    if (!this.selectedObjects.includes(obj.children[i])) {
      this.rotateObjects(obj.children[i], amount);
    }
  }
}

// ------------ #5. Selection (Tab Pick: Henry) ------------
Scene.prototype.selectionKey = function(keysPressed){
  if (keysPressed.S){
    if (this.curSelect == this.gameObjects.length) {
      this.curSelect = 0;
    }
    this.selectedObjects = [this.gameObjects[this.curSelect]];
    this.curSelect += 1;
  }
}

// ------------ #5. Selection (Mouse Pick: Jiin) ------------
Scene.prototype.selectionMouse = function(event, keysPressed){
  var canvas = document.getElementById("canvas");
  var selectX = (event.clientX / canvas.width - 0.5) * 2;
  var selectY = (event.clientY / canvas.height - 0.5) * (-2);

  let vpi = new Mat4(this.camera.viewProjMatrix).invert();
  let screenToWorld = (new Vec2(selectX, selectY)).xy01times(vpi);

  // Selects multiple objects.
  if (keysPressed.M) {
  } else {
    this.selectedObjects = [];
  }

  for (i = 0; i < this.gameObjects.length; i++) {
    // Vector difference of two points. Compare against all obj positions.
    if (screenToWorld.minus(this.gameObjects[i].position).length() < 0.25) {
      this.selectedObjects.push(this.gameObjects[i]);
      break;
    }
  }
}

// ------------ #6. Position Manipulation (Mouse Move: Jiin) ------------
Scene.prototype.moveMouse = function(event){ 
  var moveX = (event.movementX / this.canvas.width) * 2;
  var moveY = (event.movementY / this.canvas.height) * (-2);

  // Adjust for camera.
  let vpi = new Mat4(this.camera.viewProjMatrix).invert();
  let screenToWorld = (new Vec2(moveX, moveY)).xy00times(vpi);

  const amtx = screenToWorld.x;
  const amty = screenToWorld.y;

  for (j = 0; j < this.selectedObjects.length; j++) {
    this.moveObjects(this.selectedObjects[j], "x", amtx);
  }
  for (j = 0; j < this.selectedObjects.length; j++) {
    this.moveObjects(this.selectedObjects[j], "y", amty);
  }

  // ------------ #9. View (Pan: Ethan) ------------
  if (this.selectedObjects.length == 0) {
    this.camera.position.x -= screenToWorld.x;
    this.camera.position.y -= screenToWorld.y;
    this.camera.updateViewProjMatrix();
  }
}
