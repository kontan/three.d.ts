if(!this.Detector.webgl) {
    this.Detector.addGetWebGLMessage();
}
var stats;
var camera;
var scene;
var renderer;
init();
animate();
function init() {
    var container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 400;
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(4210752));
    var light = new THREE.DirectionalLight(16777215);
    light.position.set(0, 1, 0);
    scene.add(light);
    var map = THREE.ImageUtils.loadTexture('ash_uvgrid01.jpg');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    var materials = [
        new THREE.MeshLambertMaterial({
            ambient: 12303291,
            map: map,
            side: THREE.DoubleSide
        }), 
        new THREE.MeshBasicMaterial({
            color: 16777215,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        })
    ];
    var object;
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(100, 100, 100, 4, 4, 4), materials);
    object.position.set(-200, 0, 400);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.CylinderGeometry(25, 75, 100, 40, 5), materials);
    object.position.set(0, 0, 400);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.IcosahedronGeometry(75, 1), materials);
    object.position.set(-200, 0, 200);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.OctahedronGeometry(75, 2), materials);
    object.position.set(0, 0, 200);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.TetrahedronGeometry(75, 0), materials);
    object.position.set(200, 0, 200);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.PlaneGeometry(100, 100, 4, 4), materials);
    object.position.set(-200, 0, 0);
    scene.add(object);
    var object2;
    object2 = THREE.SceneUtils.createMultiMaterialObject(new THREE.CircleGeometry(50, 10, 0, Math.PI), materials);
    object2.rotation.x = Math.PI / 2;
    object.add(object2);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(75, 20, 10), materials);
    object.position.set(0, 0, 0);
    scene.add(object);
    var points = [];
    for(var i = 0; i < 50; i++) {
        points.push(new THREE.Vector3(Math.sin(i * 0.2) * 15 + 50, 0, (i - 5) * 2));
    }
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.LatheGeometry(points, 20), materials);
    object.position.set(200, 0, 0);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.TorusGeometry(50, 20, 20, 20), materials);
    object.position.set(-200, 0, -200);
    scene.add(object);
    object = THREE.SceneUtils.createMultiMaterialObject(new THREE.TorusKnotGeometry(50, 10, 50, 20), materials);
    object.position.set(0, 0, -200);
    scene.add(object);
    object = new THREE.AxisHelper(50);
    object.position.set(200, 0, -200);
    scene.add(object);
    object = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 50);
    object.position.set(200, 0, 400);
    scene.add(object);
    renderer = new THREE.WebGLRenderer({
        antialias: 1
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}
function render() {
    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos(timer) * 800;
    camera.position.z = Math.sin(timer) * 800;
    camera.lookAt(scene.position);
    for(var i = 0, l = scene.children.length; i < l; i++) {
        var object = scene.children[i];
        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;
    }
    renderer.render(scene, camera);
}
//@ sourceMappingURL=script.js.map
