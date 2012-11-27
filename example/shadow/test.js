$(function () {
    new THREE.LineBasicMaterial({
        colour: 16711680
    });
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
    camera.position.z = 400;
    camera.position.y = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    var radius = 50, segments = 16, rings = 16;
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), new THREE.MeshPhongMaterial({
        color: 65280
    }));
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshPhongMaterial({
        color: 65280
    }));
    plane.position.y = -100;
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);
    var spotLight = new THREE.SpotLight(16777215);
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
    function mainloop() {
        sphere.position.x = 40 * Math.sin(theta);
        theta += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(mainloop);
    }
    mainloop();
});
//@ sourceMappingURL=test.js.map
