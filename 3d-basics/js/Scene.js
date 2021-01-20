const Scene = function(gl) {

  /****************************** SETTINGS ******************************/
  // ------------ BACKGROUND SETTING ------------
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);  // Enable depth test.
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA);

  // ------------ TIME & CAMERA ------------
  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.camera = new PerspectiveCamera();
  this.camera.position.set(2, 3, 20, 0);

  /****************************** GAME OBJECTS ******************************/
  // ------------ PROGRAM ------------
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");

  this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured_vs.essl")
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl")

  this.fsHeadLight = new Shader(gl, gl.FRAGMENT_SHADER, "headlight_fs.essl")
  this.fsEnv = new Shader(gl, gl.FRAGMENT_SHADER, "env_fs.essl")

  this.vsWood = new Shader(gl, gl.VERTEX_SHADER, "wood_vs.essl");
  this.fsWood = new Shader(gl, gl.FRAGMENT_SHADER, "wood_fs.essl");

  this.vsInfinite = new Shader(gl, gl.VERTEX_SHADER, "infinite_vs.essl");
  this.fsInfinite = new Shader(gl, gl.FRAGMENT_SHADER, "infinite_fs.essl");

  this.solidProgram = new Program(gl, this.vsTextured, this.fsSolid);
  this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);
  this.headlightProgram = new TexturedProgram(gl, this.vsTextured, this.fsHeadLight);
  this.envMappedProgram = new TexturedProgram(gl, this.vsTextured, this.fsEnv);
  this.woodProgram = new TexturedProgram(gl, this.vsWood, this.fsWood);
  this.infiniteProgram = new TexturedProgram(gl, this.vsInfinite, this.fsInfinite);

  // ------------ MATERIAL ------------
  // Shadow
  this.blackMaterial = new Material(gl, this.solidProgram);
  this.blackMaterial.solidColor.set(0, 0, 0);

  // Slowpoke
  this.slowpokeMaterial1 = new Material(gl, this.headlightProgram);
  this.slowpokeMaterial1.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
  this.slowpokeMaterial1.specularColor.set(10, 10, 10);
  this.slowpokeMaterial1.shininess.set(25);

  this.slowpokeMaterial2 = new Material(gl, this.headlightProgram);
  this.slowpokeMaterial2.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));
  this.slowpokeMaterial2.specularColor.set(10, 10, 10);
  this.slowpokeMaterial2.shininess.set(25);

  // Balloon
  this.balloonMaterial = new Material(gl, this.texturedProgram);
  this.balloonMaterial.colorTexture.set(new Texture2D(gl, "media/obj/balloon.png"));

  // Tree
  this.treeMaterial = new Material(gl, this.texturedProgram);
  this.treeMaterial.colorTexture.set(new Texture2D(gl, "media/obj/tree.png"));

  // Chevy
  this.chevyMaterial = new Material(gl, this.texturedProgram);
  this.chevyMaterial.colorTexture.set(new Texture2D(gl, "media/obj/chevy/chevy.png"));
  this.wheelMaterial = new Material(gl, this.texturedProgram);
  this.wheelMaterial.colorTexture.set(new Texture2D(gl, "media/obj/chevy/chevy.png"))

  // Heli
  this.heliMaterial = new Material(gl, this.texturedProgram);
  this.heliMaterial.colorTexture.set(new Texture2D(gl, "media/obj/heli/heli.png"));

  this.textureCubeMaterial = new Material(gl, this.envMappedProgram);
  this.woodMaterial = new Material(gl, this.woodProgram);

  // ------------ MESH, TEXTURE ------------
  this.slowpokeMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", [this.slowpokeMaterial1, this.slowpokeMaterial2]);
  this.textureCubeMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", [this.textureCubeMaterial, this.textureCubeMaterial]);
  this.woodMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", [this.woodMaterial, this.woodMaterial]);
  this.balloonMesh = new MultiMesh(gl, "media/obj/balloon.json", [this.balloonMaterial]);
  this.treeMesh = new MultiMesh(gl, "media/obj/tree.json", [this.treeMaterial, this.treeMaterial]);
  this.chevyMesh = new MultiMesh(gl, "media/obj/chevy/chassis.json", [this.chevyMaterial]);
  this.wheelMesh = new MultiMesh(gl, "media/obj/chevy/wheel.json", [this.chevyMaterial]);
  this.sphereMesh = new MultiMesh(gl, "media/obj/sphere.json", [this.woodMaterial]);
  this.heliMesh = new MultiMesh(gl, "media/obj/heli/heli.json", [this.heliMaterial, this.heliMaterial, this.heliMaterial, this.heliMaterial,
                                                                 this.heliMaterial, this.heliMaterial, this.heliMaterial, this.heliMaterial,
                                                                 this.heliMaterial, this.heliMaterial, this.heliMaterial, this.heliMaterial,
                                                                 this.heliMaterial, this.heliMaterial, this.heliMaterial, this.heliMaterial,])
  this.mainRotorMesh = new MultiMesh(gl, "media/obj/heli/mainrotor.json", [this.heliMaterial, this.heliMaterial]);
  this.tailRotorMesh = new MultiMesh(gl, "media/obj/heli/tailrotor.json", [this.heliMaterial, this.heliMaterial]);

  this.skyCubeTexture = new
    TextureCube(gl, [
      "media/cube/posx.jpg",
      "media/cube/negx.jpg",
      "media/cube/posy.jpg",
      "media/cube/negy.jpg",
      "media/cube/posz.jpg",
      "media/cube/negz.jpg",]
      );

  this.textureCubeMaterial.
  envmapTexture.set( 
    this.skyCubeTexture);

  // ------------ GAME OBJECT ------------
  this.slowpoke = new GameObject(this.slowpokeMesh);
  this.slowpoke.scale.set(0.2, 0.2, 0.2);
  this.slowpoke.position.set(2, 0, 7, 0)

  this.glassSlowpoke = new GameObject(this.textureCubeMesh);
  this.glassSlowpoke.scale.set(0.3, 0.3, 0.3);
  this.glassSlowpoke.position.set(8, 0, 3, 0);

  this.woodSlowpoke = new GameObject(this.woodMesh);
  this.woodSlowpoke.scale.set(0.5, 0.5, 0.5);
  this.woodSlowpoke.position.set(2, 2, 2, 0);

  this.tree = new GameObject(this.treeMesh);
  this.tree.scale.set(0.1, 0.1, 0.1);
  this.tree.position.set(-8.5, 0.45, 3, 0);

  this.balloon1 = new GameObject(this.balloonMesh);
  this.balloon1.scale.set(0.1, 0.1, 0.1);
  this.balloon1.position.set(-6, 6, 2, 0);

  this.balloon2 = new GameObject(this.balloonMesh);
  this.balloon2.scale.set(0.1, 0.1, 0.1);
  this.balloon2.position.set(-10, 3, 2, 0);

  this.balloon3 = new GameObject(this.balloonMesh);
  this.balloon3.scale.set(0.1, 0.1, 0.1);
  this.balloon3.position.set(0, 0, 0, 0);

  // Car
  this.chevy = new GameObject(this.chevyMesh);
  this.chevy.scale.set(0.2, 0.2, 0.2);
  this.chevy.position.set(-3.5, 1.2, 0, 0);

  // Back left.
  this.wheel1 = new GameObject(this.wheelMesh);
  this.wheel1.parent = this.chevy;
  this.wheel1.position.set(-7, -2.5, -10, 0);
  // Back right.
  this.wheel2 = new GameObject(this.wheelMesh);
  this.wheel2.parent = this.chevy;
  this.wheel2.position.set(7, -2.5, -10, 0);
  // Front left.
  this.wheel3 = new GameObject(this.wheelMesh);
  this.wheel3.parent = this.chevy;
  this.wheel3.position.set(-7, -2.5, 14, 0);
  // Front right.
  this.wheel4 = new GameObject(this.wheelMesh);
  this.wheel4.parent = this.chevy;
  this.wheel4.position.set(7, -2.5, 14, 0);

  this.sphere = new GameObject(this.sphereMesh);
  this.sphere.scale.set(0.4, 0.4, 0.4);
  this.sphere.position.set(3.8, 0.8, 12, 0);

  // Heli
  this.heli = new GameObject(this.heliMesh);
  this.heli.scale.set(0.3, 0.3, 0.3);
  this.heli.position.set(6, 3, -14, 0)

  this.mainRotor = new GameObject(this.mainRotorMesh);
  this.mainRotor.parent = this.heli;
  this.mainRotor.scale.set(0.3, 0.3, 0.3);
  this.mainRotor.position.set(2, 14, 10, 0)

  this.tailRotor = new GameObject(this.tailRotorMesh);
  this.tailRotor.parent = this.heli;
  this.tailRotor.position.set(6, -5, 0, 0)

  // Infinite
  this.infiniteMaterial = new Material(gl, this.infiniteProgram);
  this.infiniteMaterial.colorTexture.set(new Texture2D(gl, "media/background.jpg"));
 
  this.infiniteGeometry = new InfiniteGeometry(gl);
  this.infiniteMesh = new Mesh(this.infiniteGeometry, this.infiniteMaterial);

  this.infinite = new GameObject(this.infiniteMesh);

  const rollerCoaster1 = function(t, dt){
    const roller = new Vec3(2 * Math.cos(t), Math.sin(3 * t) + 7, 3 * Math.sin(t));
    this.position = roller;
  };

  const rollerCoaster2 = function(t, dt){
    const roller = new Vec3(2 * Math.cos(t), Math.sin(3 * t) + 7, 3 * Math.sin(t));
    this.position = new Vec3(2 * Math.cos(t) + 2, Math.sin(3 * t) + 8, 3 * Math.sin(t));
  };

  const rollerCoaster3 = function(t, dt){
    const roller = new Vec3(2 * Math.cos(t), Math.sin(3 * t) + 7, 3 * Math.sin(t));
    this.position = new Vec3(2 * Math.cos(t) + 4, Math.sin(3 * t) + 3, 3 * Math.sin(t));
  };

  // ------------ Game object ------------
  this.gameObjects = [];
  this.gameObjects.push(this.slowpoke);
  this.gameObjects.push(this.glassSlowpoke, this.tree);
  this.gameObjects.push(this.balloon1, this.balloon2, this.balloon3);
  this.gameObjects.push(this.chevy, this.wheel1, this.wheel2, this.wheel3, this.wheel4);

  // ------------ #1. GROUND ZERO ------------
  this.gameObjects.push(this.infinite);

  // ------------ #2. PROCEDURAL ------------
  this.gameObjects.push(this.sphere);

  // Move
  this.balloon1.move = rollerCoaster1;
  this.balloon3.move = rollerCoaster2;
  this.glassSlowpoke.move = rollerCoaster3;
};


Scene.prototype.update = function(gl, keysPressed) {

  /****************************** SETTINGS ******************************/
  // ------------ BACKGROUND SETTING ------------
  gl.clearColor(0.8, 1.0, 0.8, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ------------ #3-6. LIGHT & SHADING ------------
  Uniforms.lighting.lightPosition.at(0).set(0, 1, 0, 0);  // Position of directional light.
  Uniforms.lighting.powerDensity.at(0).set(1, 1, 1);  // Density of directional light. Try with density (power & colors.
                                                      // (1, 0, 0) is red; (0, 1, 0) is green; (0, 0, 1) is blue.
                                                      // (100, 100, 100) is super bright.
  Uniforms.lighting.lightPosition.at(1).set(0, 1, 1, 0);  // This is a directional light.
  Uniforms.lighting.powerDensity.at(1).set(1, 0, 1);

  Uniforms.lighting.lightPosition.at(2).set(5, 1, 0, 1);  // This is a pointlight.
  Uniforms.lighting.powerDensity.at(2).set(10, 10, 0);

  // ------------ TIME & CAMERA ------------
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.camera.move(dt, keysPressed);

  // ------------ #7. HELICAM ------------
  this.newYaw = -Math.atan2(this.gameObjects[0].position.z - this.camera.position.z, this.gameObjects[0].position.x - this.camera.position.x) - Math.PI/2;
  this.distanceX = this.gameObjects[0].position.x - this.camera.position.x;
  this.distanceY = this.gameObjects[0].position.y - this.camera.position.y + 1;
  this.camera.position.x += (this.distanceX/40);
  this.camera.position.y += (this.distanceY/40);

  this.camera.yaw += (this.newYaw - this.camera.yaw)/40;
  Uniforms.camera.position.set(this.camera.position);

  // ------------ #8. WHEEL ------------
  // Car movement
  this.chevy.ahead = new Vec3(0, 0, 1);

  if (keysPressed.LEFT){
    this.chevy.position.x -= 0.1;
    this.wheel1.rotationAxis = new Vec3(0, 1, 0);
    this.wheel1.orientation = -0.5;
    this.wheel2.rotationAxis = new Vec3(0, 1, 0);
    this.wheel2.orientation = -0.5;
    this.wheel3.rotationAxis = new Vec3(0, 1, 0);
    this.wheel3.orientation = -0.5;
    this.wheel4.rotationAxis = new Vec3(0, 1, 0);
    this.wheel4.orientation = -0.5;
  }
  if (keysPressed.RIGHT){
    this.chevy.position.x += 0.1;
    this.wheel1.rotationAxis = new Vec3(0, 1, 0);
    this.wheel1.orientation = 0.5;
    this.wheel2.rotationAxis = new Vec3(0, 1, 0);
    this.wheel2.orientation = 0.5;
    this.wheel3.rotationAxis = new Vec3(0, 1, 0);
    this.wheel3.orientation = 0.5;
    this.wheel4.rotationAxis = new Vec3(0, 1, 0);
    this.wheel4.orientation = 0.5;
  }
  if (keysPressed.DOWN){
    this.chevy.position.z -= 0.1;
    this.wheel1.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel1.orientation -= 0.25;
    this.wheel2.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel2.orientation -= 0.25;
    this.wheel3.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel3.orientation -= 0.25;
    this.wheel4.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel4.orientation -= 0.25;
  }
  if (keysPressed.UP){
    this.chevy.position.z += 0.1;
    this.wheel1.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel1.orientation += 0.25;
    this.wheel2.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel2.orientation += 0.25;
    this.wheel3.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel3.orientation += 0.25;
    this.wheel4.rotationAxis = new Vec3(-1, 0, 0);
    this.wheel4.orientation += 0.25;
  }

  // ------------ #9. AVATAR ------------
  if (keysPressed.L){
    this.slowpoke.position.x -= 0.1;
  }
  if (keysPressed.R){
    this.slowpoke.position.x += 0.1;
  }
  if (keysPressed.F){
    this.slowpoke.position.z += 0.1;
  }
  if (keysPressed.B){
    this.slowpoke.position.z -= 0.1;
  }

  /****************************** GAME OBJECTS ******************************/
  for (i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

  // ------------ #10. SHADOW ------------
  for (i = 0; i < this.gameObjects.length; i++) {
    if (this.gameObjects[i] != this.infinite) {
      this.gameObjects[i].drawShadow(this.camera, this.blackMaterial);
    }
  }

  // ------------ #11. PATH ANIMATION (Partial) ------------
  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].move(t, dt);
  }
  
  // ------------ #12. ROLLING BALL (Partial) ------------
  if (Math.abs(this.slowpoke.position.x - this.sphere.position.x) < 2 &&
      Math.abs(this.slowpoke.position.y - this.sphere.position.y) < 2 &&
      Math.abs(this.slowpoke.position.z - this.sphere.position.z) < 2){
    if (keysPressed.F){
      this.sphere.position.z += 0.075;
      this.sphere.rotationAxis = new Vec3(-1, 0, 0);
      this.sphere.orientation += 0.25;
    }
    if (keysPressed.B){
      this.sphere.position.z -= 0.075;
      this.sphere.rotationAxis = new Vec3(-1, 0, 0);
      this.sphere.orientation -= 0.25;
    }
    if (keysPressed.L){
      this.sphere.position.x -= 0.075;
      this.sphere.rotationAxis = new Vec3(0, 1, 0);
      this.sphere.orientation -= 0.25;
    }
    if (keysPressed.R){
      this.sphere.position.x += 0.075;
      this.sphere.rotationAxis = new Vec3(0, 1, 0);
      this.sphere.orientation += 0.25;
    }
  }
};
