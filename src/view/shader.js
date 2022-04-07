import * as THREE from "three";
export default {
  data() {
    return {
      Qg:
        "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n",
      Gg:
        "\n  float rands(float p){\n    return fract(sin(p) * 10000.0);\n  }\n",
      ky:
        "\n  vec3 rands(vec3 c) {\n    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));\n    vec3 r;\n    r.z = fract(512.0*j);\n    j *= .125;\n    r.x = fract(512.0*j);\n    j *= .125;\n    r.y = fract(512.0*j);\n    return r-0.5;\n  }\n",
      jy:
        "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n",
      Iy:
        "\n  float rands(vec2 n) { \n    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n  }\n",
      Oy:
        "\n  float getGray(vec3 color) {\n    return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114);\n  }\n",
    };
  },
  methods: {
    //呼吸渐变墙
    getBreathWallMaterial(opts = {}) {
      let uniforms = {
        // time+=0.025
        time: {
          type: "f",
          value: 1,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.7,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      // let Qg =
      //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
      let fragmentShaderSource = `
        precision lowp float;
        precision lowp int;
        varying vec2 vUv;
        uniform vec3 color;
        uniform float time;
        uniform float opacity;
        void main() {
          vec2 uv = vUv;
          float scaleY = 0.7 + 0.3 * sin(time);
          vec4 gradient = mix(vec4(color, opacity),
            vec4(0., 0., 0., 0.0), min(1.0, uv.y / scaleY));
            //修改 1.0-- 0
          gl_FragColor = mix( mix(vec4(vec3(0.), 0.), gradient, gradient.a), vec4(vec3(0.), 0.), smoothstep(scaleY-0.00001, scaleY, uv.y));
        }`;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });

      // animate();
      function animate() {
        uniforms.time.value += 0.25;
        requestAnimationFrame(animate);
      }
      return meshMaterial;
    },
    // 环形墙
    getRippleWall(opts = {}) {
      let uniforms = {
        // time+=0.025
        time: {
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 1,
        },
        num: {
          type: "f",
          value: opts.num || 5,
        },
        hiz: {
          type: "f",
          value: 0.3,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      // let Qg =
      //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
      let fragmentShaderSource = `
        precision lowp float;
        precision lowp int;
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        uniform float num;
        uniform float hiz;
        varying vec2 vUv;
        void main() {
          vec4 fragColor = vec4(0.);
            float sin = sin((vUv.y - time * hiz) * 10. * num);
            float high = 0.92;
            float medium = 0.4;
            if (sin > high) {
              fragColor = vec4(mix(vec3(.8, 1., 1.), color, (1. - sin) / (1. - high)), 1.);
            } else if(sin > medium) {
              fragColor = vec4(color, mix(1., 0., 1.-(sin - medium) / (high - medium)));
            } else {
              fragColor = vec4(color, 0.);
            }
            vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);
            fragColor = mix(fragColor, vec4(fade, 1.), 0.85);
            gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));
        }`;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      // animate();
      // function animate() {
      //   uniforms.time.value += 0.025;
      //   requestAnimationFrame(animate);
      // }
      return meshMaterial;
    },
    //漂浮墙？
    getFloaterWallMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.8,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      let fragmentShaderSource = `
        precision lowp float;
        precision lowp int;
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        varying vec2 vUv;
        float snow(vec2 uv, float scale) {
          float w = smoothstep(1.,0.,-uv.y*(scale/10.));
          if(w<.1)return 0.;
          // uv+=time/scale;
          uv.y-=time*2./scale;
          // uv.x+=sin(uv.y+time*.1)/scale;
          uv*=scale;
          vec2 s=floor(uv),f=fract(uv),p;
          float k=3.,d;
          p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
          d=length(p);
          k=min(d,k);
          k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
          return k*w;
        }
        void main() {
          float c = snow(vUv, 30.) * .3;
          c += snow(vUv, 20.) * .5;
          c += snow(vUv, 15.) * .8;
          c += snow(vUv, 10.);
          c += snow(vUv, 8.);
          c += snow(vUv, 6.);
          c += snow(vUv, 5.);
          float modulo = mod(time, 10.0);
          if(modulo > 5.0) {
            modulo -= ((modulo - 5.0) * 2.0);
          }
          modulo /= 5.0;
          modulo += 0.35;
          if(modulo > 1.0) {
            modulo = 1.0;
          }
          vec4 fragColor = vec4(c * modulo, c * modulo, c * modulo, c);
          vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);
          fragColor += vec4(fade, 1.);
          gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));
        }`;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return meshMaterial;
    },
    //运动的图片贴图围墙 可以作为建筑贴图效果
    getTrailWallMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.8,
        },
        map: {
          type: "t",
          value: opts.texture,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      let fragmentShaderSource = `
      precision lowp float;
      precision lowp int;
      uniform float time;
      uniform sampler2D map;
      uniform float opacity;
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        if (uv.x > 1.) {
          discard;
        }
        gl_FragColor = texture2D(map, vec2(fract(uv.x - time), uv.y));
        // gl_FragColor.rgb *= color;
        gl_FragColor.a *= opacity;
      }
      `;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        // blending: THREE.AdditiveBlending,
        // transparent: !0,
        // depthWrite: !1,
        // depthTest: !0,
        // side: THREE.DoubleSide,
        // fog: !0,
      });
      return meshMaterial;
    },
    //火墙
    getFireWallMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.8,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      let fragmentShaderSource =
        "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform vec3 color;\n  uniform float time;\n  uniform float opacity;\n\n  // Simplex 3D Noise \n  // by Ian McEwan, Ashima Arts\n  //\n  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\n  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n\n  float snoise(vec3 v){ \n    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n    vec3 i  = floor(v + dot(v, C.yyy) );\n    vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n  // Other corners\n    vec3 g = step(x0.yzx, x0.xyz);\n    vec3 l = 1.0 - g;\n    vec3 i1 = min( g.xyz, l.zxy );\n    vec3 i2 = max( g.xyz, l.zxy );\n\n    //  x0 = x0 - 0. + 0.0 * C \n    vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n    vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n    vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n  // Permutations\n    i = mod(i, 289.0 ); \n    vec4 p = permute( permute( permute( \n              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients\n  // ( N*N points uniformly over a square, mapped onto an octahedron.)\n    float n_ = 1.0/7.0; // N=7\n    vec3  ns = n_ * D.wyz - D.xzx;\n\n    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)\n\n    vec4 x_ = floor(j * ns.z);\n    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n    vec4 x = x_ *ns.x + ns.yyyy;\n    vec4 y = y_ *ns.x + ns.yyyy;\n    vec4 h = 1.0 - abs(x) - abs(y);\n\n    vec4 b0 = vec4( x.xy, y.xy );\n    vec4 b1 = vec4( x.zw, y.zw );\n\n    vec4 s0 = floor(b0)*2.0 + 1.0;\n    vec4 s1 = floor(b1)*2.0 + 1.0;\n    vec4 sh = -step(h, vec4(0.0));\n\n    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n    vec3 p0 = vec3(a0.xy,h.x);\n    vec3 p1 = vec3(a0.zw,h.y);\n    vec3 p2 = vec3(a1.xy,h.z);\n    vec3 p3 = vec3(a1.zw,h.w);\n\n  //Normalise gradients\n    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n\n  // Mix final noise value\n    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n    m = m * m;\n    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                  dot(p2,x2), dot(p3,x3) ) );\n  }\n  void main() {\n    vec2 uv = vUv;\n    float scale = .1;\n    float rate = 5.0;\n    \n    float t = time/rate;\n    \n    float result = 0.0;\n    \n    //octaves\n    for (float i = 0.0; i < 5.0; i++){\n      result += snoise(vec3((uv.x*2.0)/scale, (uv.y - t)/scale, t*5.0))/pow(2.0, i);\n      scale /= 2.0;\n    }\n    result = (result + 2.0)/4.0;\n    \n    //powers for steeper curves\n    float p1 = pow(uv.y, 1.7);\n    float p2 = 8.0*(1.0 - p1);\n    result = pow(result, 8.0 - p2);\n    \n    //power for coloring\n    float g = pow(result, 6.0);\n    gl_FragColor = vec4(result * color.r, g * color.g, 0., opacity);\n  }\n";
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return meshMaterial;
    },
    //火花 火星
    getSparkWallMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#0099FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.8,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      let fragmentShaderSource =
        "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform vec3 color;\n  uniform float time;\n  uniform float opacity;\n\n  #define PI 3.1415927\n  #define TWO_PI 6.283185\n  \n  #define ANIMATION_SPEED 1.5\n  #define MOVEMENT_SPEED 1.0\n  #define MOVEMENT_DIRECTION vec2(0., -1.0)\n  \n  #define PARTICLE_SIZE 0.009\n  \n  #define PARTICLE_SCALE (vec2(0.8, 0.8))\n  #define PARTICLE_SCALE_VAR (vec2(0.25, 0.2))\n  \n  #define PARTICLE_BLOOM_SCALE (vec2(0.5, 0.8))\n  #define PARTICLE_BLOOM_SCALE_VAR (vec2(0.3, 0.1))\n  \n  #define SPARK_COLOR vec3(1.0, 0.4, 0.05) * 1.5\n  #define BLOOM_COLOR vec3(1.0, 0.4, 0.05) * 0.8\n  #define SMOKE_COLOR vec3(1.0, 0.43, 0.1) * 0.8\n  \n  #define SIZE_MOD 1.05\n  #define ALPHA_MOD 0.9\n  #define LAYERS_COUNT 15\n\n  float hash1_2(in vec2 x) {\n    return fract(sin(dot(x, vec2(52.127, 61.2871))) * 521.582);   \n  }\n\n  vec2 hash2_2(in vec2 x) {\n    return fract(sin(x * mat2(20.52, 24.1994, 70.291, 80.171)) * 492.194);\n  }\n\n  //Simple interpolated noise\n  vec2 noise2_2(vec2 uv) {\n    //vec2 f = fract(uv);\n    vec2 f = smoothstep(0.0, 1.0, fract(uv));\n      \n    vec2 uv00 = floor(uv);\n    vec2 uv01 = uv00 + vec2(0,1);\n    vec2 uv10 = uv00 + vec2(1,0);\n    vec2 uv11 = uv00 + 1.0;\n    vec2 v00 = hash2_2(uv00);\n    vec2 v01 = hash2_2(uv01);\n    vec2 v10 = hash2_2(uv10);\n    vec2 v11 = hash2_2(uv11);\n    \n    vec2 v0 = mix(v00, v01, f.y);\n    vec2 v1 = mix(v10, v11, f.y);\n    vec2 v = mix(v0, v1, f.x);\n    \n    return v;\n  }\n\n  //Simple interpolated noise\n  float noise1_2(in vec2 uv) {\n    vec2 f = fract(uv);\n    //vec2 f = smoothstep(0.0, 1.0, fract(uv));\n      \n    vec2 uv00 = floor(uv);\n    vec2 uv01 = uv00 + vec2(0,1);\n    vec2 uv10 = uv00 + vec2(1,0);\n    vec2 uv11 = uv00 + 1.0;\n    \n    float v00 = hash1_2(uv00);\n    float v01 = hash1_2(uv01);\n    float v10 = hash1_2(uv10);\n    float v11 = hash1_2(uv11);\n    \n    float v0 = mix(v00, v01, f.y);\n    float v1 = mix(v10, v11, f.y);\n    float v = mix(v0, v1, f.x);\n    \n    return v;\n  }\n\n  float layeredNoise1_2(in vec2 uv, in float sizeMod, in float alphaMod, in int layers, in float animation) {\n    float noise = 0.0;\n    float alpha = 1.0;\n    float size = 1.0;\n    vec2 offset;\n    for (int i = 0; i < 6; i++) {\n      offset += hash2_2(vec2(alpha, size)) * 10.0;\n          \n      //Adding noise with movement\n      noise += noise1_2(uv * size + time * animation * 8.0 * MOVEMENT_DIRECTION * MOVEMENT_SPEED + offset) * alpha;\n      alpha *= alphaMod;\n      size *= sizeMod;\n    }\n      \n    noise *= (1.0 - alphaMod)/(1.0 - pow(alphaMod, float(layers)));\n    return noise;\n  }\n  \n  //Rotates point around 0,0\n  vec2 rotate(in vec2 point, in float deg) {\n    float s = sin(deg);\n    float c = cos(deg);\n    return mat2(s, c, -c, s) * point;\n  }\n  \n  //Cell center from point on the grid\n  vec2 voronoiPointFromRoot(in vec2 root, in float deg) {\n    vec2 point = hash2_2(root) - 0.5;\n    float s = sin(deg);\n    float c = cos(deg);\n    point = mat2(s, c, -c, s) * point * 0.66;\n    point += root + 0.5;\n    return point;\n  }\n  \n  //Voronoi cell point rotation degrees\n  float degFromRootUV(in vec2 uv) {\n    return time * ANIMATION_SPEED * (hash1_2(uv) - 0.5) * 2.0;   \n  }\n  \n  vec2 randomAround2_2(in vec2 point, in vec2 range, in vec2 uv) {\n    return point + (hash2_2(uv) - 0.5) * range;\n  }\n  \n  \n  vec3 fireParticles(in vec2 uv, in vec2 originalUV) {\n    vec3 particles = vec3(0.0);\n    vec2 rootUV = floor(uv);\n    float deg = degFromRootUV(rootUV);\n    vec2 pointUV = voronoiPointFromRoot(rootUV, deg);\n    float dist = 2.0;\n    float distBloom = 0.0;\n    \n    //UV manipulation for the faster particle movement\n    vec2 tempUV = uv + (noise2_2(uv * 2.0) - 0.5) * 0.1;\n    tempUV += -(noise2_2(uv * 3.0 + time) - 0.5) * 0.07;\n\n    //Sparks sdf\n    dist = length(rotate(tempUV - pointUV, 0.7) * randomAround2_2(PARTICLE_SCALE, PARTICLE_SCALE_VAR, rootUV));\n    \n    //Bloom sdf\n    distBloom = length(rotate(tempUV - pointUV, 0.7) * randomAround2_2(PARTICLE_BLOOM_SCALE, PARTICLE_BLOOM_SCALE_VAR, rootUV));\n\n    //Add sparks\n    particles += (1.0 - smoothstep(PARTICLE_SIZE * 0.6, PARTICLE_SIZE * 3.0, dist)) * SPARK_COLOR;\n    \n    //Add bloom\n    particles += pow((1.0 - smoothstep(0.0, PARTICLE_SIZE * 6.0, distBloom)) * 1.0, 3.0) * BLOOM_COLOR;\n\n    //Upper disappear curve randomization\n    float border = (hash1_2(rootUV) - 0.5) * 2.0;\n    float disappear = 1.0 - smoothstep(border, border + 0.5, originalUV.y);\n  \n    //Lower appear curve randomization\n    border = (hash1_2(rootUV + 0.214) - 1.8) * 0.7;\n    float appear = smoothstep(border, border + 0.4, originalUV.y);\n    \n    return particles * disappear * appear;\n  }\n  \n  \n  //Layering particles to imitate 3D view\n  vec3 layeredParticles(in vec2 uv, in float sizeMod, in float alphaMod, in float smoke) { \n    vec3 particles = vec3(0);\n    float size = 1.0;\n    float alpha = 1.0;\n    vec2 offset = vec2(0.0);\n    vec2 noiseOffset;\n    vec2 bokehUV;\n    \n    for (int i = 0; i < LAYERS_COUNT; i++) {\n      //Particle noise movement\n      noiseOffset = (noise2_2(uv * size * 2.0 + 0.5) - 0.5) * 0.15;\n      \n      //UV with applied movement\n      bokehUV = (uv * size + time * MOVEMENT_DIRECTION * MOVEMENT_SPEED) + offset + noiseOffset; \n      \n      //Adding particles if there is more smoke, remove smaller particles\n      particles += fireParticles(bokehUV, uv) * alpha * (1.0 - smoothstep(0.0, 1.0, smoke) * (float(i) / float(LAYERS_COUNT)));\n        \n      //Moving uv origin to avoid generating the same particles\n      offset += hash2_2(vec2(alpha, alpha)) * 10.0;\n      \n      alpha *= alphaMod;\n      size *= sizeMod;\n    }\n    return particles;\n  }\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float uvx = uv.x * 5.;\n    float i = uvx - fract(uvx);\n\n    if (mod(i, 2.) > 0.) {\n      uv.x = 1. - fract(uvx);\n    } else {\n      uv.x = fract(uv.x * 5.);\n    }\n\n    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv + vec2(0.0, 0.3)));\n    \n    uv *= 1.8;\n    \n    float smokeIntensity = layeredNoise1_2(uv * 10.0 + time * 4.0 * MOVEMENT_DIRECTION * MOVEMENT_SPEED, 1.7, 0.7, 6, 0.2);\n    smokeIntensity *= pow(1.0 - smoothstep(-1.0, 1.6, uv.y), 2.0); \n    vec3 smoke = smokeIntensity * SMOKE_COLOR * 0.8 * vignette;\n    \n    //Cutting holes in smoke\n    smoke *= pow(layeredNoise1_2(uv * 4.0 + time * 0.5 * MOVEMENT_DIRECTION * MOVEMENT_SPEED, 1.8, 0.5, 3, 0.2), 2.0) * 1.5;\n    \n    vec3 particles = layeredParticles(uv, SIZE_MOD, ALPHA_MOD, smokeIntensity);\n    \n    vec3 col = particles + smoke + SMOKE_COLOR * 0.02;\n    col *= vignette;\n    \n    col = smoothstep(-0.08, 1.0, col);\n\n    gl_FragColor = vec4(col * color, (1. - uv.y) * opacity);\n  }\n";
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return meshMaterial;
    },
    //贴图围墙
    getWallTextureMaterial(opts = {}) {
      let uniforms = {
        map: {
          type: "t",
          value: new THREE.TextureLoader().load(opts.image),
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#9999FF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.7,
        },
      };
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = `
        precision lowp float;
        precision lowp int;
        uniform vec3 color;
        uniform sampler2D map;
        uniform float opacity;
        varying vec2 vUv;
        void main()
        {
          vec4 tex = texture2D(map, vUv);
          gl_FragColor = vec4(tex.rgb * color, tex.a * opacity);
        }`;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        // fog: !0
      });
      return meshMaterial;
    },
    // 扩散防护罩
    getRippleShieldMaterial(opts = {}) {
      let uniforms = {
        time: {
          // time+=0.006
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#99CCFF"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.7,
        },
        num: {
          type: "f",
          value: opts.num || 1,
        },
      };
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      // let Qg =
      //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
      let fragmentShaderSource = `
        precision lowp float;
        precision lowp int;
        uniform vec3 color;
        uniform float opacity;
        uniform float hiz;
        uniform float num;
        uniform float time;
        varying vec2 vUv;
        
        #define pi 3.1415926535
        #define PI2RAD 0.01745329252
        #define TWO_PI (2. * PI)

        void main() {
          vec2 uv = vUv;
          if (uv.y < 0.5) {//只显示一半的uv--半球
            discard;
          }
          uv += num;
          uv.y += time;
          float glowPower = 0.018;
          float glow = glowPower / mod(abs(uv.y - 0.5), 1.) - (glowPower / 0.5);
          gl_FragColor = vec4(max(vec3(glow - 0.4 + color), color) * color, clamp(0.0, 1.0, glow * 1.) * opacity);
          gl_FragColor = mix(gl_FragColor, vec4(color, mix(0.15, 0.4, 1. - (vUv.y - 0.5) / 0.5)), 0.35);
        }`;
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      // animate();
      // function animate() {
      //   uniforms.time.value += opts.dura || 0.025;
      //   requestAnimationFrame(animate);
      // }
      return meshMaterial;
    },
    // 流光防护罩
    getComposedShieldMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          glslType: "float",
          value: 0,
        },
        baseColor: {
          value: new THREE.Color(opts.baseColor || "#000"),
          type: "c",
          glslType: "vec3",
        },
        scale: {
          value: opts.scale || "5.31611692",
          type: "f",
          glslType: "float",
        },
        Star_Swamp_3D_version_1481150076458_107_brightness: {
          value: "2.5",
          type: "f",
          glslType: "float",
        },
        cameraPosition: {
          type: "v3",
          glslType: "vec3",
        },
        backgroundColor: {
          value: new THREE.Color(opts.backgroundColor || "#000"),
          type: "c",
          glslType: "vec3",
        },
        Tiling_Caustic1481150103620_119_brightness: {
          value: "1.5",
          type: "f",
          glslType: "float",
        },
        Tiling_Caustic1481150103620_119_resolution: {
          value: {
            x: "1",
            y: 1,
          },
          type: "v2",
          glslType: "vec2",
        },
        //流光颜色
        Tiling_Caustic1481150103620_119_color: {
          value: new THREE.Color(opts.flowLightColor || "#fff"),
          type: "c",
          glslType: "vec3",
        },
        Tiling_Caustic1481150103620_119_speed: {
          value: "0.5",
          type: "f",
          glslType: "float",
        },
        image: {
          value: null,
          type: "t",
          glslType: "sampler2D",
        },
        Caustic_Image_Based1487582497347_66_speed: {
          value: "0.2",
          type: "f",
          glslType: "float",
        },
        Caustic_Image_Based1487582497347_66_resolution: {
          value: "1",
          type: "f",
          glslType: "float",
        },
        Caustic_Image_Based1487582497347_66_color: {
          value: {
            r: 1,
            g: 1,
            b: 1,
          },
          type: "c",
          glslType: "vec3",
        },
        Caustic_Image_Based1487582497347_66_brightness: {
          value: "1",
          type: "f",
          glslType: "float",
        },
      };
      let vertexShaderSource = `
        precision highp float;
        precision highp int;
        uniform float time;
        varying vec2 uv2;
        varying vec2 Star_Swamp_3D_version_1481150076458_107_vUv;
        varying vec3 Star_Swamp_3D_version_1481150076458_107_vPosition;
        varying vec3 Star_Swamp_3D_version_1481150076458_107_vNormal;
        varying vec3 Tiling_Caustic1481150103620_119_vPosition;
        varying vec3 Tiling_Caustic1481150103620_119_vNormal;
        varying vec2 Tiling_Caustic1481150103620_119_vUv;
        varying vec2 vUv2;
        varying vec2 Caustic_Image_Based1487582497347_66_vUv;
        varying vec3 Caustic_Image_Based1487582497347_66_vPosition;
        varying vec3 Caustic_Image_Based1487582497347_66_vNormal;
        vec4 Star_Swamp_3D_version_1481150076458_107_main()
        {
          vec4 Star_Swamp_3D_version_1481150076458_107_gl_Position = vec4(0.0);
          Star_Swamp_3D_version_1481150076458_107_vUv = uv;
          Star_Swamp_3D_version_1481150076458_107_vPosition = position;
          Star_Swamp_3D_version_1481150076458_107_vNormal = normal;
          Star_Swamp_3D_version_1481150076458_107_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          return Star_Swamp_3D_version_1481150076458_107_gl_Position *= 0.2;
        }
        vec4 Tiling_Caustic1481150103620_119_main()
        {
          vec4 Tiling_Caustic1481150103620_119_gl_Position = vec4(0.0);
          Tiling_Caustic1481150103620_119_vNormal = normal;
          Tiling_Caustic1481150103620_119_vUv = uv;
          vUv2 = uv2;
          Tiling_Caustic1481150103620_119_vPosition = position;
          Tiling_Caustic1481150103620_119_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          return Tiling_Caustic1481150103620_119_gl_Position *= 1.0;
        }
        vec4 Caustic_Image_Based1487582497347_66_main()
        {
          vec4 Caustic_Image_Based1487582497347_66_gl_Position = vec4(0.0);
          Caustic_Image_Based1487582497347_66_vUv = uv;
          Caustic_Image_Based1487582497347_66_vPosition = position;
          Caustic_Image_Based1487582497347_66_vNormal = normal;
          Caustic_Image_Based1487582497347_66_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          return Caustic_Image_Based1487582497347_66_gl_Position *= 1.0;
        }
        void main()
        {
          gl_Position = Star_Swamp_3D_version_1481150076458_107_main() + Tiling_Caustic1481150103620_119_main() + Caustic_Image_Based1487582497347_66_main();
        }`;
      // let Qg =
      //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
      let fragmentShaderSource =
        "#define TAU 6.28318530718\n#define MAX_ITER 5\n#define PI 3.141592653589793238462643383279\n\nprecision highp float;\nprecision highp int;\nuniform vec3 baseColor;\nuniform float Star_Swamp_3D_version_1481150076458_107_brightness;\nuniform float scale;\nuniform float time;\nuniform vec2 Tiling_Caustic1481150103620_119_resolution;\nuniform vec3 backgroundColor;\nuniform vec3 Tiling_Caustic1481150103620_119_color;\nuniform float Tiling_Caustic1481150103620_119_speed;\nuniform float Tiling_Caustic1481150103620_119_brightness;\nuniform float Caustic_Image_Based1487582497347_66_speed;\nuniform float Caustic_Image_Based1487582497347_66_resolution;\nuniform vec3 Caustic_Image_Based1487582497347_66_color;\nuniform sampler2D image;\nuniform float Caustic_Image_Based1487582497347_66_brightness;\nvarying vec2 Star_Swamp_3D_version_1481150076458_107_vUv;\nvarying vec3 Star_Swamp_3D_version_1481150076458_107_vPosition;\nvarying vec3 Star_Swamp_3D_version_1481150076458_107_vNormal;\nfloat field(in vec3 p) \n                        {\n                            float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));\n                            float accum = 0.;\n                            float prev = 0.;\n                            float tw = 0.;\n                            for (int i = 0;\n i < 32; ++i) \n                            {\n                                float mag = dot(p, p);\n                                p = abs(p) / mag + vec3(-.51, -.4, -1.3);\n                                float w = exp(-float(i) / 7.);\n                                accum += w * exp(-strength * pow(abs(mag - prev), 2.3));\n                                tw += w;\n                                prev = mag;\n                            }\n                            return max(0., 5. * accum / tw - .2);\n                        }\nvec3 nrand3(vec2 co) \n                        {\n                            vec3 a = fract(cos(co.x * 8.3e-3 + co.y) * vec3(1.3e5, 4.7e5, 2.9e5));\n                            vec3 b = fract(sin(co.x * 0.3e-3 + co.y) * vec3(8.1e5, 1.0e5, 0.1e5));\n                            vec3 c = mix(a, b, 0.5);\n                            return c;\n                        }\nvarying vec2 Tiling_Caustic1481150103620_119_vUv;\nvarying vec2 Caustic_Image_Based1487582497347_66_vUv;\nvarying vec3 Caustic_Image_Based1487582497347_66_vPosition;\nvarying vec3 Caustic_Image_Based1487582497347_66_vNormal;\nvec3 lig = normalize(vec3(0.9, 0.35, -0.2));\nvec4 Star_Swamp_3D_version_1481150076458_107_main() \n                        {\n                            vec4 Star_Swamp_3D_version_1481150076458_107_gl_FragColor = vec4(0.0);\n                            vec3 pos = Star_Swamp_3D_version_1481150076458_107_vPosition / scale;\n                            vec3 p = vec3(pos / 4.) + vec3(2., -1.3, -1.);\n                            p += 0.18 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));\n                            vec3 p2 = vec3(pos / (4. + sin(time * 0.11) * 0.2 + 0.2 + sin(time * 0.15) * 0.3 + 0.4)) + vec3(2., -1.3, -1.);\n                            p2 += 0.2 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));\n                            vec3 p3 = vec3(pos / (4. + sin(time * 0.14) * 0.23 + 0.23 + sin(time * 0.19) * 0.31 + 0.31)) + vec3(2., -1.3, -1.);\n                            p3 += 0.25 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));\n                            float t = field(p);\n                            float t2 = field(p2);\n                            float t3 = field(p3);\n                            float v = (1. - exp((abs(pos.x) - 1.) * 6.)) * (1. - exp((abs(pos.y) - 1.) * 6.)) * (1. - exp((abs(pos.z) - 1.) * 6.));\n                            vec3 c1 = mix(.9, 1., v) * vec3(1.8 * t * t * t, 1.4 * t * t, t);\n                            vec3 c2 = mix(.8, 1., v) * vec3(1.9 * t2 * t2 * t2, 1.8 * t2 * t2, t2);\n                            vec3 c3 = mix(.8, 1., v) * vec3(1.4 * t3 * t3 * t3, 1.8 * t3 * t3, t3);\n                            c1 *= baseColor;\n                            c2 *= baseColor;\n                            c3 *= baseColor;\n                            Star_Swamp_3D_version_1481150076458_107_gl_FragColor = vec4(Star_Swamp_3D_version_1481150076458_107_brightness * vec3(c1 * 0.7 + c2 * 0.9 + c3 * 0.1), 1.0);\n                            return Star_Swamp_3D_version_1481150076458_107_gl_FragColor *= 0.2;\n                        }\nvec4 Tiling_Caustic1481150103620_119_main() \n                        {\n                            vec4 Tiling_Caustic1481150103620_119_gl_FragColor = vec4(0.0);\n                            vec2 uv = Tiling_Caustic1481150103620_119_vUv * Tiling_Caustic1481150103620_119_resolution;\n                            vec2 p = mod(uv * TAU, TAU) - 250.0;\n                            vec2 i = vec2(p);\n                            float c = 1.0;\n                            float inten = 0.005;\n                            for (int n = 0;\n n < MAX_ITER; n++) \n                            {\n                                float t = time * Tiling_Caustic1481150103620_119_speed * (1.0 - (3.5 / float(n + 1)));\n                                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));\n                                c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));\n                            }\n                            c /= float(MAX_ITER);\n                            c = 1.17 - pow(c, Tiling_Caustic1481150103620_119_brightness);\n                            vec3 rgb = vec3(pow(abs(c), 8.0));\n                            Tiling_Caustic1481150103620_119_gl_FragColor = vec4(rgb * Tiling_Caustic1481150103620_119_color + backgroundColor, 1.0);\n                            return Tiling_Caustic1481150103620_119_gl_FragColor *= 1.0;\n                        }\nvec4 Caustic_Image_Based1487582497347_66_main() \n                        {\n                            vec4 Caustic_Image_Based1487582497347_66_gl_FragColor = vec4(0.0);\n                            vec2 uvMax = (2.0 * asin(sin(2.0 * PI * Caustic_Image_Based1487582497347_66_vUv))) / PI;\n                            vec2 position = Caustic_Image_Based1487582497347_66_vUv * Caustic_Image_Based1487582497347_66_resolution;\n                            vec3 nor = vec3(0.0, 1.0, 0.0);\n                            float dif = max(dot(nor, lig), 0.0);\n                            vec3 pos = vec3(position.x, 0.0, position.y);\n                            float timeScale = time * Caustic_Image_Based1487582497347_66_speed;\n                            vec3 brdf = vec3(0.0);\n                            float cc = 0.55 * texture2D(image, 1.8 * 0.02 * pos.xz + 0.007 * timeScale * vec2(1.0, 0.0)).x;\n                            cc += 0.25 * texture2D(image, 1.8 * 0.04 * pos.xz + 0.011 * timeScale * vec2(0.0, 1.0)).x;\n                            cc += 0.10 * texture2D(image, 1.8 * 0.08 * pos.xz + 0.014 * timeScale * vec2(-1.0, -1.0)).x;\n                            cc = 0.6 * (1.0 - smoothstep(0.0, 0.025, abs(cc - 0.4))) + 0.4 * (1.0 - smoothstep(0.0, 0.150, abs(cc - 0.4)));\n                            vec3 col = Caustic_Image_Based1487582497347_66_color * cc;\n                            Caustic_Image_Based1487582497347_66_gl_FragColor = vec4(Caustic_Image_Based1487582497347_66_color * cc * Caustic_Image_Based1487582497347_66_brightness, 1.0);\n                            return Caustic_Image_Based1487582497347_66_gl_FragColor *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_FragColor = (Star_Swamp_3D_version_1481150076458_107_main() + Tiling_Caustic1481150103620_119_main());                        }\n";
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return meshMaterial;
    },
    //防护罩
    getElectricShieldMaterial(opts = {}) {
      var ElectricShield = {
        uniforms: {
          time: {
            // time+=0.012
            type: "f",
            value: 1,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#9999FF"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 1,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: `
          #extension GL_OES_standard_derivatives : enable
          uniform vec3 color;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          #define pi 3.1415926535
          #define PI2RAD 0.01745329252
          #define TWO_PI (2. * PI)
          float rands(float p){
            return fract(sin(p) * 10000.0);
          }
          float noise(vec2 p){
            float t = time / 20000.0;
            if(t > 1.0) t -= floor(t);
            return rands(p.x * 14. + p.y * sin(t) * 0.5);
          }
          vec2 sw(vec2 p){
            return vec2(floor(p.x), floor(p.y));
          }
          vec2 se(vec2 p){
            return vec2(ceil(p.x), floor(p.y));
          }
          vec2 nw(vec2 p){
            return vec2(floor(p.x), ceil(p.y));
          }
          vec2 ne(vec2 p){
            return vec2(ceil(p.x), ceil(p.y));
          }
          float smoothNoise(vec2 p){
            vec2 inter = smoothstep(0.0, 1.0, fract(p));
            float s = mix(noise(sw(p)), noise(se(p)), inter.x);
            float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
            return mix(s, n, inter.y);
          }
          float fbm(vec2 p){
            float z = 2.0;
            float rz = 0.0;
            vec2 bp = p;
            for(float i = 1.0; i < 6.0; i++){
              rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
              z *= 2.0;
              p *= 2.0;
            }
            return rz;
          }
          void main() {
            vec2 uv = vUv;
            vec2 uv2 = vUv;
            if (uv.y < 0.5) {
              discard;
            }
            uv *= 4.;
            float rz = fbm(uv);
            uv /= exp(mod(time * 2.0, pi));
            rz *= pow(15., 0.9);
            gl_FragColor = mix(vec4(color, opacity) / rz, vec4(color, 0.1), 0.2);
            if (uv2.x < 0.05) {
              gl_FragColor = mix(vec4(color, 0.1), gl_FragColor, uv2.x / 0.05);
            }
            if (uv2.x > 0.95){
              gl_FragColor = mix(gl_FragColor, vec4(color, 0.1), (uv2.x - 0.95) / 0.05);
            }
          }`,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: ElectricShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: ElectricShield.vertexShaderSource,
        fragmentShader: ElectricShield.fragmentShaderSource,
        // blending: THREE.NoBlending,
        // blending: THREE.AdditiveBlend ing,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      return meshMaterial;
    },
    //警报效果
    getAlarmShieldMaterial(opts = {}) {
      var AlarmShield = {
        uniforms: {
          time: {
            // time+=0.012
            type: "f",
            value: 1,
          },
          opacity: {
            type: "f",
            value: opts.opacity || 1,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: `
          #extension GL_OES_standard_derivatives : enable
          uniform float time;
          uniform float opacity;
          varying vec2 vUv;
          void main(void)
          {
            float t=time*.1;
            if (vUv.y < 0.5) {
              discard;
            }
            vec2 uv = vec2(vUv.x - 0.25, vUv.y - 0.5);
            
            vec2 ouv=uv;
            vec3 rd=normalize(vec3(uv,2.));
            rd.xy*=mat2(cos(t),sin(t),-sin(t),cos(t));
            vec3 ro=vec3(t+sin(t*6.53583)*.05,.01+sin(t*352.4855)*.0015,-t*3.);
            vec3 p=ro;
            float v=0., td=-mod(ro.z,.005);
            for (int r=0; r<150; r++) {
              v+=pow(max(0.,.01-length(abs(.01-mod(p,.02))))/.01,10.)*exp(-2.*pow((1.+td),2.));
              p=ro+rd*td;
              td+=.005;
            }
            gl_FragColor = vec4(v,v*v,v*v*v,0.)*8.*max(0.,1.-length(ouv*ouv)*2.5);
            gl_FragColor.a = opacity;
          }
          `,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: AlarmShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: AlarmShield.vertexShaderSource,
        fragmentShader: AlarmShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      return meshMaterial;
    },
    //noise texture防护罩
    getFbmShieldMaterial(opts = {}) {
      var FbmShield = {
        uniforms: {
          time: {
            type: "f",
            value: 1,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#9999FF"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 1,
          },
          noise_map: {
            type: "t",
            value: opts.texture,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource:
          "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  uniform sampler2D noise_map;\n  varying vec2 vUv;\n\n  #define tau 6.2831853\n\n  mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}\n  float noise( in vec2 x ){return texture2D(noise_map, x*.01).x;}\n\n  float fbm(in vec2 p) {\n    float z=2.;\n    float rz = 0.;\n    vec2 bp = p;\n    for (float i= 1.;i < 6.;i++)\n    {\n      rz+= abs((noise(p)-0.5)*2.)/z;\n      z = z*2.;\n      p = p*2.;\n    }\n    return rz;\n  }\n\n  float dualfbm(in vec2 p) {\n      //get two rotated fbm calls and displace the domain\n    vec2 p2 = p*.7;\n    vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));\n    basis = (basis-.5)*.2;\n    p += basis;\n    \n    //coloring\n    return fbm(p*makem2(time*0.2));\n  }\n\n  float circ(vec2 p) {\n    float r = length(p);\n    //r = log(sqrt(r));\n      r = 0.5 * log(r);\n    return abs(mod(r*4.,tau)-3.14)*3.+.2;\n  }\n\n  void main(void) {\n    vec2 uv = vUv;\n    vec2 uv2 = vUv;\n    \n    if (uv.y < 0.5) {\n      discard;\n    }\n\n    uv.x = abs(uv.x - 0.5);\n    uv*=4.;\n    \n    float rz = dualfbm(uv);\n    rz *= 10.;\n    \n    //final color\n    vec3 col = color / rz;\n    col=pow(abs(col), vec3(.99));\n    \n    gl_FragColor = mix(vec4(col, opacity), vec4(vec3(0.), 0.1), 0.2);\n  }\n",
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: FbmShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: FbmShield.vertexShaderSource,
        fragmentShader: FbmShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      return meshMaterial;
    },
    getElectricRippleShieldMaterial(opts = {}) {
      var Shield = {
        uniforms: {
          time: {
            type: "f",
            value: 1,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#9999FF"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 1,
          },
          num: {
            type: "f",
            value: opts.num || 1,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform vec3 color;\n  uniform float opacity;\n  uniform float time;\n  varying vec2 vUv;\n\n  ".concat(
          this.ky,
          "\n  \n  /* skew constants for 3d simplex functions */\n  const float F3 =  0.3333333;\n  const float G3 =  0.1666667;\n\n  /* 3d simplex noise */\n  float simplex3d(vec3 p) {\n    /* 1. find current tetrahedron T and it's four vertices */\n    /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */\n    /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/\n    \n    /* calculate s and x */\n    vec3 s = floor(p + dot(p, vec3(F3)));\n    vec3 x = p - s + dot(s, vec3(G3));\n    \n    /* calculate i1 and i2 */\n    vec3 e = step(vec3(0.0), x - x.yzx);\n    vec3 i1 = e*(1.0 - e.zxy);\n    vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n      \n    /* x1, x2, x3 */\n    vec3 x1 = x - i1 + G3;\n    vec3 x2 = x - i2 + 2.0*G3;\n    vec3 x3 = x - 1.0 + 3.0*G3;\n    \n    /* 2. find four surflets and store them in d */\n    vec4 w, d;\n    \n    /* calculate surflet weights */\n    w.x = dot(x, x);\n    w.y = dot(x1, x1);\n    w.z = dot(x2, x2);\n    w.w = dot(x3, x3);\n    \n    /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */\n    w = max(0.6 - w, 0.0);\n    \n    /* calculate surflet components */\n    d.x = dot(rands(s), x);\n    d.y = dot(rands(s + i1), x1);\n    d.z = dot(rands(s + i2), x2);\n    d.w = dot(rands(s + 1.0), x3);\n    \n    /* multiply d by w^4 */\n    w *= w;\n    w *= w;\n    d *= w;\n    \n    /* 3. return the sum of the four surflets */\n    return dot(d, vec4(52.0));\n  }\n\n  float noise(vec3 m) {\n      return   0.5333333*simplex3d(m)\n        +0.2666667*simplex3d(2.0*m)\n        +0.1333333*simplex3d(4.0*m)\n        +0.0666667*simplex3d(8.0*m);\n  }\n\n  void main() {\n    vec2 uv = vUv;\n    uv.x = uv.x - 0.5;\n    if (vUv.y < 0.5) {\n      discard;\n    }\n    vec3 p3 = vec3(vUv, time*0.4);    \n      \n    float intensity = noise(vec3(p3*12.0+12.0));\n                            \n    float t = clamp((uv.x * -uv.x * 0.2) + 0.15, 0., 1.);                         \n    float y = fract(abs(intensity * -t + fract(uv.y) - fract(-time)));                  \n      \n    float g = pow(y, 0.15);\n    \n    vec3 col = vec3(2.);\n    col = col * -g + col;                    \n    col = col * col;\n    col = col * col;\n\n    gl_FragColor = vec4(col * color, opacity);\n  }\n"
        ),
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: Shield.uniforms,
        defaultAttributeValues: {},
        vertexShader: Shield.vertexShaderSource,
        fragmentShader: Shield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      return meshMaterial;
    },
    //星空效果
    getStarSkyMaterial(opts = {}) {
      let uniforms = {
        color: {
          name: "color",
          displayName: null,
          type: "c",
          value: {
            r: 1,
            g: 1,
            b: 1,
          },
          glslType: "vec3",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
        time: {
          name: "time",
          displayName: null,
          type: "f",
          value: 0.01,
          glslType: "float",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
        speed: {
          name: "speed",
          displayName: null,
          type: "f",
          value: 0.0001,
          glslType: "float",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
        brightness: {
          name: "brightness",
          displayName: null,
          type: "f",
          value: 0.001,
          glslType: "float",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
        distfading: {
          name: "distfading",
          displayName: null,
          type: "f",
          value: 0.9,
          glslType: "float",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
        twinkleSpeed: {
          name: "twinkleSpeed",
          displayName: null,
          type: "f",
          value: 2,
          glslType: "float",
          useGridHelper: false,
          useRange: false,
          range: null,
          isRandom: false,
          randomRange: null,
          useToggle: false,
          toggle: null,
          description: "",
        },
      };
      let vertexShaderSource =
        "precision highp float;\r\nprecision highp int;\r\nattribute vec2 uv2;\r\n\r\nvarying vec2 vUv;\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\n\r\nvoid main() {\r\n  vUv = uv;\r\n  vPosition = position;\r\n  vNormal = normal;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}";
      let fragmentShaderSource =
        "\n#extension GL_OES_standard_derivatives : enable\n\n#define iterations 17\n#define volsteps 3\n#define sparsity 0.5\n#define stepsize 0.2\n #define frequencyVariation   1.3\n\nprecision highp float;\nprecision highp int;\n\nvarying vec2 vUv;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nuniform vec3 color;\nuniform float time;\nuniform float twinkleSpeed;\nuniform float speed;\n \nuniform float brightness;\nuniform float distfading;\n \n\n#define PI 3.141592653589793238462643383279\n\nvoid main( void ) {\n\n if (vUv.y < 0.5) {discard;}\n\n vec2 uv = vUv.xy + 0.5;     uv.x += time * speed * 0.1;\n \n    vec3 dir = vec3(uv * 2.0, 1.0);\n \n    float s = 0.1, fade = 0.01;\n    vec3 starColor = vec3(0.0);\n     \n    for (int r = 0; r < volsteps; ++r) {\n        vec3 p =  (time * speed * twinkleSpeed) + dir * (s * 0.5);\n        p = abs(vec3(frequencyVariation) - mod(p, vec3(frequencyVariation * 2.0)));\n \n        float prevlen = 0.0, a = 0.0;\n        for (int i = 0; i < iterations; ++i) {\n            p = abs(p);\n            p = p * (1.0 / dot(p, p)) + (-sparsity); // the magic formula            \n            float len = length(p);\n            a += abs(len - prevlen); // absolute sum of average change\n            prevlen = len;\n        }\n         \n        a *= a * a; // add contrast\n         \n        // coloring based on distance        \n        starColor += (vec3(s, s*s, s*s*s) * a * brightness + 1.0) * fade;\n        fade *= distfading; // distance fading\n        s += stepsize;\n    }\n     \n    starColor = min(starColor, vec3(1.2));\n \n    // Detect and suppress flickering single pixels (ignoring the huge gradients that we encounter inside bright areas)\n    float intensity = min(starColor.r + starColor.g + starColor.b, 0.7);\n \n    vec2 sgn = (vec2(vUv.xy)) * 2.0 - 1.0;\n    vec2 gradient = vec2(dFdx(intensity) * sgn.x, dFdy(intensity) * sgn.y);\n    float cutoff = max(max(gradient.x, gradient.y) - 0.1, 0.0);\n    starColor *= max(1.0 - cutoff * 6.0, 0.3);\n \n    // Motion blur; increases temporal coherence of undersampled flickering stars\n    // and provides temporal filtering under true motion.  \n    gl_FragColor = vec4( starColor * color, 1.0 );\n}\n";
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });

      return meshMaterial;
    },
    getBuildTextureShaderMaterial(imgData, options) {
      var building_vertex = `
        precision highp float;
        precision highp int;
        attribute vec2 maxUv;
        varying vec2 vUv;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      var building_fragment = `
        #extension GL_OES_standard_derivatives : enable
        precision highp float;
        precision highp int;
        uniform vec3 color;
        uniform float opacity;
        uniform sampler2D maps[1];
        varying vec2 vUv;
        void main(void){
          vec2 uv = vUv;
          gl_FragColor = texture2D(maps[0], uv);
        }
      `;
      //vec4 tex = texture2D(maps[0], uv);
      // gl_FragColor = vec4(tex.rgb, tex.a * opacity);

      //gl_FragColor = texture2D(maps[0], uv);

      // building_fragment = `
      //   #extension GL_OES_standard_derivatives : enable
      //   precision highp float;
      //   precision highp int;
      //   uniform vec3 color;
      //   uniform float opacity;
      //   uniform sampler2D maps[1];
      //   varying vec2 vUv;
      //   void main(void){
      //     vec2 uv = vUv;
      //     if (uv.y < 0.1) {
      //       gl_FragColor = texture2D(maps[0], uv);
      //     } else if (uv.y < 0.2) {
      //       gl_FragColor = texture2D(maps[0], uv);
      //     } else if (uv.y < 0.5) {
      //       gl_FragColor = texture2D(maps[0], uv);
      //     }else
      //       gl_FragColor = texture2D(maps[0], uv);
      //   }
      // `;
      const texture = new THREE.TextureLoader().load(imgData);
      // texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(2, 2);
      return new THREE.ShaderMaterial({
        uniforms: {
          opacity: {
            type: "f",
            value: options.opacity || 1,
          },
          color: {
            type: "c",
            value: new THREE.Color("#f00"),
          },
          maps: {
            value: [texture],
          },
        },
        vertexShader: building_vertex,
        fragmentShader: building_fragment,
        // polygonOffsetFactor: 0,
        // polygonOffsetUnits: 1,
        transparent: !1,
        // blending: THREE.AdditiveBlending,
        // blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
    },
    // 建筑"窗户"动画背景
    getBuildWindowMaterial(opts = {}) {
      let uniforms = {
        time: {
          type: "f",
          glslType: "float",
          value: 0,
        },
        brightness: {
          value: "0.0018",
          type: "f",
          glslType: "float",
        },
        distfading: {
          value: "0.7",
          type: "f",
          glslType: "float",
        },
        twinkleSpeed: {
          value: "200",
          type: "f",
          glslType: "float",
        },
        Universe_Nursery1538450747542_173_color: {
          value: {
            r: 1,
            g: 1,
            b: 1,
          },
          type: "c",
          glslType: "vec3",
        },
        Universe_Nursery1538450747542_173_speed: {
          value: "0.0001",
          type: "f",
          glslType: "float",
        },
        cameraPosition: {
          type: "v3",
          glslType: "vec3",
        },
        resolution: {
          value: {
            x: 0.46153846153846156,
            y: 0.36923076923076925,
          },
          type: "v2",
          glslType: "vec2",
        },
        backgroundColor: {
          value: {
            x: 0,
            y: 0,
            z: 0,
            w: 1,
          },
          type: "v4",
          glslType: "vec4",
        },
        charResolution: {
          value: "0",
          type: "f",
          glslType: "float",
        },
        charSize: {
          value: {
            x: 0.8769230769230769,
            y: 0.9384615384615385,
          },
          type: "v2",
          glslType: "vec2",
        },
        Enter_The_Matrix1538450930129_255_speed: {
          value: "18.26450037",
          type: "f",
          glslType: "float",
        },
        Enter_The_Matrix1538450930129_255_color: {
          value: {
            r: 0.7450980392156863,
            g: 0.7411764705882353,
            b: 0.7803921568627451,
          },
          type: "c",
          glslType: "vec3",
        },
      };
      var vertexShaderSource =
        "precision highp float;\nprecision highp int;\nuniform float time;\nvarying vec2 uv2;\nvarying vec2 Universe_Nursery1538450747542_173_vUv;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 Enter_The_Matrix1538450930129_255_vUv;\nvec4 Universe_Nursery1538450747542_173_main() \n                        {\n                            vec4 Universe_Nursery1538450747542_173_gl_Position = vec4(0.0);\n                            Universe_Nursery1538450747542_173_vUv = uv;\n                            vPosition = position;\n                            vNormal = normal;\n                            Universe_Nursery1538450747542_173_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Universe_Nursery1538450747542_173_gl_Position *= 1.0;\n                        }\nvec4 Enter_The_Matrix1538450930129_255_main() \n                        {\n                            vec4 Enter_The_Matrix1538450930129_255_gl_Position = vec4(0.0);\n                            Enter_The_Matrix1538450930129_255_vUv = uv;\n                            Enter_The_Matrix1538450930129_255_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Enter_The_Matrix1538450930129_255_gl_Position *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_Position = Universe_Nursery1538450747542_173_main() + Enter_The_Matrix1538450930129_255_main();                        }\n";
      var fragmentShaderSource =
        "#define iterations 17\n#define volsteps 3\n#define sparsity 0.5\n#define stepsize 0.2\n#define frequencyVariation 1.3\n#define PI 3.141592653589793238462643383279\n\n#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\nprecision highp int;\nuniform vec3 Universe_Nursery1538450747542_173_color;\nuniform float time;\nuniform float twinkleSpeed;\nuniform float Universe_Nursery1538450747542_173_speed;\nuniform float brightness;\nuniform float distfading;\nuniform float Enter_The_Matrix1538450930129_255_speed;\nuniform vec2 charSize;\nuniform float charResolution;\nuniform vec3 Enter_The_Matrix1538450930129_255_color;\nuniform vec4 backgroundColor;\nuniform vec2 resolution;\nvarying vec2 Universe_Nursery1538450747542_173_vUv;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 Enter_The_Matrix1538450930129_255_vUv;\nfloat seed = 2.0;\nfloat random(float x) \n                        {\n                            return fract(sin(x) * 43758.5453);\n                        }\nfloat random(vec2 st) \n                        {\n                            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);\n                        }\nfloat randomChar(vec2 outer, vec2 inner) \n                        {\n                            vec2 margin = 1.0 - charSize;\n                            vec2 borders = step(margin, inner) * step(margin, 1.0 - inner);\n                            return step(0.5, random(outer * seed + floor(inner * charResolution))) * borders.x * borders.y;\n                        }\nvec4 matrix(vec2 st) \n                        {\n                            float rows = 50.0;\n                            vec2 ipos = floor(st * rows) + vec2(1.0, 0.0);\n                            ipos += vec2(0.0, floor(time * Enter_The_Matrix1538450930129_255_speed * random(ipos.x)));\n                            vec2 fpos = fract(st * rows);\n                            vec2 center = 0.5 - fpos;\n                            float pct = random(ipos);\n                            float glow = (1.0 - dot(center, center) * 3.0) * 2.0;\n                            float result = randomChar(ipos, fpos) * pct * glow;\n                            return vec4(Enter_The_Matrix1538450930129_255_color * result, result);\n                        }\nvec4 Universe_Nursery1538450747542_173_main(void) \n                        {\n                            vec4 Universe_Nursery1538450747542_173_gl_FragColor = vec4(0.0);\n                            vec2 uv = Universe_Nursery1538450747542_173_vUv.xy + 0.5;\n                            uv.x += time * Universe_Nursery1538450747542_173_speed * 0.1;\n                            vec3 dir = vec3(uv * 2.0, 1.0);\n                            float s = 0.1, fade = 0.01;\n                            vec3 starColor = vec3(0.0);\n                            for (int r = 0;\n r < volsteps; ++r) \n                            {\n                                vec3 p = (time * Universe_Nursery1538450747542_173_speed * twinkleSpeed) + dir * (s * 0.5);\n                                p = abs(vec3(frequencyVariation) - mod(p, vec3(frequencyVariation * 2.0)));\n                                float prevlen = 0.0, a = 0.0;\n                                for (int i = 0;\n i < iterations; ++i) \n                                {\n                                    p = abs(p);\n                                    p = p * (1.0 / dot(p, p)) + (-sparsity);\n                                    float len = length(p);\n                                    a += abs(len - prevlen);\n                                    prevlen = len;\n                                }\n                                a *= a * a;\n                                starColor += (vec3(s, s * s, s * s * s) * a * brightness + 1.0) * fade;\n                                fade *= distfading;\n                                s += stepsize;\n                            }\n                            starColor = min(starColor, vec3(1.2));\n                            float intensity = min(starColor.r + starColor.g + starColor.b, 0.7);\n                            vec2 sgn = vec2(Universe_Nursery1538450747542_173_vUv.xy) * 2.0 - 1.0;\n                            vec2 gradient = vec2(dFdx(intensity) * sgn.x, dFdy(intensity) * sgn.y);\n                            float cutoff = max(max(gradient.x, gradient.y) - 0.1, 0.0);\n                            starColor *= max(1.0 - cutoff * 6.0, 0.3);\n                            Universe_Nursery1538450747542_173_gl_FragColor = vec4(starColor * Universe_Nursery1538450747542_173_color, 1.0);\n                            return Universe_Nursery1538450747542_173_gl_FragColor *= 1.0;\n                        }\nvec4 Enter_The_Matrix1538450930129_255_main() \n                        {\n                            vec4 Enter_The_Matrix1538450930129_255_gl_FragColor = vec4(0.0);\n                            vec2 st = Enter_The_Matrix1538450930129_255_vUv * resolution;\n                            Enter_The_Matrix1538450930129_255_gl_FragColor = backgroundColor + matrix(st);\n                            return Enter_The_Matrix1538450930129_255_gl_FragColor *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_FragColor = (Universe_Nursery1538450747542_173_main() + Enter_The_Matrix1538450930129_255_main());                        }\n";
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        // blending: THREE.AdditiveBlending,
        transparent: !1,
        // depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        // fog: !0,
      });
      return material;
    },
    //流星
    getMeteorMaterial(opts = {}) {
      let uniforms = {
        time: {
          //time+=0.0045
          type: "f",
          value: 0,
        },
        color: {
          type: "c",
          value: new THREE.Color(opts.color || "#EDD464"),
        },
        opacity: {
          type: "f",
          value: opts.opacity || 0.9,
        },
      };
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  varying vec2 vUv;\n\n  ".concat(
        this.Qg,
        "\n\n  float nutsack(vec2 uv){\n    uv.x *= sin(1.)*2.;\n    float t =  time*0.4;\n    uv.x = uv.x*180.0;\n    float dx = fract(uv.x);\n    uv.x = floor(uv.x);\n    uv.y *= 0.15;\n    float o=sin(uv.x*215.4);\n    float s=cos(uv.x*33.1)*.3 +.7;\n    float trail = mix(95.0,15.0,s);\n    float yv = 1.0/(fract(1. - uv.y + t*s + o) * trail);\n    yv = smoothstep(0.0,1.0,yv*yv);\n    yv = sin(yv*pi)*(s*5.0);\n    float d = sin(dx*pi);\n    return yv*(d*d);\n  }\n\n  void main() {\n    vec3 col = color * nutsack(vUv); // Get the jizz flowing\n    col += mix(color, vec3(0.,0.,0.), vUv.y);\n    gl_FragColor=vec4(col, opacity * (1. - vUv.y)); // output the spunk\n  }\n"
      );
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !1,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });

      opts.animate && animate();
      function animate() {
        uniforms.time.value += opts.dua || 0.045;
        requestAnimationFrame(animate);
      }
      return material;
    },
    //扩散圆环
    getRingEffectMaterial(color, type) {
      var ringShield = {
        //扩散圆环
        uniforms: {
          color: {
            type: "c",
            value: new THREE.Color(color || "#9999FF"),
          },
          time: {
            type: "f",
            value: -1.5,
          },
          type: {
            type: "f",
            value: type || 0,
          },
          num: {
            type: "f",
            value: 4,
          },
        },
        vertexShaderSource: `
            varying vec2 vUv;
            void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShaderSource: `
            uniform float time;
            uniform vec3 color;
            uniform float type;
            uniform float num;
            varying vec2 vUv;\n
            void main(){
                float alpha = 1.0;
                float dis = distance(vUv,vec2(0.5));//0-0.5
                if(dis > 0.5){
                    discard;
                }
                if(type ==0.0){
                        float y = (sin(6.0 * num *(dis-time)) + 1.0)/2.0;
                    alpha = smoothstep(1.0,0.0,abs(y-0.5)/0.5) * (0.5 -dis) * 2.;
                }else if(type ==1.0){
                        float step = fract(time* 4.)* 0.5;
                    if(dis<step){
                            // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
                        alpha =1.- abs(step-dis)/0.15;
                    }else{
                            alpha = smoothstep(1.0,0.0,abs(step-dis)/0.05);
                    }
                    alpha *= (pow((0.5 -dis)* 3.0,2.0));
                }
                gl_FragColor = vec4(color,alpha );
            }`,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: ringShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: ringShield.vertexShaderSource,
        fragmentShader: ringShield.fragmentShaderSource,
        // blending: THREE.NoBlending,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !0,
        fog: !0,
      });
      // animate();
      // function animate() {
      //   ringShield.uniforms.time.value += speed || 0.005;
      //   requestAnimationFrame(animate);
      // }
      return meshMaterial;
    },
    //雷达
    getRandarMetarial(opts = {}) {
      var randarShield = {
        //雷达
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          type: {
            type: "f",
            value: opts.type || 1, // 0 大扇形 1小扇形 2 环绕
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || 0x00ffff),
          },
        },
        vertexShaderSource: `
            varying vec2 vUv;
            uniform float type;
            uniform float time;
            const float PI = 3.141592653589;
            void main(){
                vUv = uv;
                vec3 pos = position;
                if(type==1.0){
                    float a = -time * 2.0 * PI;
                    mat4 rMat= mat4(
                        cos(a), -sin(a), 0.0,0.0,
                        sin(a), cos(a), 0.0,0.0,
                        0.0, 0.0, 1.0,0.0,
                        0.0, 0.0, 0.0,1.0
                    );
                    gl_Position = projectionMatrix * modelViewMatrix * rMat * vec4(pos, 1.0);
                }else{
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            }`,
        fragmentShaderSource: `
            uniform float time;
            uniform vec3 color;
            uniform float type;
            varying vec2 vUv;
            const float PI = 3.141592653589;
            void main(){
                vec2 center = vec2(0.5);
                float dis = distance(vUv,center);
                vec2 direct = normalize(vec2(vUv.x - center.x,vUv.y - center.y));

                if(type==0.0||type==1.0){
                    float step = fract(time);
                    vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                    float radius1 = 0.49;
                    float radius2 = 0.0003;//中心圆环大小
                    float alpha1 = smoothstep(1.0,0.0,abs(dis-radius1)/0.01);
                    float alpha2 = smoothstep(1.0,0.0,abs(dis-radius2)/0.02);
                    float alphastep;
                    if(type==0.0){
                        alphastep = smoothstep(0.0,1.0,dot(direct,start));
                }else if(type==1.0){
                        float diff = atan(0.0,1.0) - atan(direct.y,direct.x);
                        if(diff > 0.0){
                            alphastep = smoothstep(1.0,0.0,diff/PI);
                    }else{
                            alphastep = smoothstep(0.03,0.0,abs(diff)/PI);
                    }
                }
                if(dis<radius1){
                        gl_FragColor =  vec4(color,alphastep + (1.0 - alphastep) *alpha2 + alpha1);
                }else{
                        gl_FragColor =  vec4(color,alpha1 + alpha2);
                }
                }else if(type==2.0){
                        float radius = 0.49;
                        float alpha = 0.0;
                        float step = fract(time);
                        for(int i =0;i<5;i++){
                            vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                            float alphax = smoothstep(0.5,1.0,dot(direct,start));
                            float alphay = smoothstep(1.0,0.0,abs(dis-radius)/0.01);
                            if(alphax >0.0 && alphay >0.0){
                                // alpha += (alphax + alphay) * 0.5;
                                alpha += (alphax * alphay) ;
                        }
                        radius -= 0.1;
                        step -=0.55;
                    }
                    step = fract(1.0 - time);
                    radius = 0.44;
                    for(int i =0;i<4;i++){
                            vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                        float alphax = smoothstep(0.5,1.0,dot(direct,start));
                        float alphay = smoothstep(1.0,0.0,abs(dis-radius)/0.01);
                        if(alphax >0.0 && alphay >0.0){
                                alpha += (alphax * alphay) ;
                        }
                        radius -= 0.1;
                        step -=0.55;
                    }
                    gl_FragColor =  vec4(color,alpha);
                }

            }`,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: randarShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: randarShield.vertexShaderSource,
        fragmentShader: randarShield.fragmentShaderSource,
        // blending: THREE.NoBlending,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      // animate();
      // function animate() {
      //   randarShield.uniforms.time.value += 0.015;
      //   requestAnimationFrame(animate);
      // }
      return meshMaterial;
    },
    //雷达扫描
    FlabellumScanMaterial(opts = {}) {
      //new THREE.PlaneBufferGeometry(this.radius,this.radius,2)
      var ScanShield = {
        //雷达
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#ff0000"),
          },
          opacity: {
            type: "f",
            value: opts.color || 1,
          },
        },
        vertexShaderSource: `
          varying vec2 vUv;
          void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShaderSource: `
          precision lowp float;
          precision lowp int;
          varying vec2 vUv;
          uniform float time;
          uniform vec3 color;
          uniform float opacity;

          #define pi 3.1415926535
          #define PI2RAD 0.01745329252
          #define TWO_PI (2. * PI)
          
          void main() {
            vec2 pos = vUv - 0.5;
            float r = length(pos);
            if (r > 0.5) {
              discard;
            }
            float t = atan(pos.y, pos.x) - time*2.5;
            float a = (atan(sin(t), cos(t)) + pi)/(2.0*pi);
            float ta = 0.5;
            float v = smoothstep(ta-0.05,ta+0.05,a) * smoothstep(ta+0.05,ta-0.05,a);
            vec3 col = vec3(0, v, 0);
            float blink = pow(sin(time*1.5)*0.5+0.5, 0.8);
            gl_FragColor = vec4(color, opacity * pow(a, 8.0*(.2+blink))*(sin(r*300.0)*.5+.5)*pow(r, 0.4));
          }
        `,
      };
      let material = new THREE.ShaderMaterial({
        uniforms: ScanShield.uniforms,
        vertexShader: ScanShield.vertexShaderSource,
        fragmentShader: ScanShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
      });
      animate();
      function animate() {
        ScanShield.uniforms.time.value += opts.speed || 0.015;
        requestAnimationFrame(animate);
      }
      return material;
    },
    //水面动效
    getWaterShader(opts = {}) {
      let uniforms = {
        noiseImage: {
          value: opts.t1,
          type: "t",
          glslType: "sampler2D",
        },
        scale: {
          value: "0.1",
          type: "f",
          glslType: "float",
        },
        cloudCover: {
          value: opts.cloudCover || "0.58",
          type: "f",
          glslType: "float",
        },
        cloudBrightness: {
          value: "0.1",
          type: "f",
          glslType: "float",
        },
        cloudMorphSpeed: {
          value: "0.4",
          type: "f",
          glslType: "float",
        },
        cloudMorphDirection: {
          value: "-1",
          type: "f",
          glslType: "float",
        },
        time: {
          value: 1,
          type: "f",
          glslType: "float",
        },
        Cloud_WIP1555482451489_482_speed: {
          value: {
            x: "0.002",
            y: 0,
          },
          type: "v2",
          glslType: "vec2",
        },
        Cloud_WIP1555482451489_482_color: {
          value: {
            r: 0.6823529411764706,
            g: 0.8862745098039215,
            b: 0.2235294117647059,
          },
          type: "c",
          glslType: "vec3",
        },
        color1: {
          value: {
            r: 0.054901960784313725,
            g: 0.5333333333333333,
            b: 1,
          },
          type: "c",
          glslType: "vec3",
        },
        color2: {
          value: {
            r: 0,
            g: 0.050980392156862744,
            b: 0.35294117647058826,
          },
          type: "c",
          glslType: "vec3",
        },
        resolution: {
          value: opts.md || "2", //水纹密度
          type: "f",
          glslType: "float",
        },
        image1: {
          value: opts.t2,
          type: "t",
          glslType: "sampler2D",
        },
        image2: {
          value: opts.t3,
          type: "t",
          glslType: "sampler2D",
        },
        Flowing_Image_Combination1555482451537_488_speed: {
          value: "0.01",
          type: "f",
          glslType: "float",
        },
        Flowing_Image_Combination1555482451537_488_color: {
          value: {
            r: 1,
            g: 1,
            b: 1,
          },
          type: "c",
          glslType: "vec3",
        },
        rimWidth: {
          value: "2",
          type: "f",
          glslType: "float",
        },
        fadeDistance: {
          value: "0.5",
          type: "f",
          glslType: "float",
        },
        Fresnel_Glow1555482451555_491_color: {
          value: {
            r: 0.6901960784313725,
            g: 0.9450980392156862,
            b: 1,
          },
          type: "c",
          glslType: "vec3",
        },
      };
      let vertexShaderSource =
        "precision highp float;\nprecision highp int;\nuniform float time;\nvarying vec2 uv2;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 Cloud_WIP1555482451489_482_vUv;\nvarying vec2 vUv2;\nvarying vec2 Vertical_2_Color_Graident1555482451525_485_vUv;\nvarying vec2 Flowing_Image_Combination1555482451537_488_vUv;\nvarying vec3 fNormal;\nvarying vec3 fPosition;\nvec4 Cloud_WIP1555482451489_482_main() \n                        {\n                            vec4 Cloud_WIP1555482451489_482_gl_Position = vec4(0.0);\n                            vNormal = normal;\n                            Cloud_WIP1555482451489_482_vUv = uv;\n                            vUv2 = uv2;\n                            vPosition = position;\n                            Cloud_WIP1555482451489_482_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Cloud_WIP1555482451489_482_gl_Position *= 0.7;\n                        }\nvec4 Vertical_2_Color_Graident1555482451525_485_main() \n                        {\n                            vec4 Vertical_2_Color_Graident1555482451525_485_gl_Position = vec4(0.0);\n                            Vertical_2_Color_Graident1555482451525_485_vUv = uv;\n                            Vertical_2_Color_Graident1555482451525_485_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Vertical_2_Color_Graident1555482451525_485_gl_Position *= 1.0;\n                        }\nvec4 Flowing_Image_Combination1555482451537_488_main() \n                        {\n                            vec4 Flowing_Image_Combination1555482451537_488_gl_Position = vec4(0.0);\n                            Flowing_Image_Combination1555482451537_488_vUv = uv;\n                            Flowing_Image_Combination1555482451537_488_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Flowing_Image_Combination1555482451537_488_gl_Position *= 0.5;\n                        }\nvec4 Fresnel_Glow1555482451555_491_main() \n                        {\n                            vec4 Fresnel_Glow1555482451555_491_gl_Position = vec4(0.0);\n                            fNormal = normalize(normalMatrix * normal);\n                            vec4 pos = modelViewMatrix * vec4(position, 1.0);\n                            fPosition = pos.xyz;\n                            Fresnel_Glow1555482451555_491_gl_Position = projectionMatrix * pos;\n                            return Fresnel_Glow1555482451555_491_gl_Position *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_Position = Cloud_WIP1555482451489_482_main() + Vertical_2_Color_Graident1555482451525_485_main() + Flowing_Image_Combination1555482451537_488_main() + Fresnel_Glow1555482451555_491_main();                        }\n";
      let fragmentShaderSource =
        "precision highp float;\nprecision highp int;\nuniform float scale;\nuniform sampler2D noiseImage;\nuniform vec2 Cloud_WIP1555482451489_482_speed;\nuniform float cloudBrightness;\nuniform float cloudMorphSpeed;\nuniform float cloudMorphDirection;\nuniform float cloudCover;\nuniform float time;\nuniform vec3 Cloud_WIP1555482451489_482_color;\nuniform vec3 color1;\nuniform vec3 color2;\nuniform float Flowing_Image_Combination1555482451537_488_speed;\nuniform float resolution;\nuniform sampler2D image1;\nuniform sampler2D image2;\nuniform vec3 Flowing_Image_Combination1555482451537_488_color;\nuniform vec3 Fresnel_Glow1555482451555_491_color;\nuniform float rimWidth;\nuniform float fadeDistance;\nvarying vec2 Cloud_WIP1555482451489_482_vUv;\nvarying vec2 Vertical_2_Color_Graident1555482451525_485_vUv;\nvarying vec2 Flowing_Image_Combination1555482451537_488_vUv;\nvarying vec3 fPosition;\nvarying vec3 fNormal;\nvec4 Cloud_WIP1555482451489_482_main() \n                        {\n                            vec4 Cloud_WIP1555482451489_482_gl_FragColor = vec4(0.0);\n                            vec4 colorOutput = vec4(0.0);\n                            vec2 elapsed = time * Cloud_WIP1555482451489_482_speed;\n                            vec2 uv = (Cloud_WIP1555482451489_482_vUv + elapsed) * scale;\n                            for (int i = 1;\n i <= 4; i++) \n                            {\n                                float f = float(i);\n                                float divis = pow(2.0, f);\n                                float uvPow = pow(2.0, f - 1.0);\n                                vec4 computed = texture2D(noiseImage, uvPow * (uv + vec2(0.1, 0.0) + (time * 0.001 * cloudMorphSpeed))) / divis;\n                                computed += texture2D(noiseImage, uvPow * (uv + vec2(0.1))) / divis;\n                                computed += texture2D(noiseImage, uvPow * (uv + vec2(0.0, 0.1) + (cloudMorphDirection * time * 0.001 * cloudMorphSpeed))) / divis;\n                                computed *= 0.25;\n                                colorOutput += computed;\n                            }\n                            colorOutput = max(colorOutput - (1.0 - cloudCover), 0.0);\n                            colorOutput = vec4(1.0 - pow((1.0 - cloudBrightness), colorOutput.r * 255.0));\n                            Cloud_WIP1555482451489_482_gl_FragColor = vec4(colorOutput.rgb, 1.0);\n                            return Cloud_WIP1555482451489_482_gl_FragColor *= 0.7;\n                        }\nvec4 Vertical_2_Color_Graident1555482451525_485_main(void) \n                        {\n                            vec4 Vertical_2_Color_Graident1555482451525_485_gl_FragColor = vec4(0.0);\n                            vec3 mixCol = mix(color2, color1, Vertical_2_Color_Graident1555482451525_485_vUv.y);\n                            Vertical_2_Color_Graident1555482451525_485_gl_FragColor = vec4(mixCol, 1.);\n                            return Vertical_2_Color_Graident1555482451525_485_gl_FragColor *= 1.0;\n                        }\nvec4 Flowing_Image_Combination1555482451537_488_main() \n                        {\n                            vec4 Flowing_Image_Combination1555482451537_488_gl_FragColor = vec4(0.0);\n                            vec2 uv = Flowing_Image_Combination1555482451537_488_vUv.xy * resolution;\n                            vec4 texCol = vec4(texture2D(image1, uv));\n                            mat3 tfm;\n                            tfm[0] = vec3(texCol.z, 0.0, 0);\n                            tfm[1] = vec3(0.0, texCol.y, 0);\n                            tfm[2] = vec3(0, 0, 1.0);\n                            vec2 muv = (vec3(uv, 1.0) * tfm).xy + time * Flowing_Image_Combination1555482451537_488_speed;\n                            texCol = vec4(vec3(texture2D(image2, muv)) * Flowing_Image_Combination1555482451537_488_color, 1.0);\n                            Flowing_Image_Combination1555482451537_488_gl_FragColor = texCol;\n                            return Flowing_Image_Combination1555482451537_488_gl_FragColor *= 0.5;\n                        }\nvec4 Fresnel_Glow1555482451555_491_main(void) \n                        {\n                            vec4 Fresnel_Glow1555482451555_491_gl_FragColor = vec4(0.0);\n                            vec3 viewDirectionW = normalize(-fNormal);\n                            vec3 eye = normalize(-fPosition.xyz);\n                            float fresnelTerm = dot(eye, fNormal);\n                            fresnelTerm = rimWidth * clamp(fadeDistance - fresnelTerm, 0.0, 1.);\n                            Fresnel_Glow1555482451555_491_gl_FragColor = vec4(Fresnel_Glow1555482451555_491_color * fresnelTerm, 1.);\n                            return Fresnel_Glow1555482451555_491_gl_FragColor *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_FragColor = (Cloud_WIP1555482451489_482_main() + Vertical_2_Color_Graident1555482451525_485_main() + Flowing_Image_Combination1555482451537_488_main() + Fresnel_Glow1555482451555_491_main());                        }\n";
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        // blending: THREE.AdditiveBlending,
        // transparent: !0,
        // depthWrite: !1,
        // depthTest: !0,
        // side: THREE.DoubleSide,
        // fog: !0,
      });

      animate();
      function animate() {
        uniforms.time.value += 0.45;
        requestAnimationFrame(animate);
      }
      return meshMaterial;
    },
    //bloom??
    getGlowMaterial(color) {
      let glowShield = {
        //glow发光效果
        uniforms: {
          s: { type: "f", value: -1.0 },
          b: { type: "f", value: 1.0 },
          p: { type: "f", value: 2.0 },
          glowColor: { type: "c", value: new THREE.Color(color || 0xdb633f) },
        },
        vertexShaderSource: `
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main()
            {
                vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
                vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
      `,
        fragmentShaderSource: `
            uniform vec3 glowColor;
            uniform float b;
            uniform float p;
            uniform float s;
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main()
            {
                float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
                gl_FragColor = vec4( glowColor, a );
            }
      `,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: glowShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: glowShield.vertexShaderSource,
        fragmentShader: glowShield.fragmentShaderSource,
        // blending: THREE.NoBlending,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      return meshMaterial;
    },
    //结合arcline使用
    getLightningLineMaterial(opts = {}) {
      var LightningLineShield = {
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            map: {
              type: "t",
              value: null,
            },
            useMap: {
              type: "f",
              value: 0,
            },
            alphaMap: {
              type: "f",
              value: null,
            },
            useAlphaMap: {
              type: "f",
              value: 0,
            },
            resolution: {
              type: "v2",
              value: new THREE.Vector2(1920, 1808),
              //   value: new THREE.Vector2(
              //     this.viewer.box.clientWidth,
              //     this.viewer.box.clientHeight
              //   )
            },
            sizeAttenuation: {
              type: "f",
              value: 0,
            },
            near: {
              type: "f",
              value: 1,
            },
            far: {
              type: "f",
              value: 1,
            },
            dashArray: {
              type: "f",
              value: 0,
            },
            dashOffset: {
              type: "f",
              value: 0,
            },
            dashRatio: {
              type: "f",
              value: 0.5,
            },
            useDash: {
              type: "f",
              value: 0,
            },
            visibility: {
              type: "f",
              value: 1,
            },
            alphaTest: {
              type: "f",
              value: 0,
            },
            lineWidth: {
              type: "f",
              value: opts.lineWidth || 4,
            },
            color: {
              type: "c",
              value: new THREE.Color(opts.color || "#9999FF"),
            },
            opacity: {
              type: "f",
              value: opts.opacity || 1,
            },
            time: {
              type: "f",
              value: 0,
            },
          },
        ]),
        vertexShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  "
          .concat(THREE.ShaderChunk.logdepthbuf_pars_vertex, "\n  ")
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  attribute vec3 position;\n  attribute vec3 previous;\n  attribute vec3 next;\n  attribute float side;\n  attribute float width;\n  attribute vec2 uv;\n  attribute float counters;\n\n  uniform mat4 projectionMatrix;\n  uniform mat4 modelViewMatrix;\n  uniform vec2 resolution;\n  uniform float lineWidth;\n  uniform float near;\n  uniform float far;\n  uniform float sizeAttenuation;\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  vec2 fix( vec4 i, float aspect ) {\n    vec2 res = i.xy / i.w;\n    res.x *= aspect;\n    // vCounters = counters;\n    return res;\n  }\n  void main() {\n    float aspect = resolution.x / resolution.y;\n    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n    vUv = uv;\n\n    mat4 m = projectionMatrix * modelViewMatrix;\n    vec4 finalPosition = m * vec4( position, 1.0 );\n    vec4 prevPos = m * vec4( previous, 1.0 );\n    vec4 nextPos = m * vec4( next, 1.0 );\n\n    vec2 currentP = fix( finalPosition, aspect );\n    vec2 prevP = fix( prevPos, aspect );\n    vec2 nextP = fix( nextPos, aspect );\n\n    float pixelWidth = finalPosition.w * pixelWidthRatio;\n    float w = 1.8 * pixelWidth * lineWidth * width;\n\n    if( sizeAttenuation == 1. ) {\n      w = 1.8 * lineWidth * width;\n    }\n\n    vec2 dir;\n    if( nextP == currentP ) dir = normalize( currentP - prevP );\n    else if( prevP == currentP ) dir = normalize( nextP - currentP );\n    else {\n      vec2 dir1 = normalize( currentP - prevP );\n      vec2 dir2 = normalize( nextP - currentP );\n      dir = normalize( dir1 + dir2 );\n\n      vec2 perp = vec2( -dir1.y, dir1.x );\n      vec2 miter = vec2( -dir.y, dir.x );\n      //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n    }\n\n    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n    vec2 normal = vec2( -dir.y, dir.x );\n    normal.x /= aspect;\n    normal *= .5 * w;\n\n    vec4 offset = vec4( normal * side, 0.0, 1.0 );\n    finalPosition.xy += offset.xy;\n\n    gl_Position = finalPosition;\n    "
          )
          .concat(
            THREE.ShaderChunk.logdepthbuf_vertex,
            "\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  uniform float time;\n  uniform vec2 resolution;\n  uniform vec3 color;\n  uniform float opacity;\n  "
          .concat(THREE.ShaderChunk.common, "\n  ")
          .concat(
            THREE.ShaderChunk.fog_pars_fragment,
            "\n  varying vec2 vUv;\n\n  "
          )
          .concat(
            this.ky,
            "\n  /* skew constants for 3d simplex functions */\n  const float F3 =  0.3333333;\n  const float G3 =  0.1666667;\n\n  /* 3d simplex noise */\n  float simplex3d(vec3 p) {\n    /* 1. find current tetrahedron T and it's four vertices */\n    /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */\n    /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/\n\n    /* calculate s and x */\n    vec3 s = floor(p + dot(p, vec3(F3)));\n    vec3 x = p - s + dot(s, vec3(G3));\n\n    /* calculate i1 and i2 */\n    vec3 e = step(vec3(0.0), x - x.yzx);\n    vec3 i1 = e*(1.0 - e.zxy);\n    vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n\n    /* x1, x2, x3 */\n    vec3 x1 = x - i1 + G3;\n    vec3 x2 = x - i2 + 2.0*G3;\n    vec3 x3 = x - 1.0 + 3.0*G3;\n\n    /* 2. find four surflets and store them in d */\n    vec4 w, d;\n\n    /* calculate surflet weights */\n    w.x = dot(x, x);\n    w.y = dot(x1, x1);\n    w.z = dot(x2, x2);\n    w.w = dot(x3, x3);\n\n    /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */\n    w = max(0.6 - w, 0.0);\n\n    /* calculate surflet components */\n    d.x = dot(rands(s), x);\n    d.y = dot(rands(s + i1), x1);\n    d.z = dot(rands(s + i2), x2);\n    d.w = dot(rands(s + 1.0), x3);\n\n    /* multiply d by w^4 */\n    w *= w;\n    w *= w;\n    d *= w;\n\n    /* 3. return the sum of the four surflets */\n    return dot(d, vec4(52.0));\n  }\n\n  float noise(vec3 m) {\n      return   0.5333333*simplex3d(m)\n        +0.2666667*simplex3d(2.0*m)\n        +0.1333333*simplex3d(4.0*m)\n        +0.0666667*simplex3d(8.0*m);\n  }\n  void main(){\n    vec2 uv = vUv - 0.5;\n    vec2 p = gl_FragCoord.xy/resolution.x;\n    vec3 p3 = vec3(p, time*0.4);\n\n    float intensity = noise(vec3(p3*12.0+12.0));\n\n    float t = clamp((uv.x * -uv.x * 0.16) + 0.15, 0., 1.);\n    float y = abs(intensity * -t + uv.y * 0.5);\n\n    float g = pow(y, 0.2);\n\n    // vec3 col = vec3(1.70, 1.48, 1.78);\n    vec3 col = vec3(1.) * 1.7;\n    col = col * -g + col;\n    col = col * col;\n    col = col * col;\n\n    gl_FragColor = vec4(col * color, opacity);\n    "
          )
          .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n"),
      };
      var r = new THREE.RawShaderMaterial({
        uniforms: LightningLineShield.uniforms,
        vertexShader: LightningLineShield.vertexShaderSource,
        fragmentShader: LightningLineShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
        defines: {
          USE_FOG: !0,
        },
      });
      // animate();
      // function animate() {
      //   LightningLineShield.uniforms.time.value += 0.15;
      //   requestAnimationFrame(animate);
      // }
      return r;
    },
    getflowTrailLineMaterial(opts = {}) {
      var LightningLineShield = {
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            resolution: {
              type: "v2",
              value: new THREE.Vector2(1920, 1080),
            },
            lineWidth: {
              type: "f",
              value: opts.lineWidth,
            },
            color: {
              type: "c",
              value: new THREE.Color(opts.color),
            },
            time: {
              type: "f",
              value: 0,
            },
            color_end: {
              type: "c",
              value: new THREE.Color(opts.colorEnd),
            },
            trail_opacity: {
              type: "f",
              value: opts.trailOpacity,
            },
            num: {
              type: "f",
              value: opts.num,
            },
            percent: {
              type: "f",
              value: opts.percent,
            },
          },
        ]),
        vertexShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n\n  attribute vec3 facenormal;\n  varying vec2 vUv;\n  uniform float lineWidth;\n  uniform vec2 resolution;\n\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n\n  void main(void) {\n    vec4 pos=projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n    float pixelWidth = pos.w * pixelWidthRatio;\n    vUv=uv;\n    vec3 real_position=position+normalize(facenormal)*lineWidth*pixelWidth;\n    vec4 mvPosition = modelViewMatrix * vec4(real_position, 1.0);\n    gl_Position = projectionMatrix * mvPosition;\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  uniform float visibility;\n  uniform vec3 color;\n  uniform vec3 color_end;\n  uniform float lineWidth;\n  uniform float time;\n  uniform float trail_opacity;\n  uniform float num;\n  uniform float percent;\n\n  "
          .concat(THREE.ShaderChunk.common, "\n  ")
          .concat(
            THREE.ShaderChunk.fog_pars_fragment,
            "\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  void main() {\n    vec2 uv = vUv;\n    vec2 uv2 = uv;\n    uv.x *= num;\n    uv.x = mod(uv.x - time, 1.);\n    uv.x = uv.x * percent - (percent - 1.);\n\n    float trailOpacity = trail_opacity;\n    gl_FragColor = vec4(mix(color, color_end, uv2.x), trailOpacity);\n    if (uv.x > trailOpacity) {\n      gl_FragColor = vec4(mix(vec3(1., 1., 1.), gl_FragColor.rgb, 1.-uv.x), uv.x);\n    }\n\n    // gl_FragColor.a *= step(vCounters, visibility);\n    "
          )
          .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n"),
      };
      var r = new THREE.ShaderMaterial({
        uniforms: LightningLineShield.uniforms,
        vertexShader: LightningLineShield.vertexShaderSource,
        fragmentShader: LightningLineShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
        defines: {
          USE_FOG: !0,
        },
      });
      return r;
    },
    getLightBeamMaterial(opts = {}) {
      let shield = {
        //
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          type: {
            type: "f",
            value: opts.type || 1,
          },
          dir: {
            type: "f",
            value: opts.dir || 2,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#9999FF"),
          },
          map: {
            type: "t",
            value: null,
          },
        },
        vertexShaderSource: `
      uniform float time;
      uniform float type;
      varying vec2 vUv;
      varying float progress;\n
      void main(){
            vUv = uv;
            vec3 pos = position;
            if(type==4.0){
                progress = mod(time,20.0)/20.;
                pos.xz *= (progress + 0.2);
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }`,
        fragmentShaderSource: `
      uniform float time;
      uniform vec3 color;
      uniform float type;
      uniform float dir;
      uniform sampler2D map;
      varying vec2 vUv;
      varying float progress;\n\n
      float random (in vec2 _st) {
            return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
      }
      float noise (vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
      }
      vec2 hash22( vec2 p ){
            p = vec2( dot(p,vec2(127.1,311.7)),
                    dot(p,vec2(269.5,183.3)) );
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }
      float hash21(vec2 p){
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            //vec3 p3  = fract(vec3(p.xyx) * .1931);
            //p3 += dot(p3, p3.yzx + 19.19);
            //return fract((p3.x + p3.y) * p3.z);
      }
      float perlinNoise(vec2 p) {
            vec2 pi = floor(p);
          vec2 pf = fract(p);
          vec2 w = pf * pf * (3.0 - 2.0 * pf);
          return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)),
                         dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x),
                     mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)),
                         dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),
                     w.y);
    }
      #define NUM_OCTAVES 15
      float fbm (vec2 _st) {
            float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5),
                          -sin(0.5), cos(0.50));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
                v += a * noise(_st);
              _st = rot * _st * 2.0 + shift;
              a *= 0.5;
        }
          return v;
    }


      #define OCTAVES1 15
      float fbm1 (in vec2 st) {
            float value = 0.0;
          float amplitude = .5;
          float frequency = 0.;
          for (int i = 0; i < OCTAVES1; i++) {
                value += amplitude * noise(st);
              st *= 2.;
              amplitude *= .5;
        }
          return value;
    }\n
      const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );
      float fbm6( vec2 p ) {
            float f = 0.0;
          f += 0.500000*perlinNoise( p ); p = mtx*p*2.02;
          f += 0.250000*perlinNoise( p ); p = mtx*p*2.03;
          f += 0.125000*perlinNoise( p ); p = mtx*p*2.01;
          f += 0.062500*perlinNoise( p ); p = mtx*p*2.04;
          f += 0.031250*perlinNoise( p ); p = mtx*p*2.01;
          f += 0.015625*perlinNoise( p );
          return f/0.96875;
    }\n\n
      void main(){
            // if (vUv.y < 0.5) {
            //   discard;
            // }
            if(type ==0.0){
                float alpha;
              if(dir==0.0){
                    alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
            }else if(dir==1.0){
                    alpha = smoothstep(1.0,0.0,vUv.y + sin(time)* 0.1);
            }else if(dir==2.0){
                    alpha = smoothstep(0.7,0.05,(abs(vUv.y-0.5)+sin(time)* 0.1)/0.6);
            }else{
                    alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
            }
              gl_FragColor =  vec4(color,alpha);
        }else if(type==1.0){
                vec2 st = vUv ;
              float alpha;
              st += st * abs(fract(time) *0.01);
              vec3 color = vec3(color);
              if(dir==0.0){
                    alpha = smoothstep(0.0,1.0,vUv.y);
            }else if(dir==1.0){
                    alpha = smoothstep(1.0,0.0,vUv.y);
            }else if(dir==2.0){
                    alpha = smoothstep(0.9,0.05,abs(vUv.y - 0.5)/0.5);
            }else{
                    alpha = smoothstep(0.0,1.0,vUv.y);
            }\n
              vec2 q = vec2(0.);
              q.x = fbm( st + 0.05*time);
              q.y = fbm( st + vec2(1.0));
              vec2 r = vec2(0.);
              r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time * 0.3 );
              r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time * 0.3);
              float f = fbm(st+r);
              gl_FragColor = vec4((f*f*f + .6*f*f + .5*f)*color,alpha);\n\n
              // st = vec2((st.x +time/10.)/2.0,st.y);
              // color += fbm6(st*3.0);
              // gl_FragColor = vec4(color,alpha);
        }else if(type==2.0){
                vec3 color = vec3(color);
              float alpha;
              if(dir==0.0){
                    alpha = smoothstep(0.0,1.0,vUv.y);
            }else if(dir==1.0){
                    alpha = smoothstep(1.0,0.0,vUv.y);
            }else if(dir==2.0){
                    alpha = smoothstep(0.9,0.05,abs(vUv.y - 0.5)/0.5);
            }else{
                    alpha = smoothstep(0.0,1.0,vUv.y);
            }
              vec2 st = vUv;
              st = vec2(vUv.x,(vUv.y +time/20.)/2.0);
              color += fbm6(st*3.0);
              gl_FragColor = vec4(color,alpha);
        }else if(type==3.0){
                vec4 tex = texture2D( map,vec2(vUv.x,(vUv.y +fract(time/10.))/2.0));
              gl_FragColor =  tex;
        }else if(type==4.0){
                float alpha;
              if(dir==0.0){
                    alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
            }else if(dir==1.0){
                    alpha = smoothstep(1.0,0.0,vUv.y + sin(time)* 0.1);
            }else if(dir==2.0){
                    alpha = smoothstep(0.7,0.05,(abs(vUv.y-0.5)+sin(time)* 0.1)/0.6);
            }else if(dir==3.0){
                    // float alphax = smoothstep(1.0,0.0,progress);
                  // float alphax =1.2 -  sin(progress * 0.5 * 3.141592653589);
                  float alphax =1.0 -  pow(progress,3.0);
                  alpha = smoothstep(0.0,1.0,vUv.y);
                  alpha *= alphax;
            }
              gl_FragColor =  vec4(color,alpha);
        }
    }`,
      };
      let meshMaterial = new THREE.ShaderMaterial({
        uniforms: shield.uniforms,
        defaultAttributeValues: {},
        vertexShader: shield.vertexShaderSource,
        fragmentShader: shield.fragmentShaderSource,
        // blending: THREE.NoBlending,
        // blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !1,
        fog: !0,
      });
      animate();
      function animate() {
        shield.uniforms.time.value += 0.045;
        requestAnimationFrame(animate);
      }
      return meshMaterial;
    },
    getRunTextureMaterial(opts = {}) {
      let uniforms = {
        time: {
          //time+=0.0045
          type: "f",
          value: 0,
        },
        map: {
          type: "t",
          value: opts.texture,
        },
      };
      var vertexShaderSource =
        "\n        varying vec2 vUv;\n        varying vec3 pos;\n\n        void main(){\n            vUv = uv;\n            pos = position;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n    ";
      var fragmentShaderSource = `
        uniform float time;
        uniform sampler2D map;
        varying vec2 vUv;
        varying vec3 pos;
        void main(){
          vec4 texel = texture2D(map, vec2(abs(vUv.x),abs(vUv.y)));
          float h = mod(time,50.);
          // if(pos.y > h){
          //   discard;
          // }
          gl_FragColor = texel;
        }
      `;
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
      });

      // animate();
      // function animate() {
      //   uniforms.time.value += opts.speed || 0.5;
      //   requestAnimationFrame(animate);
      // }
      return material;
    },
    //跳动的网格 use
    getGridPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(this.jy, "\n\n  ")
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    vec2 uv2 = uv;\n\n    vec2 pos = vec2(0.0, 0.0);\n        \n    float dist = length(uv - pos);// * sin(3.141592 * time);\n    \n    float timing = time;\n    \n    float rippleRadius = timing;\n    \n    float diff = rippleRadius - dist;\n    \n    float func = sin(pi * diff);\n    \n    uv += uv * func * 0.1;\n    \n    float stripes = 10.0;\n    float thickness = 10.0;\n    float sharpness = 2.0;\n    vec2 a = sin(stripes * 0.5 * pi * uv - pi/2.0);\n    vec2 b = abs(a);\n    \n    vec3 colorS = vec3(0.0);\n    colorS += 1.0 * exp(-thickness * b.x * (0.8 + 0.5 * sin(pi * time)));\n    colorS += 1.0 * exp(-thickness * b.y);\n    colorS += 0.5 * exp(-(thickness/4.0) * sin(b.x));\n    colorS += 0.5 * exp(-(thickness/3.0) * b.y);\n    \n    float ddd = exp(-5.5 * clamp(pow(dist, 3.0), 0.0, 1.0));\n    \n    gl_FragColor = vec4(colorS * ddd * color, 1.0);\n\n    float dir = length(uv2);\n    float ratio = 0.25;\n    if (dir < ratio) {\n      gl_FragColor.a *= opacity;\n    } else {\n      gl_FragColor.a *= mix(opacity, 0., (dir - ratio) / (0.5 - ratio));\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });

      return material;
    },
    //动画雾化 use
    getFogPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource =
        "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  float snoise(vec3 uv, float res) {\n    const vec3 s = vec3(1e0, 1e2, 1e3);\n    \n    uv *= res;\n    \n    vec3 uv0 = floor(mod(uv, res))*s;\n    vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;\n    \n    vec3 f = fract(uv); f = f*f*(3.0-2.0*f);\n  \n    vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,\n                uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);\n  \n    vec4 r = fract(sin(v*1e-1)*1e3);\n    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);\n    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    return mix(r0, r1, f.z)*2.-1.;\n  }\n  \n  float noise(vec2 uv, float baseres) {\n    float n = 0.0;\n    for (int i = 0; i < 4; i++)\n    {\n        float v = pow(2.0, float(i));\n        n += (1.5 / v) * snoise(vec3(uv + vec2(1.,1.) * (float(i) / 17.), 1), v * baseres);\n    }\n    \n    \n    return clamp((1.0 - n) * .5, 0., 1.) * 2.0;\n  }\n\n  void main(void) {\n    vec2 uv = vUv;\n    \n    // Tweaking vars\n    vec4 color1 = vec4(0.125, 0.291, 0.923, 1.0);\n    vec4 leaving = vec4(color, 1.0);\n    float noise_sz = 10.0;\n    float speed = 0.4;\n    vec2 center = vec2(0.5, 0.5);\n    \n    float dc = 1. - (distance(uv, center) * 1.75);\n    float pdc = pow(dc, 3.5);\n    \n    vec2 dir = -normalize(uv - center) * speed;\n    \n    float phase0 = fract(time * 0.3 + 0.5);\n    float phase1 = fract(time * 0.3 + 0.0);\n    \n    vec2 uv0 = uv + phase0 * dir;\n    vec2 uv1 = uv + phase1 * dir;\n    \n    // Rotation\n    float as = pdc * sin(time * 0.9) * 1.2;\n    float ca = cos(as);\n    float sa = sin(as);\n    \n    mat2 rot;\n    rot[0] = vec2(ca, -sa);\n    rot[1] = vec2(sa, ca);\n    \n    uv0 = center + ((uv0 - center) * rot);\n    uv1 = center + ((uv1 - center) * rot);\n\n    // Samplings\n    float tex0 = max(noise(uv0, noise_sz), noise(uv0 * 1.2, noise_sz));\n    float tex1 = max(noise(uv1, noise_sz), noise(uv1 * 1.4, noise_sz));\n    \n    float lerp = abs((0.5 - phase0) / 0.5);\n    float samplings = mix(tex0, tex1, lerp);\n    \n    vec4 c = vec4(samplings, samplings, samplings, 1.0) * mix(color1, leaving, pdc) * pdc;\n    c += pow(dc, 16.0) * mix(color1, leaving, pow(dc, 16.0)) * 2.3;\n    \n    float cl = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);\n    \n    // Output to screen\n    gl_FragColor = vec4(c.rgb, cl * opacity);\n  }\n";
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //强调突出显示 转圈动画 use
    getEmphasizePulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  float sections = 3.0;\n  \n  bool belongs(float time, vec2 uv, float near, float far) {\n    near += sin(uv.x - time * 8.0) / 50.0;\n    far += cos(uv.y - time * 8.0) / 50.0;\n    vec2 center = vec2(0.5, 0.5);\n    vec2 xy = uv - center;\n    float dist = distance(xy, vec2(0.0, 0.0));\n    float angle = mod(atan(xy.y, xy.x) + time * 2.5 + sin(time * 4.0) / 1.0, PI * 2.0);\n    float oddity = mod(angle / (2.0 * PI) * sections * 2.0, 2.0);\n    if (dist > near && dist < far && floor(mod(oddity, 2.0)) == 0.0) {\n        return true;\n    } else {\n        return false;\n    }\n  }\n\n  void main() {\n    vec2 uv = vUv;\n\n    if (belongs(time, uv, 0.2, 0.25) || belongs(time + 0.5, uv, 0.3, 0.35) || belongs(time + 1.0, uv, 0.4, 0.45)) {\n      gl_FragColor = vec4(color, 1.0);\n    } else {\n      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //交替旋转轮盘动画 use 背景色待去除
    getAlternateCurtainPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  #extension GL_OES_standard_derivatives : enable\n\n  precision lowp float;\n  precision lowp int;\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n  \n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  float smoothing = 1.0 / 256.0;\n  \n  float Union(float a, float b) {\n    return min(a, b);\n  }\n  \n  float Substraction(float a, float b) {\n      return max(a,-b);\n  }\n  \n  float Intersection(float a, float b) {\n      return max(a,b);\n  }\n  \n  float Circle(vec2 p, float r) {\n    return length(p) - r;\n  }\n  \n  float SDF(vec2 p) {\n      float t = 4.0 * (5.0 * time + 1.0 * sin(5.0 * time));\n      float dt = 1.0 + 1.0 * cos(5.0 * time);\n      \n      float sm = clamp(1.5 * cos(2.5 * time), -1.0, 1.0);\n      \n      float a = atan(p.y, p.x);\n      float segmentA =  sin(a * 12.0 + t) * 0.1 + 0.07;\n      float segmentB = -sin(a * 12.0 - t) * 0.1 + 0.07;\n      \n      float ringASize = 0.4 + sm * 0.1;\n      float ringBSize = 0.4 - sm * 0.1;\n      float width = 0.5;\n      \n      float bigCircleA = Circle(p, ringASize + ringASize * width);\n      \n      float smallCircleA = Circle(p, ringASize);\n      \n      float bigCircleB = Circle(p, ringBSize + ringBSize * width);\n      \n      float smallCircleB = Circle(p, ringBSize);\n      \n      float ringA = Substraction(bigCircleA, smallCircleA);\n      float ringB = Substraction(bigCircleB, smallCircleB);\n      \n      return Union(Intersection(ringA, segmentA), Intersection(ringB, segmentB));\n  }\n  \n  float Render(vec2 p) {\n      float dist = SDF(p);\n      return smoothstep(0.0, smoothing, -dist);\n  }\n\n  void main(void) {\n    vec2 uv = vUv - 0.5;\n    vec3 colorB = vec3(1., 0., 0.);\n    float alpha = Render(uv * 1.48);\n    vec3 col = mix(colorB, color, alpha);\n    gl_FragColor = vec4(col, 1.0);\n    "
          // "\n\n  float smoothing = 1.0 / 256.0;\n  \n  float Union(float a, float b) {\n    return min(a, b);\n  }\n  \n  float Substraction(float a, float b) {\n      return max(a,-b);\n  }\n  \n  float Intersection(float a, float b) {\n      return max(a,b);\n  }\n  \n  float Circle(vec2 p, float r) {\n    return length(p) - r;\n  }\n  \n  float SDF(vec2 p) {\n      float t = 4.0 * (5.0 * time + 1.0 * sin(5.0 * time));\n      float dt = 1.0 + 1.0 * cos(5.0 * time);\n      \n      float sm = clamp(1.5 * cos(2.5 * time), -1.0, 1.0);\n      \n      float a = atan(p.y, p.x);\n      float segmentA =  sin(a * 12.0 + t) * 0.1 + 0.07;\n      float segmentB = -sin(a * 12.0 - t) * 0.1 + 0.07;\n      \n      float ringASize = 0.4 + sm * 0.1;\n      float ringBSize = 0.4 - sm * 0.1;\n      float width = 0.5;\n      \n      float bigCircleA = Circle(p, ringASize + ringASize * width);\n      \n      float smallCircleA = Circle(p, ringASize);\n      \n      float bigCircleB = Circle(p, ringBSize + ringBSize * width);\n      \n      float smallCircleB = Circle(p, ringBSize);\n      \n      float ringA = Substraction(bigCircleA, smallCircleA);\n      float ringB = Substraction(bigCircleB, smallCircleB);\n      \n      return Union(Intersection(ringA, segmentA), Intersection(ringB, segmentB));\n  }\n  \n  float Render(vec2 p) {\n      float dist = SDF(p);\n      return smoothstep(0.0, smoothing, -dist);\n  }\n\n  void main(void) {\n    vec2 uv = vUv - 0.5;\n    vec3 colorB = vec3(0., 0., 0.);\n    float alpha = Render(uv * 1.48);\n    vec3 col = mix(colorB, color, alpha);\n    gl_FragColor = vec4(col, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //伽马射线 黑色背景待去除 use vertexShaderSource 不同
    getGammaCurtainPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision highp float;\n  precision highp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision highp float;\n  precision highp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  #define ray_brightness 22.\n  #define gamma 1.6\n  #define ray_density 18.5\n  #define curvature 18.\n\n  #define SIZE 0.2\n\n  "
        .concat(this.Iy, "\n  \n  ")
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  float noise(vec2 p){\n    vec2 ip = floor(p);\n    vec2 u = fract(p);\n    u = u*u*(3.0-2.0*u);\n    \n    float res = mix(\n      mix(rands(ip),rands(ip+vec2(1.0,0.0)),u.x),\n      mix(rands(ip+vec2(0.0,1.0)),rands(ip+vec2(1.0,1.0)),u.x),u.y);\n    return res*res;\n  }\n  \n  // FLARING GENERATOR, A.K.A PURE AWESOME\n  mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );\n  float fbm( in vec2 p ) {\n    float z=8.;       // EDIT THIS TO MODIFY THE INTENSITY OF RAYS\n    float rz = -0.08; // EDIT THIS TO MODIFY THE LENGTH OF RAYS\n    p *= 0.425;        // EDIT THIS TO MODIFY THE FREQUENCY OF RAYS\n    for (int i= 1; i < 6; i++)\n    {\n      rz+= abs((noise(p)-0.5)*2.)/z;\n      z = z*2.;\n      p = p*2.*m2;\n    }\n    return rz;\n  }\n  void main() {\n    float t = -time*.33; \n    vec2 uv = vUv - 0.5;\n    uv*= curvature* SIZE;\n    \n    float r = sqrt(dot(uv,uv)); // DISTANCE FROM CENTER, A.K.A CIRCLE\n    float x = dot(normalize(uv), vec2(.5,0.))+t;\n    float y = dot(normalize(uv), vec2(.0,.5))+t;\n   \n          float val=0.0;\n          val = fbm(vec2(r+ y * ray_density, r+ x * ray_density)); // GENERATES THE FLARING\n    val = smoothstep(gamma*.02-.1,ray_brightness+(gamma*0.02-.1)+.001,val);\n    val = sqrt(val); // WE DON'T REALLY NEED SQRT HERE, CHANGE TO 15. * val FOR PERFORMANCE\n    \n    vec3 col =  val/ color;\n    col = 1.-col; // WE DO NOT NEED TO CLAMP THIS LIKE THE NIMITZ SHADER DOES!\n          float rad= 35. ; // MODIFY THIS TO CHANGE THE RADIUS OF THE SUNS CENTER\n    col = mix(col,vec3(1.), rad - 266.667 * r); // REMOVE THIS TO SEE THE FLARING\n    // for glslsandbox pic-frame visibility... gigatron\n    vec4 cfinal =  mix(vec4(col,1.0),vec4(0.0,0.0,.0,1.0),0.05);\n    // cfinal.rgb *= color;\n    cfinal.a *= opacity;\n    \n    gl_FragColor = vec4(cfinal);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    // 向四周放射效果动画 use
    getDropPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(THREE.ShaderChunk.fog_pars_fragment, "\n\n\n  ")
        .concat(
          this.jy,
          "\n\n  float vDrop(vec2 uv,float t) {\n    uv.x = uv.x*50.0;\n    float dx = fract(uv.x);\n    uv.x = floor(uv.x);\n    uv.y *= 0.05;\n    float o=sin(uv.x*215.4);\n    float s=cos(uv.x*33.1)*.3 +.7;\n    float trail = mix(95.0,35.0,s);\n    float yv = fract(uv.y + t*s + o) * trail;\n    yv = 1.0/yv;\n    yv = smoothstep(0.0,1.0,yv*yv);\n    yv = sin(yv*pi)*(s*5.0);\n    float d2 = sin(dx*pi);\n    return yv*(d2*d2);\n  }\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float d = length(uv)+0.5;\n    uv = vec2(atan(uv.x, uv.y) / pi, 2.5 / d);\n    float t =  time*0.4;\n    vec3 col = vec3(1.,1.,1.) * vDrop(uv,t);\n    gl_FragColor = vec4(col*(d*d), mix(opacity, -0.6, d - 0.5));\n    gl_FragColor.rgb *= color;\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //flower 花朵动画 nice useful
    getFlowerPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n\n  uniform vec3 color;\n  uniform float time;\n  uniform float opacity;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  /**/ // 215 chars   - with tomkh's help\n  #define d  gl_FragColor += .1*(1.+cos(A= 2.33*a + time)) / length(vec2( fract(a*8.)-.5, 32.*length(uv)-3.2*sin(A)-8.)); a += 6.3;\n  \n  void main() {\n    vec2 uv = vUv - 0.5;\n\n    float a = atan(uv.y,uv.x), A;\n    gl_FragColor -= gl_FragColor;\n    d d d\n    gl_FragColor.rgb *= color;\n    gl_FragColor.a *= opacity;\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //龙卷风 useful nice
    getTornadoPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(THREE.ShaderChunk.fog_pars_fragment, "\n\n  ")
        .concat(
          this.jy,
          "\n  #define INF 1e10\n  #define EPS 1e-10\n  #define ITER_MAX 10000\n\n  float crs(vec2 v1, vec2 v2) {\n    return v1.x*v2.y - v1.y*v2.x;\n  }\n\n  vec2 rotate(vec2 p, float rad) {\n      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad)) * p;\n  }\n\n  float smin(float a, float b, float k) {\n      float res = exp(-k*a) + exp(-k*b);\n      return -log(res)/k;\n  }\n\n  float ellipse(vec2 p, vec2 r) {\n      return (length(p/r) - 1.0) * min(r.x, r.y);\n  }\n\n  float line(vec2 p, vec2 v1, vec2 v2) {\n      p  -= v1;\n      vec2 v = v2-v1;\n      float t = dot(p, normalize(v));\n      if (t<0.0) {\n          return length(p);\n      } else if (t>length(v)) {\n          return length(p-v);\n      } else {\n          return abs(crs(p, normalize(v)));\n      }\n  }\n\n  bool innerTriangle(vec2 p, vec2 v1, vec2 v2, vec2 v3) {\n      float c1 = crs(v2-v1, p-v1);\n      float c2 = crs(v3-v2, p-v2);\n      float c3 = crs(v1-v3, p-v3);\n      return (c1>0.0&&c2>0.0&&c3>0.0) || (c1<0.0&&c2<0.0&&c3<0.0);\n  }\n\n  float StarPolygon(vec2 p, int n, int m, float r) {\n      float d = INF;\n      for (int i=0; i<ITER_MAX; i++) {\n          if (i >= n) break;\n          \n          float rad1 = 2.0*pi*float(i)/float(n);\n          float rad2 = 2.0*pi*float(i+m)/float(n);\n          vec2 v1 = vec2(cos(rad1), sin(rad1)) * r;\n          vec2 v2 = vec2(cos(rad2), sin(rad2)) * r;\n          bool flg = innerTriangle(p, vec2(0.0), v1, v2);\n          d = min(d, line(p, v1, v2) * (flg?-1.0:1.0));\n      }\n      return d;\n  }\n\n  vec3 calc(vec2 p) {\n      float t = time;\n      float r = (sin(t*pi)+1.0) * 0.2 + EPS;\n      p = rotate(p, (length(p) * 2.0 - t*2.0)*pi);\n      float d1 = StarPolygon(p, 5, 2, r);\n      float d2 = ellipse(p, vec2(0.01));\n      float d = smin(d1, d2, 5.5);\n      return vec3(pow(clamp(1.0-d, 0.0, INF), 5.0)) * color;\n  }\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n    gl_FragColor = vec4(calc(uv), 1.);\n    float ratio = 0.25;\n    if (dir < ratio) {\n      gl_FragColor.a = opacity;\n    } else {\n      gl_FragColor.a = mix(opacity, 0., (dir - ratio) / (0.5 - ratio));\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //旋涡  useful nice
    getVortexPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  #define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))\n  void main() {\n    vec2 uv = vUv - 0.5;\n    vec2 uv2 = uv;\n    uv *= rot(0.5 / length(uv) + time);\n    uv = log(abs(uv));\n    gl_FragColor = vec4(0.5 / length(0.5 * uv + 1.) / log(10. + time));\n    gl_FragColor.rgb *= color;\n\n    float dir = length(uv2);\n    float ratio = 0.25;\n    if (dir < ratio) {\n      gl_FragColor.a *= opacity;\n    } else {\n      gl_FragColor.a *= mix(opacity, 0., (dir - ratio) / (0.5 - ratio));\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //呼吸光圈 use
    getCircleBreathPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n\n    float speed = 3.0,\n          time2 = time * speed,\n          radius = 0.4 + 0.04 * sin(time2),\n          thickness = 0.07 + 0.05 * cos(time2);\n    gl_FragColor = vec4(smoothstep(thickness/2., 0., abs(dir-radius))) * vec4(color, opacity);\n  \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //扩散的圆圈光点 useful
    getDotPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n\n    vec2 gv = uv * 36.0;\n    gv = fract(gv) - 0.5;\n\n    float s = (sin(time - length(uv * 2.0) * 18.0) * 0.4 + 0.5) * 0.6;\n    float m = smoothstep(s, s - 0.05, length(gv)) + s*2.0;\n\n    vec3 col = color.rgb * m;\n\n    gl_FragColor = vec4(col, opacity * (0.5 - dir) * 2.);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //同 getRingEffectMaterial 扩散圆环
    getRipplePulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 _uv = vUv * (3. + sin(time / 20.));\n    _uv.x += sin(time / 200.0) * 30.;\n    float len = length(vUv - 0.5);\n    float field = len + 0.05 * (-1.0 * time / 5.);\n    float ripple = smoothstep(0., 0.5, sin(field * 150.0));\n    ripple = sin(field * 55.0) * 0.5 + 0.3;\n    ripple *= smoothstep(0.5, 0.75, clamp(1. - len * 1.5, 0.0, 1.0));\n    gl_FragColor = vec4(color, ripple * opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //呼吸放大光圈 use
    getBreathPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n    \n    float r = dir*.85;\n    r = r*2.-1.;\n    float s = sin(pow(r+1., 2.)-time*3.+sin(r*.8))*sin(r+.99);\n    vec3 col = color;\n    col *= (abs(1./(s*60.8))-.01);\n    gl_FragColor = vec4(col, 1.);\n    \n    float ratio = 0.25;\n    if (dir < ratio) {\n      gl_FragColor.a = opacity;\n    } else {\n      gl_FragColor.a = mix(opacity, 0., (dir - ratio) / (0.5 - ratio));\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //旋转旋涡 use
    getRotatePulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(THREE.ShaderChunk.fog_pars_fragment, "\n\n  ")
        .concat(
          this.jy,
          "\n\n  vec2 rotate2D (vec2 _st, float _angle) {\n    _st = mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)) * _st;\n    return _st;\n  }\n  void main() {\n    vec2 uv = vUv - 0.5;\n    uv *= 1.6;\n    vec3 col = color;\n    float r = length(uv);\n    float w = .3;\n    uv = rotate2D(uv,(r*pi*6.-time*2.));\n    col *= smoothstep(-w,.0,uv.x)*smoothstep(w,.0,uv.x);\n    col *= abs(1./(sin(pow(r,2.)*2.-time*1.3)*6.))*.4;\n    gl_FragColor = vec4(col, mix(opacity, 0., length(uv)));\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    // 呼吸放大光点
    getHeartBeatPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n\n    float r = 0.6;\n    float omega = 5.;\n    vec3 col = mix(color, vec3(0., 0., 0.), 1. - (r * (cos(omega * time) + 2.) / 2. - length(uv)));\n    gl_FragColor = vec4(col * r / 8. / dir, 1.);\n\n    float ratio = 0.25;\n    if (dir < ratio) {\n      gl_FragColor.a = opacity;\n    } else {\n      gl_FragColor.a = mix(opacity, 0., (dir - ratio) / (0.5 - ratio));\n    }\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //扩散渐变圆圈
    getRadialPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  vec4 circle(vec2 uv, float rad) {\n    float d = length(uv) - rad;\n    float t = 1.0 - clamp(d, 0.0, 1.0);\n    t = step(1., t);\n    float dist = (rad) - length(uv);\n    dist = clamp(dist * 1.35, 0.0, 1.0);\n    t -= dist;\n    return vec4(t);\n  }\n  void main() {\n    vec2 uv = vUv - 0.5;\n\n    float f_time = fract(time * 0.5);\n\n    float radius = f_time * 0.7;\n    vec4 col = circle(uv, radius);\n    col *= 1.0 - f_time;\n\n    gl_FragColor = col * vec4(color, opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //光点向中心聚集 同getDropPulseMaterial相反 use
    getDotGatherPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource =
        "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  #define E3_COUNT 40\n  #define E3_RADIUS 0.07\n  #define E3_RADIUS2 2.0\n\n  mat3 rotateX(float a) {\n      float sx = sin(a), cx = cos(a);\n      return mat3(vec3(1.0,0.0,0.0),vec3(0.0,cx,sx),vec3(0.0,-sx,cx));\n  }\n\n  mat3 rotateY(float a) {\n      float sy = sin(a), cy = cos(a);\n      return mat3(vec3(cy,0.0,-sy),vec3(0.0,1.0,0.0),vec3(sy,0.0,cy));\n  }\n\n  vec3 noisepos(int seed) {\n      return vec3(fract(5147.4235*sin(vec3(55.123,43.45,16.123) + vec3(float(seed)*0.012345)))) - 0.5;\n  }\n\n  float hash(float a) {\n      return fract(5147.4235*sin(a*0.012345));\n  }\n\n  // dot particles\n  vec4 effect3( vec3 pos, vec3 ray, float time, int seed ) {\n    float a = 0.0;\n    \n    vec3 npp = normalize(pos);\n    \n    for (int i=0; i<E3_COUNT;i++) {\n      float tm = time*1.0 - hash(float(i+seed));\n      int s=int(floor(tm));\n      float io = fract(tm);\n      vec3 np = normalize(noisepos(i + seed + s*E3_COUNT));\n      vec3 p = np * sqrt(1.0-io)*E3_RADIUS2 - pos;\n        \n      float ad=0.0;\n      for (int k=0;k<11;k++){\n        p += np*0.03;\n        float rl = 1.0/dot(ray,normalize(p));\n        rl = (sqrt(rl*rl - 1.0));\n        ad += (1.0 - clamp(rl * length(p) / E3_RADIUS,0.0,1.0))*abs(6.0-float(5-k))*0.03 * io;\n      }\n      a += ad*ad;\n    }\n    \n    return vec4(a*a,a*a,a,1);\n  }\n\n  void main(void) {\n    vec2 p = vUv - 0.5;\n    float dir = length(p);\n\n    // Ray, position and rotation\n    float mx = 0.;\n    float my = time*0.025;\n    mat3 imr = rotateX(mx) * rotateY(-my);\n    vec3 ray = normalize(vec3(p,2.0))*imr;\n    vec3 pos = vec3(0.0,0.0,-3.0)*imr;\n\n    // Output to screen\n    float a = 0.0;\n    \n    gl_FragColor = effect3(pos,ray,time,0)*clamp(time*0.25,0.0,1.0);\n    gl_FragColor.rgb *= color;\n    gl_FragColor.a *= opacity * (0.7 - dir) * 2.;\n  }\n";
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //扩散光带/圈 中间黑色待去除
    getLightBandPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  #extension GL_OES_standard_derivatives : enable\n  precision lowp float;\n  precision lowp float;\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(THREE.ShaderChunk.fog_pars_fragment, "\n\n  ")
        .concat(this.Iy, "\n  ")
        .concat(
          this.Oy,
          "\n\n  float worley( vec2 p, float timeSpeed ) {\n    float d = 10.0;\n    for( int xo = -1; xo <= 1; xo++ )\n    {\n      for( int yo = -1; yo <= 1; yo++ )\n        {\n        vec2 test_cell = floor(p) + vec2( xo, yo );\n        \n        float f1 = rands( test_cell );\n        float f2 = rands( test_cell + vec2(1.0,83.0) );\n        \n        float xp = mix( f1, f2, sin(f1*time*timeSpeed) );\n        float yp = mix( f1, f2, cos(f2*time*timeSpeed) );\n        \n        vec2 c = test_cell + vec2(xp,yp);\n        \n        vec2 cTop = p - c;\n        d = min( d, dot(cTop,cTop) );\n      }\n    }\n    return d;\n  }\n  \n  float pass( vec2 uv, float timeSpeed ) {\n    float t = worley( gl_FragCoord.xy * 0.05, timeSpeed );\n    t = pow(t, 2.0 );\n    \n    return t;\n  }\n  \n  float mask( vec2 uv ) {\n    float radius = fract(time * 0.4) * 7.0 - 1.0;\n    float t = abs(radius - dot(uv, uv));\n    t = (0.4 - t) * 2.0;\n    t = clamp(t, 0.1, 1.0);\n    t = pow(t, 3.0) * 2.0;\n    t = t * (1.0 - clamp(radius * 0.2, 0.0, 1.0));\n    return t;\n  }\n\n  void main(void) {\n    vec2 uv = vUv - 0.5;\n    float dir = length(uv);\n\n    float t = pass( uv, 6.0 );\n    vec3 finalColor = vec3(pow(t, 2.0), t, sqrt(t * 1.0) );\n    \n    t = mask(uv*2.0);\n    finalColor *= vec3(t * 4.0);\n    float gray = getGray(finalColor);\n    \n    gl_FragColor = vec4( vec3(gray) * color, opacity * (0.5 - dir) * 3. );\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //帷幕 比较丑 less use
    getLightCurtainPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  #extension GL_OES_standard_derivatives : enable\n\n  precision lowp float;\n  precision lowp int;\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  #define HorizontalAmplitude 0.30\n  #define VerticleAmplitude 0.20\n  #define HorizontalSpeed 0.90\n  #define VerticleSpeed 1.50\n  #define ParticleMinSize 1.76\n  #define ParticleMaxSize 1.61\n  #define ParticleBreathingSpeed 0.30\n  #define ParticleColorChangeSpeed 0.70\n  #define ParticleCount 3.0\n  #define ParticleColor1 vec3(9.0, 5.0, 3.0)\n  #define ParticleColor2 vec3(1.0, 3.0, 9.0)\n  float hash( float x ) {\n      return fract( sin( x ) * 43758.5453 );\n  }\n  \n  float noise( vec2 uv ) {\n    vec3 x = vec3( uv.xy, 0.0 );\n    \n    vec3 p = floor( x );\n    vec3 f = fract( x );\n    \n    f = f*f*(3.0 - 2.0*f);\n    \n    float offset = 57.0;\n    \n    float n = dot( p, vec3(1.0, offset, offset*2.0) );\n    \n    return mix( mix( mix( hash( n + 0.0 ), hash( n + 1.0 ), f.x ),\n                mix( hash( n + offset), hash( n + offset+1.0), f.x ), f.y ),\n        mix( mix( hash( n + offset*2.0), hash( n + offset*2.0+1.0), f.x),\n                      mix( hash( n + offset*3.0), hash( n + offset*3.0+1.0), f.x), f.y), f.z);\n  }\n  \n  float snoise( vec2 uv ) {\n    return noise( uv ) * 2.0 - 1.0;\n  }\n  \n  \n  float perlinNoise( vec2 uv ) {   \n    float n =   noise( uv * 1.0 )  * 128.0 +\n      noise( uv * 2.0 )  * 64.0 +\n      noise( uv * 4.0 )  * 32.0 +\n      noise( uv * 8.0 )  * 16.0 +\n      noise( uv * 16.0 )  * 8.0 +\n      noise( uv * 32.0 )  * 4.0 +\n      noise( uv * 64.0 )  * 2.0 +\n      noise( uv * 128.0 ) * 1.0;\n    \n    float noiseVal = n / ( 1.0 + 2.0 + 4.0 + 8.0 + 16.0 + 32.0 + 64.0 + 128.0 );\n    noiseVal = abs(noiseVal * 2.0 - 1.0);\n  \n    return  noiseVal;\n  }\n  \n  float fBm( vec2 uv, float lacunarity, float gain ) {\n    float sum = 0.0;\n    float amp = 10.0;\n    \n    for( int i = 0; i < 2; ++i ) {\n        sum += ( perlinNoise( uv ) ) * amp;\n        amp *= gain;\n        uv *= lacunarity;\n    }\n    \n    return sum;\n  }\n  \n  vec3 particles( vec2 pos ) {\n    vec3 c = vec3( 0, 0, 0 );\n    \n    float noiseFactor = fBm( pos, 0.01, 0.1);\n    \n    for( float i = 1.0; i < ParticleCount+1.0; ++i ) {\n      float cs = cos( time * HorizontalSpeed * (i/ParticleCount) + noiseFactor ) * HorizontalAmplitude;\n      float ss = sin( time * VerticleSpeed   * (i/ParticleCount) + noiseFactor ) * VerticleAmplitude;\n      vec2 origin = vec2( cs , ss );\n      \n      float t = sin( time * ParticleBreathingSpeed * i ) * 0.5 + 0.5;\n      float particleSize = mix( ParticleMinSize, ParticleMaxSize, t );\n      float d = clamp( sin( length( pos - origin )  + particleSize ), 0.0, particleSize);\n      \n      float t2 = sin( ParticleColorChangeSpeed * i ) * 0.5 + 0.5;\n      vec3 color = mix( ParticleColor1, ParticleColor2, t2 );\n      c += color * pow( d, 70.0 );\n    }\n    \n    return c;\n  }\n\n  void main( void )  {\n    vec2 uv = vUv - 0.5;\n    vec3 finalColor = particles( uv );\n    gl_FragColor = vec4( finalColor * color, opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //喷射 pause use
    getFountainPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
          noise: {
            type: "t",
            value: opts.noise,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  #define SEED 0.12345679\n  #define GRAV vec2(0.,-.0)\n  #define SIZE 0.024\n  #define DIE_TIME 0.9\n  #define PARTICLE_COUNT 100.0\n  #define PI 3.14159265359\n\n  float particle(vec2 uv, float identifier, vec2 anchor, vec2 velocity, float creationTime) {\n    float particleTime = max(0., time - creationTime);\n\n    float size = max(0., DIE_TIME - particleTime) * SIZE;\n\n    vec2 velocityOffset = velocity * particleTime;\n    vec2 gravityOffset = GRAV * pow(particleTime, 1.798);\n    \n    vec2 point = anchor + velocityOffset + gravityOffset;\n    \n    float dist = distance(uv, point);\n    float hit = smoothstep(size, 0., dist);\n    \n    return hit;\n  }\n\n  void main() {\n    vec2 uv = vUv;\n    vec3 col = vec3(0.);\n\n    for (float i = 0.0; i < PARTICLE_COUNT; i++) {\n      float seed = SEED + floor(i / PARTICLE_COUNT + time);\n\n      vec2 anchor = vec2(0.5, 0.3);\n      vec2 velocity = vec2(mix(-.5, .5, rand(vec2(seed, i))), mix(-.5, .5, rand(vec2(i, seed) / 3.)));\n      \n      float creationTime = time - fract(i / PARTICLE_COUNT + time);\n      \n      col += particle(uv, 0., anchor, velocity, creationTime) * color;\n    }\n\n    col = smoothstep(.6, .9, col);\n\n    \n    gl_FragColor = vec4(col, 1.);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    // 圆圈烟雾
    getSmokePulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision highp float;\n  precision highp int;\n  varying vec2 vUv;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(THREE.ShaderChunk.fog_pars_fragment, "\n\n  ")
        .concat(this.jy, "\n  ")
        .concat(
          this.Iy,
          "\n\n  float noise(vec2 n) {\n    const vec2 d = vec2(0.0, 1.0);\n    vec2 b = floor(n);\n    vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n    return mix(mix(rands(b), rands(b+d.yx), f.x), mix(rands(b + d.xy), rands(b + d.yy), f.x), f.y);\n  }\n  vec3 ramp(float t) {\n    return t <= .5 ? vec3(1. - t * 1.4, .2, 1.05) / t : vec3(.3 * (1.-t) * 2., .2,1.05)/t;\n  }\n  vec2 polarMap(vec2 uv, float shift, float inner) {\n    uv = vec2(0.5) - uv;\n    float px = 1.0 - fract(atan(uv.y, uv.x) / 8.28 + 0.25) + shift;\n    float py = (sqrt(uv.x  * uv.x + uv.y * uv.y) * (1.0 + inner * 2.0)-inner)*2.0;\n\n    return vec2(px, py);\n  }\n  float fire(vec2 n) {\n    return noise(n) + noise(n * 2.1)* 0.6 + noise(n * 5.4) * 0.42;\n  }\n  float shade(vec2 uv, float t) {\n    uv.x += uv.y < 0.5 ? 23.0 + t *0.035 : -11.0 + t*0.03;\n    //uv.y = abs(uv.y - 0.5);\n    uv.y = abs(uv.y +2.5);\n    uv.x *= 35.0;\n\n    float q = fire(uv - t * 0.013) / 2.0;\n    vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));\n\n    return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);\n  }\n  vec3 colors(float grad) {\n    float m2 = 2.4;\n    grad = sqrt(grad);\n    vec3 color = vec3(1.0 / (pow(vec3(1., 1., 1.) + 2.61, vec3(2.0))));\n    color = ramp(grad);\n    color /= (m2 + max(vec3(0), color));\n\n    return color;\n  }\n  void main() {\n    float m1 = 2.;\n    float t = time;\n    vec2 uv = vUv;\n    float ff = 1.0 - uv.y;\n    vec2 uv2 = uv;\n    uv2.y = 1.0 - uv2.y;\n    uv = polarMap(uv, 1.3, m1);\n    uv2 = polarMap(uv2, 1.9, m1);\n\n    vec3 c1 = colors(shade(uv, t)) * ff;\n    vec3 c2 = colors(shade(uv2, t)) * (1.0 - ff);\n    gl_FragColor = vec4((c1 + c2) * color, opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        // side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    //波浪
    getWavePulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  void main() {\n    vec2 p = vUv - 0.5;\n    p *= 5.;\n    float a = atan(p.y, p.x);\n    float r = 1.5;\n    float wr = 0.1;\n    float wn = 11.;\n    float ws = 1.;\n    float c = length(p) - r - wr * sin(wn * a - ws * time) + wr * sin(20. * a - 10.*time);\n    c = 0.1 / abs(c);\n    gl_FragColor = vec4(c * color, opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        // side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    getBloomPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision highp float;\n  precision highp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n  \n  float snoise(vec3 uv, float res) {\n    const vec3 s = vec3(1e0, 1e2, 1e3);\n    \n    uv *= res;\n    \n    vec3 uv0 = floor(mod(uv, res)) * s;\n    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * s;\n    \n    vec3 f = smoothstep(0.0, 1.0, fract(uv));\n  \n    vec4 v = vec4(uv0.x + uv0.y + uv0.z,\n            uv1.x + uv0.y + uv0.z,\n            uv0.x + uv1.y + uv0.z,\n            uv1.x + uv1.y + uv0.z);\n  \n    vec4 r = fract(sin(v * 1e-1) * 1e3);\n    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);\n    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    return mix(r0, r1, f.z) * 2.0 - 1.0;\n  }\n  void main() {\n    vec2 p = vUv - 0.5;\n    float lp = length(p);\n\n    float colorRatio = 3.0 - (6.0 * lp);\n\n    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5, 0.4 * lp, 0.5);\n    \n    float power = 1.0;\n    for (int i = 0; i < 6; i++) {\n      power *= 2.0;\n      colorRatio += (1.5 / power) * snoise(coord + vec3(0.0, -0.05 * time*2.0, 0.01 * time*2.0), 16.0 * power);\n    }\n    colorRatio = max(colorRatio, 0.0);\n    float c2 = colorRatio * colorRatio;\n    float c3 = colorRatio * c2;\n    vec3 fc = vec3(colorRatio * color.r, c2*color.g, c3*color.b);\n    float f = fract(time);\n    fc *= smoothstep(f-0.1, f, length(p)) - smoothstep(f, f+0.1, length(p));\n    gl_FragColor = vec4(fc , opacity);\n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        // side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
    getSpillPulseMaterial(opts = {}) {
      let uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color(opts.color || "#EDD464"),
          },
          opacity: {
            type: "f",
            value: opts.opacity || 0.9,
          },
        },
      ]);
      var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      var fragmentShaderSource = "\n  precision highp float;\n  precision highp int;\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  varying vec2 vUv;\n\n  "
        .concat(THREE.ShaderChunk.common, "\n  ")
        .concat(
          THREE.ShaderChunk.fog_pars_fragment,
          "\n\n  float snoise(vec3 uv, float res) {\n    const vec3 s = vec3(1e0, 1e2, 1e3);\n    \n    uv *= res;\n    \n    vec3 uv0 = floor(mod(uv, res)) * s;\n    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * s;\n    \n    vec3 f = smoothstep(0.0, 1.0, fract(uv));\n  \n    vec4 v = vec4(uv0.x + uv0.y + uv0.z,\n            uv1.x + uv0.y + uv0.z,\n            uv0.x + uv1.y + uv0.z,\n            uv1.x + uv1.y + uv0.z);\n  \n    vec4 r = fract(sin(v * 1e-1) * 1e3);\n    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);\n    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n    \n    return mix(r0, r1, f.z) * 2.0 - 1.0;\n  }\n  void main() {\n    vec2 p = vUv - 0.5;\n    float lp = length(p);\n\n    float colorRatio = 2.5 - (6.0 * lp);\n\n    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5, 0.4 * lp, 0.5);\n    \n    float power = 1.0;\n    for (int i = 0; i < 6; i++) {\n      power *= 2.0;\n      colorRatio += (1.5 / power) * snoise(coord + vec3(0.0, -0.05 * time*2.0, 0.01 * time*2.0), 16.0 * power);\n    }\n    colorRatio = max(colorRatio, 0.0);\n    float c2 = colorRatio * colorRatio;\n    float c3 = colorRatio * c2;\n    vec3 fc = vec3(colorRatio * color.r, c2*color.g, c3*color.b);\n    float f = fract(time);\n    gl_FragColor = vec4(fc , opacity);\n    \n    "
        )
        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        fog: !0,
      });
      return material;
    },
  },
};
