$(function () {
    var renderer = new THREE.WebGLRenderer({
        clearColor: 48,
        clearAlpha: 1
    });
    var WIDTH = 400, HEIGHT = 300;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setSize(WIDTH, HEIGHT);
    var scene = new THREE.Scene();
    var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 600;
    camera.position.y = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    var earthTexture = THREE.ImageUtils.loadTexture("earth.png");
    var meshMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture
    });
    var radius = 50, segments = 16, rings = 16;
    var earth = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), meshMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    var PLANE_SIZE = 5000;
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE), new THREE.MeshPhongMaterial({
        color: 8429696
    }));
    plane.position.y = -100;
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);
    var directionalLight = new THREE.SpotLight(16777215);
    directionalLight.position.set(-10, 600, 0);
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;
    directionalLight.shadowMapWidth = 1024;
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowCameraFov = 60;
    directionalLight.shadowCameraNear = 50;
    directionalLight.shadowCameraFar = 1000;
    scene.add(directionalLight);
    var pointLight = new THREE.PointLight(16777215);
    scene.add(pointLight);
    var radius = 50, segments = 16, rings = 16;
    var sun = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("sun.png")
    }));
    scene.add(sun);
    $('#container').append(renderer.domElement);
    var theta = Math.PI / 2;
    var revolutionRadius = 250;
    function mainloop() {
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
//@ sourceMappingURL=test.js.map
