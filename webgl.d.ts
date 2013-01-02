/**
 * webgl.d.ts (https://github.com/kontan/three.d.ts)
 *
 * @author Kon - http://phyzkit.net/
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// WebGL Interface (incomplete)
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// When you use three.d.ts with other ambient source file for WebGL,
// remove below definition for WebGLRenderingContext.
interface WebGLRenderingContext {
    getParameter(pname:GLenum):any;
    ACTIVE_TEXTURE:GLenum; // unsigned long
    ALIASED_LINE_WIDTH_RANGE:GLenum; //     Float32Array (with 2 elements)
    ALIASED_POINT_SIZE_RANGE:GLenum; //     Float32Array (with 2 elements)
    ALPHA_BITS:GLenum; //   long
    ARRAY_BUFFER_BINDING:GLenum; //     WebGLBuffer
    BLEND:GLenum; //    boolean
    BLEND_COLOR:GLenum; //  Float32Array (with 4 values)
    BLEND_DST_ALPHA:GLenum; //  unsigned long
    BLEND_DST_RGB:GLenum; //    unsigned long
    BLEND_EQUATION_ALPHA:GLenum; //     unsigned long
    BLEND_EQUATION_RGB:GLenum; //   unsigned long
    BLEND_SRC_ALPHA:GLenum; //  unsigned long
    BLEND_SRC_RGB:GLenum; //    unsigned long
    BLUE_BITS:GLenum; //    long
    COLOR_CLEAR_VALUE:GLenum; //    Float32Array (with 4 values)
    COLOR_WRITEMASK:GLenum; //  boolean[] (with 4 values)
    COMPRESSED_TEXTURE_FORMATS:GLenum; //   null
    CULL_FACE:GLenum; //    boolean
    CULL_FACE_MODE:GLenum; //   unsigned long
    CURRENT_PROGRAM:GLenum; //  WebGLProgram
    DEPTH_BITS:GLenum; //   long
    DEPTH_CLEAR_VALUE:GLenum; //    float
    DEPTH_FUNC:GLenum; //   unsigned long
    DEPTH_RANGE:GLenum; //  Float32Array (with 2 elements)
    DEPTH_TEST:GLenum; //   boolean
    DEPTH_WRITEMASK:GLenum; //  boolean
    DITHER:GLenum; //   boolean
    ELEMENT_ARRAY_BUFFER_BINDING:GLenum; //     WebGLBuffer
    FRAMEBUFFER_BINDING:GLenum; //  WebGLFramebuffer
    FRONT_FACE:GLenum; //   unsigned long
    GENERATE_MIPMAP_HINT:GLenum; //     unsigned long
    GREEN_BITS:GLenum; //   long
    LINE_WIDTH:GLenum; //   float
    MAX_COMBINED_TEXTURE_IMAGE_UNITS:GLenum; //     long
    MAX_CUBE_MAP_TEXTURE_SIZE:GLenum; //    long
    MAX_FRAGMENT_UNIFORM_VECTORS:GLenum; //     long
    MAX_RENDERBUFFER_SIZE:GLenum; //    long
    MAX_TEXTURE_IMAGE_UNITS:GLenum; //  long
    MAX_TEXTURE_SIZE:GLenum; //     long
    MAX_VARYING_VECTORS:GLenum; //  long
    MAX_VERTEX_ATTRIBS:GLenum; //   long
    MAX_VERTEX_TEXTURE_IMAGE_UNITS:GLenum; //   long
    MAX_VERTEX_UNIFORM_VECTORS:GLenum; //   long
    MAX_VIEWPORT_DIMS:GLenum; //    Int32Array (with 2 elements)
    NUM_COMPRESSED_TEXTURE_FORMATS:GLenum; //   long
    PACK_ALIGNMENT:GLenum; //   long
    POLYGON_OFFSET_FACTOR:GLenum; //    float
    POLYGON_OFFSET_FILL:GLenum; //  boolean
    POLYGON_OFFSET_UNITS:GLenum; //     float
    RED_BITS:GLenum; //     long
    RENDERBUFFER_BINDING:GLenum; //     WebGLRenderbuffer
    RENDERER:GLenum; //     DOMString
    SAMPLE_BUFFERS:GLenum; //   long
    SAMPLE_COVERAGE_INVERT:GLenum; //   boolean
    SAMPLE_COVERAGE_VALUE:GLenum; //    float
    SAMPLES:GLenum; //  long
    SCISSOR_BOX:GLenum; //  Int32Array (with 4 elements)
    SCISSOR_TEST:GLenum; //     boolean
    SHADING_LANGUAGE_VERSION:GLenum; //     DOMString
    STENCIL_BACK_FAIL:GLenum; //    unsigned long
    STENCIL_BACK_FUNC:GLenum; //    unsigned long
    STENCIL_BACK_PASS_DEPTH_FAIL:GLenum; //     unsigned long
    STENCIL_BACK_PASS_DEPTH_PASS:GLenum; //     unsigned long
    STENCIL_BACK_REF:GLenum; //     long
    STENCIL_BACK_VALUE_MASK:GLenum; //  unsigned long
    STENCIL_BACK_WRITEMASK:GLenum; //   unsigned long
    STENCIL_BITS:GLenum; //     long
    STENCIL_CLEAR_VALUE:GLenum; //  long
    STENCIL_FAIL:GLenum; //     unsigned long
    STENCIL_FUNC:GLenum; //     unsigned long
    STENCIL_PASS_DEPTH_FAIL:GLenum; //  unsigned long
    STENCIL_PASS_DEPTH_PASS:GLenum; //  unsigned long
    STENCIL_REF:GLenum; //  long
    STENCIL_TEST:GLenum; //     boolean
    STENCIL_VALUE_MASK:GLenum; //   unsigned long
    STENCIL_WRITEMASK:GLenum; //    unsigned long
    SUBPIXEL_BITS:GLenum; //    long
    TEXTURE_BINDING_2D:GLenum; //   WebGLTexture
    TEXTURE_BINDING_CUBE_MAP:GLenum; //     WebGLTexture
    UNPACK_ALIGNMENT:GLenum; //     int
    UNPACK_COLORSPACE_CONVERSION_WEBGL:GLenum; //   unsigned long
    UNPACK_FLIP_Y_WEBGL:GLenum; //  boolean
    UNPACK_PREMULTIPLY_ALPHA_WEBGL:GLenum; //   boolean
    VENDOR:GLenum; //   DOMString
    VERSION:GLenum; //  DOMString
    VIEWPORT:GLenum; //     Int32Array (with 4 elements)
}
enum GLenum{}