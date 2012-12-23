varying float dotProd;

uniform vec3 lightPosition;

//[[shadowmap_pars_vertex]]

void main(void)
{ 
	mat4 t = projectionMatrix * modelViewMatrix;
    //gl_Position = t * vec4( position, 1.0 );
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);

    //[[shadowmap_vertex]]

    gl_Position = projectionMatrix * worldPosition;    

    mat4 rt = t;
    rt[3][0] = 0.0;
    rt[3][1] = 0.0;
    rt[3][2] = 0.0;
    vec4 n = rt * vec4(normalize(normal), 1.0);
    dotProd = dot(normalize(lightPosition), vec3(n));


}