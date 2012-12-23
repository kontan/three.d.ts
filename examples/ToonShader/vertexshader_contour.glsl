uniform float lineWidth;

void main (void)
{
	vec4 mvPosition = (projectionMatrix * modelViewMatrix * vec4( position, 1.0 )); 
	float z = mvPosition.z;

	mvPosition = vec4(position, 1.0);
	
	mvPosition += 0.002 * z * vec4(normalize(normal), 0.0);
	
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}