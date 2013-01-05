/**
 * @author Tim Knip / http://www.floorplanner.com/ / tim at floorplanner.com
 */

// translated by Kon - http://phyzkit.net/

/// <reference path="../libs/xpath.d.ts" />
/// <reference path="../../three.d.ts" />

// **HACK**
// Create a alias of Math because THREE.Math hides Math.
var _Math = Math;

module THREE.Collada{
	// **HACK** THREE.Math hides Math
	var TO_RADIANS = _Math.PI / 180;


	export interface Dae{
		images      :{[name:string]:_Image      ;};
		materials   :{[name:string]:_Material    ;};
		cameras     :{[name:string]:_Camera      ;};
		effects     :{[name:string]:Effect      ;};
		geometries  :{[name:string]:_Geometry    ;};
		controllers :{[name:string]:Controller  ;};
		animations  :{[name:string]:_Animation   ;};
		visualScenes:{[name:string]:VisualScene ;};
		scene       :THREE.Object3D;
	}

	export interface Collada{
		scene     : THREE.Object3D;
		morphs    : THREE.Mesh[];
		skins     : THREE.SkinnedMesh[];
		animations: AnimData;
		dae       : Dae;
	}

	export interface ReadyCallback{
		(collada:Collada):void;
	}

	export interface Hierarchy{
		node: Node;
		keys: any;	// ???
		sids: any;	// ???		
	}

	export interface AnimData{
		fps:number;
		hierarchy: Hierarchy[];
		node: Node;
		name:string;
		length:number;
	}

	export class ColladaLoader{

		COLLADA = null;
		private scene = null;
		private daeScene;

		private readyCallbackFunc:ReadyCallback = null;

	 	        sources    :{[name:string]:Source      ;} = {};
		        images     :{[name:string]:_Image      ;} = {};
		private animations :{[name:string]:_Animation   ;} = {};
		private controllers:{[name:string]:Controller  ;} = {};
		private geometries :{[name:string]:_Geometry    ;} = {};
		private materials  :{[name:string]:_Material    ;} = {};
		private effects    :{[name:string]:Effect      ;} = {};
		private cameras    :{[name:string]:_Camera      ;} = {};

		private animData;
		private visualScenes;
		        baseUrl;
		private morphs;
		private skins;

		private flip_uv:bool = true;
		        preferredShading:THREE.Shading = THREE.SmoothShading;

		options = {
			// Force Geometry to always be centered at the local origin of the
			// containing Mesh.
			centerGeometry: false,

			// Axis conversion is done for geometries, animations, and controllers.
			// If we ever pull cameras or lights out of the COLLADA file, they'll
			// need extra work.
			convertUpAxis: false,

			subdivideFaces: true,

			upAxis: 'Y',

			// For reflective or refractive materials we'll use this cubemap
			defaultEnvMap: null

		};

		// TODO: support unit conversion as well
		colladaUnit = 1.0;
		colladaUp = 'Y';
		upConversion = null;



		constructor(){
		}

		load(url:string, readyCallback:ReadyCallback, progressCallback?:(progress:{total:number;loaded:number;})=>void) {

			var length:number = 0;

			if ( document.implementation && document.implementation.createDocument ) {

				var request = new XMLHttpRequest();

				request.onreadystatechange = ()=>{

					if( request.readyState == 4 ) {

						if( request.status == 0 || request.status == 200 ) {


							if ( request.responseXML ) {

								this.readyCallbackFunc = readyCallback;
								this.parse( request.responseXML, undefined, url );

							} else if ( request.responseText ) {

								this.readyCallbackFunc = readyCallback;
								var xmlParser = new DOMParser();
								var responseXML = xmlParser.parseFromString( request.responseText, "application/xml" );
								this.parse( responseXML, undefined, url );

							} else {

								console.error( "ColladaLoader: Empty or non-existing file (" + url + ")" );

							}

						}

					} else if ( request.readyState == 3 ) {

						if ( progressCallback ) {

							if ( length == 0 ) {

								length = parseInt(request.getResponseHeader( "Content-Length" ));

							}

							progressCallback( { total: length, loaded: request.responseText.length } );

						}

					}

				}

				request.open( "GET", url, true );
				request.send( null );

			} else {

				alert( "Don't know how to parse XML!" );

			}

		}

		parse( doc, callBack?:ReadyCallback, url?:string) {

			this.COLLADA = doc;
			callBack = callBack || this.readyCallbackFunc;

			if ( url !== undefined ) {

				var parts = url.split( '/' );
				parts.pop();
				this.baseUrl = ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';

			}

			this.parseAsset();
			setUpConversion(this);
			this.images       = this.parseLib( "//dae:library_images/dae:image",                _Image,      "image" );
			this.materials    = this.parseLib( "//dae:library_materials/dae:material",          _Material,    "material" );
			this.effects      = this.parseLib( "//dae:library_effects/dae:effect",              Effect,      "effect" );
			this.geometries   = this.parseLib( "//dae:library_geometries/dae:geometry",         _Geometry,    "geometry" );
			this.cameras      = this.parseLib( ".//dae:library_cameras/dae:camera",             _Camera,      "camera" );
			this.controllers  = this.parseLib( "//dae:library_controllers/dae:controller",      Controller,  "controller" );
			this.animations   = this.parseLib( "//dae:library_animations/dae:animation",        _Animation,   "animation" );
			this.visualScenes = this.parseLib( ".//dae:library_visual_scenes/dae:visual_scene", VisualScene, "visual_scene" );

			this.morphs = [];
			this.skins = [];

			this.daeScene = this.parseScene();
			this.scene = new THREE.Object3D();

			for ( var i = 0; i < this.daeScene.nodes.length; i ++ ) {

				this.scene.add( this.createSceneGraph( this.daeScene.nodes[ i ] ) );

			}

			this.createAnimations();

			var result = {

				scene     : this.scene,
				morphs    : this.morphs,
				skins     : this.skins,
				animations: this.animData,
				dae: {
					images      : this.images,
					materials   : this.materials,
					cameras     : this.cameras,
					effects     : this.effects,
					geometries  : this.geometries,
					controllers : this.controllers,
					animations  : this.animations,
					visualScenes: this.visualScenes,
					scene       : this.daeScene
				}

			};

			if ( callBack ) {

				callBack( result );

			}

			return result;

		}

		setPreferredShading ( shading:THREE.Shading ) {

			this.preferredShading = shading;

		}

		parseAsset () {

			var elements = this.COLLADA.evaluate( '//dae:asset', this.COLLADA, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

			var element = elements.iterateNext();

			if ( element && element.childNodes ) {

				for ( var i = 0; i < element.childNodes.length; i ++ ) {

					var child = element.childNodes[ i ];

					switch ( child.nodeName ) {

						case 'unit':

							var meter = child.getAttribute( 'meter' );

							if ( meter ) {

								this.colladaUnit = parseFloat( meter );

							}

							break;

						case 'up_axis':

							this.colladaUp = child.textContent.charAt(0);
							break;

					}

				}

			}

		}

		parseLib ( q, classSpec, prefix ) {

			var elements = this.COLLADA.evaluate(q, this.COLLADA, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null) ;

			var lib = {};
			var element = elements.iterateNext();
			var i = 0;

			while ( element ) {

				var daeElement = ( new classSpec(this) ).parse( element );
				if ( !daeElement.id || daeElement.id.length == 0 ) daeElement.id = prefix + ( i ++ );
				lib[ daeElement.id ] = daeElement;

				element = elements.iterateNext();

			}

			return lib;

		}

		parseScene() {

			var sceneElement = this.COLLADA.evaluate( './/dae:scene/dae:instance_visual_scene', this.COLLADA, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null ).iterateNext();

			if ( sceneElement ) {

				var url = sceneElement.getAttribute( 'url' ).replace( /^#/, '' );
				return this.visualScenes[ url.length > 0 ? url : 'visual_scene0' ];

			} else {

				return null;

			}

		}

		createAnimations() {

			this.animData = [];

			// fill in the keys
			this.recurseHierarchy( this.scene );

		}

		recurseHierarchy( node ) {

			var n = this.daeScene.getChildById( node.name, true ),
				newData = null;

			if ( n && n.keys ) {

				newData = {
					fps: 60,
					hierarchy: [ {
						node: n,
						keys: n.keys,
						sids: n.sids
					} ],
					node: node,
					name: 'animation_' + node.name,
					length: 0
				};

				this.animData.push(newData);

				for ( var i = 0, il = n.keys.length; i < il; i++ ) {

					newData.length = _Math.max( newData.length, n.keys[i].time );

				}

			} else  {

				newData = {
					hierarchy: [ {
						keys: [],
						sids: []
					} ]
				}

			}

			for ( var i = 0, il = node.children.length; i < il; i++ ) {

				var d = this.recurseHierarchy( node.children[i] );

				for ( var j = 0, jl = d.hierarchy.length; j < jl; j ++ ) {

					newData.hierarchy.push( {
						keys: [],
						sids: []
					} );

				}

			}

			return newData;

		}

		calcAnimationBounds () {

			var start = 1000000;
			var end = -start;
			var frames = 0;

			for ( var id in this.animations ) {

				var animation = this.animations[ id ];

				for ( var i = 0; i < animation.sampler.length; i ++ ) {

					var sampler = animation.sampler[ i ];
					sampler.create();

					start = _Math.min( start, sampler.startTime );
					end = _Math.max( end, sampler.endTime );
					frames = _Math.max( frames, sampler.input.length );

				}

			}

			return { start:start, end:end, frames:frames };

		}

		createMorph ( geometry, ctrl ) {

			var morphCtrl = ctrl instanceof InstanceController ? this.controllers[ ctrl.url ] : ctrl;

			if ( !morphCtrl || !morphCtrl.morph ) {

				console.log("could not find morph controller!");
				return;

			}

			var morph = morphCtrl.morph;

			for ( var i = 0; i < morph.targets.length; i ++ ) {

				var target_id = morph.targets[ i ];
				var daeGeometry = this.geometries[ target_id ];

				if ( !daeGeometry.mesh ||
					 !daeGeometry.mesh.primitives ||
					 !daeGeometry.mesh.primitives.length ) {
					 continue;
				}

				var target = daeGeometry.mesh.primitives[ 0 ].geometry;

				if ( target.vertices.length === geometry.vertices.length ) {

					geometry.morphTargets.push( { name: "target_1", vertices: target.vertices } );

				}

			}

			geometry.morphTargets.push( { name: "target_Z", vertices: geometry.vertices } );

		}

		createSkin ( geometry, ctrl, applyBindShape ) {

			var skinCtrl = this.controllers[ ctrl.url ];

			if ( !skinCtrl || !skinCtrl.skin ) {

				console.log( "could not find skin controller!" );
				return;

			}

			if ( !ctrl.skeleton || !ctrl.skeleton.length ) {

				console.log( "could not find the skeleton for the skin!" );
				return;

			}

			var skin = skinCtrl.skin;
			var skeleton = this.daeScene.getChildById( ctrl.skeleton[ 0 ] );
			var hierarchy = [];

			applyBindShape = applyBindShape !== undefined ? applyBindShape : true;

			var bones = [];
			geometry.skinWeights = [];
			geometry.skinIndices = [];

			//createBones( geometry.bones, skin, hierarchy, skeleton, null, -1 );
			//createWeights( skin, geometry.bones, geometry.skinIndices, geometry.skinWeights );

			/*
			geometry.animation = {
				name: 'take_001',
				fps: 30,
				length: 2,
				JIT: true,
				hierarchy: hierarchy
			};
			*/

			if ( applyBindShape ) {

				for ( var i = 0; i < geometry.vertices.length; i ++ ) {

					skin.bindShapeMatrix.multiplyVector3( geometry.vertices[ i ] );

				}

			}

		}

		setupSkeleton ( node, bones, frame, parent? ) {

			node.world = node.world || new THREE.Matrix4();
			node.world.copy( node.matrix );

			if ( node.channels && node.channels.length ) {

				var channel = node.channels[ 0 ];
				var m = channel.sampler.output[ frame ];

				if ( m instanceof THREE.Matrix4 ) {

					node.world.copy( m );

				}

			}

			if ( parent ) {

				node.world.multiply( parent, node.world );

			}

			bones.push( node );

			for ( var i = 0; i < node.nodes.length; i ++ ) {

				this.setupSkeleton( node.nodes[ i ], bones, frame, node.world );

			}

		}

		setupSkinningMatrices ( bones, skin ) {

			// FIXME: this is dumb...

			for ( var i = 0; i < bones.length; i ++ ) {

				var bone = bones[ i ];
				var found = -1;

				if ( bone.type != 'JOINT' ) continue;

				for ( var j = 0; j < skin.joints.length; j ++ ) {

					if ( bone.sid == skin.joints[ j ] ) {

						found = j;
						break;

					}

				}

				if ( found >= 0 ) {

					var inv = skin.invBindMatrices[ found ];

					bone.invBindMatrix = inv;
					bone.skinningMatrix = new THREE.Matrix4();
					bone.skinningMatrix.multiply(bone.world, inv); // (IBMi * JMi)

					bone.weights = [];

					for ( var j = 0; j < skin.weights.length; j ++ ) {

						for (var k = 0; k < skin.weights[ j ].length; k ++) {

							var w = skin.weights[ j ][ k ];

							if ( w.joint == found ) {

								bone.weights.push( w );

							}

						}

					}

				} else {

					throw 'ColladaLoader: Could not find joint \'' + bone.sid + '\'.';

				}

			}

		}

		applySkin ( geometry, instanceCtrl, frame? ) {

			var skinController = this.controllers[ instanceCtrl.url ];

			frame = frame !== undefined ? frame : 40;

			if ( !skinController || !skinController.skin ) {

				console.log( 'ColladaLoader: Could not find skin controller.' );
				return;

			}

			if ( !instanceCtrl.skeleton || !instanceCtrl.skeleton.length ) {

				console.log( 'ColladaLoader: Could not find the skeleton for the skin. ' );
				return;

			}

			var animationBounds = this.calcAnimationBounds();
			var skeleton = this.daeScene.getChildById( instanceCtrl.skeleton[0], true ) ||
						   this.daeScene.getChildBySid( instanceCtrl.skeleton[0], true );

			var i, j, w, vidx, weight;
			var v = new THREE.Vector3(), o, s;

			// move vertices to bind shape

			for ( i = 0; i < geometry.vertices.length; i ++ ) {

				skinController.skin.bindShapeMatrix.multiplyVector3( geometry.vertices[i] );

			}

			// process animation, or simply pose the rig if no animation

			for ( frame = 0; frame < animationBounds.frames; frame ++ ) {

				var bones = [];
				var skinned = [];

				// zero skinned vertices

				for ( i = 0; i < geometry.vertices.length; i++ ) {

					skinned.push( new THREE.Vector3() );

				}

				// process the frame and setup the rig with a fresh
				// transform, possibly from the bone's animation channel(s)

				this.setupSkeleton( skeleton, bones, frame );
				this.setupSkinningMatrices( bones, skinController.skin );

				// skin 'm

				for ( i = 0; i < bones.length; i ++ ) {

					if ( bones[ i ].type != 'JOINT' ) continue;

					for ( j = 0; j < bones[ i ].weights.length; j ++ ) {

						w = bones[ i ].weights[ j ];
						vidx = w.index;
						weight = w.weight;

						o = geometry.vertices[vidx];
						s = skinned[vidx];

						v.x = o.x;
						v.y = o.y;
						v.z = o.z;

						bones[i].skinningMatrix.multiplyVector3(v);

						s.x += (v.x * weight);
						s.y += (v.y * weight);
						s.z += (v.z * weight);

					}

				}

				geometry.morphTargets.push( { name: "target_" + frame, vertices: skinned } );

			}

		}

		createSceneGraph ( node, parent? ) {

			var obj = new THREE.Object3D();
			var skinned = false;
			var skinController;
			var morphController;
			var i, j;

			// FIXME: controllers

			for ( i = 0; i < node.controllers.length; i ++ ) {

				var controller = this.controllers[ node.controllers[ i ].url ];

				switch ( controller.type ) {

					case 'skin':

						if ( this.geometries[ controller.skin.source ] ) {

							var inst_geom = new InstanceGeometry(this);

							inst_geom.url = controller.skin.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );
							skinned = true;
							skinController = node.controllers[ i ];

						} else if ( this.controllers[ controller.skin.source ] ) {

							// urgh: controller can be chained
							// handle the most basic case...

							var second = this.controllers[ controller.skin.source ];
							morphController = second;
						//	skinController = node.controllers[i];

							if ( second.morph && this.geometries[ second.morph.source ] ) {

								var inst_geom = new InstanceGeometry(this);

								inst_geom.url = second.morph.source;
								inst_geom.instance_material = node.controllers[ i ].instance_material;

								node.geometries.push( inst_geom );

							}

						}

						break;

					case 'morph':

						if ( this.geometries[ controller.morph.source ] ) {

							var inst_geom = new InstanceGeometry(this);

							inst_geom.url = controller.morph.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );
							morphController = node.controllers[ i ];

						}

						console.log( 'ColladaLoader: Morph-controller partially supported.' );

					default:
						break;

				}

			}

			// FIXME: multi-material mesh?
			// geometries

			var double_sided_materials:{[materialID:string]:THREE.Material;} = {};

			for ( i = 0; i < node.geometries.length; i ++ ) {

				var instance_geometry = node.geometries[i];
				var instance_materials = instance_geometry.instance_material;
				var geometry = this.geometries[ instance_geometry.url ];
				var used_materials = {};
				var used_materials_array = [];
				var num_materials = 0;
				var first_material;

				if ( geometry ) {

					if ( !geometry.mesh || !geometry.mesh.primitives )
						continue;

					if ( obj.name.length == 0 ) {

						obj.name = geometry.id;

					}

					// collect used fx for this geometry-instance

					if ( instance_materials ) {

						for ( j = 0; j < instance_materials.length; j ++ ) {

							var instance_material = instance_materials[ j ];
							var mat = this.materials[ instance_material.target ];
							var effect_id = mat.instance_effect.url;
							var shader = this.effects[ effect_id ].shader;
							var material3js:THREE.Material = shader.material;

							if ( geometry.doubleSided ) {

								if ( !(double_sided_materials[material3js.id.toString()] !== undefined) ) {	// ???

									var _copied_material = material3js.clone();
									_copied_material.side = THREE.DoubleSide;
									double_sided_materials[ material3js.id.toString() ] = _copied_material;

								}

								material3js = double_sided_materials[ material3js.id.toString() ];

							}

							material3js.opacity = !material3js.opacity ? 1 : material3js.opacity;
							used_materials[ instance_material.symbol ] = num_materials;
							used_materials_array.push( material3js );
							first_material = material3js;
							first_material.name = mat.name == null || mat.name === '' ? mat.id : mat.name;
							num_materials ++;

						}

					}

					var mesh;
					var material = first_material || new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading, side: geometry.doubleSided ? THREE.DoubleSide : THREE.FrontSide } );
					var geom = geometry.mesh.geometry3js;

					if ( num_materials > 1 ) {

						material = new THREE.MeshFaceMaterial( used_materials_array );

						for ( j = 0; j < geom.faces.length; j ++ ) {

							var face = geom.faces[ j ];
							face.materialIndex = used_materials[ (<any>face).daeMaterial ]

						}

					}

					if ( skinController !== undefined ) {

						this.applySkin( geom, skinController );

						material.morphTargets = true;

						mesh = new THREE.SkinnedMesh( geom, material, false );
						mesh.skeleton = skinController.skeleton;
						mesh.skinController = this.controllers[ skinController.url ];
						mesh.skinInstanceController = skinController;
						mesh.name = 'skin_' + this.skins.length;

						this.skins.push( mesh );

					} else if ( morphController !== undefined ) {

						this.createMorph( geom, morphController );

						material.morphTargets = true;

						mesh = new THREE.Mesh( geom, material );
						mesh.name = 'morph_' + this.morphs.length;

						this.morphs.push( mesh );

					} else {

						mesh = new THREE.Mesh( geom, material );
						// mesh.geom.name = geometry.id;

					}

					node.geometries.length > 1 ? obj.add( mesh ) : obj = mesh;

				}

			}

			for ( i = 0; i < node.cameras.length; i ++ ) {

				var instance_camera = node.cameras[i];
				var cparams = this.cameras[instance_camera.url];

				obj = new THREE.PerspectiveCamera(cparams.xfov, cparams.aspect_ratio, cparams.znear, cparams.zfar);

			}

			obj.name = node.id || "";
			obj.matrix = node.matrix;
			var props = node.matrix.decompose();
			obj.position = props[ 0 ];
			obj.quaternion = props[ 1 ];
			obj.useQuaternion = true;
			obj.scale = props[ 2 ];

			if ( this.options.centerGeometry && obj.hasOwnProperty('geometry') ) {

				var delta = THREE.GeometryUtils.center( (<any>obj).geometry );
				obj.quaternion.multiplyVector3( delta.multiplySelf( obj.scale ) );
				obj.position.subSelf( delta );

			}

			for ( i = 0; i < node.nodes.length; i ++ ) {

				obj.add( this.createSceneGraph( node.nodes[i], node ) );

			}

			return obj;

		}

		getJointId( skin, id ) {

			for ( var i = 0; i < skin.joints.length; i ++ ) {

				if ( skin.joints[ i ] == id ) {

					return i;

				}

			}

		}

		getLibraryNode( id ) {

			return this.COLLADA.evaluate( './/dae:library_nodes//dae:node[@id=\'' + id + '\']', this.COLLADA, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null ).iterateNext();

		}

		getChannelsForNode (node ) {

			var channels = [];
			var startTime = 1000000;
			var endTime = -1000000;

			for ( var id in this.animations ) {

				var animation = this.animations[id];

				for ( var i = 0; i < animation.channel.length; i ++ ) {

					var channel = animation.channel[i];
					var sampler = animation.sampler[i];
					var id = channel.target.split('/')[0];

					if ( id == node.id ) {

						sampler.create();
						channel.sampler = sampler;
						startTime = _Math.min(startTime, sampler.startTime);
						endTime = _Math.max(endTime, sampler.endTime);
						channels.push(channel);

					}

				}

			}

			if ( channels.length ) {

				node.startTime = startTime;
				node.endTime = endTime;

			}

			return channels;

		}

		calcFrameDuration( node ) {

			var minT = 10000000;

			for ( var i = 0; i < node.channels.length; i ++ ) {

				var sampler = node.channels[i].sampler;

				for ( var j = 0; j < sampler.input.length - 1; j ++ ) {

					var t0 = sampler.input[ j ];
					var t1 = sampler.input[ j + 1 ];
					minT = _Math.min( minT, t1 - t0 );

				}
			}

			return minT;

		}

		calcMatrixAt( node, t ) {

			var animated = {};

			var i, j;

			for ( i = 0; i < node.channels.length; i ++ ) {

				var channel = node.channels[ i ];
				animated[ channel.sid ] = channel;

			}

			var matrix = new THREE.Matrix4();

			for ( i = 0; i < node.transforms.length; i ++ ) {

				var transform = node.transforms[ i ];
				var channel = animated[ transform.sid ];

				if ( channel !== undefined ) {

					var sampler = channel.sampler;
					var value;

					for ( j = 0; j < sampler.input.length - 1; j ++ ) {

						if ( sampler.input[ j + 1 ] > t ) {

							value = sampler.output[ j ];
							//console.log(value.flatten)
							break;

						}

					}

					if ( value !== undefined ) {

						if ( value instanceof THREE.Matrix4 ) {

							matrix = matrix.multiply( matrix, value );

						} else {

							// FIXME: handle other types

							matrix = matrix.multiply( matrix, transform.matrix );

						}

					} else {

						matrix = matrix.multiply( matrix, transform.matrix );

					}

				} else {

					matrix = matrix.multiply( matrix, transform.matrix );

				}

			}

			return matrix;

		}

		bakeAnimations ( node ) {

			if ( node.channels && node.channels.length ) {

				var keys = [],
					sids = [];

				for ( var i = 0, il = node.channels.length; i < il; i++ ) {

					var channel = node.channels[i],
						fullSid = channel.fullSid,
						sampler = channel.sampler,
						input = sampler.input,
						transform = node.getTransformBySid( channel.sid ),
						member;

					if ( channel.arrIndices ) {

						member = [];

						for ( var j = 0, jl = channel.arrIndices.length; j < jl; j++ ) {

							member[ j ] = getConvertedIndex(this, channel.arrIndices[ j ] );

						}

					} else {

						member = getConvertedMember(this, channel.member );

					}

					if ( transform ) {

						if ( sids.indexOf( fullSid ) === -1 ) {

							sids.push( fullSid );

						}

						for ( var j = 0, jl = input.length; j < jl; j++ ) {

							var time = input[j],
								data = sampler.getData( transform.type, j ),
								key = this.findKey( keys, time );

							if ( !key ) {

								key = new Key( time );
								var timeNdx = this.findTimeNdx( keys, time );
								keys.splice( timeNdx == -1 ? keys.length : timeNdx, 0, key );

							}

							key.addTarget( fullSid, transform, member, data );

						}

					} else {

						console.log( 'Could not find transform "' + channel.sid + '" in node ' + node.id );

					}

				}

				// post process
				for ( var i = 0; i < sids.length; i++ ) {

					var sid = sids[ i ];

					for ( var j = 0; j < keys.length; j++ ) {

						var key = keys[ j ];

						if ( !key.hasTarget( sid ) ) {

							this.interpolateKeys( keys, key, j, sid );

						}

					}

				}

				node.keys = keys;
				node.sids = sids;

			}

		}

		findKey ( keys, time) {

			var retVal = null;

			for ( var i = 0, il = keys.length; i < il && retVal == null; i++ ) {

				var key = keys[i];

				if ( key.time === time ) {

					retVal = key;

				} else if ( key.time > time ) {

					break;

				}

			}

			return retVal;

		}

		findTimeNdx ( keys, time) {

			var ndx = -1;

			for ( var i = 0, il = keys.length; i < il && ndx == -1; i++ ) {

				var key = keys[i];

				if ( key.time >= time ) {

					ndx = i;

				}

			}

			return ndx;

		}

		interpolateKeys ( keys, key, ndx, fullSid ) {

			var prevKey = this.getPrevKeyWith( keys, fullSid, ndx ? ndx-1 : 0 ),
				nextKey = this.getNextKeyWith( keys, fullSid, ndx+1 );

			if ( prevKey && nextKey ) {

				var scale = (key.time - prevKey.time) / (nextKey.time - prevKey.time),
					prevTarget = prevKey.getTarget( fullSid ),
					nextData = nextKey.getTarget( fullSid ).data,
					prevData = prevTarget.data,
					data;

				if ( prevTarget.type === 'matrix' ) {

					data = prevData;

				} else if ( prevData.length ) {

					data = [];

					for ( var i = 0; i < prevData.length; ++i ) {

						data[ i ] = prevData[ i ] + ( nextData[ i ] - prevData[ i ] ) * scale;

					}

				} else {

					data = prevData + ( nextData - prevData ) * scale;

				}

				key.addTarget( fullSid, prevTarget.transform, prevTarget.member, data );

			}

		}

		// Get next key with given sid

		getNextKeyWith( keys, fullSid, ndx ) {

			for ( ; ndx < keys.length; ndx++ ) {

				var key = keys[ ndx ];

				if ( key.hasTarget( fullSid ) ) {

					return key;

				}

			}

			return null;

		}

		// Get previous key with given sid

		getPrevKeyWith( keys, fullSid, ndx ) {

			ndx = ndx >= 0 ? ndx : ndx + keys.length;

			for ( ; ndx >= 0; ndx-- ) {

				var key = keys[ ndx ];

				if ( key.hasTarget( fullSid ) ) {

					return key;

				}

			}

			return null;

		}




	}

		
	export class _Image{
		id:string = "";
		init_from:string = "";
		constructor() {
		}

		parse(element) {

			this.id = element.getAttribute('id');

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeName == 'init_from' ) {

					this.init_from = child.textContent;

				}

			}

			return this;

		}
	}

	export class Controller{
		id:string;
		name:string;
		type:string;
		skin:Skin;
		morph:Morph;

		constructor(private loader:ColladaLoader) {

			this.id = "";
			this.name = "";
			this.type = "";
			this.skin = null;
			this.morph = null;

		}

		parse( element ) {

			this.id = element.getAttribute('id');
			this.name = element.getAttribute('name');
			this.type = "none";

			for ( var i = 0; i < element.childNodes.length; i++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'skin':

						this.skin = (new Skin(this.loader)).parse(child);
						this.type = child.nodeName;
						break;

					case 'morph':

						this.morph = (new Morph(this.loader)).parse(child);
						this.type = child.nodeName;
						break;

					default:
						break;

				}
			}

			return this;

		}
	}

	export class Morph{
		method:string;
		source:string;
		targets:THREE.Matrix4[];
		weights:THREE.Matrix4[];

		constructor(private loader:ColladaLoader) {

			this.method = null;
			this.source = null;
			this.targets = null;
			this.weights = null;

		}

		parse( element ) {

			var sources = {};
			var inputs = [];
			var i;

			this.method = element.getAttribute( 'method' );
			this.source = element.getAttribute( 'source' ).replace( /^#/, '' );

			for ( i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'source':

						var source = ( new Source(this.loader) ).parse( child );
						sources[ source.id ] = source;
						break;

					case 'targets':

						inputs = this.parseInputs( child );
						break;

					default:

						console.log( child.nodeName );
						break;

				}

			}

			for ( i = 0; i < inputs.length; i ++ ) {

				var input = inputs[ i ];
				var source = sources[ input.source ];

				switch ( input.semantic ) {

					case 'MORPH_TARGET':

						this.targets = source.read();
						break;

					case 'MORPH_WEIGHT':

						this.weights = source.read();
						break;

					default:
						break;

				}
			}

			return this;

		}

		parseInputs(element) {

			var inputs = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];
				if ( child.nodeType != 1) continue;

				switch ( child.nodeName ) {

					case 'input':

						inputs.push( (new Input()).parse(child) );
						break;

					default:
						break;
				}
			}

			return inputs;

		}
	}

	export class Skin{
		source:string;
		bindShapeMatrix:THREE.Matrix4;
		invBindMatrices:THREE.Matrix4[];
		joints;
		weights;

		constructor(private loader:ColladaLoader) {

			this.source = "";
			this.bindShapeMatrix = null;
			this.invBindMatrices = [];
			this.joints = [];
			this.weights = [];

		}

		parse( element ) {

			var sources = {};
			var joints, weights;

			this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
			this.invBindMatrices = [];
			this.joints = [];
			this.weights = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'bind_shape_matrix':

						var f = _floats(child.textContent);
						this.bindShapeMatrix = getConvertedMat4(this.loader, f );
						break;

					case 'source':

						var src = new Source(this.loader).parse(child);
						sources[ src.id ] = src;
						break;

					case 'joints':

						joints = child;
						break;

					case 'vertex_weights':

						weights = child;
						break;

					default:

						console.log( child.nodeName );
						break;

				}
			}

			this.parseJoints( joints, sources );
			this.parseWeights( weights, sources );

			return this;

		}

		parseJoints( element, sources ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':

						var input = ( new Input() ).parse( child );
						var source = sources[ input.source ];

						if ( input.semantic == 'JOINT' ) {

							this.joints = source.read();

						} else if ( input.semantic == 'INV_BIND_MATRIX' ) {

							this.invBindMatrices = source.read();

						}

						break;

					default:
						break;
				}

			}

		}

		parseWeights( element, sources ) {

			var v, vcount, inputs = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':

						inputs.push( ( new Input() ).parse( child ) );
						break;

					case 'v':

						v = _ints( child.textContent );
						break;

					case 'vcount':

						vcount = _ints( child.textContent );
						break;

					default:
						break;

				}

			}

			var index = 0;

			for ( var i = 0; i < vcount.length; i ++ ) {

				var numBones = vcount[i];
				var vertex_weights = [];

				for ( var j = 0; j < numBones; j++ ) {

					var influence = { joint: 0, weight: 0 };

					for ( var k = 0; k < inputs.length; k ++ ) {

						var input = inputs[ k ];
						var value = v[ index + input.offset ];

						switch ( input.semantic ) {

							case 'JOINT':

								influence.joint = value;//this.joints[value];
								break;

							case 'WEIGHT':

								influence.weight = sources[ input.source ].data[ value ];
								break;

							default:
								break;

						}

					}

					vertex_weights.push( influence );
					index += inputs.length;
				}

				for ( var j = 0; j < vertex_weights.length; j ++ ) {

					vertex_weights[ j ].index = i;

				}

				this.weights.push( vertex_weights );

			}

		}
	}

	export class VisualScene{
		id:string = "";
		name:string = "";
		nodes:Node[] = [];
		scene:THREE.Object3D = new THREE.Object3D();

		constructor(private loader:ColladaLoader) {
		}

		getChildById( id, recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var node = this.nodes[ i ].getChildById( id, recursive );

				if ( node ) {

					return node;

				}

			}

			return null;

		}

		getChildBySid( sid, recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var node = this.nodes[ i ].getChildBySid( sid, recursive );

				if ( node ) {

					return node;

				}

			}

			return null;

		}

		parse( element ) {

			this.id = element.getAttribute( 'id' );
			this.name = element.getAttribute( 'name' );
			this.nodes = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'node':

						this.nodes.push( ( new Node(this.loader) ).parse( child ) );
						break;

					default:
						break;

				}

			}

			return this;

		}
	}

	export class Node{
		id:string = "";
		name:string = "";
		sid:string = "";
		nodes:Node[]                     = [];
		controllers:InstanceController[] = [];
		transforms :Transform[]          = [];
		geometries :InstanceGeometry[]   = [];
		channels = [];
		matrix:THREE.Matrix4 = new THREE.Matrix4();

		type:string;
		cameras:InstanceCamera[] = [];

		constructor(private loader:ColladaLoader) {
		}

		getChannelForTransform( transformSid ) {

			for ( var i = 0; i < this.channels.length; i ++ ) {

				var channel = this.channels[i];
				var parts = channel.target.split('/');
				var id = parts.shift();
				var sid = parts.shift();
				var dotSyntax = (sid.indexOf(".") >= 0);
				var arrSyntax = (sid.indexOf("(") >= 0);
				var arrIndices;
				var member;

				if ( dotSyntax ) {

					parts = sid.split(".");
					sid = parts.shift();
					member = parts.shift();

				} else if ( arrSyntax ) {

					arrIndices = sid.split("(");
					sid = arrIndices.shift();

					for ( var j = 0; j < arrIndices.length; j ++ ) {

						arrIndices[ j ] = parseInt( arrIndices[ j ].replace( /\)/, '' ) );

					}

				}

				if ( sid == transformSid ) {

					channel.info = { sid: sid, dotSyntax: dotSyntax, arrSyntax: arrSyntax, arrIndices: arrIndices };
					return channel;

				}

			}

			return null;

		}

		getChildById( id, recursive ) {

			if ( this.id == id ) {

				return this;

			}

			if ( recursive ) {

				for ( var i = 0; i < this.nodes.length; i ++ ) {

					var n = this.nodes[ i ].getChildById( id, recursive );

					if ( n ) {

						return n;

					}

				}

			}

			return null;

		}

		getChildBySid( sid, recursive ) {

			if ( this.sid == sid ) {

				return this;

			}

			if ( recursive ) {

				for ( var i = 0; i < this.nodes.length; i ++ ) {

					var n = this.nodes[ i ].getChildBySid( sid, recursive );

					if ( n ) {

						return n;

					}

				}
			}

			return null;

		}

		getTransformBySid( sid ) {

			for ( var i = 0; i < this.transforms.length; i ++ ) {

				if ( this.transforms[ i ].sid == sid ) return this.transforms[ i ];

			}

			return null;

		}

		parse( element ) {

			var url;

			this.id = element.getAttribute('id');
			this.sid = element.getAttribute('sid');
			this.name = element.getAttribute('name');
			this.type = element.getAttribute('type');

			this.type = this.type == 'JOINT' ? this.type : 'NODE';

			this.nodes = [];
			this.transforms = [];
			this.geometries = [];
			this.cameras = [];
			this.controllers = [];
			this.matrix = new THREE.Matrix4();

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'node':

						this.nodes.push( ( new Node(this.loader) ).parse( child ) );
						break;

					case 'instance_camera':

						this.cameras.push( ( new InstanceCamera() ).parse( child ) );
						break;

					case 'instance_controller':

						this.controllers.push( ( new InstanceController(this.loader) ).parse( child ) );
						break;

					case 'instance_geometry':

						this.geometries.push( ( new InstanceGeometry(this.loader) ).parse( child ) );
						break;

					case 'instance_light':

						break;

					case 'instance_node':

						url = child.getAttribute( 'url' ).replace( /^#/, '' );
						var iNode = this.loader.getLibraryNode( url );

						if ( iNode ) {

							this.nodes.push( ( new Node(this.loader) ).parse( iNode )) ;

						}

						break;

					case 'rotate':
					case 'translate':
					case 'scale':
					case 'matrix':
					case 'lookat':
					case 'skew':

						this.transforms.push( ( new Transform(this.loader) ).parse( child ) );
						break;

					case 'extra':
						break;

					default:

						console.log( child.nodeName );
						break;

				}

			}

			this.channels = this.loader.getChannelsForNode( this );
			this.loader.bakeAnimations( this );

			this.updateMatrix();

			return this;

		}	

		updateMatrix() {

			this.matrix.identity();

			for ( var i = 0; i < this.transforms.length; i ++ ) {

				this.transforms[ i ].apply( this.matrix );

			}

		}
	}

	export class Transform{
		sid:string = "";
		type:string = "";
		data:number[] = [];
		obj:any = null; // Matrix4 or Vector3
		angle:number;

		constructor(private loader:ColladaLoader) {
		}

		parse( element ) {

			this.sid = element.getAttribute( 'sid' );
			this.type = element.nodeName;
			this.data = _floats( element.textContent );
			this.convert();

			return this;

		}

		convert() {

			switch ( this.type ) {

				case 'matrix':

					this.obj = getConvertedMat4(this.loader, this.data );
					break;

				case 'rotate':

					this.angle = this.data[3] * TO_RADIANS;

				case 'translate':

					fixCoords(this.loader, this.data, -1 );
					this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
					break;

				case 'scale':

					fixCoords(this.loader, this.data, 1 );
					this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
					break;

				default:
					console.log( 'Can not convert Transform of type ' + this.type );
					break;

			}

		}

		apply( matrix ) {

			switch ( this.type ) {

				case 'matrix':

					matrix.multiplySelf( this.obj );
					break;

				case 'translate':

					matrix.translate( this.obj );
					break;

				case 'rotate':

					matrix.rotateByAxis( this.obj, this.angle );
					break;

				case 'scale':

					matrix.scale( this.obj );
					break;

			}

		}

		update( data, member ) {

			var members = [ 'X', 'Y', 'Z', 'ANGLE' ];

			switch ( this.type ) {

				case 'matrix':

					if ( ! member ) {

						this.obj.copy( data );

					} else if ( member.length === 1 ) {

						switch ( member[ 0 ] ) {

							case 0:

								this.obj.n11 = data[ 0 ];
								this.obj.n21 = data[ 1 ];
								this.obj.n31 = data[ 2 ];
								this.obj.n41 = data[ 3 ];

								break;

							case 1:

								this.obj.n12 = data[ 0 ];
								this.obj.n22 = data[ 1 ];
								this.obj.n32 = data[ 2 ];
								this.obj.n42 = data[ 3 ];

								break;

							case 2:

								this.obj.n13 = data[ 0 ];
								this.obj.n23 = data[ 1 ];
								this.obj.n33 = data[ 2 ];
								this.obj.n43 = data[ 3 ];

								break;

							case 3:

								this.obj.n14 = data[ 0 ];
								this.obj.n24 = data[ 1 ];
								this.obj.n34 = data[ 2 ];
								this.obj.n44 = data[ 3 ];

								break;

						}

					} else if ( member.length === 2 ) {

						var propName = 'n' + ( member[ 0 ] + 1 ) + ( member[ 1 ] + 1 );
						this.obj[ propName ] = data;

					} else {

						console.log('Incorrect addressing of matrix in transform.');

					}

					break;

				case 'translate':
				case 'scale':

					if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

						member = members[ member[ 0 ] ];

					}

					switch ( member ) {

						case 'X':

							this.obj.x = data;
							break;

						case 'Y':

							this.obj.y = data;
							break;

						case 'Z':

							this.obj.z = data;
							break;

						default:

							this.obj.x = data[ 0 ];
							this.obj.y = data[ 1 ];
							this.obj.z = data[ 2 ];
							break;

					}

					break;

				case 'rotate':

					if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

						member = members[ member[ 0 ] ];

					}

					switch ( member ) {

						case 'X':

							this.obj.x = data;
							break;

						case 'Y':

							this.obj.y = data;
							break;

						case 'Z':

							this.obj.z = data;
							break;

						case 'ANGLE':

							this.angle = data * TO_RADIANS;
							break;

						default:

							this.obj.x = data[ 0 ];
							this.obj.y = data[ 1 ];
							this.obj.z = data[ 2 ];
							this.angle = data[ 3 ] * TO_RADIANS;
							break;

					}
					break;

			}

		}
	}

	export class InstanceController{
		url:string = "";
		skeleton:string[] = [];
		instance_material:InstanceMaterial[] = [];

		constructor(private loader:ColladaLoader) {
		}

		parse( element ) {

			this.url = element.getAttribute('url').replace(/^#/, '');
			this.skeleton = [];
			this.instance_material = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'skeleton':

						this.skeleton.push( child.textContent.replace(/^#/, '') );
						break;

					case 'bind_material':

						var instances = this.loader.COLLADA.evaluate( './/dae:instance_material', child, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

						if ( instances ) {

							var instance = instances.iterateNext();

							while ( instance ) {

								this.instance_material.push( (new InstanceMaterial()).parse(instance) );
								instance = instances.iterateNext();

							}

						}

						break;

					case 'extra':
						break;

					default:
						break;

				}
			}

			return this;

		}
	}

	export class InstanceMaterial{
		symbol:string = "";
		target:string = "";

		constructor() {
		}

		parse( element ) {

			this.symbol = element.getAttribute('symbol');
			this.target = element.getAttribute('target').replace(/^#/, '');
			return this;

		}
	}

	export class InstanceGeometry{
		url:string = "";
		instance_material:InstanceMaterial[] = [];

		constructor(private loader:ColladaLoader) {
		}

		parse( element ) {

			this.url = element.getAttribute('url').replace(/^#/, '');
			this.instance_material = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];
				if ( child.nodeType != 1 ) continue;

				if ( child.nodeName == 'bind_material' ) {

					var instances = this.loader.COLLADA.evaluate( './/dae:instance_material', child, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

					if ( instances ) {

						var instance = instances.iterateNext();

						while ( instance ) {

							this.instance_material.push( (new InstanceMaterial()).parse(instance) );
							instance = instances.iterateNext();

						}

					}

					break;

				}

			}

			return this;

		}
	}

	export class _Geometry{
		id:string;
		mesh:_Mesh;
		doubleSided:bool;

		constructor(private loader:ColladaLoader) {

			this.id = "";
			this.mesh = null;

		}

		parse( element ) {

			this.id = element.getAttribute('id');

			extractDoubleSided(this.loader, this, element );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];

				switch ( child.nodeName ) {

					case 'mesh':

						this.mesh = (new _Mesh(this.loader, this)).parse(child);
						break;

					case 'extra':

						// console.log( child );
						break;

					default:
						break;
				}
			}

			return this;

		}
	}

	export class _Mesh{

		geometry:string;
		primitives:any[];
		vertices:Vertices;
		geometry3js:THREE.Geometry;

		constructor(private loader:ColladaLoader, geometry ) {

			this.geometry = geometry.id;
			this.primitives = [];
			this.vertices = null;
			this.geometry3js = null;

		}

		parse( element ) {

			this.primitives = [];

			var i, j;

			for ( i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'source':

						_source(this.loader, child );
						break;

					case 'vertices':

						this.vertices = ( new Vertices() ).parse( child );
						break;

					case 'triangles':

						this.primitives.push( ( new Triangles().parse( child ) ) );
						break;

					case 'polygons':

						this.primitives.push( ( new Polygons().parse( child ) ) );
						break;

					case 'polylist':

						this.primitives.push( ( new Polylist().parse( child ) ) );
						break;

					default:
						break;

				}

			}

			this.geometry3js = new THREE.Geometry();

			var vertexData = this.loader.sources[ this.vertices.input['POSITION'].source ].data;

			for ( i = 0; i < vertexData.length; i += 3 ) {

				this.geometry3js.vertices.push( getConvertedVec3(this.loader, vertexData, i ).clone() );

			}

			for ( i = 0; i < this.primitives.length; i ++ ) {

				var primitive = this.primitives[ i ];
				primitive.setVertices( this.vertices );
				this.handlePrimitive( primitive, this.geometry3js );

			}

			this.geometry3js.computeCentroids();
			this.geometry3js.computeFaceNormals();

			if ( (<any>this.geometry3js).calcNormals ) {

				this.geometry3js.computeVertexNormals();
				delete (<any>this.geometry3js).calcNormals;

			}

			this.geometry3js.computeBoundingBox();

			return this;

		}

		handlePrimitive( primitive, geom ) {

			var j, k, pList = primitive.p, inputs = primitive.inputs;
			var input, index, idx32;
			var source, numParams;
			var vcIndex = 0, vcount = 3, maxOffset = 0;
			var texture_sets = [];

			for ( j = 0; j < inputs.length; j ++ ) {

				input = inputs[ j ];
				var offset = input.offset + 1;
				maxOffset = (maxOffset < offset)? offset : maxOffset;

				switch ( input.semantic ) {

					case 'TEXCOORD':
						texture_sets.push( input.set );
						break;

				}

			}

			for ( var pCount = 0; pCount < pList.length; ++pCount ) {

				var p = pList[ pCount ], i = 0;

				while ( i < p.length ) {

					var vs:number[] = [];
					var ns:THREE.Vector3[] = [];
					var ts:{[key:string]:THREE.Vector2[];} = null;
					var cs:THREE.Color[] = [];

					if ( primitive.vcount ) {

						vcount = primitive.vcount.length ? primitive.vcount[ vcIndex ++ ] : primitive.vcount;

					} else {

						vcount = p.length / maxOffset;

					}


					for ( j = 0; j < vcount; j ++ ) {

						for ( k = 0; k < inputs.length; k ++ ) {

							input = inputs[ k ];
							source = this.loader.sources[ input.source ];

							index = p[ i + ( j * maxOffset ) + input.offset ];
							numParams = source.accessor.params.length;
							idx32 = index * numParams;

							switch ( input.semantic ) {

								case 'VERTEX':

									vs.push( index );

									break;

								case 'NORMAL':

									ns.push( getConvertedVec3(this.loader, source.data, idx32 ) );

									break;

								case 'TEXCOORD':

									ts = ts || { };
									if ( ts[ input.set ] === undefined ) ts[ input.set ] = [];
									// invert the V
									ts[ input.set ].push( new THREE.Vector2( source.data[ idx32 ], source.data[ idx32 + 1 ] ) );

									break;

								case 'COLOR':

									cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

									break;

								default:

									break;

							}

						}

					}

					if ( ns.length == 0 ) {

						// check the vertices inputs
						throw "this section is not implemented";
						/*

						input = this.vertices.input.NORMAL;
						//                          ^^^^^^
						//                       NORMAL is not exists. ????
						//						both of 2 examples don't pass the code.

						if ( input ) {

							source = sources[ input.source ];
							numParams = source.accessor.params.length;

							for ( var ndx = 0, len = vs.length; ndx < len; ndx++ ) {

								ns.push( getConvertedVec3( source.data, vs[ ndx ] * numParams ) );

							}

						} else {

							geom.calcNormals = true;

						}
						*/

					}

					if ( !ts ) {

						ts = { };

						// check the vertices inputs
						
						throw "This section is not implemented.";
						/*
						input = this.vertices.input.TEXCOORD;
						                            ^^^^^^^^
						                            not exists??????

						if ( input ) {

							texture_sets.push( input.set );
							source = sources[ input.source ];
							numParams = source.accessor.params.length;

							for ( var ndx = 0, len = vs.length; ndx < len; ndx++ ) {

								idx32 = vs[ ndx ] * numParams;
								if ( ts[ input.set ] === undefined ) ts[ input.set ] = [ ];
								// invert the V
								ts[ input.set ].push( new THREE.UV( source.data[ idx32 ], 1.0 - source.data[ idx32 + 1 ] ) );

							}

						}
						*/

					}

					if ( cs.length == 0 ) {

						//throw "This section is not implemented.";
						// check the vertices inputs
						
						///input = this.vertices.input.COLOR;
                        //                           ^^^^^^^  
                        //                            ??????
                        input = undefined;

						if ( input ) {

							source = this.loader.sources[ input.source ];
							numParams = source.accessor.params.length;

							for ( var ndx = 0, len = vs.length; ndx < len; ndx++ ) {

								idx32 = vs[ ndx ] * numParams;
								cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

							}

						}
						

					}

					var face = null, faces:THREE.Face[] = [], uv, uvArr;

					if ( vcount === 3 ) {
						faces.push(cs.length ? new THREE.Face3( vs[0], vs[1], vs[2], ns, cs                )
						                     : new THREE.Face3( vs[0], vs[1], vs[2], ns, new THREE.Color() )
						);
					} else if ( vcount === 4 ) {
						faces.push(cs.length ? new THREE.Face4( vs[0], vs[1], vs[2], vs[3], ns, cs ) 
							                 : new THREE.Face4( vs[0], vs[1], vs[2], vs[3], ns, new THREE.Color() )
						);

					} else if ( vcount > 4 && this.loader.options.subdivideFaces ) {


						if(cs.length){
							// subdivide into multiple Face3s
							for ( k = 1; k < vcount - 1; ) {
								// FIXME: normals don't seem to be quite right
								faces.push( new THREE.Face3( vs[0], vs[k], vs[k+1], [ ns[0], ns[k++], ns[k] ],  cs ) );
							}
						}else{
							// subdivide into multiple Face3s
							for ( k = 1; k < vcount - 1; ) {
								// FIXME: normals don't seem to be quite right
								faces.push( new THREE.Face3( vs[0], vs[k], vs[k+1], [ ns[0], ns[k++], ns[k] ],  new THREE.Color() ) );
							}
						}
					}

					if ( faces.length ) {

						for ( var ndx = 0, len = faces.length; ndx < len; ndx ++ ) {

							face = faces[ndx];
							face.daeMaterial = primitive.material;
							geom.faces.push( face );

							for ( k = 0; k < texture_sets.length; k++ ) {

								uv = ts[ texture_sets[k] ];

								if ( vcount > 4 ) {

									// Grab the right UVs for the vertices in this face
									uvArr = [ uv[0], uv[ndx+1], uv[ndx+2] ];

								} else if ( vcount === 4 ) {

									uvArr = [ uv[0], uv[1], uv[2], uv[3] ];

								} else {

									uvArr = [ uv[0], uv[1], uv[2] ];

								}

								if ( !geom.faceVertexUvs[k] ) {

									geom.faceVertexUvs[k] = [];

								}

								geom.faceVertexUvs[k].push( uvArr );

							}

						}

					} else {

						console.log( 'dropped face with vcount ' + vcount + ' for geometry with id: ' + geom.id );

					}

					i += maxOffset * vcount;

				}
			}

		}
	}

	export class Polygons{
		material:string = "";
		count:number = 0;
		inputs:Input[] = [];
		vcount:any = null;	// number or number[]
		p:number[][] = [];
		geometry = new THREE.Geometry();

		constructor() {
		}

		setVertices( vertices ) {

			for ( var i = 0; i < this.inputs.length; i ++ ) {

				if ( this.inputs[ i ].source == vertices.id ) {

					this.inputs[ i ].source = vertices.input[ 'POSITION' ].source;

				}

			}

		}

		parse( element ) {

			this.material = element.getAttribute( 'material' );
			this.count = _attr_as_int( element, 'count', 0 );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'input':

						this.inputs.push( ( new Input() ).parse( element.childNodes[ i ] ) );
						break;

					case 'vcount':

						this.vcount = _ints( child.textContent );
						break;

					case 'p':

						this.p.push( _ints( child.textContent ) );
						break;

					case 'ph':

						console.warn( 'polygon holes not yet supported!' );
						break;

					default:
						break;

				}

			}

			return this;

		}
	}

	export class Polylist extends Polygons{
		constructor() {
			super();
			this.vcount = [];
		}
	}

	export class Triangles extends Polygons {
		constructor(){
			super();	
			this.vcount = 3;
		}

	}


	export class Accessor{
		source:string = "";
		count:number = 0;
		stride:number = 0;
		params:{name:string;type:string;}[] = [];

		constructor() {
		}

		parse( element ) {

			this.params = [];
			this.source = element.getAttribute( 'source' );
			this.count = _attr_as_int( element, 'count', 0 );
			this.stride = _attr_as_int( element, 'stride', 0 );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeName == 'param' ) {

					var param = {
						name: child.getAttribute( 'name' ),
						type: child.getAttribute( 'type' )
					};
					this.params.push( param );

				}

			}

			return this;

		}
	}

	export class Vertices{
		input:{[key:string]:Input;} = {};
		id:string = "";

		constructor() {
		}

		parse( element ) {

			this.id = element.getAttribute('id');

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				if ( element.childNodes[i].nodeName == 'input' ) {

					var input = ( new Input() ).parse( element.childNodes[ i ] );
					this.input[ input.semantic ] = input;

				}

			}

			return this;

		}
	}

	export class Input{
		semantic:string = "";
		offset:number = 0;
		source:string = "";
		_set:number = 0;

		constructor() {
		}

		parse( element ) {

			this.semantic = element.getAttribute('semantic');
			this.source = element.getAttribute('source').replace(/^#/, '');
			this._set = _attr_as_int(element, 'set', -1);
			this.offset = _attr_as_int(element, 'offset', 0);

			if ( this.semantic == 'TEXCOORD' && this._set < 0 ) {

				this._set = 0;

			}

			return this;

		}
	}

	export class Source{
		id:string;
		type:string;
		data:any[];
		accessor:Accessor;
		constructor ( private loader:ColladaLoader, id?:string ) {

			this.id = id;
			this.type = null;

		}

		parse( element:Element ) {

			this.id = element.getAttribute( 'id' );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];

				switch ( child.nodeName ) {

					case 'bool_array':

						this.data = _bools( child.textContent );
						this.type = child.nodeName;
						break;

					case 'float_array':

						this.data = _floats( child.textContent );
						this.type = child.nodeName;
						break;

					case 'int_array':

						this.data = _ints( child.textContent );
						this.type = child.nodeName;
						break;

					case 'IDREF_array':
					case 'Name_array':

						this.data = _strings( child.textContent );
						this.type = child.nodeName;
						break;

					case 'technique_common':

						for ( var j = 0; j < child.childNodes.length; j ++ ) {

							if ( child.childNodes[ j ].nodeName == 'accessor' ) {

								this.accessor = ( new Accessor() ).parse( child.childNodes[ j ] );
								break;

							}
						}
						break;

					default:
						// console.log(child.nodeName);
						break;

				}

			}

			return this;

		}

		read():any {

			var result = [];

			//for (var i = 0; i < this.accessor.params.length; i++) {

				var param = this.accessor.params[ 0 ];

				//console.log(param.name + " " + param.type);

				switch ( param.type ) {

					case 'IDREF':
					case 'Name': case 'name':
					case 'float':

						return this.data;

					case 'float4x4':

						for ( var j = 0; j < this.data.length; j += 16 ) {

							var s = this.data.slice( j, j + 16 );
							var m = getConvertedMat4( this.loader, s );
							result.push( m );
						}

						break;

					default:

						console.log( 'ColladaLoader: Source: Read dont know how to read ' + param.type + '.' );
						break;

				}

			//}

			return result;

		}
	}

	export class _Material{

		id:string;
		name:string;
		instance_effect:InstanceEffect;

		constructor() {

			this.id = "";
			this.name = "";
			this.instance_effect = null;

		}

		parse( element ) {

			this.id = element.getAttribute( 'id' );
			this.name = element.getAttribute( 'name' );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				if ( element.childNodes[ i ].nodeName == 'instance_effect' ) {

					this.instance_effect = ( new InstanceEffect() ).parse( element.childNodes[ i ] );
					break;

				}

			}

			return this;

		}
	}

	export class ColorOrTexture{
		color:THREE.Color = new THREE.Color( 0 );
		
		texture:string = null;
		texcoord:string = null;
		texOpts:{
			offsetU:number;
			offsetV:number;
			repeatU:number;
			repeatV:number;
			wrapU:number;
			wrapV:number; 
		} = null;

		constructor() {
			this.color.setRGB( _Math.random(), _Math.random(), _Math.random() );
			(<any>this.color).a = 1.0;
		}

		isColor() {

			return ( this.texture == null );

		};

		isTexture() {

			return ( this.texture != null );

		};

		parse( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'color':

						var rgba = _floats( child.textContent );
						this.color = new THREE.Color(0);
						this.color.setRGB( rgba[0], rgba[1], rgba[2] );
						(<any>this.color).a = rgba[3];
						break;

					case 'texture':

						this.texture = child.getAttribute('texture');
						this.texcoord = child.getAttribute('texcoord');
						// Defaults from:
						// https://collada.org/mediawiki/index.php/Maya_texture_placement_MAYA_extension
						this.texOpts = {
							offsetU: 0,
							offsetV: 0,
							repeatU: 1,
							repeatV: 1,
							wrapU: 1,
							wrapV: 1,
						};
						this.parseTexture( child );
						break;

					default:
						break;

				}

			}

			return this;

		};

		parseTexture( element ) {

			if ( ! element.childNodes ) return this;

			// This should be supported by Maya, 3dsMax, and MotionBuilder

			if ( element.childNodes[1] && element.childNodes[1].nodeName === 'extra' ) {

				element = element.childNodes[1];

				if ( element.childNodes[1] && element.childNodes[1].nodeName === 'technique' ) {

					element = element.childNodes[1];

				}

			}

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'offsetU':
					case 'offsetV':
					case 'repeatU':
					case 'repeatV':

						this.texOpts[ child.nodeName ] = parseFloat( child.textContent );
						break;

					case 'wrapU':
					case 'wrapV':

						this.texOpts[ child.nodeName ] = parseInt( child.textContent );
						break;

					default:
						this.texOpts[ child.nodeName ] = child.textContent;
						break;

				}

			}

			return this;

		}
	}

	export class Shader{

		material:THREE.Material = null;


		constructor( private loader:ColladaLoader, public type:string, public effect:Effect ) {
		}

		parse( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'ambient':
					case 'emission':
					case 'diffuse':
					case 'specular':
					case 'transparent':

						this[ child.nodeName ] = ( new ColorOrTexture() ).parse( child );
						break;

					case 'shininess':
					case 'reflectivity':
					case 'index_of_refraction':
					case 'transparency':

						var f = evaluateXPath(this.loader, child, './/dae:float' );

						if ( f.length > 0 )
							this[ child.nodeName ] = parseFloat( f[ 0 ].textContent );

						break;

					default:
						break;

				}

			}

			this.create();
			return this;

		}

		create() {

			var props:{
				[key:string]:any;
			} = {};
			var transparent = ( this['transparency'] !== undefined && this['transparency'] < 1.0 );

			for ( var prop in this ) {

				switch ( prop ) {

					case 'ambient':
					case 'emission':
					case 'diffuse':
					case 'specular':

						var cot = this[ prop ];

						if ( cot instanceof ColorOrTexture ) {

							if ( cot.isTexture() ) {

								if ( this.effect.sampler && this.effect.surface ) {

									if ( this.effect.sampler.source == this.effect.surface.sid ) {

										var image = this.loader.images[this.effect.surface.init_from];

										if ( image ) {

											var texture = THREE.ImageUtils.loadTexture(this.loader.baseUrl + image.init_from);
											texture.wrapS = cot.texOpts.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
											texture.wrapT = cot.texOpts.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
											texture.offset.x = cot.texOpts.offsetU;
											texture.offset.y = cot.texOpts.offsetV;
											texture.repeat.x = cot.texOpts.repeatU;
											texture.repeat.y = cot.texOpts.repeatV;
											props['map'] = texture;

											// Texture with baked lighting?
											if ( prop === 'emission' ) props[ 'emissive' ] = 0xffffff;

										}

									}

								}

							} else if ( prop === 'diffuse' || !transparent ) {

								if ( prop === 'emission' ) {

									props[ 'emissive' ] = cot.color.getHex();

								} else {

									props[ prop ] = cot.color.getHex();

								}

							}

						}

						break;

					case 'shininess':

						props[ prop ] = this[ prop ];
						break;

					case 'reflectivity':

						props[ prop ] = this[ prop ];
						if( props[ prop ] > 0.0 ) props['envMap'] = this.loader.options.defaultEnvMap;
						props['combine'] = THREE.MixOperation;	//mix regular shading with reflective component
						break;

					case 'index_of_refraction':

						props[ 'refractionRatio' ] = this[ prop ]; //TODO: "index_of_refraction" becomes "refractionRatio" in shader, but I'm not sure if the two are actually comparable
						if ( this[ prop ] !== 1.0 ) props['envMap'] = this.loader.options.defaultEnvMap;
						break;

					case 'transparency':

						if ( transparent ) {

							props[ 'transparent' ] = true;
							props[ 'opacity' ] = this[ prop ];
							transparent = true;

						}

						break;

					default:
						break;

				}

			}

			props[ 'shading' ] = this.loader.preferredShading;
			props[ 'side' ] = this.effect.doubleSided ? THREE.DoubleSide : THREE.FrontSide;

			switch ( this.type ) {

				case 'constant':

					props['color'] = props['emission'];
					this.material = new THREE.MeshBasicMaterial( props );
					break;

				case 'phong':
				case 'blinn':

					props['color'] = props['diffuse'];
					this.material = new THREE.MeshPhongMaterial( props );
					break;

				case 'lambert':
				default:

					props['color'] = props['diffuse'];
					this.material = new THREE.MeshLambertMaterial( props );
					break;

			}

			return this.material;

		}
	}

	export class Surface{
		init_from:string = null;
		format:string = null;
		sid:string;

		constructor ( public effect:Effect ) {
		}

		parse( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'init_from':

						this.init_from = child.textContent;
						break;

					case 'format':

						this.format = child.textContent;
						break;

					default:

						console.log( "unhandled Surface prop: " + child.nodeName );
						break;

				}

			}

			return this;

		}
	}

	export class Sampler2D{
		source:string = null;
		wrap_s:string = null;
		wrap_t:string = null;
		minfilter:string = null;
		magfilter:string = null;
		mipfilter:string = null;
		sid:number;

		constructor( public effect:Effect ) {
		}

		parse( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'source':

						this.source = child.textContent;
						break;

					case 'minfilter':

						this.minfilter = child.textContent;
						break;

					case 'magfilter':

						this.magfilter = child.textContent;
						break;

					case 'mipfilter':

						this.mipfilter = child.textContent;
						break;

					case 'wrap_s':

						this.wrap_s = child.textContent;
						break;

					case 'wrap_t':

						this.wrap_t = child.textContent;
						break;

					default:

						console.log( "unhandled Sampler2D prop: " + child.nodeName );
						break;

				}

			}

			return this;

		}
	}

	export class Effect{
		id:string = "";
		name:string = "";
		shader:Shader = null;
		surface:Surface = null;
		sampler:Sampler2D = null;
		doubleSided:bool;

		constructor(private loader:ColladaLoader) {
		}

		create() {

			if ( this.shader == null ) {

				return null;

			}

		}

		parse( element ) {

			this.id = element.getAttribute( 'id' );
			this.name = element.getAttribute( 'name' );

			extractDoubleSided(this.loader, this, element );

			this.shader = null;

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'profile_COMMON':

						this.parseTechnique( this.parseProfileCOMMON( child ) );
						break;

					default:
						break;

				}

			}

			return this;

		}

		parseNewparam ( element ) {

			var sid = element.getAttribute( 'sid' );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'surface':

						this.surface = ( new Surface( this ) ).parse( child );
						this.surface.sid = sid;
						break;

					case 'sampler2D':

						this.sampler = ( new Sampler2D( this ) ).parse( child );
						this.sampler.sid = sid;
						break;

					case 'extra':

						break;

					default:

						console.log( child.nodeName );
						break;

				}

			}

		}

		parseProfileCOMMON ( element ) {

			var technique;

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'profile_COMMON':

						this.parseProfileCOMMON( child );
						break;

					case 'technique':

						technique = child;
						break;

					case 'newparam':

						this.parseNewparam( child );
						break;

					case 'image':

						var _image = ( new _Image() ).parse( child );
						this.loader.images[ _image.id ] = _image;
						break;

					case 'extra':
						break;

					default:

						console.log( child.nodeName );
						break;

				}

			}

			return technique;

		}

		parseTechnique( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[i];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'constant':
					case 'lambert':
					case 'blinn':
					case 'phong':

						this.shader = ( new Shader(this.loader, child.nodeName, this ) ).parse( child );
						break;

					default:
						break;

				}

			}

		}
	}

	export class InstanceEffect{
		url:string;

		constructor() {

			this.url = "";

		}

		parse( element ):InstanceEffect {

			this.url = element.getAttribute( 'url' ).replace( /^#/, '' );
			return this;
		}

	}

	export class _Animation{
		id:string = "";
		name:string = "";
		source:{[key:string]:Source;} = {};
		sampler = [];
		channel = [];

		constructor(private loader:ColladaLoader){
		}

		parse( element ) {

			this.id = element.getAttribute( 'id' );
			this.name = element.getAttribute( 'name' );
			this.source = {};

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'animation':

						var anim = ( new _Animation(this.loader) ).parse( child );

						for ( var src in anim.source ) {

							this.source[ src ] = anim.source[ src ];

						}

						for ( var j = 0; j < anim.channel.length; j ++ ) {

							this.channel.push( anim.channel[ j ] );
							this.sampler.push( anim.sampler[ j ] );

						}

						break;

					case 'source':

						// TypeScript's Bug?
						// tsc ssumes 'src' is string.
						var _src:Source = new Source(this.loader);
						_src.parse( child );
						this.source[ _src.id ] = _src;
						break;

					case 'sampler':

						this.sampler.push( ( new Sampler(this.loader, this ) ).parse( child ) );
						break;

					case 'channel':

						this.channel.push( ( new Channel( this ) ).parse( child ) );
						break;

					default:
						break;

				}

			}

			return this;

		}
	}

	export class Channel{
		private animation = animation;
		private source:string;
		private target:string;
		private fullSid;
		private sid;
		private dotSyntax;
		private arrSyntax;
		private arrIndices:number[] = null;
		private member;

		constructor( animation ) {

			this.animation = animation;
			this.source = "";
			this.target = "";
			this.fullSid = null;
			this.sid = null;
			this.dotSyntax = null;
			this.arrSyntax = null;
			this.arrIndices = null;
			this.member = null;

		}

		parse( element ) {

			this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
			this.target = element.getAttribute( 'target' );

			var parts = this.target.split( '/' );

			var id = parts.shift();
			var sid = parts.shift();

			var dotSyntax = ( sid.indexOf(".") >= 0 );
			var arrSyntax = ( sid.indexOf("(") >= 0 );

			if ( dotSyntax ) {

				parts = sid.split(".");
				this.sid = parts.shift();
				this.member = parts.shift();

			} else if ( arrSyntax ) {

				var arrIndices:string[] = sid.split("(");
				this.sid = arrIndices.shift();

				this.arrIndices = [];
				for (var j = 0; j < arrIndices.length; j ++ ) {

					this.arrIndices.push(parseInt( arrIndices[j].replace(/\)/, '') ));

				}
			} else {

				this.sid = sid;

			}

			this.fullSid = sid;
			this.dotSyntax = dotSyntax;
			this.arrSyntax = arrSyntax;

			return this;

		}
	}

	export class Sampler{
		id:string;
		inputs:Input[] = [];
		input:number[] = null;
		output:THREE.Matrix4[] = null;
		strideOut = null;
		interpolation = null;
		startTime:number = 0;
		endTime:number = 0;
		duration:number = 0;

		constructor(private loader:ColladaLoader, public animation:_Animation ) {
		}

		parse ( element ) {

			this.id = element.getAttribute( 'id' );
			this.inputs = [];

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':

						this.inputs.push( (new Input()).parse( child ) );
						break;

					default:
						break;

				}

			}

			return this;

		}

		create () {

			for ( var i = 0; i < this.inputs.length; i ++ ) {

				var input = this.inputs[ i ];
				var source = this.animation.source[ input.source ];

				switch ( input.semantic ) {

					case 'INPUT':

						this.input = source.read();
						break;

					case 'OUTPUT':

						this.output = source.read();
						this.strideOut = source.accessor.stride;
						break;

					case 'INTERPOLATION':

						this.interpolation = source.read();
						break;

					case 'IN_TANGENT':

						break;

					case 'OUT_TANGENT':

						break;

					default:

						console.log(input.semantic);
						break;

				}

			}

			this.startTime = 0;
			this.endTime = 0;
			this.duration = 0;

			if ( this.input.length ) {

				this.startTime = 100000000;
				this.endTime = -100000000;

				for ( var i = 0; i < this.input.length; i ++ ) {

					this.startTime = _Math.min( this.startTime, this.input[ i ] );
					this.endTime   = _Math.max( this.endTime,   this.input[ i ] );

				}

				this.duration = this.endTime - this.startTime;

			}

		}

		getData ( type, ndx ) {

			var data;

			if ( type === 'matrix' && this.strideOut === 16 ) {

				data = this.output[ ndx ];

			} else if ( this.strideOut > 1 ) {

				data = [];
				ndx *= this.strideOut;

				for ( var i = 0; i < this.strideOut; ++i ) {

					data[ i ] = this.output[ ndx + i ];

				}

				if ( this.strideOut === 3 ) {

					switch ( type ) {

						case 'rotate':
						case 'translate':

							fixCoords(this.loader, data, -1 );
							break;

						case 'scale':

							fixCoords(this.loader, data, 1 );
							break;

					}

				} else if ( this.strideOut === 4 && type === 'matrix' ) {

					fixCoords(this.loader, data, -1 );

				}

			} else {

				data = this.output[ ndx ];

			}

			return data;

		}
	}

	export class Key{

		private targets;
		private time;

		constructor( time ) {

			this.targets = [];
			this.time = time;

		}

		addTarget( fullSid, transform, member, data ):void {

			this.targets.push( {
				sid: fullSid,
				member: member,
				transform: transform,
				data: data
			} );

		}

		apply( opt_sid ):void {

			for ( var i = 0; i < this.targets.length; ++i ) {

				var target = this.targets[ i ];

				if ( !opt_sid || target.sid === opt_sid ) {

					target.transform.update( target.data, target.member );

				}

			}

		}

		getTarget( fullSid ) {

			for ( var i = 0; i < this.targets.length; ++i ) {

				if ( this.targets[ i ].sid === fullSid ) {

					return this.targets[ i ];

				}

			}

			return null;

		}

		hasTarget ( fullSid ):bool {

			for ( var i = 0; i < this.targets.length; ++i ) {

				if ( this.targets[ i ].sid === fullSid ) {

					return true;

				}

			}

			return false;

		}

		// TODO: Currently only doing linear interpolation. Should support full COLLADA spec.
		interpolate( nextKey, time ) {

			for ( var i = 0; i < this.targets.length; ++i ) {

				var target = this.targets[ i ],
					nextTarget = nextKey.getTarget( target.sid ),
					data;

				if ( target.transform.type !== 'matrix' && nextTarget ) {

					var scale = ( time - this.time ) / ( nextKey.time - this.time ),
						nextData = nextTarget.data,
						prevData = target.data;

					// check scale error

					if ( scale < 0 || scale > 1 ) {

						console.log( "Key.interpolate: Warning! Scale out of bounds:" + scale );
						scale = scale < 0 ? 0 : 1;

					}

					if ( prevData.length ) {

						data = [];

						for ( var j = 0; j < prevData.length; ++j ) {

							data[ j ] = prevData[ j ] + ( nextData[ j ] - prevData[ j ] ) * scale;

						}

					} else {

						data = prevData + ( nextData - prevData ) * scale;

					}

				} else {

					data = target.data;

				}

				target.transform.update( data, target.member );

			}

		}
	}

	export class _Camera{
		id:string        = "";
		name:string      = "";
		technique:string = "";
		yfov:number;
		xfov:number;
		znear:number;
		zfar:number;
		xmag:number;
		ymag:number;
		aspect_ratio:number;
		
		constructor(){
		}

		parse( element:Element ):_Camera {

			this.id = element.getAttribute( 'id' );
			this.name = element.getAttribute( 'name' );

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];
				if ( child.nodeType != 1 ) continue;	// nodeType == 1 means child is Element

				switch ( child.nodeName ) {

					case 'optics':

						this.parseOptics( <Element> child );
						break;

					default:
						break;

				}

			}

			return this;

		}

		parseOptics( element:Element ):_Camera {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				if ( element.childNodes[ i ].nodeName == 'technique_common' ) {

					var technique = element.childNodes[ i ];

					for ( var j = 0; j < technique.childNodes.length; j ++ ) {

						this.technique = technique.childNodes[ j ].nodeName;

						if ( this.technique == 'perspective' ) {

							var perspective = technique.childNodes[ j ];

							for ( var k = 0; k < perspective.childNodes.length; k ++ ) {

								var param = perspective.childNodes[ k ];

								switch ( param.nodeName ) {

									case 'yfov':
										this.yfov = parseFloat(param.textContent);
										break;
									case 'xfov':
										this.xfov = parseFloat(param.textContent);
										break;
									case 'znear':
										this.znear = parseFloat(param.textContent);
										break;
									case 'zfar':
										this.zfar = parseFloat(param.textContent);
										break;
									case 'aspect_ratio':
										this.aspect_ratio = parseFloat(param.textContent);
										break;

								}

							}

						} else if ( this.technique == 'orthographic' ) {

							var orthographic = technique.childNodes[ j ];

							for ( var k = 0; k < orthographic.childNodes.length; k ++ ) {

								var param = orthographic.childNodes[ k ];

								switch ( param.nodeName ) {

									case 'xmag':
										this.xmag = parseFloat(param.textContent);
										break;
									case 'ymag':
										this.ymag = parseFloat(param.textContent);
										break;
									case 'znear':
										this.znear = parseFloat(param.textContent);
										break;
									case 'zfar':
										this.zfar = parseFloat(param.textContent);
										break;
									case 'aspect_ratio':
										this.aspect_ratio = parseFloat(param.textContent);
										break;

								}

							}

						}

					}

				}

			}
			return this;
		}
	}

	export class InstanceCamera {
		url:string;
		constructor(){
			this.url = "";
		}
		parse( element:Element ):InstanceCamera {

			this.url = element.getAttribute('url').replace(/^#/, '');

			return this;

		}
	}

	function _source(loader:ColladaLoader, element ) {

		var id = element.getAttribute( 'id' );

		if ( loader.sources[ id ] != undefined ) {

			return loader.sources[ id ];

		}

		loader.sources[ id ] = ( new Source(id )).parse( element );
		return loader.sources[ id ];

	}

	function _nsResolver( nsPrefix:string ):string {

		if ( nsPrefix == "dae" ) {

			return "http://www.collada.org/2005/11/COLLADASchema";

		}

		return null;

	}

	function _bools( str:string ):bool[] {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( (raw[i] == 'true' || raw[i] == '1') ? true : false );

		}

		return data;

	}

	function _floats( str:string ):number[] {

		var raw = _strings(str);
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseFloat( raw[ i ] ) );

		}

		return data;

	}

	function _ints( str:string ):number[] {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseInt( raw[ i ], 10 ) );

		}

		return data;

	}

	function _strings( str:string ):string[] {

		return ( str.length > 0 ) ? _trimString( str ).split( /\s+/ ) : [];

	}

	function _trimString( str:string ):string {

		return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );

	}

	function _attr_as_float( element:Element, name:string, defaultValue:number ):number {

		if ( element.hasAttribute( name ) ) {

			return parseFloat( element.getAttribute( name ) );

		} else {

			return defaultValue;

		}

	}

	function _attr_as_int( element:Element, name:string, defaultValue:number ):number {

		if ( element.hasAttribute( name ) ) {

			return parseInt( element.getAttribute( name ), 10) ;

		} else {

			return defaultValue;

		}

	}

	function _attr_as_string( element:Element, name:string, defaultValue:string ):string {

		if ( element.hasAttribute( name ) ) {

			return element.getAttribute( name );

		} else {

			return defaultValue;

		}

	}

	function _format_float( f, num ) {

		if ( f === undefined ) {

			var s = '0.';

			while ( s.length < num + 2 ) {

				s += '0';

			}

			return s;

		}

		num = num || 2;

		var parts = f.toString().split( '.' );
		parts[ 1 ] = parts.length > 1 ? parts[ 1 ].substr( 0, num ) : "0";

		while( parts[ 1 ].length < num ) {

			parts[ 1 ] += '0';

		}

		return parts.join( '.' );

	}

	function evaluateXPath(loader:ColladaLoader, node, query:string ) {

		var instances = loader.COLLADA.evaluate( query, node, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

		var inst = instances.iterateNext();
		var result = [];

		while ( inst ) {

			result.push( inst );
			inst = instances.iterateNext();

		}

		return result;

	}

	function extractDoubleSided(loader:ColladaLoader, obj, element ) {

		obj.doubleSided = false;

		var node = loader.COLLADA.evaluate( './/dae:extra//dae:double_sided', element, _nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

		if ( node ) {

			node = node.iterateNext();

			if ( node && parseInt( node.textContent, 10 ) === 1 ) {

				obj.doubleSided = true;

			}

		}

	}

		// Up axis conversion

	function setUpConversion(loader:ColladaLoader):void {

		if ( !loader.options.convertUpAxis || loader.colladaUp === loader.options.upAxis ) {

			loader.upConversion = null;

		} else {

			switch ( loader.colladaUp ) {

				case 'X':

					loader.upConversion = loader.options.upAxis === 'Y' ? 'XtoY' : 'XtoZ';
					break;

				case 'Y':

					loader.upConversion = loader.options.upAxis === 'X' ? 'YtoX' : 'YtoZ';
					break;

				case 'Z':

					loader.upConversion = loader.options.upAxis === 'X' ? 'ZtoX' : 'ZtoY';
					break;

			}

		}

	}

	function fixCoords(loader:ColladaLoader, data:number[], sign:number ):void {

		if ( !loader.options.convertUpAxis || loader.colladaUp === loader.options.upAxis ) {

			return;

		}

		switch ( loader.upConversion ) {

			case 'XtoY':

				var tmp = data[ 0 ];
				data[ 0 ] = sign * data[ 1 ];
				data[ 1 ] = tmp;
				break;

			case 'XtoZ':

				var tmp = data[ 2 ];
				data[ 2 ] = data[ 1 ];
				data[ 1 ] = data[ 0 ];
				data[ 0 ] = tmp;
				break;

			case 'YtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = sign * tmp;
				break;

			case 'YtoZ':

				var tmp = data[ 1 ];
				data[ 1 ] = sign * data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoY':

				var tmp = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = sign * tmp;
				break;

		}

	}

	function getConvertedVec3(loader:ColladaLoader, data:number[], offset:number ):THREE.Vector3 {

		var arr = [ data[ offset ], data[ offset + 1 ], data[ offset + 2 ] ];
		fixCoords(this.loader, arr, -1 );
		return new THREE.Vector3( arr[ 0 ], arr[ 1 ], arr[ 2 ] );

	}

	function getConvertedMat4(loader:ColladaLoader, data:number[] ):THREE.Matrix4 {

		if ( loader.options.convertUpAxis ) {

			// First fix rotation and scale

			// Columns first
			var arr = [ data[ 0 ], data[ 4 ], data[ 8 ] ];
			fixCoords(loader, arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 4 ] = arr[ 1 ];
			data[ 8 ] = arr[ 2 ];
			arr = [ data[ 1 ], data[ 5 ], data[ 9 ] ];
			fixCoords(loader, arr, -1 );
			data[ 1 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 9 ] = arr[ 2 ];
			arr = [ data[ 2 ], data[ 6 ], data[ 10 ] ];
			fixCoords(loader, arr, -1 );
			data[ 2 ] = arr[ 0 ];
			data[ 6 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];
			// Rows second
			arr = [ data[ 0 ], data[ 1 ], data[ 2 ] ];
			fixCoords(loader, arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 1 ] = arr[ 1 ];
			data[ 2 ] = arr[ 2 ];
			arr = [ data[ 4 ], data[ 5 ], data[ 6 ] ];
			fixCoords(loader, arr, -1 );
			data[ 4 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 6 ] = arr[ 2 ];
			arr = [ data[ 8 ], data[ 9 ], data[ 10 ] ];
			fixCoords(loader, arr, -1 );
			data[ 8 ] = arr[ 0 ];
			data[ 9 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];

			// Now fix translation
			arr = [ data[ 3 ], data[ 7 ], data[ 11 ] ];
			fixCoords(loader, arr, -1 );
			data[ 3 ] = arr[ 0 ];
			data[ 7 ] = arr[ 1 ];
			data[ 11 ] = arr[ 2 ];

		}

		return new THREE.Matrix4(
			data[0], data[1], data[2], data[3],
			data[4], data[5], data[6], data[7],
			data[8], data[9], data[10], data[11],
			data[12], data[13], data[14], data[15]
			);

	}

	function getConvertedIndex(loader:ColladaLoader, index:number ):number{

		if ( index > -1 && index < 3 ) {

			var members = ['X', 'Y', 'Z'],
				indices = { X: 0, Y: 1, Z: 2 };

			getConvertedMember(loader, members[ index ] );
			index = indices[ index ];

		}

		return index;

	}

	function getConvertedMember(loader:ColladaLoader, member ):void {

		if ( loader.options.convertUpAxis ) {

			switch ( member ) {

				case 'X':

					switch ( loader.upConversion ) {

						case 'XtoY':
						case 'XtoZ':
						case 'YtoX':

							member = 'Y';
							break;

						case 'ZtoX':

							member = 'Z';
							break;

					}

					break;

				case 'Y':

					switch ( loader.upConversion ) {

						case 'XtoY':
						case 'YtoX':
						case 'ZtoX':

							member = 'X';
							break;

						case 'XtoZ':
						case 'YtoZ':
						case 'ZtoY':

							member = 'Z';
							break;

					}

					break;

				case 'Z':

					switch ( loader.upConversion ) {

						case 'XtoZ':

							member = 'X';
							break;

						case 'YtoZ':
						case 'ZtoX':
						case 'ZtoY':

							member = 'Y';
							break;

					}

					break;

			}

		}
	}
}