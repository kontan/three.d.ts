uniform float lineWidth;

void main (void)
{
	vec4 mvPosition;
	mvPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 
	float z = mvPosition.z;

	mvPosition = vec4(position, 1.0);
	mvPosition -= lineWidth * z * vec4(normal, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}