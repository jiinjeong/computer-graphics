/******************************************************************************/
/* FILE   : App.js                                                            */
/*                                                                            */
/******************************************************************************/

"use strict";

const App = function(canvas, overlay) {
  this.canvas = canvas;
  this.overlay = overlay;
  this.keysPressed = {};

  // Obtains WebGL context.
  this.gl = canvas.getContext("webgl2", {alpha: false});
  if (this.gl === null) {
    throw new Error("Browser does not support WebGL2");
  }

  this.gl.pendingResources = {};
  this.scene = new Scene(this.gl);
  
  this.resize();
};

// Match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
  // Rendering resolution.
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

  // Sets aspect ratios for the cameras.
  this.scene.camera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );

  this.scene.miniCamera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );
};

App.prototype.registerEventHandlers = function() {
  document.onkeydown = (event) => {
    let pressed = keyboardMap[event.keyCode];
    this.keysPressed[pressed] = true;
    this.scene.selectionKey(this.keysPressed);
  };

  document.onkeyup = (event) => {
    let pressed = keyboardMap[event.keyCode];
    this.keysPressed[pressed] = false;
  };

  this.canvas.onmousedown = (event) => {
    this.scene.selectionMouse(event, this.keysPressed);
    this.scene.addMouse(event, this.keysPressed);
  };

  this.canvas.onmousemove = (event) => {
    event.stopPropagation();
    if (event.buttons == 1) {
      this.scene.moveMouse(event);
      this.scene.rotateMouse(event);
    }
  };

  this.canvas.onmouseout = (event) => {
  };

  this.canvas.onmouseup = (event) => {
  };

  window.addEventListener('resize', () => this.resize() );
  window.requestAnimationFrame( () => this.update() );

  // Close the dropdown if the user clicks outside of it.
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

};

// Toggles between hiding and showing the dropdown content.
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
  
// Updates animation frame.
App.prototype.update = function() {

  const pendingResourceNames = Object.keys(this.gl.pendingResources);
  if (pendingResourceNames.length === 0) {
    this.scene.update(this.gl, this.keysPressed);
    this.overlay.innerHTML = "Ready.";
  } else {
    this.overlay.innerHTML = "Loading: " + pendingResourceNames;
  }

  // Refresh.
  window.requestAnimationFrame( () => this.update() );
};

// Entry point from HTML.
window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "WebGL";

  const app = new App(canvas, overlay);
  app.registerEventHandlers();
});
