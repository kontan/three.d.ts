/**
 * @author Kon - http://phyzkit.net/
 */
module Detector{
	export var canvas:bool;
	export function webgl():bool;
	export var workers:bool;
	export var fileapi:bool;
	export function getWebGLErrorMessage():HTMLDivElement;
	export function addGetWebGLMessage( parameters?:{parent?:HTMLElement; id?:string;} ):void;
}
