/// <reference path="jquery.d.ts" />
/// <reference path="../../three.d.ts" />
$(()=>{
	// renderer
	var renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer({
		clearColor: 0x00000030,
		clearAlpha: 1.0
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
	camera.position.z = 400;
	camera.position.y = 400;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	// sphere
	var radius = 50, segments = 16, rings = 16;
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, rings),
		new THREE.MeshPhongMaterial({ color: 0x00ff00 })
	);
	sphere.castShadow = true;
	sphere.receiveShadow  = true;
	scene.add(sphere);

	// plane
	var plane:THREE.Mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(400, 400),
		new THREE.MeshPhongMaterial({
			color: 0x00ff00
		})
	);
	plane.position.y = -100;
	plane.rotation.x = -Math.PI/2;
	plane.castShadow = true;
	plane.receiveShadow  = true;
	scene.add(plane);

	// spot light
	var spotLight:THREE.SpotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-10, 200, 0);
	spotLight.castShadow = true;  
	spotLight.shadowDarkness = 0.5;
	spotLight.shadowMapWidth = 1024; 
	spotLight.shadowMapHeight = 1024;  
	spotLight.shadowCameraNear = 50; 
	spotLight.shadowCameraFar = 400; 
	spotLight.shadowCameraFov = 30;
	spotLight.shadowCameraVisible = true;
	scene.add(spotLight);

	$('#container').append(renderer.domElement);

	var theta = 0;
	setInterval(()=>{
		sphere.position.x = 40 * Math.sin(theta);
		theta += 0.05;
		renderer.render(scene, camera);
	}, 15);
});