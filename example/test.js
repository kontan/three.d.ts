$(function () {
    var WIDTH = 400, HEIGHT = 300;
    var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
    var renderer = new THREE.WebGLRenderer({
        clearColor: 255,
        clearAlpha: 1,
        lights: true
    });
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    var scene = new THREE.Scene();
    scene.add(camera);
    camera.position.z = 300;
    renderer.setSize(WIDTH, HEIGHT);
    var sphereMaterial = new THREE.MeshPhongMaterial({
        color: 65280
    });
    var radius = 50, segments = 16, rings = 16;
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
    scene.add(sphere);
    var directionalLight = new THREE.DirectionalLight(6316128, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    var pointLight = new THREE.PointLight(15790320);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    renderer.render(scene, camera);
});
