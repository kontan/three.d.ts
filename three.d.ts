/**
 * three.d.ts (https://github.com/kontan/three.d.ts)
 *
 * based on three.js (http://mrdoob.github.com/three.js/) r53
 *
 * @author Kon - http://phyzkit.net/
 */


// When you use three.d.ts with other ambient source file for WebGL,
// remove below definition for WebGLRenderingContext.
interface WebGLRenderingContext {}

module THREE{
	export var REVISION:string;

	// **HACK**   pseudo enum hack
	// TypeScript has experimental enum construct but it creates new type.For example,
	//
	//    export enum Side{ FrontSide, BackSide, DoubleSide }
	//
	// will be compiled successfully.
	// Ideally, those three.js constant values should be prefixed with the enum type name:
	//
	//     new THREE.MeshPhongMaterial().side = THREE.Side.FrontSide;
	//
	// Unfortunately, three.js currently doesn't. 
	// Therefore, at the following constant value section, those enum type are defined as class.
	// In three.d.ts, you can write a enum value as follows:
	//
	//     new THREE.MeshPhongMaterial().side = THREE.FrontSide;
	//
	// But the following code will cause a type error on compile time:
	//
	//     new THREE.MeshPhongMaterial().side = THREE.FlatShading;
	//
	// In three.js, there are no the classes. You must not instantiate an object of the classes. 
	// For example, you can compile the following code without compile time error.
	//
	//     new THREE.MeshPhongMaterial().side = new THREE.Side();
	//
	// However, it will cause a runtime type error.
	// 
	// I think it is not defect of three.js.
	// Rather, TypeScript should have more flexible enum definition syntax for existing JavaScript source codes.

	// side
	export class Side {} 
	export var FrontSide :Side;
	export var BackSide  :Side;
	export var DoubleSide:Side;

	// shading
	export class Shading {}
	export var NoShading    :Shading;
	export var FlatShading  :Shading;
	export var SmoothShading:Shading;

	// colors
	export class Colors {}
	export var NoColors    :Colors;
	export var FaceColors  :Colors;
	export var VertexColors:Colors;

	// blending modes
	export class Blending {}
	export var NoBlending         :Blending;
	export var NormalBlending     :Blending;
	export var AdditiveBlending   :Blending;
	export var SubtractiveBlending:Blending;
	export var MultiplyBlending   :Blending;
	export var CustomBlending     :Blending;

	// custom blending equations
	// (numbers start from 100 not to clash with other
	//  mappings to OpenGL constants defined in Texture.js)
	export class BlendingEquation {}
	export var AddEquation            :BlendingEquation;
	export var SubtractEquation       :BlendingEquation;
	export var ReverseSubtractEquation:BlendingEquation;

	// custom blending destination factors
	export class BlendingDstFactor {}
	export var ZeroFactor            :BlendingDstFactor;
	export var OneFactor             :BlendingDstFactor;
	export var SrcColorFactor        :BlendingDstFactor;
	export var OneMinusSrcColorFactor:BlendingDstFactor;
	export var SrcAlphaFactor        :BlendingDstFactor;
	export var OneMinusSrcAlphaFactor:BlendingDstFactor;
	export var DstAlphaFactor        :BlendingDstFactor;
	export var OneMinusDstAlphaFactor:BlendingDstFactor;

	// custom blending source factors
	export class BlendingSrcFactor {}
	export var DstColorFactor        :BlendingSrcFactor;
	export var OneMinusDstColorFactor:BlendingSrcFactor;
	export var SrcAlphaSaturateFactor:BlendingSrcFactor;

	// TEXTURE CONSTANTS
	export class Combine {}
	export var MultiplyOperation:Combine;
	export var MixOperation     :Combine;
	export var AddOperation     :Combine;
	
	// Mapping modes
	export class Mapping {}
	export var UVMapping                 :Mapping;
	export var CubeReflectionMapping     :Mapping;
	export var CubeRefractionMapping     :Mapping;
	export var SphericalReflectionMapping:Mapping;
	export var SphericalRefractionMapping:Mapping;

	// Wrapping modes
	export class Wrapping {}
	export var RepeatWrapping        :Wrapping;
	export var ClampToEdgeWrapping   :Wrapping;
	export var MirroredRepeatWrapping:Wrapping;

	// Filters
	export class TextureFilter {}
	export var NearestFilter             :TextureFilter;
	export var NearestMipMapNearestFilter:TextureFilter;
	export var NearestMipMapLinearFilter :TextureFilter;
	export var LinearFilter              :TextureFilter;
	export var LinearMipMapNearestFilter :TextureFilter;
	export var LinearMipMapLinearFilter  :TextureFilter;

	// Data types
	export class TextureDataType {}
	export var UnsignedByteType :TextureDataType;
	export var ByteType         :TextureDataType;
	export var ShortType        :TextureDataType;
	export var UnsignedShortType:TextureDataType;
	export var IntType          :TextureDataType;
	export var UnsignedIntType  :TextureDataType;
	export var FloatType        :TextureDataType;

	// Pixel types
	export class PixelType {}
	//	export var UnsignedByteType:number;
	export var UnsignedShort4444Type:PixelType;
	export var UnsignedShort5551Type:PixelType;
	export var UnsignedShort565Type :PixelType;

	// Pixel formats
	export class PixelFormat {}
	export var AlphaFormat         :PixelFormat;
	export var RGBFormat           :PixelFormat;
	export var RGBAFormat          :PixelFormat;
	export var LuminanceFormat     :PixelFormat;
	export var LuminanceAlphaFormat:PixelFormat;

	// Compressed texture formats
	export class CompressedPixelFormat {}
	export var RGB_S3TC_DXT1_Format :CompressedPixelFormat;
	export var RGBA_S3TC_DXT1_Format:CompressedPixelFormat;
	export var RGBA_S3TC_DXT3_Format:CompressedPixelFormat;
	export var RGBA_S3TC_DXT5_Format:CompressedPixelFormat;

	
	// Potential future PVRTC compressed texture formats
	// export class CompressedTextureFormats {}
	// export var RGB_PVRTC_4BPPV1_Format :CompressedTextureFormats;
	// export var RGB_PVRTC_2BPPV1_Format :CompressedTextureFormats;
	// export var RGBA_PVRTC_4BPPV1_Format:CompressedTextureFormats;
	// export var RGBA_PVRTC_2BPPV1_Format:CompressedTextureFormats;


	// Core ///////////////////////////////////////////////////////////////////////////////////////////////

	export class BufferGeometry{ 
		constructor();
		id:number;
		attributes:{[name:string]:any;};
		dynamic:bool;
		boundingBox:BoundingBox3D;
		boundingSphere:BoundingSphere;
		hasTangents:bool;
		morphTargets:any[];
		applyMatrix(matrix:Matrix4):void;
		verticesNeedUpdate:bool;
		computeBoundingBox():void;
		computeBoundingSphere():void;
		computeVertexNormals():void;
		normalizeNormals():void;
		computeTangents():void;
		deallocate():void;
	}

	export class Clock{
		constructor(autoStart:bool);		
		autoStart:bool;
		startTime:number;
		oldTime:number;
		elapsedTime:number;
		running:bool;
		start():void;
		stop():void;
		getElapsedTime():number;
		getDelta():number;
	}

	export interface HSV{
		h:number;
		s:number;
		v:number;
	}

	export class Color{
		constructor(hex?:string);
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

	export class EventTarget{
		constructor();
		addEventListener(type:string, listener:(event:any)=>void):void;
		dispatchEvent(event:any);
		removeEventListener(type:string, listener:(event:any)=>void):void;
	}

	// **HACK**
	// three.js has no Face class but some properties have array contains both of Face3 and Face4.
	export class Face{
	}

	export class Face3 extends Face{
		constructor(a:number, b:number, c:number, normal:Vector3, color:Color, materialIndex:number);		
		a:number;
		b:number;
		c:number;
		normal:Vector3;
		color:Color;
		vertexNormals:Vector3[];
		vertexColors:Color[];
		vertexTangents:number[];
		materialIndex:number;
		centroid:number;
		clone():Face3;
	}

	export class Face4 extends Face{
		constructor(a:number, b:number, c:number, d:number, normal:Vector3, color:Color, materialIndex:number);
		a:number;
		b:number;
		c:number;
		d:number;
		normal:Vector3;
		color:Color;
		vertexNormals:Vector3[];
		vertexColors:Color[];
		vertexTangents:number[];
		materialIndex:number;
		centroid:number;
		clone():Face4;
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

	export interface BoundingBox3D{ 
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
		boundingBox:BoundingBox3D;
		boundingSphere:BoundingSphere;
		hasTangents:bool;
		dynamic:bool;
		applyMatrix(matrix:Matrix4):void;
		computeCentroids():void;
		computeFaceNormals():void;
		computeVertexNormals(areaWeighted:bool):void;
		computeMorphNormals():void;
		computeTangents():void;;
		computeLineDistances():void;
		computeBoundingBox():void;
		computeBoundingSphere():void;
		mergeVertices():number;
		clone():Geometry;
		deallocate():void;
	}
	
	var GeometryIdCount:number;
	var GeometryLibrary:Geometry[];

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
		constructor();
		elements:Float32Array;
		multiplyVector3(v:Vector3):Vector3;
		multiplyVector3Array(a:number[]):number[];
		getInverse(matrix:Matrix3):Matrix3;
		transpose():Matrix3;
		transposeIntoArray(r:number[]):number[];
	}

	export class Matrix4{
		constructor(n11:number, n12:number, n13:number, n14:number, n21:number, n22:number, n23:number, n24:number, n31:number, n32:number, n33:number, n34:number, n41:number, n42:number, n43:number, n44:number);
		elements:Float32Array;
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
		compose(translation:Vector3, rotation:Quaternion, scale:Vector3):Matrix4;
		decompose(translation:Vector3, rotation:Quaternion, scale:Vector3):any[];
		extractPosition(m:Matrix4):Matrix4;
		extractRotation(m:Matrix4):Matrix4;
		translate(v:Vector3):Matrix4;
		rotateX(angle:number):Matrix4;
		rotateY(angle:number):Matrix4;
		rotateZ(angle:number):Matrix4;
		rotateByAxis(axis:Vector3, angle:number):Matrix4;
		scale(v:Vector3):Matrix4;
		getMaxScaleOnAxis():number;
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
		constructor();		
		id:number;
		name:string;
		properties:any;
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
		applyMatrix(matrix:Matrix4):void;
		translate(distance:number, axis:Vector3):void;
		translateX(distance:number):void;
		translateY(distance:number):void;
		translateZ(distance:number):void;
		localToWorld(vector:Vector3):Vector3;
		worldToLocal(vector:Vector3):Vector3;
		lookAt(vector:Vector3):void;
		add(object:Object3D):void;
		remove(object:Object3D):void;
		traverse(callback:(object:Object3D)=>any):void;
		getChildByName(name:string, recursive:bool):Object3D;
		getDescendants(array?:Object3D[]):Object3D[];
		updateMatrix():void;
		updateMatrixWorld(force:bool):void;
		clone(object?:Object3D):Object3D;
		deallocate():void;
		static defaultEulerOrder:string;
	}

	var Object3DIdCount:number;
	var Object3DLibrary:Object3D[];

	export class Projector{
		constructor();
		projectVector(vector:Vector3, camera:Camera):Vector3;
		unprojectVector(vector:Vector3, camera:Camera):Vector3;
		pickingRay(vector:Vector3, camera:Camera):Ray;
		projectScene(scene:Scene, camera:Camera, sortObjects:bool, sortElements?:bool):{ 
			objects:Object3D[]; 	// Mesh, Line or other object  
			sprites:Object3D[];	// Sprite or Particle 
			lights:Light[]; 
			elements: Face[];	// Line, Particle, Face3 or Face4 
		};
	}

	export class Quaternion{
		constructor(x?:number, y?:number, z?:number, w?:number);
		x:number;
		y:number;
		z:number;
		w:number;
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

	export interface Intersect{ 
		distance:number; 
		point:Vector3; 
		face:Face;
		object:Object3D;
	}

	export class Ray{
		constructor(origin?:Vector3, direction?:Vector3, near?:number, far?:number);
		origin:Vector3;
		direction:Vector3;
		near:number;
		far:number;
		precision:number;
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

	export interface SplineControlPoint{
		x:number;
		y:number;
		z:number;
	}

	export class Spline{
		constructor(points:SplineControlPoint[]);
		points:SplineControlPoint[];
		initFromArray(a:number[][]):void;
		getPoint(k:number):SplineControlPoint;
		getControlPointsArray():number[][];
		getLength(nSubDivisions?:number):{ chunks: number[];total:number;};
		reparametrizeByArcLength(samplingCoef:number):void;
	}

	export class UV{
		constructor(u?:number, v?:number);
		set(u:number, v:number):UV;
		copy(uv:UV):UV;
		lerpSelf(uv:UV, alpha:number):UV;
		clone():UV;
	}

	export class Vector2{
		constructor(x?:number, y?:number);		
		x:number;
		y:number;
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
		lerpSelf(v:Vector2, alpha:number):Vector2;
		equals(v:Vector2):bool;
		clone():Vector2;
	}

	export class Vector3{
		constructor(x?:number, y?:number, z?:number);	
		x:number;
		y:number;
		z:number;
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
		constructor(x?:number, y?:number, z?:number, w?:number);		
		x:number;
		y:number;
		z:number;
		w:number;
		set(x:number, y:number, z:number, w:number):Vector4;
		copy(v:Vector4):Vector4;
		add(a:Vector4, b:Vector4):Vector4;
		addSelf(v:Vector4):Vector4;
		sub(a:Vector4, b:Vector4):Vector4;
		subSelf(v:Vector4):Vector4;
		multiplyScalar(s:number):Vector4;
		divideScalar(s:number):Vector4;
		negate():Vector4;
		dot(v:Vector4):number;
		lengthSq():number;
		length():number;
		lengthManhattan():number;
		normalize():Vector4;
		setLength(l:number):Vector4;
		lerpSelf(v:Vector4, alpha:number):Vector4;
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
		constructor(fov?:number, aspect?:number, near?:number, far?:number);
		fov:number;
		aspect:number;
		near:number;
		far:number;
		setLens(focalLength:number, frameHeight?:number):void;
		setViewOffset(fullWidth:number, fullHeight:number, x:number, y:number, width:number, height:number):void;
		updateProjectionMatrix():void;
	}

	// Lights //////////////////////////////////////////////////////////////////////////////////
	export class Light extends Object3D{
		constructor(hex?:number);
		color:Color;
	}

	export class AmbientLight extends Light{
		constructor(hex?:number);
	}

	export class RenderTarget{
	}

	export class DirectionalLight extends Light{
		constructor(hex?:number, intensity?:number);
		position:Vector3;
		target:Object3D;
		intensity:number;

		// shadow map
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

	export class HemisphereLight extends Light{
		constructor(skyColorHex?:number, groundColorHex?:number, intensity?:number);
		groundColor:Color;
		position:Vector3;
		intensity:number;
	}

	export class PointLight extends Light{
		constructor(hex?:number, intensity?:number, distance?:number);
		position:Vector3;
		intensity:number;
		distance:number;
	}

	export class SpotLight extends Light{
		constructor(hex?:number, intensity?:number, distance?:number, angle?:number, exponent?:number);
		position:Vector3;
		target:Object3D;
		intensity:number;
		distance:number;
		angle:number;
		exponent:number;

		// shadow map
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
	
	export interface Progress{
		total:number;
		loaded:number;
	}

	export class Loader{
		constructor(showStatus?:bool);
		showStatus:bool;
		statusDomElement:HTMLElement;
		onLoadStart:()=>void;
		onLoadProgress:()=>void;
		onLoadComplete:()=>void;
		crossOrigin:string;
		addStatusElement():HTMLElement;
		updateProgress(progress:Progress):void;
		extractUrlBase(url:string):string;
		initMaterials(materials:Material[], texturePath:string):Material[];
		needsTangents(materials:Material[]):bool;
		createMaterial(m:Material, texturePath:string):bool;
	}

	export class BinaryLoader extends Loader{
		constructor(showStatus:bool);
		load(url:string, callback:(geometry:Geometry,materials:Material[])=>void, texturePath?:string, binaryPath?:string):void;
		loadAjaxJSON(context, url, callback, texturePath, binaryPath, callbackProgress):void;
		loadAjaxBuffers(json:any, callback:(geometry:Geometry, materials:Material[])=>void, binaryPath:string, texturePath?:string, callbackProgress?:(progress:Progress)=>void):void;
		createBinModel(data:any, callback:(geometry:Geometry, materials:Material[])=>void, texturePath:string, jsonMaterials:any):void;
	}

	export class ImageLoader extends EventTarget{
		constructor();
		crossOrigin:string;
		load(url:string, image?:HTMLImageElement):void;
	}


	export class JSONLoader extends Loader{
		constructor(showStatus:bool);
		withCredentials:bool;
		load(url:string, callback:(geometry:Geometry, materials:Material[])=>void, texturePath?:string):void;
		loadAjaxJSON( context, url, callback:(geometry:Geometry,materials:Material[])=>void, texturePath?:string, callbackProgress?:(progress:Progress)=>void):void;
		createModel(json:any, callback:(geometry:Geometry,materials:Material[])=>void, texturePath?:string):void;
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
		blending:Blending;
		blendSrc:BlendingDstFactor;
		blendDst:BlendingSrcFactor;
		blendEquation:BlendingEquation;
		depthTest:bool;
		depthWrite:bool;
		polygonOffset:bool;
		polygonOffsetFactor:number;
		polygonOffsetUnits:number;
		alphaTest:number;
		overdraw:bool;
		visible:bool;
		side:Side;
		needsUpdate:bool;
	}

	export interface LineBasicMaterialParameters{
		color?:number;
 		opacity?:number;
 		blending?:Blending;
		depthTest?:bool;
		linewidth?:number;
		linecap?:string;
 		linejoin?:string;
 		vertexColors?:bool;
 		fog?:bool;
 	}

	export class LineBasicMaterial extends Material{
		constructor(parameters?:LineBasicMaterialParameters);
		color:Color;
		linewidth:number;
		linecap:string;
		linejoin:string;
		vertexColors:bool;
		fog:bool;
		clone():LineBasicMaterial;
	}

	export interface LineDashedMaterialParameters{
		color?:number;
 		opacity?:number;
		blending?:Blending;
 		depthTest?:bool;
		linewidth?:number;
		scale?:number;
 		dashSize?:number;
		gapSize?:number;
		vertexColors?:number;
		fog?:bool;
	}

	export class LineDashedMaterial extends Material{
		constructor(parameters?:LineDashedMaterialParameters);
		color:Color;
		linewidth:number;
		scale:number;
		dashSize:number;
		gapSize:number;
		vertexColors:bool;
		fog:bool;
		clone():LineDashedMaterial;
	}

	export interface MeshBasicMaterialParameters{
		color?:number;
		opacity?:number;
		map?:Texture;
		lightMap?:Texture;
		specularMap?:Texture;
		envMap?:Texture;
		combine?:Combine;
		reflectivity?:number;
		refractionRatio?:number;
		shading?:Shading;
		blending?:Blending;
		depthTest?:bool;
		wireframe?:bool;
		wireframeLinewidth?:number;
		vertexColors?:Colors;
		skinning?:bool;
		morphTargets?:bool;
		fog?:bool;
	}

	export class MeshBasicMaterial extends Material{
		constructor(parameters?:MeshBasicMaterialParameters);
		color:Color;
		map:Texture;
		lightMap:Texture;
		specularMap:Texture;
		envMap:Texture;
		combine:Combine;
		reflectivity:number;
		refractionRatio:number;
		fog:bool;
		shading:Shading;
		wireframe:bool;
		wireframeLinewidth:number;
		wireframeLinecap:string;
		wireframeLinejoin:string;
		vertexColors:Colors;
		skinning:bool;
		morphTargets:bool;
		clone():MeshBasicMaterial;
	}

	export interface MeshDepthMaterialParameters{			
		opacity?:number;
		blending?:Blending;
		depthTest?:bool;
		wireframe?:bool;
	 	wireframeLinewidth?:number;
	}

	export class MeshDepthMaterial extends Material{
		constructor(parameters?:MeshDepthMaterialParameters);
		wireframe:bool;
		wireframeLinewidth:number;
		clone():MeshDepthMaterial;
	} 

	export class MeshFaceMaterial extends Material{
		constructor(materials?:Material[]);
		materials:Material[];
		clone():MeshFaceMaterial;
	}

	export interface MeshLambertMaterialParameters{
		color?:number;
		ambient?:number;
		emissive?:number;
		opacity?:number;
		map?:Texture;
		lightMap?:Texture;
		specularMap?:Texture;
		envMap?:Texture;
		combine?:Combine;
		reflectivity?:number;
		refractionRatio?:number;
		shading?:Shading;
		blending?:Blending;
		depthTest:bool;
		wireframe:bool;
		wireframeLinewidth:number;
		vertexColors:Colors;
		skinning:bool;
		morphTargets:bool;
		morphNormals:bool;
		fog:bool;
	}

	export class MeshLambertMaterial extends Material{
		constructor(parameters?:MeshLambertMaterialParameters);
		color:Color;
		ambient:Color;
		emissive:Color;
		wrapAround:bool;
		wrapRGB:Vector3;
		map:Texture;
		lightMap:Texture;
		specularMap:Texture;
		envMap:Texture;
		combine:Combine;
		reflectivity:number;
		refractionRatio:number;
		fog:bool;
		shading:Shading;
		wireframe:bool;
		wireframeLinewidth:number;
		wireframeLinecap:string;
		wireframeLinejoin:string;
		vertexColors:Colors;
		skinning:bool;
		morphTargets:bool;
		morphNormals:bool;
		clone():MeshLambertMaterial;
	}

	export interface MeshNormalMaterialParameters{
		opacity?:number;
		shading?:Shading;
		blending?:Blending;
		depthTest?:bool;
		wireframe?:bool;
		wireframeLinewidth?:number;
	}

	export class MeshNormalMaterial extends Material{
		constructor(parameters?:MeshNormalMaterialParameters);
		shading:Shading;
		wireframe:bool;
		wireframeLinewidth:number;
		clone():MeshNormalMaterial;
	}

	export interface MeshPhongMaterialParameters{
		color?:number;
		ambient?:number;
		emissive?:number;
		specular?:number;
		shininess?:number;
		opacity?:number;
		map?:Texture;
		lightMap?:Texture;
		bumpMap?:Texture;
		bumpScale?:number;
		normalMap?:Texture;
		normalScale?:Vector2;
		specularMap?:Texture;
		envMap?:Texture;
		combine?:Combine;
		reflectivity?:number;
		refractionRatio?:number;
		shading?:Shading;
		blending?:Blending;
		depthTest?:bool;
		wireframe?:bool;
		wireframeLinewidth?:number;
		vertexColors?:Colors;
		skinning?:bool;
		morphTargets?:bool;
		morphNormals?:bool;
		fog?:bool;
	}

	export class MeshPhongMaterial extends Material{
		constructor(parameters?:MeshPhongMaterialParameters);
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
		combine:Combine;
		reflectivity:number;
		refractionRatio:number;
		fog:bool;
		shading:Shading;
		wireframe:bool;
		wireframeLinewidth:number;
		wireframeLinecap:string;
		wireframeLinejoin:string;
		vertexColors:Colors;
		skinning:bool;
		morphTargets:bool;
		morphNormals:bool;
		clone():MeshPhongMaterial;
	}

	export interface ParticleBasicMaterialParameters{
		color?:number;
		opacity?:number;
		map?:Texture;
		size?:number;
		blending?:Blending;
		depthTest?:bool;
		vertexColors?:bool;
		fog?:bool;
	}

	export class ParticleBasicMaterial extends Material{
		constructor(parameters?:ParticleBasicMaterialParameters);
		color:Color;
		map:Texture;
		size:number;
		sizeAttenuation:bool;
		vertexColors:bool;
		fog:bool;
		clone():ParticleBasicMaterial;
	}

	export interface ParticleCanvasMaterialParameters{
		color?:number;
		program?:(context:CanvasRenderingContext2D, color:Color)=>void;
		opacity?:number;
 		blending?:Blending;
 	}

	export class ParticleCanvasMaterial extends Material{
		constructor(parameters?:ParticleCanvasMaterialParameters);
		color:Color;
		program:(context:CanvasRenderingContext2D, color:Color)=>void;
		clone():ParticleCanvasMaterial;
	}

	export class ParticleDOMMaterial extends Material{
		constructor(element:HTMLElement);
		clone():ParticleDOMMaterial;
	}

	export interface Uniforms{
		[name:string]:{type:string;value:any;};
	}

	export interface ShaderMaterialParameters{
		fragmentShader?:string;
		vertexShader?:string;
		uniforms?:Uniforms;
		defines?:{[label:string]:string;};
		shading?:Shading;
		blending?:Blending;
		depthTest?:bool;
		wireframe?:bool;
		wireframeLinewidth?:number;
		lights?:bool;
		vertexColors?:Colors;
		skinning?:bool;
		morphTargets?:bool;
		morphNormals?:bool;
		fog?:bool;
	}

	export class ShaderMaterial extends Material{
		constructor(parameters?:ShaderMaterialParameters);
		fragmentShader:string;
		vertexShader:string;
		uniforms:Uniforms;
		defines:{[label:string]:any;};
		attributes:{[name:string]:any;};
		shading:Shading;
		wireframe:bool;
		wireframeLinewidth:number;
		fog:bool;
		lights:bool;
		vertexColors:Colors;
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
		constructor(geometry?:Geometry, material?:LineDashedMaterial, type?:number);
		constructor(geometry?:Geometry, material?:LineBasicMaterial, type?:number);
		constructor(geometry?:Geometry, material?:ShaderMaterial, type?:number);
		geometry:Geometry;
		material:Material;
		type:number;
		clone(object?:Line):Line;
	}

	export class LOD extends Object3D{
		constructor();
		LODs:Object3D[];
		addLevel(object3D:Object3D, visibleAtDistance?:number):void;
		update(camera:Camera):void;
		clone():LOD;
	}

	export class Mesh extends Object3D{
		constructor(geometry?:Geometry, material?:MeshBasicMaterial);
		constructor(geometry?:Geometry, material?:MeshDepthMaterial);
		constructor(geometry?:Geometry, material?:MeshFaceMaterial);
		constructor(geometry?:Geometry, material?:MeshLambertMaterial);
		constructor(geometry?:Geometry, material?:MeshNormalMaterial);
		constructor(geometry?:Geometry, material?:MeshPhongMaterial);
		constructor(geometry?:Geometry, material?:ShaderMaterial);
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
		constructor(geometry?:Geometry, material?:MeshBasicMaterial);
		constructor(geometry?:Geometry, material?:MeshDepthMaterial);
		constructor(geometry?:Geometry, material?:MeshFaceMaterial);
		constructor(geometry?:Geometry, material?:MeshLambertMaterial);
		constructor(geometry?:Geometry, material?:MeshNormalMaterial);
		constructor(geometry?:Geometry, material?:MeshPhongMaterial);
		constructor(geometry?:Geometry, material?:ShaderMaterial);
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
		constructor(geometry:Geometry, material?:ParticleBasicMaterial);
		constructor(geometry:Geometry, material?:ParticleCanvasMaterial);
		constructor(geometry:Geometry, material?:ParticleDOMMaterial);
		constructor(geometry:Geometry, material?:ShaderMaterial);
		geometry:Geometry;
		material:Material;
		sortParticles:bool;
		clone(object?:ParticleSystem ):ParticleSystem;
	}

	export class Ribbon extends Object3D{
		constructor(geometry:Geometry, material:Material );
		geometry:Geometry;
		material:Material;
		clone(object?:Ribbon):Ribbon;
	}

	export class SkinnedMesh extends Mesh{
		constructor(geometry:Geometry, material?:ParticleBasicMaterial,  useVertexTexture?:bool);
		constructor(geometry:Geometry, material?:ParticleCanvasMaterial, useVertexTexture?:bool);
		constructor(geometry:Geometry, material?:ParticleDOMMaterial,    useVertexTexture?:bool);
		constructor(geometry:Geometry, material?:ShaderMaterial,         useVertexTexture?:bool);
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

	export interface Renderer{
		render(scene:Scene, camera:Camera):void;
	}

	export class CanvasRenderer implements Renderer{
		constructor(parameters?:any);
		domElement:HTMLCanvasElement;
		autoClear:bool;
		sortObjects:bool;
		sortElements:bool;
		info:{ render: { vertices:number; faces:number; }; };
		setSize(width:number, height:number):void;
		setClearColor(color:Color, opacity?:number):void;
		setClearColorHex(hex:number, opacity?:number):void;
		getMaxAnisotropy():number;
		clear():void;
		render(scene:Scene, camera:Camera):void;
	}

	export interface RendererPlugin{
		init(renderer:WebGLRenderer):void;
		render(scene:Scene,camera:Camera,currentWidth:number,currentHeight:number):void;
	}

	export interface WebGLRendererParameters{
		canvas?:HTMLCanvasElement;
		precision?:string;
		alpha?:bool;
		premultipliedAlpha?:bool;
		antialias?:bool;
		stencil?:bool;
		preserveDrawingBuffer?:bool;
		clearColor?:number;
		clearAlpha?:number;
	}

	export class WebGLRenderer implements Renderer{
		constructor(parameters?:WebGLRendererParameters);
		domElement:HTMLCanvasElement;
		context:WebGLRenderingContext;
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
		renderPluginsPre:RendererPlugin[];
		renderPluginsPost:RendererPlugin[];
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
		getContext():WebGLRenderingContext;
		supportsVertexTextures():bool;
		getMaxAnisotropy():number;
		setSize(width:number, height:number):void;
		setViewport(x?:number, y?:number, width?:number, height?:number):void;
		setScissor(x:number, y:number, width:number, height:number):void;
		enableScissorTest(enable:bool):void;
		setClearColorHex(hex:number, alpha:number):void;
		setClearColor(color:Color, alpha:number):void;
		getClearColor():Color;
		getClearAlpha():number;
		clear(color?:bool, depth?:bool, stencil?:bool):void;
		addPostPlugin(plugin:RendererPlugin):void;
		addPrePlugin(plugin:RendererPlugin):void;
		deallocateObject(object:Object3D):void;
		deallocateTexture(texture:Texture):void;
		deallocateRenderTarget(renderTarget:RenderTarget):void;
		updateShadowMap(scene:Scene, camera:Camera):void;
		renderBufferImmediate(object:Object3D, program:Object, material:Material):void;
		renderBufferDirect(camera:Camera, lights:Light[], fog:Fog, material:Material, geometryGroup:any, object:Object3D):void;
		renderBuffer      (camera:Camera, lights:Light[], fog:Fog, material:Material, geometryGroup:any, object:Object3D):void;
		render(scene:Scene, camera:Camera, renderTarget?:RenderTarget, forceClear?:bool):void;
		renderImmediateObject(camera:Camera, lights:Light[], fog:Fog, material:Material, object:Object3D):void;
		initWebGLObjects(scene:Scene):void;
		initMaterial(material:Material, lights:Light[], fog:Fog, object:Object3D):void;
		setFaceCulling(cullFace:string, frontFace:string):void;
		setMaterialFaces(material:Material):void;
		setDepthTest(depthTest:bool):void;
		setDepthWrite(depthWrite:bool):void;
		setBlending(blending:Blending, blendEquation:BlendingEquation, blendSrc:BlendingSrcFactor, blendDst:BlendingDstFactor):void;
		setTexture(texture:Texture, slot ):void;
		setRenderTarget(renderTarget:RenderTarget):void;
	}

	export interface WebGLRenderTargetOptions{
		wrapS?:Wrapping;
		wrapT?:Wrapping;
		magFilter?:TextureFilter;
		minFilter?:TextureFilter;
		anisotropy?:number; // 1;
		format?:number; // THREE.RGBAFormat;
		type?:TextureDataType; // THREE.UnsignedByteType;
		depthBuffer?:bool; // true;
		stencilBuffer?:bool; // true;
	}

	export class WebGLRenderTarget extends RenderTarget{ 
		constructor(width:number, height:number, options?:WebGLRenderTargetOptions);
		width:number;
		height:number;
		wrapS:Wrapping;
		wrapT:Wrapping; 
		magFilter:TextureFilter;
		minFilter:TextureFilter;
		anisotropy:number;
		offset:Vector2;
		repeat:Vector2;
		format:number;
		type:number;
		depthBuffer:bool;
		stencilBuffer:bool;
		generateMipmaps:bool;
		clone():WebGLRenderTarget;
	}

	export class WebGLRenderTargetCube extends WebGLRenderTarget{
		constructor(width:number, height:number, options?:WebGLRenderTargetOptions);
		activeCubeFace:number; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
	}

	// Renderers / Renderables /////////////////////////////////////////////////////////////////////

	export class RenderableFace3{
		constructor();
		v1:RenderableVertex;
		v2:RenderableVertex;
		v3:RenderableVertex;
		centroidWorld:Vector3;
		centroidScreen:Vector3;
		normalWorld:Vector3;
		vertexNormalsWorld:Vector3[];
		vertexNormalsLength:number;
		color:number;
		material:Material;
		uvs:UV[][];
		z:number;
	}

	export class RenderableFace4{
		constructor();
		v1:RenderableVertex;
		v2:RenderableVertex;
		v3:RenderableVertex;
		v4:RenderableVertex;
		centroidWorld:Vector3;
		centroidScreen:Vector3;
		normalWorld:Vector3;
		vertexNormalsWorld:Vector3[];
		vertexNormalsLength:number;
		color:number;
		material:Material;
		uvs:UV[][];
		z:number;
	}

	export class RenderableLine{
		constructor();
		z:number;
		v1:RenderableVertex;
		v2:RenderableVertex;
		material:Material;
	}

	export class RenderableObject{
		constructor();
		object:any;
		z:number;
	}

	export class RenderableParticle{
		constructor();
		object:any;
		x:number;
		y:number;
		z:number;
		rotation:number;
		scale:Vector2;
		material:Material;
	}

	export class RenderableVertex{
		constructor();
		positionWorld:Vector3;
		positionScreen:Vector4;
		visible:bool;
		copy(vertex:RenderableVertex):void;
	}

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
		constructor( 
			image:HTMLImageElement, 
			mapping?:Mapping, 
			wrapS?:Wrapping, 
			wrapT?:Wrapping, 
			magFilter?:TextureFilter, 
			minFilter?:TextureFilter, 
			format?:PixelFormat, 
			type?:TextureDataType, 
			anisotropy?:number
		);
		id:number;
		name:string;
		image:any; // HTMLImageElement or ImageData ;
		mapping:Mapping;
		wrapS:Wrapping;
		wrapT:Wrapping;
		magFilter:TextureFilter;
		minFilter:TextureFilter;
		anisotropy:number;
		format:PixelFormat;
		type:TextureDataType;
		offset:Vector2;
		repeatVector2:Vector2;
		generateMipmaps:bool;
		premultiplyAlpha:bool;
		flipY:bool;
		needsUpdate:bool;
		onUpdate:any;
		clone():Texture;
		deallocate():void;
	}
	var TextureIdCount:number;
	var TextureLibrary:Texture[];


	export class CompressedTexture extends Texture{
		constructor(mipmaps:ImageData[], width:number, height:number, format?:PixelFormat, type?:TextureDataType, mapping?:Mapping, wrapS?:Wrapping, wrapT?:Wrapping, magFilter?:TextureFilter, minFilter?:TextureFilter);
		mipmaps:ImageData[];
		clone():CompressedTexture;
	}

	export class DataTexture extends Texture{
		constructor(data:ImageData , width:number, height:number, format:PixelFormat, type:TextureDataType, mapping:Mapping, wrapS:Wrapping, wrapT:Wrapping, magFilter:TextureFilter, minFilter:TextureFilter);
		clone():DataTexture;
	}

	// Extras /////////////////////////////////////////////////////////////////////
	export class ColorUtils{
		adjustHSV(color:Color, h:number, s:number, v:number):void;
	}

	export interface TypefaceData{
		familyName:string;
		cssFontWeight:string;
		cssFontStyle:string;
	}

	export var FontUtils:{
		faces:{[weight:string]:{[style:string]:Face;};};
		face:string;
		weight:string;
		style:string;
		size:number;
		divisions:number;
		getFace():Face;
		loadFace(data:TypefaceData):TypefaceData;
		drawText(text:string):{ paths:Path[]; offset:number; };
		extractGlyphPoints(c:string, face:Face, scale:number, offset:number, path:Path):{offset:number; path:Path;};
		generateShapes(text:string, parameters?:{size?:number;curveSegments?:number;font?:string;weight?:string;style?:string;}):Shape[];
		Triangulate:{
			(contour:Vector2[], indices:bool):Vector2[];
			area(contour:Vector2[]):number;
		};
	}

	export var GeometryUtils:{
		merge(geometry1:Geometry, object2:Mesh):void;
		merge(geometry1:Geometry, object2:Geometry):void;
		removeMaterials(geometry:Geometry, materialIndexArray:number[]):void;
		randomPointInTriangle(vectorA:Vector3, vectorB:Vector3, vectorC:Vector3):Vector3;
		randomPointInFace(face:Face, geometry:Geometry, useCachedAreas:bool):Vector3;
		randomPointsInGeometry(geometry:Geometry, n:number):Vector3;
		triangleArea(vectorA:Vector3, vectorB:Vector3, vectorC:Vector3):number;
		center(geometry:Geometry):Vector3;
		normalizeUVs(geometry:Geometry):void;
		triangulateQuads(geometry:Geometry):void;
		explode(geometry:Geometry):void;
		tessellate(geometry:Geometry, maxEdgeLength:number):void;
	}

	export var ImageUtils:{
		crossOrigin:string;
		loadTexture          (url:string, mapping?:Mapping, onLoad?:(texture:Texture)=>void, onError?:(message:string)=>void):Texture;
		loadCompressedTexture(url:string, mapping?:Mapping, onLoad?:(texture:Texture)=>void, onError?:(message:string)=>void):Texture;
		loadTextureCube          (array:string[], mapping?:Mapping, onLoad?:()=>void, onError?:(message:string)=>void):Texture;
		loadCompressedTextureCube(array:string[], mapping?:Mapping, onLoad?:()=>void, onError?:(message:string)=>void):Texture;
		parseDDS(buffer:ArrayBuffer, loadMipmaps:bool):{ mipmaps: { data:Uint8Array; width:number; height:number; }[]; width:number; height:number; format:number; mipmapCount:number; };
		getNormalMap(image:HTMLImageElement, depth?:number):HTMLCanvasElement;
		generateDataTexture(width:number, height:number, color:Color):DataTexture;
	};

	export var SceneUtils : {
		createMultiMaterialObject(geometry:Geometry, materials:Material[]):Object3D;
		detach(child:Object3D, parent:Object3D, scene:Scene):void;
		attach(child:Object3D, scene:Scene, parent:Object3D):void;
	};

	export var ShaderUtils : {
		lib: {
			[name:string]:{
				uniforms:Uniforms;
				fragmentShader:string;
				vertexShader:string;
			};
		};
	};

	// Extras / Animation /////////////////////////////////////////////////////////////////////

	export interface KeyFrame{
		pos:number[];
		rot:number[];
		scl:number[];
		time:number;
	}

	export interface KeyFrames{
		keys:KeyFrame[];
		parent:number;	
	}

	export interface AnimationData{
		JIT:number;
		fps:number;
		hierarchy:KeyFrames[];
		length: number;
		name: string;
	}

	export class Animation{
		constructor(root:Mesh, name:string, interpolationType?:AnimationInterpolation);

		interpolateCatmullRom(points:Vector3[], scale:number):Vector3[];
		interpolate(p0:number, p1:number, p2:number, p3:number, t:number, t2:number, t3:number):number;

		root:Mesh;
		data:AnimationData;
		hierarchy:Bone[];
		currentTime:number;
		timeScale:number;
		isPlaying:bool;
		isPaused:bool;
		loop:bool;
		interpolationType:AnimationInterpolation;
		points:Vector3[];
		target:Vector3;
		play(loop?:bool, startTimeMS?:number):void;
		pause():void;
		stop():void;;
		update(deltaTimeMS:number):void;
		
		getNextKeyWith(type:string, h:number, key:number):KeyFrame;	// ????
		getPrevKeyWith(type:string, h:number, key:number):KeyFrame;
	}

	export class AnimationInterpolation {}

	export class AnimationHandler{
		constructor();
		update(deltaTimeMS:number):void;
		addToUpdate(animation:Animation):void;
		removeFromUpdate(animation:Animation):void;
		add(data:AnimationData):void;
		get(name:string):AnimationData;
		parse(root:SkinnedMesh):Object3D[];
	
		// **HACK** enum values of AnimationInterpolation
		static LINEAR            :AnimationInterpolation;
		static CATMULLROM        :AnimationInterpolation;
		static CATMULLROM_FORWARD:AnimationInterpolation;
	}

	export class AnimationMorphTarget{
		constructor(root:Bone, data:any);
		influence:number;
		
		root:Bone;
		data:any;
		hierarchy:KeyFrames[];
		currentTime:number;
		timeScale:number;
		isPlaying:bool;
		isPaused:bool;
		loop:bool;
		play(loop?:bool, startTimeMS?:number):void;
		pause():void;
		stop():void;
		update(deltaTimeMS:number):void;
	}

	export class KeyFrameAnimation{
		constructor(root:Mesh, data:any, JITCompile?:bool);
		JITCompile:number;
		
		root:Mesh;
		data:any;
		hierarchy:KeyFrames[];
		currentTime:number;
		timeScale:number;
		isPlaying:number;
		isPaused:number;
		loop:number;
		play(loop?:number, startTimeMS?:number):void;
		pause():void;
		stop():void;
		update(deltaTimeMS:number):void; 

		getNextKeyWith(type:string, h:number, key:number):KeyFrame;	// ????
		getPrevKeyWith(type:string, h:number, key:number):KeyFrame;
	}

	// Extras / Cameras /////////////////////////////////////////////////////////////////////

	export class CombinedCamera extends Camera{
		constructor(width:number, height:number, fov:number, near:number, far:number, orthoNear:number, orthoFar:number);
		fov:number;
		left:number;
		right:number;
		top:number;
		bottom:number;
		cameraO:OrthographicCamera;
		cameraP:PerspectiveCamera;
		zoom:number;
		near:number;
		far:number;
		inPerspectiveMode:bool;
		inOrthographicMode:bool;		
		toPerspective():void;
		toOrthographic():void;
		setSize(width:number, height:number):void;
		setFov(fov:number):void;
		updateProjectionMatrix():void;
		setLens(focalLength:number, frameHeight?:number):number;
		setZoom(zoom:number):void;
		toFrontView():void;
		toBackView():void;
		toLeftView():void;
		toRightView():void;
		toTopView():void;
		toBottomView():void;
	}

	export class CubeCamera extends Object3D{
		constructor(near:number, far:number, cubeResolution:number);
		renderTarget:WebGLRenderTargetCube;
		updateCubeMap(renderer:Renderer, scene:Scene):void;
	}

	// Extras / Core /////////////////////////////////////////////////////////////////////

	export class Curve{
		constructor();
		getPoint(t:number):Vector2;
		getPointAt(u:number):Vector2;
		getPoints(divisions?:number):Vector2[];
		getSpacedPoints(divisions?:number):Vector2[];
		getLength():number;
		getLengths(divisions?:number):number[];
		needsUpdate:bool;
		updateArcLengths():void;
		getUtoTmapping(u:number, distance:number):number;
		getNormalVector(t:number):Vector2;
		getTangent(t:number):Vector2;
		getTangentAt(u:number):Vector2;

		static Utils:{
			tangentQuadraticBezier(t:number, p0:number, p1:number, p2:number):number;
			tangentCubicBezier(t:number, p0:number, p1:number, p2:number, p3:number):number;
			tangentSpline(t:number, p0:number, p1:number, p2:number, p3:number):number;
			interpolate(p0:number, p1:number, p2:number, p3:number, t:number):number;
		};

		static create(constructorFunc:Function, getPointFunc:Function):Function;
	}

	export class LineCurve extends Curve{
		constructor(v1:Vector2, v2:Vector2);
	}
	export class QuadraticBezierCurve extends Curve{
		constructor(v0:Vector2, v1:Vector2, v2:Vector2);
	}
	export class CubicBezierCurve extends Curve{
		constructor(v0:number, v1:number, v2:number, v3:number);
	}
	export class SplineCurve extends Curve{
		constructor(points?:Vector2[]);
	}
	export class EllipseCurve extends Curve{
		constructor(aX:number, aY:number, xRadius:number, yRadius:number, aStartAngle:number, aEndAngle:number, aClockwise:bool);
		aX:number;
		aY:number;
		xRadius:number;
		yRadius:number;
		aStartAngle:number;
		aEndAngle:number;
		aClockwise:bool;
	}
	export class ArcCurve extends EllipseCurve{
		constructor(aX:number, aY:number, aRadius:number, aStartAngle:number, aEndAngle:number, aClockwise:bool);
	}	

	
	// **HACK** Non-existent class in three.js
	// abstruct class
	export class Curve3D{
		constructor();
		getPoint(t:number):Vector3;
		getPointAt(u:number):Vector3;
		getPoints(divisions?:number):Vector3[];
		getSpacedPoints(divisions?:number):Vector3[];
		getLength():number;
		getLengths(divisions?:number):number[];
		needsUpdate:bool;
		updateArcLengths():void;
		getUtoTmapping(u:number, distance:number):number;
		getNormalVector(t:number):Vector3;
		getTangent(t:number):Vector3;
		getTangentAt(u:number):Vector3;
	}
	export class LineCurve3 extends Curve3D{
		constructor(v1:Vector3, v2:Vector3);
	}
	export class QuadraticBezierCurve3 extends Curve3D{
		constructor(v0:Vector3, v1:Vector3, v2:Vector3);
	}
	export class CubicBezierCurve3 extends Curve3D{
		constructor(v0:Vector3, v1:Vector3, v2:Vector3, v3:Vector3);
	}
	export class SplineCurve3 extends Curve3D{
		constructor(points?:Vector3[]);
		points:Vector3[];
	}
	export class ClosedSplineCurve3 extends Curve3D{
		constructor(points?:Vector3[]);
		points:Vector3[];
	}

	export interface BoundingBox{
		minX:number; 
		minY:number; 
		maxX:number; 
		maxY:number; 
		centroid: any; /* Vector3 or Vector2 */ 
	}

	export class CurvePath extends Curve{
		constructor();
		curves:Curve[];
		bends:Path[];
		autoClose:bool;
		add(curve:Curve):void;
		checkConnection():bool;
		closePath():void;
		getBoundingBox():BoundingBox;
		createPointsGeometry(divisions:number):Geometry;
		createSpacedPointsGeometry(divisions:number):Geometry;
		createGeometry(points:Vector2[]):Geometry;
		addWrapPath(bendpath:Path):void;
		getTransformedPoints(segments:number, bends?:Path):Vector2[];
		getTransformedSpacedPoints(segments:number, bends?:Path[]):Vector2[];
		getWrapPoints( oldPts:Vector2[], path:Path) :Vector2[];
	}

	// **TODO**
	// TypeScript's enum construction is experimental feature
	export enum PathActions{
		MOVE_TO,
		LINE_TO,
		QUADRATIC_CURVE_TO, // Bezier quadratic curve
		BEZIER_CURVE_TO, 	// Bezier cubic curve
		CSPLINE_THRU,		// Catmull-rom spline
		ARC,				// Circle
		ELLIPSE,
	}

	export class Path extends CurvePath{
		constructor(points?:Vector2);
		actions:PathActions[];
		fromPoints(vectors:Vector2[]):void;
		moveTo(x:number, y:number):void;
		lineTo(x:number, y:number):void;
		quadraticCurveTo(aCPx:number, aCPy:number, aX:number, aY:number):void;
		bezierCurveTo(aCP1x:number, aCP1y:number, aCP2x:number, aCP2y:number, aX:number, aY:number):void;
		splineThru(pts:Vector2[]):void;
		arc       (aX:number, aY:number, aRadius:number,                 aStartAngle:number, aEndAngle:number, aClockwise:bool):void;
	 	absarc    (aX:number, aY:number, aRadius:number,                 aStartAngle:number, aEndAngle:number, aClockwise:bool):void;
		ellipse   (aX:number, aY:number, xRadius:number, yRadius:number, aStartAngle:number, aEndAngle:number, aClockwise:bool):void;
 		absellipse(aX:number, aY:number, xRadius:number, yRadius:number, aStartAngle:number, aEndAngle:number, aClockwise:bool):void;
		toShapes():Shape[];
	}

	export class Gyroscope extends Object3D{
		constructor();
		updateMatrixWorld(force?:bool):void;
		translationWorld:Vector3;
		translationObject:Vector3;
		rotationWorld:Quaternion;
		rotationObject:Quaternion;
		scaleWorld:Vector3;
		scaleObject:Vector3;
	}

	export class Shape extends Path{
		constructor();
		holes:Vector2[][];
		extrude(options?:any):ExtrudeGeometry;
		makeGeometry(options?:any):ShapeGeometry;
		getPointsHoles(divisions:number):Vector2[][];
		getSpacedPointsHoles(divisions:number):Vector2[][];
		extractAllPoints(divisions:number):{
			shape: Vector2[];
			holes: Vector2[][];
		};
		useSpacedPoints:bool;
		extractPoints(divisions:number):Vector2[];
		extractAllSpacedPoints(divisions:Vector2):{
			shape: Vector2[];
			holes: Vector2[][];
		};
	
		static Utils:{
			removeHoles(contour:Vector2[], holes:Vector2[][]):{
				shape:Shape; 		/* shape with no holes */
				isolatedPts: Vector2[]; /* isolated faces */
				allpoints: Vector2[];
			};
			triangulateShape(contour:Vector2[], holes:Vector2[][]):Vector2[];
			isClockWise(pts):bool;
			b2p0(t:number, p:number):number;
			b2p1(t:number, p:number):number;
			b2p2(t:number, p:number):number;
			b2(t:number, p0:number, p1:number, p2:number):number;
			b3p0(t:number, p:number):number;
			b3p1(t:number, p:number):number;
			b3p2(t:number, p:number):number;
			b3p3(t:number, p:number):number;
			b3(t:number, p0:number, p1:number, p2:number, p3:number):number;
		};
	}



	// Extras / Geomerties /////////////////////////////////////////////////////////////////////

	export class AsteriskGeometry extends Geometry{
		constructor(innerRadius:number, outerRadius:number);
	}

	export class CircleGeometry extends Geometry{
		constructor(radius?:number, segments?:number, thetaStart?:number, thetaLength?:number);
	}

	export class ConvexGeometry extends Geometry{
		constructor(vertices:Vector3);
	}

	export class CubeGeometry extends Geometry{
		constructor(width:number, height:number, depth:number, widthSegments?:number, heightSegments?:number, depthSegments?:number);
	}

	export class CylinderGeometry extends Geometry{
		constructor(radiusTop?:number, radiusBottom?:number, height?:number, radiusSegments?:number, heightSegments?:number, openEnded?:bool);
	}

	export class ExtrudeGeometry extends Geometry{
		constructor(shape?:Shape, options?:any);
		constructor(shapes?:Shape[], options?:any);
		shapebb:BoundingBox;
		addShapeList(shapes:Shape[], options?:any):void;
		addShape(shape:Shape, options?:any):void;
		static WorldUVGenerator:{
			generateTopUV(geometry:Geometry, extrudedShape, extrudeOptions, indexA:number, indexB:number, indexC:number):UV[];
			generateBottomUV(geometry:Geometry, extrudedShape, extrudeOptions, indexA:number, indexB:number, indexC:number):UV[];
			generateSideWallUV(geometry:Geometry, extrudedShape, wallContour, extrudeOptions,
	                              indexA:number, indexB:number, indexC:number, indexD:number, stepIndex:number, stepsLength:number,
	                              contourIndex1:number, contourIndex2:number):UV[];
		};
	}

	export class IcosahedronGeometry extends PolyhedronGeometry{
		constructor(radius:number, detail:number);
	}

	export class LatheGeometry extends Geometry{
		constructor(points:Vector3[], steps?:number, angle?:number);
	}

	export class OctahedronGeometry extends PolyhedronGeometry{
		constructor(radius:number, detail:number);
	}

	export class ParametricGeometry extends Geometry{
		constructor(func:(u:number,v:number)=>Vector3, slices:number, stacks:number, useTris?:bool);
	}

	export class PlaneGeometry extends Geometry{
		constructor( width:number, height:number, widthSegments?:number, heightSegments?:number );
		width:number;
		height:number;
		widthSegments:number;
		heightSegments:number;
	}

	export class PolyhedronGeometry extends Geometry{
		constructor(vertices:Vector3[], faces:Face[], radius?:number, detail?:number);
	}

	export class ShapeGeometry extends Geometry{
		constructor(shape:Shape, options:any);
		constructor(shapes:Shape[], options:any);
		shapebb:BoundingBox;
		addShapeList(shapes:Shape[], options:any):ShapeGeometry;
		addShape(shape:Shape, options?:any):void;
	}

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

	export class TetrahedronGeometry extends PolyhedronGeometry{
		constructor(radius?:number, detail?:number);
	}

	export interface TextGeometryParameters{
		size?:number;			// size of the text
		height?:number; 		// thickness to extrude text
		curveSegments?:number; 	// number of points on the curves
		font?:string;			// font name
 		weight?:string;			// font weight (normal, bold)
 		style?:string;			// font style  (normal, italics)
 		bevelEnabled?:bool;		// turn on bevel
 		bevelThickness?:number; // how deep into text bevel goes
 		bevelSize?:number;		// how far from text outline is bevel
 	}

	export class TextGeometry extends ExtrudeGeometry{
		constructor(text:string, TextGeometryParameters?:TextGeometryParameters);
	}

	export class TorusGeometry extends Geometry{
		constructor(radius?:number, tube?:number, radialSegments?:number, tubularSegments?:number, arc?:number);
		radius:number;
		tube:number;
		radialSegments:number;
		tubularSegments:number;
		arc:number;
	}

	export class TorusKnotGeometry extends Geometry{
		constructor(radius?:number, tube?:number, radialSegments?:number, tubularSegments?:number, p?:number, q?:number, heightScale?:number);
		radius:number;
		tube:number;
		radialSegments:number;
		tubularSegments:number;
		p:number;
		q:number;
		heightScale:number;
		grid:number[][];
	}

	export class TubeGeometry extends Geometry{ 
		constructor(path:Path, segments?:number, radius?:number, radiusSegments?:number, closed?:bool, debug?:ArrowHelper[]);
		path:Path;
		segments:number;
		radius:number;
		radiusSegments:number;
		closed:bool;
		grid:number[][];
		tangents:Vector3[];
		normals:Vector3[];
		binormals:Vector3[];
		FrenetFrames(path, segments, closed):void;
	}

	// Extras / Helpers /////////////////////////////////////////////////////////////////////

	export class AxisHelper extends Line{
		constructor(size:number);
	}

	export class ArrowHelper extends Object3D{
		constructor(dir:Vector3, origin?:Vector3, length?:number, hex?:number);
		line:Line;
		cone:Mesh;
		setDirection(dir:Vector3):void;
		setLength(length:number):void;
		setColor(hex:number):void;
	}

	export class CameraHelper extends Line{
		constructor(camera:Camera);
		pointMap:{[id:string]:number[];};
		camera:Camera;
	}

	export class DirectionalLightHelper extends Object3D{
		constructor(light:Light, sphereSize:number, arrowLength:number);
		light:Light;
		direction:Vector3;
		color:Color;
		lightArrow:ArrowHelper;
		lightSphere:Mesh;
		lightRays:Line;
		targetSphere:Mesh;
		targetLine:Line;
	}

	export class HemisphereLightHelper extends Object3D{
		constructor(light:Light, sphereSize:number, arrowLength:number, domeSize:number);
		light:Light;
		color:Color;
		groundColor:Color;
		lightSphere:Mesh;
		lightArrow:ArrowHelper;
		lightArrowGround:ArrowHelper;
		target:Vector3;
	}

	export class PointLightHelper extends Object3D{
		constructor(light:Light, sphereSize:number);
		light:Light;
		color:Color;
		lightSphere:Mesh;
		lightRays:Line;
		lightDistance:Mesh;
	}

	export class SpotLightHelper extends Object3D{
		constructor(light:Light, sphereSize:number, arrowLength:number);
		light:Light;
		direction:Vector3;
		color:Color;
		lightArrow:ArrowHelper;
		lightSphere:Mesh;
		lightCone:Mesh;
		lightRays:Line;
		gyroscope:Gyroscope;
		targetSphere:Mesh;
		targetLine:Line;
	}

	// Extras / Modifiers /////////////////////////////////////////////////////////////////////

	export class SubdivisionModifier{
		constructor(subdivisions?:number);
		subdivisions:number;
		useOldVertexColors:bool;
		supportUVs:bool;
		debug:bool;
		modify(geometry:Geometry):void;
		orderedKey(a:number, b:number):string;
		computeEdgeFaces(geometry:Geometry):{[key:string]:number;};
		smooth(oldGeometry:Geometry):void;
	}

	// Extras / Objects /////////////////////////////////////////////////////////////////////

	export class ImmediateRenderObject extends Object3D{
		constructor();
		render(renderCallback):void;
	}

	export interface LensFlareProperty{
		texture:Texture; 			// THREE.Texture
		size:number; 				// size in pixels (-1 = use texture.width)
		distance:number; 			// distance (0-1) from light source (0=at light source)
		x:number; 
		y:number; 
		z:number;					// screen position (-1 => 1) z = 0 is ontop z = 1 is back
		scale:number; 				// scale
		rotation:number; 			// rotation
		opacity:number;				// opacity
		color:Color;				// color
		blending:Blending;
	}

	export class LensFlare extends Object3D{
		constructor(texture?:Texture, size?:number, distance?:number, blending?:Blending, color?:number);
		lensFlares:LensFlareProperty[];
		positionScreen:Vector3;
		customUpdateCallback:()=>void;
		add(texture?:Texture, size?:number, distance?:number, blending?:Blending, color?:number, opacity?:number):void;
		updateLensFlares():void;
	}

	export interface MorphBlendMeshAnimation{
		startFrame:number;
		endFrame:number;
		length:number;
		fps:number;
		duration:number;
		lastFrame:number;
		currentFrame:number;
		active:bool;
		time:number;
		direction:number;
		weight:number;
		directionBackwards:bool;
		mirroredLoop:bool;
	}

	export class MorphBlendMesh extends Mesh{
		constructor(geometry:Geometry, material:Material);
		animationsMap:{[name:string]:MorphBlendMeshAnimation;};
		animationsList:MorphBlendMeshAnimation[];	
		createAnimation(name:string, start:number, end:number, fps:number):void;
		autoCreateAnimations(fps:number):void;
		firstAnimation:string;
		setAnimationDirectionForward(name:string):void;
		setAnimationDirectionBackward(name:string):void;
		setAnimationFPS(name:string, fps:number):void;
		setAnimationDuration(name:string, duration:number):void;;
		setAnimationWeight(name:string, weight:number):void;
		setAnimationTime(name:string, time:number):void;
		getAnimationTime(name:string):number;
		getAnimationDuration(name:string):number;
		playAnimation(name:string):void;
		stopAnimation(name:string):void;
		update(delta:number):void;
	}

	// Extras / Renderers / Plugins /////////////////////////////////////////////////////////////////////

	export class DepthPassPlugin implements RendererPlugin{
		constructor();
		enabled:bool;
		renderTarget:RenderTarget;
		init(renderer:Renderer):void;
		render(scene:Scene, camera:Camera):void;
		update(scene:Scene, camera:Camera):void;
	}

	export class LensFlarePlugin implements RendererPlugin{
		constructor();
		init(renderer:Renderer):void;
		render(scene:Scene, camera:Camera, viewportWidth:number, viewportHeight:number):void;
	}

	export class ShadowMapPlugin implements RendererPlugin{
		constructor();
		init(renderer:Renderer):void;
		render(scene:Scene, camera:Camera):void;
		update(scene:Scene, camera:Camera):void;
	}

	export class SpritePlugin implements RendererPlugin{
		constructor();
		init(renderer:Renderer):void;
		render(scene:Scene, camera:Camera, viewportWidth:number, viewportHeight:number):void;
	}

	// Extras / Renderers / Shaders /////////////////////////////////////////////////////////////////////

	export interface ShaderLibrary{
		[name:string]:{
			vertexShader: string;
			fragmentShader: string;
		};
	}
	export var ShaderFlares:ShaderLibrary;
	export var ShaderSprite:ShaderLibrary;
}