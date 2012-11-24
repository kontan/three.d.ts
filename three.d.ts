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
		//clone(object?Object3D):Object3D;
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

	export class Vector4{
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


	export class Vector2{
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
	// Loaders //////////////////////////////////////////////////////////////////////////////////
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

	// Objects //////////////////////////////////////////////////////////////////////////////////
	// Renderers //////////////////////////////////////////////////////////////////////////////////
	// Renderers //////////////////////////////////////////////////////////////////////////////////
	// Renderers / Renderables /////////////////////////////////////////////////////////////////////
	// Scenes /////////////////////////////////////////////////////////////////////
	
	export class Fog{
		hex:number;
		near:number;
		far:number;
		constructor(hex:number, near?:number, far?:number);
		clone():Fog;
	}

	export class Scene extends Object3D{
		fog:Fog;
		overrideMaterial:Material;
		matrixAutoUpdate:bool;
	}

	// Textures /////////////////////////////////////////////////////////////////////
	// Extras /////////////////////////////////////////////////////////////////////
	// Extras / Animation /////////////////////////////////////////////////////////////////////
	// Extras / Cameras /////////////////////////////////////////////////////////////////////
	// Extras / Core /////////////////////////////////////////////////////////////////////
	// Extras / Geomerties /////////////////////////////////////////////////////////////////////
	// Extras / Helpers /////////////////////////////////////////////////////////////////////
	// Extras / Modifiers /////////////////////////////////////////////////////////////////////
	// Extras / Objects /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Effects /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Plugins /////////////////////////////////////////////////////////////////////
	// Extras / Renderers / Shaders /////////////////////////////////////////////////////////////////////
}