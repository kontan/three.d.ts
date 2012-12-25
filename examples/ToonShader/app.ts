/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../three.d.ts" />

var viewReferencePoint = new THREE.Vector3(0, 60, 0);

function replaceShaderChunkPlaceHolders(source:string):string{
	for(var key in THREE.ShaderChunk){
		if(THREE.ShaderChunk.hasOwnProperty(key)){
			source = source.replace("[[" + key + "]]",   THREE.ShaderChunk[key]);
		}
	}
	return source;
}


function initialize(
	vertexShaderSource:string, 
	pixelShaderSource:string,
	vertexShaderContourSource:string,
	pixelShaderContourSource:string
){
	
	vertexShaderSource = replaceShaderChunkPlaceHolders(vertexShaderSource);
	pixelShaderSource  = replaceShaderChunkPlaceHolders(pixelShaderSource);
	vertexShaderContourSource = replaceShaderChunkPlaceHolders(vertexShaderContourSource);
	pixelShaderContourSource  = replaceShaderChunkPlaceHolders(pixelShaderContourSource);

	function makeToon(viewportHeight:number, lightPos:THREE.Vector3, mesh:THREE.Mesh, map:THREE.Texture):THREE.Mesh{


		var toonShaderUniforms:THREE.Uniforms = <THREE.Uniforms>{
            color: { type:"v3", value:new THREE.Vector3(1, 1, 0) },
            map  : { type: "t", value: map }
        };

        var _uniforms = THREE.UniformsUtils.merge([
			THREE.UniformsLib[ "common" ],
	        THREE.UniformsLib[ "shadowmap" ],
	        toonShaderUniforms
	    ]);



		var material_solid = new THREE.ShaderMaterial({
			vertexShader: vertexShaderSource,
			fragmentShader: pixelShaderSource,
			uniforms: _uniforms,
			blending: THREE.NormalBlending,
	 		depthTest: true,
	        wireframe: false,
	        vertexColors: THREE.NoColors,
	        skinning: false,
	        fog: false,
	        side: THREE.FrontSide
		});

		

		mesh.material = material_solid;

		mesh.material = new THREE.MeshBasicMaterial({ map: map });



		var material_contour = new THREE.ShaderMaterial({
			vertexShader: vertexShaderContourSource,
			fragmentShader: pixelShaderContourSource,
			uniforms: {
				//lineWidth: { type:"f", value:0.085 / HEIGHT },
				lineWidth: { type:"f", value:0.002 },
				lineColor: { type:"v3", value:new THREE.Vector3(0.4, 0.4, 0.4) }
			},
			defines: {},
			blending: THREE.NormalBlending,
	 		depthTest: true,
	        wireframe: false,
	        lights: false,
	        vertexColors: THREE.NoColors,
	        skinning: false,
	        fog: false,
	        side: THREE.BackSide
		});

		var mesh_contour = new THREE.Mesh(
			mesh.geometry.clone(),
			material_contour
		);
		mesh_contour.position = mesh.position.clone();
		return mesh_contour;
	}


	var WIDTH:number = 800;
	var HEIGHT:number = 600;	
	var lightPos = new THREE.Vector3(200, 400, 10);

	var buffalo:THREE.Mesh, buffalo_contour:THREE.Mesh; 

	// renderer
	var renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer({
		clearColor: 0x00ffffff,
		clearAlpha: 1.0,
		antialias: true
	});

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapCullFrontFaces = false;
	renderer.setSize(WIDTH, HEIGHT);

	// scene
	var scene:THREE.Scene = new THREE.Scene();

	// camera
	var VIEW_ANGLE:number = 45, ASPECT:number = WIDTH / HEIGHT, NEAR:number = 0.1, FAR:number = 10000;
	var camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.z = 500;
	camera.position.y = 200;
	camera.lookAt(viewReferencePoint);
	scene.add(camera);

	// sphere
	var radius = 50, segments = 16, rings = 16;
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, rings)
	);
	sphere.position.x = 100;
	sphere.position.y = 200;
	sphere.castShadow = true;
	sphere.receiveShadow  = true;
	scene.add(sphere);

	// sphere contour
	var shereTexture = THREE.ImageUtils.loadTexture("m_world.jpg");
	

	var sphere_contour = makeToon(HEIGHT, lightPos, sphere, shereTexture);
	sphere_contour.castShadow = true;
	sphere_contour.receiveShadow  = true;	
	scene.add(sphere_contour);

	// plane
	var plane:THREE.Mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(1400, 1400),
		new THREE.MeshPhongMaterial({
			color: 0xccffcc
		})
	);
	plane.position.y = 0;
	plane.rotation.x = -Math.PI/2;
	plane.castShadow = true;
	plane.receiveShadow  = true;
	scene.add(plane);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position = lightPos.clone();
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 0.3;
	directionalLight.shadowMapWidth = 1024; 
	directionalLight.shadowMapHeight = 1024;
	directionalLight.shadowCameraVisible = true;	
	directionalLight.shadowCameraLeft   = -200;
    directionalLight.shadowCameraRight  =  200;
    directionalLight.shadowCameraTop    =  200;
    directionalLight.shadowCameraBottom = -200;
	directionalLight.shadowCameraNear = 5;
	directionalLight.shadowCameraFar = 600;
	directionalLight.shadowBias = -0.005;
	scene.add(directionalLight);

	$('#container').append(renderer.domElement);


	var theta = 0;
	function mainloop(){
		sphere.position.z = 100 * Math.sin(theta);
		sphere_contour.position.z = sphere.position.z;
		theta += 0.02;
		renderer.setFaceCulling("back");
		renderer.render(scene, camera);
		requestAnimationFrame(mainloop);
	}
	mainloop();


	//var modelDataURL = "suzanneHi.js";
	//var modelDataURL = "monkey.js";
	var modelDataURL = "youmu.js";
	var youmuTexture = THREE.ImageUtils.loadTexture("youmu_tex.png");

	var loader = new THREE.JSONLoader();
	loader.load(modelDataURL, (geometry:THREE.Geometry, materials:THREE.Material[])=>{
		buffalo = new THREE.Mesh(geometry);
		buffalo.castShadow = true;
		buffalo.receiveShadow  = true;
		scene.add(buffalo);
		buffalo_contour = makeToon(HEIGHT, lightPos, buffalo, youmuTexture);
		scene.add(buffalo_contour);
		buffalo_contour.castShadow = true;
		buffalo_contour.receiveShadow  = true;

		window.addEventListener("keydown", (e:KeyboardEvent)=>{
			var dx = ((e.keyCode == 38 ? 1 : 0) - (e.keyCode == 40 ? 1 : 0)) * 0.1;
			var dy = ((e.keyCode == 37 ? 1 : 0) - (e.keyCode == 39 ? 1 : 0)) * 0.1;
			var dz = ((e.keyCode == 33 ? 1 : 0) - (e.keyCode == 34 ? 1 : 0)) * 10;
			if(dx != 0 || dy != 0 || dz != 0){
				buffalo.rotation.x += ((e.keyCode == 38 ? 1 : 0) - (e.keyCode == 40 ? 1 : 0)) * 0.1;
				buffalo.rotation.y += ((e.keyCode == 37 ? 1 : 0) - (e.keyCode == 39 ? 1 : 0)) * 0.1;
				//buffalo.position.z += ((e.keyCode == 33 ? 1 : 0) - (e.keyCode == 34 ? 1 : 0)) * 10;
				
				camera.position.z += ((e.keyCode == 33 ? 1 : 0) - (e.keyCode == 34 ? 1 : 0)) * 10;
				camera.lookAt(viewReferencePoint);

				buffalo_contour.rotation = buffalo.rotation.clone();
				buffalo_contour.position = buffalo.position.clone();
				e.preventDefault();
			}
		});
	});
}

$(()=>{
	var shaderFiles:string[] = [
		"vertexshader.glsl", 
		"pixelshader.glsl", 
		"vertexshader_contour.glsl", 
		"pixelshader_contour.glsl"
	];
    var sources:string[] = [];
    var loadedFileCount:number = 0;
    shaderFiles.forEach((file, i)=>{
    	$.ajax(file, {
    		contentType: "text/plain",
			success: (data:string)=>{
				sources[i] = data;
				loadedFileCount++;
				if(loadedFileCount == shaderFiles.length){
					initialize(sources[0], sources[1], sources[2], sources[3]);
				}
			}
		});
    });
});