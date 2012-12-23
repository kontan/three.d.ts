varying float dotProd;

uniform vec3 lightPosition;

uniform vec3 color;
uniform float shadowOpacity;
uniform float threshold;

//[[shadowmap_pars_fragment]]

void main (void)
{
	
    //gl_FragColor = vec4(color * (dotProd > threshold ? 1.0 : 1.0 - shadowOpacity), 1.0);
    gl_FragColor = vec4(color, 1.0);

    //[[shadowmap_fragment]]
}

