/// <reference path="jquery.d.ts" />
/// <reference path="../three.d.ts" />
$(()=>{
	var WIDTH = 400, HEIGHT = 300;
	var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
	var renderer = new THREE.WebGLRenderer({
		clearColor: 0x000000ff,
		clearAlpha: 1.0,
		lights: true
	});
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var scene = new THREE.Scene();
	scene.add(camera);
	camera.position.z = 300;
	renderer.setSize(WIDTH, HEIGHT);

	var sphereMaterial = new THREE.MeshPhongMaterial({

		color: 0x00ff00
	});

	var radius = 50, segments = 16, rings = 16;
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			radius,
			segments,
			rings
		),
		sphereMaterial
	);
	scene.add(sphere);

	var directionalLight = new THREE.DirectionalLight( 0x606060, 0.5 ); 
	directionalLight.position.set( 0, 1, 0); 
	scene.add( directionalLight );

	// create a point light
var pointLight =
  new THREE.PointLight(0xf0f0f0);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

	var container:HTMLElement = document.getElementById('container');
	container.appendChild(renderer.domElement);
  	renderer.render(scene, camera);
});