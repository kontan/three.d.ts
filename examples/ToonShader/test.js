function initialize(vertexShaderSource, pixelShaderSource, vertexShaderContourSource, pixelShaderContourSource) {
    vertexShaderSource = vertexShaderSource.replace("//[[shadowmap_pars_vertex]]", THREE.ShaderChunk.shadowmap_pars_vertex + "\n");
    vertexShaderSource = vertexShaderSource.replace("//[[shadowmap_vertex]]", THREE.ShaderChunk.shadowmap_vertex + "\n");
    pixelShaderSource = pixelShaderSource.replace("//[[shadowmap_pars_fragment]]", THREE.ShaderChunk.shadowmap_pars_fragment + "\n");
    pixelShaderSource = pixelShaderSource.replace("//[[shadowmap_fragment]]", THREE.ShaderChunk.shadowmap_fragment + "\n");
    function makeToon(viewportHeight, lightPos, mesh) {
        var uniforms = {
            color: {
                type: "v3",
                value: new THREE.Vector3(1, 1, 0)
            },
            shadowOpacity: {
                type: "f",
                value: 0.2
            },
            lightPosition: {
                type: "v3",
                value: lightPos.clone()
            },
            threshold: {
                type: "f",
                value: -0.5
            }
        };
        var material_solid = new THREE.ShaderMaterial({
            vertexShader: vertexShaderSource,
            fragmentShader: pixelShaderSource,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["shadowmap"], 
                uniforms
            ]),
            blending: THREE.NormalBlending,
            depthTest: true,
            wireframe: false,
            vertexColors: THREE.NoColors,
            skinning: false,
            fog: false,
            side: THREE.FrontSide
        });
        mesh.material = material_solid;
        var material_contour = new THREE.ShaderMaterial({
            vertexShader: vertexShaderContourSource,
            fragmentShader: pixelShaderContourSource,
            uniforms: {
                lineWidth: {
                    type: "f",
                    value: 0.085 / HEIGHT
                },
                lineColor: {
                    type: "v3",
                    value: new THREE.Vector3(0.4, 0.4, 0.4)
                }
            },
            defines: {
            },
            blending: THREE.NormalBlending,
            depthTest: true,
            wireframe: false,
            lights: false,
            vertexColors: THREE.NoColors,
            skinning: false,
            fog: false,
            side: THREE.BackSide
        });
        var mesh_contour = new THREE.Mesh(mesh.geometry.clone(), material_contour);
        mesh_contour.position = mesh.position.clone();
        return mesh_contour;
    }
    var WIDTH = 800;
    var HEIGHT = 600;
    var lightPos = new THREE.Vector3(200, 400, 10);
    var buffalo, buffalo_contour;
    var renderer = new THREE.WebGLRenderer({
        clearColor: 16777215,
        clearAlpha: 1.0,
        antialias: true
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setSize(WIDTH, HEIGHT);
    var scene = new THREE.Scene();
    var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 800;
    camera.position.y = 120;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    var radius = 50, segments = 16, rings = 16;
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings));
    sphere.position.x = 100;
    sphere.position.y = 100;
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    var sphere_contour = makeToon(HEIGHT, lightPos, sphere);
    sphere_contour.castShadow = true;
    sphere_contour.receiveShadow = true;
    scene.add(sphere_contour);
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshPhongMaterial({
        color: 65280
    }));
    plane.position.y = -120;
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);
    var directionalLight = new THREE.DirectionalLight(16777215);
    directionalLight.position = lightPos.clone();
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;
    directionalLight.shadowMapWidth = 1024;
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowCameraVisible = true;
    scene.add(directionalLight);
    $('#container').append(renderer.domElement);
    var theta = 0;
    function mainloop() {
        sphere.position.z = 100 * Math.sin(theta);
        sphere_contour.position.z = sphere.position.z;
        theta += 0.02;
        renderer.setFaceCulling("back");
        renderer.render(scene, camera);
        requestAnimationFrame(mainloop);
    }
    mainloop();
    var loader = new THREE.JSONLoader();
    loader.load("suzanneHi.js", function (geometry, materials) {
        buffalo = new THREE.Mesh(geometry);
        buffalo.castShadow = true;
        buffalo.receiveShadow = true;
        scene.add(buffalo);
        buffalo_contour = makeToon(HEIGHT, lightPos, buffalo);
        scene.add(buffalo_contour);
        buffalo_contour.castShadow = true;
        buffalo_contour.receiveShadow = true;
        window.addEventListener("keydown", function (e) {
            var dx = ((e.keyCode == 38 ? 1 : 0) - (e.keyCode == 40 ? 1 : 0)) * 0.1;
            var dy = ((e.keyCode == 37 ? 1 : 0) - (e.keyCode == 39 ? 1 : 0)) * 0.1;
            var dz = ((e.keyCode == 33 ? 1 : 0) - (e.keyCode == 34 ? 1 : 0)) * 10;
            if(dx != 0 || dy != 0 || dz != 0) {
                buffalo.rotation.x += ((e.keyCode == 38 ? 1 : 0) - (e.keyCode == 40 ? 1 : 0)) * 0.1;
                buffalo.rotation.y += ((e.keyCode == 37 ? 1 : 0) - (e.keyCode == 39 ? 1 : 0)) * 0.1;
                buffalo.position.z += ((e.keyCode == 33 ? 1 : 0) - (e.keyCode == 34 ? 1 : 0)) * 10;
                buffalo_contour.rotation = buffalo.rotation.clone();
                buffalo_contour.position = buffalo.position.clone();
                e.preventDefault();
            }
        });
    });
}
$(function () {
    var shaderFiles = [
        "vertexshader.glsl", 
        "pixelshader.glsl", 
        "vertexshader_contour.glsl", 
        "pixelshader_contour.glsl"
    ];
    var sources = [];
    var loadedFileCount = 0;
    shaderFiles.forEach(function (file, i) {
        $.ajax(file, {
            success: function (data) {
                sources[i] = data;
                loadedFileCount++;
                if(loadedFileCount == shaderFiles.length) {
                    initialize(sources[0], sources[1], sources[2], sources[3]);
                }
            }
        });
    });
});
//@ sourceMappingURL=test.js.map
