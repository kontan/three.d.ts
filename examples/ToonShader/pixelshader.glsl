varying float dotProd;

uniform vec3 lightPosition;

uniform vec3 color;
uniform float shadowDarkness;
uniform float threshold;

void main (void)
{
	
    gl_FragColor = vec4(color * (dotProd > threshold ? 1.0 : 1.0 - shadowDarkness), 1.0);
}

