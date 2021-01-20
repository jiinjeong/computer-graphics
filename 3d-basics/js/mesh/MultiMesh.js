const MultiMesh = function(
    gl, jsonModelFileUrl, materials) { 
  this.meshes = []; 
  
  const request = new XMLHttpRequest();
  request.overrideMimeType("application/json"); 
  request.open("GET", jsonModelFileUrl); 
  request.onreadystatechange = () => {    
	// Create meshes.
	if (request.readyState == 4) { 
	  const meshesJson =
	            JSON.parse(request.responseText).meshes; 
	  for (let i = 0; i < meshesJson.length; i++) { 
	    this.meshes.push( new Mesh( 
	     new TexturedIndexedTrianglesGeometry(
	                            gl, meshesJson[i]), 
	     materials[i] 
	    )); 
	  } 
	}
	}; 
  request.send(); 
}; 

// Draw meshes.
MultiMesh.prototype.draw = function(gl){ 
  for (let i = 0; i < this.meshes.length; i++) { 
    this.meshes[i].draw(gl); 
  } 
}; 

MultiMesh.prototype.drawSelected = function(gl, material){ 
  for (let i = 0; i < this.meshes.length; i++) { 
    this.meshes[i].drawSelected(gl, material); 
  } 
}; 
