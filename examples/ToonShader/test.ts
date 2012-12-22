/// <reference path="../libs/jquery.d.ts" />
/// <reference path="../../three.d.ts" />

function makeToon(lightPos:THREE.Vector3, mesh:THREE.Mesh){

}

function initialize(
	vertexShaderSource:string, 
	pixelShaderSource:string,
	vertexShaderContourSource:string,
	pixelShaderContourSource:string
){
	var lightPos = new THREE.Vector3(200, 400, 10);

	var material_solid = new THREE.ShaderMaterial({
		vertexShader: vertexShaderSource,
		fragmentShader: pixelShaderSource,
		uniforms: {
			color: { type:"v3", value:new THREE.Vector3(1, 1, 0) },
			shadowDarkness: { type:"f", value:0.2 },
			lightPosition : { type:"v3", value:lightPos.clone() },
			threshold: { type:"f", value:-0.5 }
		},
		//defines: {},
		blending: THREE.NormalBlending,
 		depthTest: true,
        wireframe: false,
        vertexColors: THREE.NoColors,
        skinning: false,
        fog: false,
        side: THREE.FrontSide
	});

	var material_contour = new THREE.ShaderMaterial({
		vertexShader: vertexShaderContourSource,
		fragmentShader: pixelShaderContourSource,
		uniforms: {
			lineWidth: { type:"f", value:0.00005 },
			lineColor: { type:"v3", value:new THREE.Vector3(0, 0, 0) }
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

	// renderer
	var renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer({
		clearColor: 0x00ffffff,
		clearAlpha: 1.0,
		antialias: true
	});
	var WIDTH:number = 400, HEIGHT:number = 300;
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setSize(WIDTH, HEIGHT);

	// scene
	var scene:THREE.Scene = new THREE.Scene();

	// camera
	var VIEW_ANGLE:number = 45, ASPECT:number = WIDTH / HEIGHT, NEAR:number = 0.1, FAR:number = 10000;
	var camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.z = 800;
	camera.position.y = 120;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	// sphere
	var radius = 50, segments = 16, rings = 16;
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, rings),
		material_solid
	);
	sphere.castShadow = true;
	sphere.receiveShadow  = true;
	scene.add(sphere);

	// sphere contour
	var sphere_contour = new THREE.Mesh(
		sphere.geometry.clone(),
		material_contour
	);
	sphere_contour.castShadow = true;
	sphere_contour.receiveShadow  = true;
	scene.add(sphere_contour);

	// plane
	var plane:THREE.Mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(1400, 1400),
		new THREE.MeshPhongMaterial({
			color: 0x00ff00
		})
	);
	plane.position.y = -90;
	plane.rotation.x = -Math.PI/2;
	plane.castShadow = true;
	plane.receiveShadow  = true;
	scene.add(plane);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position = lightPos.clone();
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 0.5;
	directionalLight.shadowMapWidth = 1024; 
	directionalLight.shadowMapHeight = 1024;
	directionalLight.shadowCameraVisible = true;	
	scene.add(directionalLight);

	$('#container').append(renderer.domElement);


	var theta = 0;
	function mainloop(){
		sphere.position.z = 700 * Math.sin(theta);
		sphere_contour.position.z = sphere.position.z;
		theta += 0.02;

		renderer.setFaceCulling("back");
		renderer.render(scene, camera);

		requestAnimationFrame(mainloop);
	}
	mainloop();

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