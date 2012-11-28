/// <reference path="../jquery.d.ts" />
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
	camera.position.z = 600;
	camera.position.y = 100;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	// earth
	var earthTexture:THREE.Texture = THREE.ImageUtils.loadTexture("earth.png");

	var meshMaterial:THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
		map: earthTexture
	});

	var radius = 50, segments = 16, rings = 16;
	var earth = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, rings),
		meshMaterial
	);
	earth.castShadow = true;
	earth.receiveShadow  = true;
	scene.add(earth);

	// plane
	var PLANE_SIZE = 5000;
	var plane:THREE.Mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
		new THREE.MeshPhongMaterial({
			color: 0x80a080
		})
	);
	plane.position.y = -100;
	plane.rotation.x = -Math.PI/2;
	plane.castShadow = true;
	plane.receiveShadow  = true;
	scene.add(plane);

	// directional light
	var directionalLight:THREE.SpotLight = new THREE.SpotLight(0xffffff);
	directionalLight.position.set(-10, 600, 0);
	directionalLight.castShadow = true;  
	directionalLight.shadowDarkness = 0.5;
	directionalLight.shadowMapWidth = 1024; 
	directionalLight.shadowMapHeight = 1024;  
	directionalLight.shadowCameraFov = 60;
	directionalLight.shadowCameraNear = 50; 
	directionalLight.shadowCameraFar = 1000; 
	//directionalLight.shadowCameraVisible = true;
	scene.add(directionalLight);

	// Sun
	var pointLight:THREE.PointLight	= new THREE.PointLight(0xffffff);
	scene.add(pointLight);
	var radius = 50, segments = 16, rings = 16;
	var sun = new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, rings),
		new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("sun.png")
		})
	);
	scene.add(sun);


	$('#container').append(renderer.domElement);

	var theta = Math.PI / 2;
	var revolutionRadius:number = 250;
	function mainloop(){
		sun.rotation.y = theta * 3;
		earth.rotation.y = theta * 4;
		earth.position.x = revolutionRadius * Math.sin(theta);
		earth.position.z = revolutionRadius * Math.cos(theta);
		theta += 0.01;
		renderer.render(scene, camera);

		requestAnimationFrame(mainloop);
	}
	mainloop();
});