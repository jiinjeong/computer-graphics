"use strict";
// App constructor
const App = function(canvas, overlay) {
  this.canvas = canvas;
  this.overlay = overlay;
  this.keysPressed = {};  // Create new obj.

  // Obtain WebGL context
  // In getContext, add {alpha: false} to get rid of grid-like background.
  // To make it transparent, enable alpha blending.
  // If alpha == 1: fragment shader, alpha == 0: frame buffer.
  this.gl = canvas.getContext("webgl2", {alpha: false});
  if (this.gl === null) {
    throw new Error("Browser does not support WebGL2");
  }

  // serves as a registry for textures or models being loaded
  this.gl.pendingResources = {};
  // create a simple scene
  this.scene = new Scene(this.gl);
  
  this.resize();
};

// Match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
  // Rendering resolution
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

  this.scene.camera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );
};

App.prototype.registerEventHandlers = function() {
  document.onkeydown = (event) => {
    let pressed = keyboardMap[event.keyCode];
    this.keysPressed[pressed] = true;
    //jshint unused:false
  };
  document.onkeyup = (event) => {
    let pressed = keyboardMap[event.keyCode];
    this.keysPressed[pressed] = false;
    //jshint unused:false
  };
  this.canvas.onmousedown = (event) => {
    this.scene.camera.mouseDown();
    //jshint unused:false
  };
  this.canvas.onmousemove = (event) => {
    //jshint unused:false
    this.scene.camera.mouseMove(event);
    event.stopPropagation();
  };
  this.canvas.onmouseout = (event) => {
    //jshint unused:false
  };
  this.canvas.onmouseup = (event) => {
    this.scene.camera.mouseUp();
    //jshint unused:false
  };
  window.addEventListener('resize', () => this.resize() );
  window.requestAnimationFrame( () => this.update() );
};

// animation frame update
App.prototype.update = function() {

  const pendingResourceNames = Object.keys(this.gl.pendingResources);
  if (pendingResourceNames.length === 0) {
    // animate and draw scene
    this.scene.update(this.gl, this.keysPressed);
    this.overlay.innerHTML = "Ready.";
  } else {
    this.overlay.innerHTML = "Loading: " + pendingResourceNames;
  }

  // refresh
  window.requestAnimationFrame( () => this.update() );
};

// entry point from HTML
window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "WebGL";

  const app = new App(canvas, overlay);
  app.registerEventHandlers();
});