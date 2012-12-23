#define USE_SHADOWMAP

uniform vec3 color;

//[[map_pars_fragment]]
//[[shadowmap_pars_fragment]]

void main (void)
{
    gl_FragColor = vec4(color, 1.0);
    //[[map_fragment]]
    //[[shadowmap_fragment]]
}

