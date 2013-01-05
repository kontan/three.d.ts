if(!this.Detector.webgl) {
    this.Detector.addGetWebGLMessage();
}
var container, stats;
var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae, skin;
var loader = new this.THREE.Collada.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('../models/collada/monster/monster.dae', function (collada) {
    dae = collada.scene;
    skin = collada.skins[0];
    dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
    dae.updateMatrix();
    init();
    animate();
});
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(2, 2, 3);
    scene = new THREE.Scene();
    var size = 14, step = 1;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({
        color: 13421772,
        opacity: 0.2
    });
    for(var i = -size; i <= size; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
        geometry.vertices.push(new THREE.Vector3(size, -0.04, i));
        geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
        geometry.vertices.push(new THREE.Vector3(i, -0.04, size));
    }
    var line = new THREE.Line(geometry, material, THREE.LinePieces);
    scene.add(line);
    scene.add(dae);
    particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({
        color: 16777215
    }));
    scene.add(particleLight);
    scene.add(new THREE.AmbientLight(13421772));
    var directionalLight = new THREE.DirectionalLight(15658734);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);
    pointLight = new THREE.PointLight(16777215, 4);
    pointLight.position = particleLight.position;
    scene.add(pointLight);
    renderer = new THREE.WebGLRenderer();
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
var t = 0;
var clock = new this.THREE.Clock();
function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    if(t > 1) {
        t = 0;
    }
    if(skin) {
        for(var i = 0; i < skin.morphTargetInfluences.length; i++) {
            skin.morphTargetInfluences[i] = 0;
        }
        skin.morphTargetInfluences[Math.floor(t * 30)] = 1;
        t += delta;
    }
    render();
    stats.update();
}
function render() {
    var timer = Date.now() * 0.0005;
    camera.position.x = Math.cos(timer) * 10;
    camera.position.y = 2;
    camera.position.z = Math.sin(timer) * 10;
    camera.lookAt(scene.position);
    particleLight.position.x = Math.sin(timer * 4) * 3009;
    particleLight.position.y = Math.cos(timer * 5) * 4000;
    particleLight.position.z = Math.cos(timer * 4) * 3009;
    renderer.render(scene, camera);
}
//@ sourceMappingURL=script.js.map
