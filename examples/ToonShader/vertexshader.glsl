varying float dotProd;

uniform vec3 lightPosition;

void main(void)
{

	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    dotProd = dot(normalize(lightPosition), normalize(normal));
}