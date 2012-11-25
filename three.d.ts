/**
 * three.d.ts
 *
 * based on three.js (http://mrdoob.github.com/three.js/) r53
 *
 * @author Kon / http://phyzkit.net/
 */
module THREE{
	export var REVISION:string;

	export var FrontSide:number;
	export var BackSide:number;
	export var DoubleSide:number;

	// shading
	export var NoShading:number;
	export var FlatShading:number;
	export var SmoothShading:number;

	// colors
	export var NoColors:number;
	export var FaceColors:number;
	export var VertexColors:number;

	// blending modes
	export var NoBlending:number;
	export var NormalBlending:number;
	export var AdditiveBlending:number;
	export var SubtractiveBlending:number;
	export var MultiplyBlending:number;
	export var CustomBlending:number;

	// custom blending equations
	// (numbers start from 100 not to clash with other
	//  mappings to OpenGL constants defined in Texture.js)
	export var AddEquation:number;
	export var SubtractEquation:number;
	export var ReverseSubtractEquation:number;
	// custom blending destination factors
	export var ZeroFactor:number;
	export var OneFactor:number;
	export var SrcColorFactor:number;
	export var OneMinusSrcColorFactor:number;
	export var SrcAlphaFactor:number;
	export var OneMinusSrcAlphaFactor:number;
	export var DstAlphaFactor:number;
	export var OneMinusDstAlphaFactor:number;

	// custom blending source factors
	export var DstColorFactor:number;
	export var OneMinusDstColorFactor:number;
	export var SrcAlphaSaturateFactor:number;

	// TEXTURE CONSTANTS
	export var MultiplyOperation:number;
	export var MixOperation:number;
	export var AddOperation:number;
	
	// Mapping modes
	export var UVMapping:()=>void;
	export var CubeReflectionMapping:()=>void;
	export var CubeRefractionMapping:()=>void;
	export var SphericalReflectionMapping:()=>void;
	export var SphericalRefractionMapping:()=>void;

	// Wrapping modes
	export var RepeatWrapping:number;
	export var ClampToEdgeWrapping:number;
	export var MirroredRepeatWrapping:number;

	// Filters
	export var NearestFilter:number;
	export var NearestMipMapNearestFilter:number;
	export var NearestMipMapLinearFilter:number;
	export var LinearFilter:number;
	export var LinearMipMapNearestFilter:number;
	export var LinearMipMapLinearFilter:number;

	// Data types
	export var UnsignedByteType:number;
	export var ByteType:number;
	export var ShortType:number;
	export var UnsignedShortType:number;
	export var IntType:number;
	export var UnsignedIntType:number;
	export var FloatType:number;

	// Pixel types
	//	export var UnsignedByteType:number;
	export var UnsignedShort4444Type:number;
	export var UnsignedShort5551Type:number;
	export var UnsignedShort565Type:number;

	// Pixel formats
	export var AlphaFormat:number;
	export var RGBFormat:number;
	export var RGBAFormat:number;
	export var LuminanceFormat:number;
	export var LuminanceAlphaFormat:number;

	// Compressed texture formats
	export var RGB_S3TC_DXT1_Format:number;
	export var RGBA_S3TC_DXT1_Format:number;
	export var RGBA_S3TC_DXT3_Format:number;
	export var RGBA_S3TC_DXT5_Format:number;

	/*
	// Potential future PVRTC compressed texture formats
		export var RGB_PVRTC_4BPPV1_Format:number;
		export var RGB_PVRTC_2BPPV1_Format:number;
		export var RGBA_PVRTC_4BPPV1_Format:number;
		export var RGBA_PVRTC_2BPPV1_Format:number;
	*/

	// Core ///////////////////////////////////////////////////////////////////////////////////////////////
	export class Clock{
		autoStart:bool;
		startTime:number;
		oldTime:number;
		elapsedTime:number;
		running:bool;
		constructor(autoStart:bool);
		start():void;
		stop():void;
		getElapsedTime():number;
		getDelta():number;
	}

	interface HSV{
		h:number;
		s:number;
		v:number;
	}

	export class Color{
		constructor(hex?:number);
		r:number;
		g:number;
		b:number;
		copy(color:Color):Color;;
		copyGammaToLinear(color:Color):Color;
		copyLinearToGamma(color:Color):Color;
		convertGammaToLinear():Color;
		convertLinearToGamma():Color;
		setRGB(r:number, g:number, b:number):Color;
		setHSV(h:number, s:number, v:number):Color;
		getHex():number;
		setHex(hex:number):Color;
		getHexString():string;
		getContextStyle():string;;
		setContextStyle(style:string):Color;
		getHSV(hsv?:HSV):HSV;
		lerpSelf(color:Color, alpha:number):Color;
		clone():Color;
	}

	export class Face{
	}

	export class Face3 extends Face{
		a:number;
		b:number;
		c:number;
		normal:Vector3;
		color:Color;
		vertexNormals:Vector3[];
		vertexColors:Color[];
		vertexTangets:number[];	// *TODO* Is it a misspelling of "vertexTangents" ?
		materialIndex:number;
		centroid:number;
		constructor(a:number, b:number, c:number, normal:Vector3, color:Color, materialIndex:number);
		clone():Face3;
	}

	export class Face4 extends Face{
		a:number;
		b:number;
		c:number;
		d:number;
		normal:Vector3;
		color:Color;
		vertexNormals:Vector3[];
		vertexColors:Color[];
		vertexTangets:number[];	// *TODO* Is it a misspelling of "vertexTangents" ?
		materialIndex:number;
		centroid:number;
		constructor(a:number, b:number, c:number, d:number, normal:Vector3, color:Color, materialIndex:number);
		clone():Face3;
	}

	export class Frustum{
		constructor();
		planes:Vector4[];
		setFromMatrix(m:Matrix4):void;
		contains(object:Object3D):bool;
	}


	export interface MorphTarget{ 
		name:string;
		vertices:Vector3[];
	}

	export interface MorphColor{ 
		name:string;
		color:Color[];
	}

	export interface BoundingBox{ 
		min:Vector3;
		max:Vector3;
	}

	export interface BoundingSphere{ 
		radius:number;
	}

	export class Geometry{
		constructor();
		id:number;
		name:string;
		vertices:Vector3[];
		colors:Color[];
		materials:Material[];
		faces:Face[];
		faceUvs:UV[];
		faceVertexUvs:UV[][];
		morphTargets:MorphTarget[];
		morphColors:MorphColor[];
		skinWeights:number[];
		skinIndices:number[];
		boundingBox:BoundingBox;
		boundingSphere:BoundingSphere;
		hasTangents:bool;
		dynamic:bool;
		applyMatrix(matrix:Matrix4):void;
		computeCentroids():void;
		computeFaceNormals():void;
		computeVertexNormals(areaWeighted:bool);
		computeMorphNormals():void;
		computeTangents():void;;
		computeLineDistances():void;
		computeBoundingBox():void;
		computeBoundingSphere();
		mergeVertices():number;
		clone():Geometry;
		//deallocate():void;
	}
	// var GeometryIdCount:number;
	// var GeometryLibrary:Geometry[];

	export class Math{
		clamp(x:number, a:number, b:number):number;
		clampBottom(x:number, a:number):number;
		mapLinear(x:number, a1:number, a2:number, b1:number, b2:number):number;
		random16():number;
		randInt(low:number, high:number):number;
		randFloat(low:number, high:number):number;
		randFloatSpread(range:number):number;
		sign(x:number):number;
	}

	export class Matrix3{
		elements:Float32Array;
		constructor();
		//multiplyVector3(v:Vector3):Vector3;
		//multiplyVector3Array(a:number[]):number[];
		//getInverse(matrix:Matrix3);
		transpose():Matrix3;
		transposeIntoArray(r:number[]):number[];
	}

	export class Matrix4{
		elements:Float32Array;
		constructor(n11:number, n12:number, n13:number, n14:number, n21:number, n22:number, n23:number, n24:number, n31:number, n32:number, n33:number, n34:number, n41:number, n42:number, n43:number, n44:number);
		set(n11:number, n12:number, n13:number, n14:number, n21:number, n22:number, n23:number, n24:number, n31:number, n32:number, n33:number, n34:number, n41:number, n42:number, n43:number, n44:number):Matrix4;
		identity():Matrix4;
		copy(m:Matrix4):Matrix4;
		lookAt(eye:Vector3, target:Vector3, up:Vector3):Matrix4;
		multiply(a:Matrix4, b:Matrix4):Matrix4;
		multiplySelf(m:Matrix4):Matrix4;
		multiplyToArray(a:Matrix4, b:Matrix4, r:number[]):Matrix4;
		multiplyScalar(s:number):Matrix4;
		multiplyVector3(v:Vector3):Vector3;
		multiplyVector4( v:Vector4):Vector4;
		multiplyVector3Array(a:number[]):number[];
		rotateAxis(v:Vector3):Vector3;
		crossVector(a:Vector3):Vector4;
		determinant():number;
		transpose():Matrix4;
		flattenToArray(flat:number[]):number[];
		flattenToArrayOffset(flat:number[], offset:number):number[];
		getPosition():Vector3;
		setPosition(v:Vector3):Vector3;
		getColumnX():Vector3;
		getColumnY():Vector3;
		getColumnZ():Vector3;
		getInverse(m:Matrix4):Matrix4;
		setRotationFromEuler(v:Vector3, order:string):Matrix4;
		setRotationFromQuaternion(q:Quaternion):Matrix4;
		compose(translation:Vector3, rotation:Quaternion, scale:Vector3);
		decompose(translation:Vector3, rotation:Quaternion, scale:Vector3):any[];
		extractPosition(m:Matrix4):Matrix4;
		extractRotation(m:Matrix4):Matrix4;
		translate(v:Vector3):Matrix4;
		rotateX(angle:number):Matrix4;
		rotateY(angle:number):Matrix4;
		rotateZ(angle:number):Matrix4;
		rotateByAxis(axis:Vector3, angle:number):Matrix4;
		scale(v:Vector3):Matrix4;
		// getMaxScaleOnAxis():number;
		makeTranslation(x:number, y:number, z:number):Matrix4;
		makeRotationX(theta:number):Matrix4;
		makeRotationY(theta:number):Matrix4;
		makeRotationZ(theta:number):Matrix4;
		makeRotationAxis(axis:Vector3, angle:number):Matrix4;
		makeScale(x:number, y:number, z:number):Matrix4;
		makeFrustum(left:number, right:number, bottom:number, top:number, near:number, far:number):Matrix4;
		makePerspective(fov:number, aspect:number, near:number, far:number):Matrix4;
		makeOrthographic(left:number, right:number, top:number, bottom:number, near:number, far:number):Matrix4;
		clone():Matrix4;
	}

	export class Object3D{
		id:number;
		name:string;
		parent:Object3D;
		children:Object3D[];
		position:Vector3;
		rotation:Vector3;
		eulerOrder:string;
		scale:Vector3;
		up:Vector3;	
		matrix:Matrix4;
		matrixRotationWorld:Matrix4;
		quaternion:Quaternion;
		useQuaternion:bool;
		boundRadius:number;
		boundRadiusScale:number;
		renderDepth:number;
		visible:number;
		castShadow:bool;
		receiveShadow:bool;
		frustumCulled:bool;
		matrixAutoUpdate:bool;
		matrixWorldNeedsUpdate:bool;
		rotationAutoUpdate:bool;
		constructor();
		applyMatrix(matrix:Matrix4):void;
		translate(distance:number, axis:Vector3):void;
		translateX(distance:number);
		translateY(distance:number);
		translateZ(distance:number);
		//localToWorld(vector:Vector3):Vector3;
		//worldToLocal(vector:Vector3):Vector3;
		lookAt(vector:Vector3):void;
		add(object:Object3D):void;
		remove(object:Object3D):void;
		//traverse(callback:(Object3D)=>any);
		getChildByName(name:string, recursive:bool):Object3D;
		getDescendants(array?:Object3D[]):Object3D[];
		updateMatrix():void;
		updateMatrixWorld(force:bool):void;
		clone(object?:Object3D):Object3D;
		//deallocate():void;

		// static __m1:Matrix4;
		// static defaultEulerOrder:string;
	}

	//var Object3DIdCount:number;
	//var Object3DLibrary:Object3D[];

	export class Projector{
		constructor();
		projectVector(vector:Vector3, camera:Camera):Vector3;
		unprojectVector(vector:Vector3, camera:Camera):Vector3;
		pickingRay(vector:Vector3, camera:Camera):Ray;
		projectScene(scene:Scene, camera:Camera, sortObjects:bool, sortElements?:bool);
	}

	export class Quaternion{
		x:number;
		y:number;
		z:number;
		w:number;
		constructor(x?:number, y?:number, z?:number, w?:number);
		set(x:number, y:number, z:number, w:number):Quaternion;
		copy(q:Quaternion):Quaternion;
		setFromEuler(v:Vector3, order:string):Quaternion;
		setFromAxisAngle( axis, angle ):Quaternion;
		setFromRotationMatrix(m:Matrix4):Quaternion;
		inverse():Quaternion;
		conjugate():Quaternion;
		length():number;
		normalize():Quaternion;
		multiply(a:Quaternion, b:Quaternion):Quaternion;
		multiplySelf(b:Quaternion):Quaternion;
		multiplyVector3(vector:Vector3, dest:Vector3):Vector3;
		slerpSelf(qb:Quaternion, t:number):Quaternion;
		clone():Quaternion;
		static slerp(qa:Quaternion, qb:Quaternion, qm:Quaternion, t:number):Quaternion;
	}

	interface Intersect{ 
		distance:number; 
		point:Vector3; 
		face:Face;
		object:Object3D;
	}

	export class Ray{
		origin:Vector3;
		direction:Vector3;
		near:number;
		far:number;
		constructor(origin?:Vector3, direction?:Vector3, near?:number, far?:number);
		// setPrecision(value:number);
		// precision:number;
		set(origin:Vector3, direction:Vector3):void;
		intersectObject(object:Object3D, recursive?:bool):Intersect[];
		intersectObjects(objects:Object3D[], recursive?:bool):Intersect[];
	}

	export class Rectangle{
		constructor();
		getX():number;
		getY():number;
		getWidth():number;
		getHeight():number;
		getLeft():number;;
		getTop():number;;
		getRight():number;;
		getBottom():number;;
		set(left:number, top:number, right:number, bottom:number):void;
		addPoint(x:number, y:number):void;
		add3Points(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number):void;
		addRectangle(r:Rectangle):void;
		inflate(v:number):void;
		minSelf(r:Rectangle):void;
		intersects(r:Rectangle):bool;
		empty():void;
		isEmpty():bool;
	}

	interface SplineControlPoint{
		x:number;
		y:number;
		z:number;
	}

	export class Spline{
		constructor(points:SplineControlPoint[]);
		points:SplineControlPoint[];
		initFromArray(a:number[][]);
		getPoint(k:number):SplineControlPoint;
		getControlPointsArray():number[][];
		getLength(nSubDivisions?:number):{ chunks: number[];total:number;};
		reparametrizeByArcLength(samplingCoef:number):void;
	}

	export class UV{
		constructor(u:number, v:number);
		set(u:number, v:number):UV;
		copy(uv:UV):UV;
		lerpSelf(uv:UV, alpha:number):UV;
		clone():UV;
	}

	export class Vector2{
		x:number;
		y:number;
		constructor(x?:number, y?:number);
		set(x:number, y:number):void;
		copy(v:Vector2):Vector2;
		add(a:number, b:number):Vector2;
		addSelf(v:Vector2):Vector2;
		sub(a:number, b:number):Vector2;
		subSelf(v:Vector2):Vector2;
		multiplyScalar(s:number):Vector2;
		divideScalar(s:number):Vector2;
		negate:Vector2;
		dot(v:Vector2):Vector2;
		lengthSq():number;
		length():number;
		normalize():Vector2;
		distanceTo(v:Vector2):number;
		distanceToSquared(v:Vector2):number;
		setLength(l:number):Vector2;
		lerpSelf(v:Vector2, alpha:number);
		equals(v:Vector2):bool;
		clone:Vector2;
	}

	export class Vector3{
		x:number;
		y:number;
		z:number;
		constructor(x?:number, y?:number, z?:number);
		set(x:number, y:number, z:number):Vector3;
		setX(x:number):Vector3;
		setY(y:number):Vector3;
		setZ(z:number):Vector3;
		copy(v:Vector3):Vector3;
		add(a:Vector3, b:Vector3):Vector3;
		addSelf(v:Vector3):Vector3;
		addScalar(s:number):Vector3;
		sub(a:Vector3, b:Vector3):Vector3;
		subSelf( v:Vector3):Vector3;
		multiply(a:Vector3, b:Vector3):Vector3;
		multiplySelf(v:Vector3):Vector3;
		multiplyScalar(s:number):Vector3;
		divideSelf(v:Vector3):Vector3;
		divideScalar(s:number):Vector3;
		negate():Vector3;
		dot(v:Vector3):number;
		lengthSq():number;
		length():number;
		lengthManhattan():number;
		normalize():Vector3;
		setLength(l:number):Vector3;
		lerpSelf(v:Vector3, alpha:number):Vector3;
		cross(a:Vector3, b:Vector3):Vector3;
		crossSelf(v:Vector3):Vector3;
		angleTo(v:Vector3):number;
		distanceTo(v:Vector3):number;
		distanceToSquared(v:Vector3):number;
		getPositionFromMatrix(m:Matrix4):Vector3;
		setEulerFromRotationMatrix(m:Matrix4, order:string):Vector3; 
		setEulerFromQuaternion(q:Quaternion, order:string ):Vector3;
		getScaleFromMatrix(m:Matrix4):Vector3;
		equals(v:Vector3):bool;
		clone():Vector3;
	}

	export class Vector4{
		x:number;
		y:number;
		z:number;
		w:number;
		constructor(x?:number, y?:number, z?:number, w?:number);
		set(x:number, y:number, z:number, w:number):Vector4;
		copy(v:Vector4):Vector4;
		add(a:Vector4, b:Vector4):Vector4;
		addSelf(v:Vector4):Vector4;
		sub(a:Vector4, b:Vector4):Vector4;
		subSelf(v:Vector4):Vector4;
		multiplyScalar(s:number):Vector4;
		divideScalar(s:number):Vector4;
		negate():Vector4;
		dot(v:Vector4);
		lengthSq():number;
		length():number;
		lengthManhattan():number;
		normalize():Vector4;
		setLength(l:number):Vector4;
		lerpSelf(v:Vector4, alpha:number);
		clone():Vector4;
	}

	// Cameras ////////////////////////////////////////////////////////////////////////////////////////
	export class Camera extends Object3D{
		constructor();
		matrixWorldInverse:Matrix4;
		projectionMatrix:Matrix4;
		projectionMatrixInverse:Matrix4;
		lookAt(vector:Vector3):void;
	}

	export class OrthographicCamera extends Camera{
		constructor(left:number, right:number, top:number, bottom:number, near?:number, far?:number);
		left:number;
		right:number;
		top:number;
		bottom:number;
		near:number;
		far:number;
		updateProjectionMatrix():void;
	}

	export class PerspectiveCamera extends Camera{
		left:number;
		right:number;
		top:number;
		bottom:number;
		near:number;
		far:number;
		constructor(fov?:number, aspect?:number, near?:number, far?:number);
		//setLens(focalLength:number, frameHeight?:number):void;
		//setViewOffset(fullWidth:number, fullHeight:number, x:number, y:number, width:number, height:number):void;
		updateProjectionMatrix():void;
	}

	// Lights //////////////////////////////////////////////////////////////////////////////////
	export class Light extends Object3D{
		constructor(hex:number);
		color:Color;
	}

	export class AmbientLight extends Light{
		constructor(hex:number);
	}

	export class RenderTarget{
	}

	export class DirectionalLight extends Light{
		constructor(hex:number, intensity?:number);
		position:Vector3;
		target:Object3D;
		intensity:number;
		castShadow:bool;
		onlyShadow:bool;
		shadowCameraNear:number;
		shadowCameraFar:number;
		shadowCameraLeft:number;
		shadowCameraRight:number;
		shadowCameraTop:number;
		shadowCameraBottom:number;
		shadowCameraVisible:bool;
		shadowBias:number;
		shadowDarkness:number;
		shadowMapWidth:number;
		shadowMapHeight:number;
		shadowCascad:bool;
		shadowCascadeOffset:Vector3;
		shadowCascadeCount:number;;
		shadowCascadeBias:number[];
		shadowCascadeWidth:number[];
		shadowCascadeHeight:number[];
		shadowCascadeNearZ:number[];
		shadowCascadeFarZ:number[];
		shadowCascadeArray:DirectionalLight[];
		shadowMap:RenderTarget;
		shadowMapSize:number;
		shadowCamera:Camera;
		shadowMatrix:Matrix4;
	}

	export class PointLight extends Light{
		constructor(hex:number, intensity?:number, distance?:number);
		position:Vector3;
		intensity:number;
		distance:number;
	}

	export class SpotLight extends Light{
		constructor(hex:number, intensity?:number, distance?:number, angle?:number, exponent?:number);
		position:Vector3;
		target:Object3D;
		intensity:number;
		distance:number;
		angle:number;
		exponent:number;
		castShadow:bool;
		onlyShadow:bool;
		shadowCameraNear:number;
		shadowCameraFar:number;
		shadowCameraFov:number;
		shadowCameraVisible:bool;
		shadowBias:number;
		shadowDarkness:number;
		shadowMapWidth:number;
		shadowMapHeight:number;
		shadowMap:RenderTarget;
		shadowMapSize:Vector2;
		shadowCamera:Camera;
		shadowMatrix:Matrix4;
	}

	// Loaders //////////////////////////////////////////////////////////////////////////////////
	
	export class Loader{
		constructor(showStatus?:bool);
		showStatus:bool;
		statusDomElement:HTMLElement;
		onLoadStart:()=>void;
		onLoadProgress:()=>void;
		onLoadComplete:()=>void;
		//crossOrigin:string;
		//addStatusElement:()=>HTMLElement;
		//updateProgress:(progress:{total:number;loaded:number;})=>void;
		//extractUrlBase:(url:string)=>string;
		//initMaterials:(materials:Material[], texturePath:string):Material[];
		//needsTangents:(materials:Material[])=>bool;
		//createMaterial:(m:Material, texturePath:string):bool;
	}

	interface Progress{
		total:number;
		loaded:number;
	}

	export class BinaryLoader extends Loader{
		constructor(showStatus:bool);
		load(url:string, callback:(geometry:Geometry,materials:Material[])=>void, texturePath?:string, binaryPath?:string):void;
		//loadAjaxJSON(context, url, callback, texturePath, binaryPath, callbackProgress);
		//loadAjaxBuffers(json:any, callback:(geometry:Geometry, materials:Material[])=>void, binaryPath:string, texturePath:string, callbackProgress:(progress:Progress)=>void);
		//createBinModel(data:any, callback:(geometry:Geometry, materials:Material[])=>void, texturePath:string, jsonMaterials:any);
	}

	export class ImageLoader extends EventTarget{
		// crossOrigin:string;
		load(url:string, image?:HTMLImageElement):void;
	}


	export class JSONLoader extends Loader{
		constructor(showStatus:bool);
		//withCredentials:bool;
		load(url:string, callback:(geometry:Geometry)=>void, texturePath?:string):void;
		//loadAjaxJSON( context, url, callback:(geometry:Geometry,materials:Material[])=>void, texturePath, callbackProgress ) {
		//createModel(json:any, callback:(geometry:Geometry,materials:Material[])=>void, texturePath?:string) ;
	}

	export class LoadingMonitor extends EventTarget{
		constructor();
		add(loader:Loader):void;
	}

	export class SceneLoader{
		constructor();
		onLoadStart:()=>void;
		onLoadProgress:()=>void;
		onLoadComplete:()=>void;
		callbackSync:()=>void;
		callbackProgress:()=>void;
		load(url:string, callbackFinished:(scene:Scene)=>void):void;
	}

	export class TextureLoader extends EventTarget{
		constructor();
		load(url:string):void;
	}

	// Materials //////////////////////////////////////////////////////////////////////////////////
	
	export class Material{
		constructor();
		id:number;
		name:string;
		opacity:number;
		transparent:bool;
		blending:number; // Blending
		blendSrc:number;
		blendDst:number;
		blendEquation:number;
		depthTest:bool;
		depthWrite:bool;
		polygonOffset:bool;
		polygonOffsetFactor:number;
		polygonOffsetUnits:number;
		alphaTest:number;
		overdraw:bool;
		visible:bool;
		side:number; // THREE.FrontSide, THREE.BackSide, THREE.DoubleSide
		needsUpdate:bool;
	}

	export class MeshBasicMaterial extends Material{
		constructor( parameters?:any );
		color:Color;
		map:Texture;
		lightMap:Texture;
		specularMap:Texture;
		envMap:Texture; // TextureCube ?;
		combine:number; //THREE.MultiplyOperation;
		reflectivity:number;
		refractionRatio:number;
		fog:bool;
		shading:number; //THREE.SmoothShading;
		wireframe:bool;
		wireframeLinewidth:number;
		wireframeLinecap:string;
		wireframeLinejoin:string;
		vertexColors:number; // THREE.NoColors;
		skinning:bool;
		morphTargets:bool;
		clone():MeshBasicMaterial;
	}

	export class MeshPhongMaterial extends Material{
		constructor( parameters?:any );
		color:Color; // diffuse
		ambient:Color;
		emissive:Color;
		specular:Color;
		shininess:number;
		metal:bool;
		perPixel:bool;
		wrapAround:bool;
		wrapRGB:Vector3;
		map:Texture;
		lightMap:Texture;
		bumpMap:Texture;
		bumpScale:number;
		normalMap:Texture;
		normalScale:Vector2;
		specularMap:Texture;
		envMap:Texture;
		combine:number; // THREE.MultiplyOperation;
		reflectivity:number;
		refractionRatio:number;
		fog:bool;
		shading:number; // THREE.SmoothShading;
		wireframe:bool;
		wireframeLinewidth:number;
		wireframeLinecap:string;
		wireframeLinejoin:string;
		vertexColors:number; // THREE.NoColors;
		skinning:bool;
		morphTargets:bool;
		morphNormals:bool;
		clone():MeshPhongMaterial;
	}

	export class ShaderMaterial extends Material{
		constructor( parameters:any);
		fragmentShader:string;
		vertexShader:string;
		uniforms:{[paramName:string]:{type:string;value:number;};};
		defines:{[label:string]:any;};
		attributes:{[name:string]:any;};
		shading:number; // THREE.SmoothShading;
		wireframe:bool;
		wireframeLinewidth:number;
		fog:bool;
		lights:bool;
		vertexColors:number; // THREE.NoColors; 
		skinning:bool;
		morphTargets:bool;
		morphNormals:bool;
		clone():ShaderMaterial;
	}

	// Objects //////////////////////////////////////////////////////////////////////////////////
	
	export class Bone extends Object3D{
		constructor(belongsToSkin:SkinnedMesh);
		skin:SkinnedMesh;
		skinMatrix:Matrix4;
		update(parentSkinMatrix?:Matrix4, forceUpdate?:bool):void;
	}

	export class Line extends Object3D{
		constructor(geometry?:Geometry, material?:Material, type?:number);
		geometry:Geometry;
		material:Material;
		type:number;
		clone(object?:Line):Line;
	}

	export class LOD extends Object3D{
		constructor();
		LODs:Object3D[];
		addLevel(object3D:Object3D, visibleAtDistance?:number);
		update(camera:Camera);
		clone():LOD;
	}

	export class Mesh extends Object3D{
		constructor(geometry?:Geometry, material?:Material);
		geometry:Geometry;
		material:Material;
		morphTargetBase:number;
		morphTargetForcedOrder:number;
		morphTargetInfluences:number[];
		morphTargetDictionary:{[key:string]:number;};
		getMorphTargetIndexByName(name:string):number;
		clone(object?:Mesh):Mesh;
	}

	export class MorphAnimMesh extends Mesh{
		constructor(geometry:Geometry, material:Material);
		duration:number; // milliseconds
		mirroredLoop:bool;
		time:number;
		lastKeyframe:number;
		currentKeyframe:number;
		direction:number;
		directionBackwards:bool;
		setFrameRange(start:number, end:number):void;
		setDirectionForward():void;
		setDirectionBackward():void;
		parseAnimations():void;
		setAnimationLabel(label:string, start:number, end:number):void;
		playAnimation(label:string, fps:number):void;
		updateAnimation(delta:number):void;
		clone(object?:MorphAnimMesh):MorphAnimMesh;
	}

	export class Particle extends Object3D{
		constructor(material:Material);
		clone( object?:Particle ):Particle;
	}

	export class ParticleSystem extends Object3D{
		constructor( geometry?:Geometry, material?:Material );
		geometry:Geometry;
		material:Material;
		sortParticles:bool;
		clone(object?:ParticleSystem ):ParticleSystem;
	}

	export class Ribbon extends Object3D{
		constructor( geometry:Geometry, material:Material );
		geometry:Geometry;
		material:Material;
		clone( object?:Ribbon ):Ribbon;
	}

	export class SkinnedMesh extends Mesh{
		constructor(geometry?:Geometry, material?:Material, useVertexTexture?:bool);
		useVertexTexture:bool;
		identityMatrix:Matrix4;
		bones:Bone[];
		boneMatrices:Float32Array;
		boneTextureWidth:number;
		boneTextureHeight:number;
		boneTexture:DataTexture;
		addBone(bone?:Bone):Bone;
		updateMatrixWorld(force?:bool):void;
		pose():void;
		clone(object?:SkinnedMesh):SkinnedMesh;
		static offsetMatrix:Matrix4;
	}

	export class Sprite extends Object3D{
		constructor(parameters?:any);
		updateMatrix():void;
		clone(object?:Sprite):Sprite;
	}
	export class SpriteAlignment{
		static topLeft:Vector2;
		static topCenter:Vector2;
		static topRight:Vector2;
		static centerLeft:Vector2;
		static center:Vector2;
		static centerRight:Vector2;
		static bottomLeft:Vector2;
		static bottomCenter:Vector2;
		static bottomRight:Vector2;
	}

	// Renderers //////////////////////////////////////////////////////////////////////////////////

	interface Plugin{
		init(renderer:WebGLRenderer);
		render(scene:Scene,camera:Camera,currentWidth:number,currentHeight:number);
	}

	export class WebGLRenderer{
		constructor(parameters?:any);
		domElement:HTMLCanvasElement;
		context:CanvasRenderingContext2D;
		autoClear:bool;
		autoClearColor:bool;
		autoClearDepth:bool;
		autoClearStencil:bool;
		sortObjects:bool;
		autoUpdateObjects:bool;
		autoUpdateScene:bool;
		gammaInput:bool;
		gammaOutput:bool;
		physicallyBasedShading:bool;
		shadowMapEnabled:bool;
		shadowMapAutoUpdate:bool;
		shadowMapSoft:bool;
		shadowMapCullFrontFaces:bool;
		shadowMapDebug:bool;
		shadowMapCascade:bool;
		maxMorphTargets:number;
		maxMorphNormals:number;
		autoScaleCubemaps:bool;
		renderPluginsPre:Plugin[];
		renderPluginsPost:Plugin[];
		info: {
			memory:{
				programs:number;
				geometries:number;
				textures:number;
			};
			render:{
				calls:number;
				vertices:number;
				faces:number;
				points:number;
			};
		};
		getContext():CanvasRenderingContext2D;
		supportsVertexTextures():bool;
		setSize(width:number, height:number):void;
		setViewport(x:number, y:number, width:number, height:number):void;
		setScissor(x:number, y:number, width:number, height:number):void;
		enableScissorTest(enable:bool):void;
		setClearColorHex( hex:number, alpha:number):void;
		setClearColor(color:Color, alpha:number):void;
		getClearColor():Color;
		getClearAlpha():number;
		clear(color?:Color, depth?:number, stencil?:number):void;
		addPostPlugin(plugin:Plugin):void;
		addPrePlugin(plugin:Plugin):void;
		deallocateObject(object:any):void;
		deallocateTexture(texture:Texture):void;
		deallocateRenderTarget(renderTarget:RenderTarget):void;
		updateShadowMap(scene:Scene, camera:Camera):void;
		renderBufferImmediate(object, program, shading):void;
		renderBufferDirect(camera, lights, fog, material, geometryGroup, object):void;
		renderBuffer(camera, lights, fog, material, geometryGroup, object ):void;
		render(scene:Scene, camera:Camera, renderTarget?:RenderTarget, forceClear?:bool):void;
		renderImmediateObject( camera, lights, fog, material, object ):void;
		initWebGLObjects(scene:Scene):void;
		initMaterial( material, lights, fog, object ):void;
		setFaceCulling( cullFace, frontFace ):void;
		setObjectFaces( object ):void;
		setDepthTest( depthTest ):void;
		setDepthWrite( depthWrite ):void;
		setBlending( blending, blendEquation, blendSrc, blendDst ):void;
		setTexture(texture:Texture, slot ):void;
		setRenderTarget(renderTarget:RenderTarget):void;
	}

	// Renderers / Renderables /////////////////////////////////////////////////////////////////////
	// Scenes /////////////////////////////////////////////////////////////////////
	
	class AbstractFog{
	}

	export class Fog extends AbstractFog{
		hex:number;
		near:number;
		far:number;
		constructor(hex:number, near?:number, far?:number);
		clone():Fog;
	}

	export class FogExp2 extends AbstractFog{
		constructor(hex:number, density?:number);
		name:string;
		color:Color;
		density:number;
		clone():FogExp2;
	}

	export class Scene extends Object3D{
		fog:AbstractFog;
		overrideMaterial:Material;
		matrixAutoUpdate:bool;
	}

	// Textures /////////////////////////////////////////////////////////////////////
	
	export class Texture{
		constructor( image, mapping?:()=>void, wrapS?:number, wrapT?:number, magFilter?:number, minFilter?:number, format?:number, type?:number, anisotropy?:number);
		id:number;
		name:string;
		image:any; // HTMLImageElement or ImageData ;
		mapping:()=>void;
		wrapS:number;
		wrapT:number;
		magFilter:number;
		minFilter:number;
		anisotropy:number;
		format:number;
		type:number;
		offset:Vector2;
		repeatVector2:Vector2;
		generateMipmaps:bool;
		premultiplyAlpha:bool;
		flipY:bool;
		needsUpdate:bool;
		onUpdate:any;
		clone():Texture;
		deallocate();
	}
	var TextureIdCount:number;
	var TextureLibrary:Texture[];

	export class DataTexture extends Texture{
		constructor(data:ImageData , width:number, height:number, format:number, type:number, mapping:number, wrapS:number, wrapT:number, magFilter:number, minFilter:number);
		clone():DataTexture;
	}

	// Extras /////////////////////////////////////////////////////////////////////
	// Extras / Animation /////////////////////////////////////////////////////////////////////
	// Extras / Cameras /////////////////////////////////////////////////////////////////////
	// Extras / Core /////////////////////////////////////////////////////////////////////
	
	export class EventTarget{
		constructor();
		addEventListener(type:any, listener:(event:any)=>void);
		dispatchEvent(event:any);
		removeEventListener(type:any, listener:(event:any)=>void);
	}

	// Extras / Geomerties /////////////////////////////////////////////////////////////////////
	
	export class SphereGeometry extends Geometry{
		constructor(radius:number, widthSegments?:number, heightSegments?:number, phiStart?:number, phiLength?:number, thetaStart?:number, thetaLength?:number);
		radius:number;
		widthSegments:number;
		heightSegments:number;
		phiStart:number;
		phiLength:number;
		thetaStart:number;
		thetaLength:number;
	}

	// Extras / Helpers /////////////////////////////////////////////////////////////////////
	// Extras / Modifiers /////////////////////////////////////////////////////////////////////
	// Extras / Objects /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Effects /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Plugins /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Shaders /////////////////////////////////////////////////////////////////////
}