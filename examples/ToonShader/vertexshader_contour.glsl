uniform float lineWidth;

void main (void)
{
	[[default_vertex]] 

	vec4 p = vec4(position, 1.0);
	p += lineWidth * gl_Position.z * vec4(normalize(normal), 0.0);
	gl_Position = projectionMatrix * modelViewMatrix * p;
}