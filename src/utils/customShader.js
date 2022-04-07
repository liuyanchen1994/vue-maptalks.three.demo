import * as THREE from "three";
export default {
  data() {
    return {};
  },
  methods: {
    getSnowMaterial(threeLayer) {
      let size = threeLayer.getMap().getSize();
      const fragmentShader = `
        uniform vec3      iResolution;           // viewport resolution (in pixels)
        uniform float     time;                 // shader playback time (in seconds)
        // uniform float     timeDelta;            // render time (in seconds)
        // uniform int       iFrame;                // shader playback frame
        // uniform float     iChannelTime[4];       // channel playback time (in seconds)
        // uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
        // uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
        // // uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
        // uniform vec4      iDate;                 // (year, month, day, time in seconds)
        // uniform float     iSampleRate;           // sound sample rate (i.e., 44100)
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            float snow = 0.0;
            float gradient = (1.0-float(fragCoord.y / iResolution.x))*0.4;
            float random = fract(sin(dot(fragCoord.xy,vec2(12.9898,78.233)))* 43758.5453);
            for(int k=0;k<6;k++){
                for(int i=0;i<12;i++){
                    float cellSize = 2.0 + (float(i)*3.0);
                        float downSpeed = 0.3+(sin(time*0.4+float(k+i*20))+1.0)*0.00008;
                    vec2 uv = (fragCoord.xy / iResolution.x)+vec2(0.01*sin((time+float(k*6185))*0.6+float(i))*(5.0/float(i)),downSpeed*(time+float(k*1352))*(1.0/float(i)));
                    vec2 uvStep = (ceil((uv)*cellSize-vec2(0.5,0.5))/cellSize);
                    float x = fract(sin(dot(uvStep.xy,vec2(12.9898+float(k)*12.0,78.233+float(k)*315.156)))* 43758.5453+float(k)*12.0)-0.5;
                    float y = fract(sin(dot(uvStep.xy,vec2(62.2364+float(k)*23.0,94.674+float(k)*95.0)))* 62159.8432+float(k)*12.0)-0.5;

                    float randomMagnitude1 = sin(time*2.5)*0.7/cellSize;
                    float randomMagnitude2 = cos(time*2.5)*0.7/cellSize;

                    float d = 5.0*distance((uvStep.xy + vec2(x*sin(y),y)*randomMagnitude1 + vec2(y,x)*randomMagnitude2),uv.xy);

                    float omiVal = fract(sin(dot(uvStep.xy,vec2(32.4691,94.615)))* 31572.1684);
                    if(omiVal<0.08?true:false){
                        float newd = (x+1.0)*0.4*clamp(1.9-d*(15.0+(x*6.3))*(cellSize/1.4),0.0,1.0);
                        /*snow += d<(0.08+(x*0.3))/(cellSize/1.4)?
                            newd
                            :newd;*/
                        snow += newd;
                    }
                }
            }
            fragColor = vec4(snow)+gradient*vec4(0.4,0.8,1.0,0.0) + random*0.01;
        }
        void main(){
            mainImage(gl_FragColor,gl_FragCoord.xy);
        }
        `;
      let material = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          iResolution: {
            type: "v3",
            value: new THREE.Vector3(1, 1, 1),
          },
        },
        blending: THREE.AdditiveBlending,
        // transparent: !0,
        depthWrite: !1,
        depthTest: !1,
        side: THREE.DoubleSide,
      });
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
      //   animate();
      //   function animate() {
      //     material.uniforms.time.value += 1.0 / 100.0;
      //     requestAnimationFrame(animate);
      //   }
      return material;
    },
    getSnowMaterial2(threeLayer) {
      let size = threeLayer.getMap().getSize();
      const fragmentShader = `
        
        uniform vec3      iResolution;           // viewport resolution (in pixels)
        uniform float     time;                 // shader playback time (in seconds)
        // uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
        #define pi 3.1415926

        float T;

        // iq's hash function from https://www.shadertoy.com/view/MslGD8
        vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*18.5453); }

        float simplegridnoise(vec2 v)
        {
            float s = 1. / 256.;
            vec2 fl = floor(v), fr = fract(v);
            float mindist = 1e9;
            for(int y = -1; y <= 1; y++)
                for(int x = -1; x <= 1; x++)
                {
                    vec2 offset = vec2(x, y);
                    vec2 pos = .5 + .5 * cos(2. * pi * (T*.1 + hash(fl+offset)) + vec2(0,1.6));
                    mindist = min(mindist, length(pos+offset -fr));
                }
            
            return mindist;
        }

        float blobnoise(vec2 v, float s)
        {
            return pow(.5 + .5 * cos(pi * clamp(simplegridnoise(v)*2., 0., 1.)), s);
        }

        float fractalblobnoise(vec2 v, float s)
        {
            float val = 0.;
            const float n = 4.;
            for(float i = 0.; i < n; i++)
                //val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, time * 1.0), s);
                val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, T), s);

            return val;
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            T = time;

            vec2 r = vec2(1.0, iResolution.y / iResolution.x);
            vec2 uv = fragCoord.xy / iResolution.xy;
            float val = fractalblobnoise(r * uv * 20.0, 5.0);
            //float val = fractalblobnoise(r * uv * 40.0, 1.25); // more snowflakes
            // float val = blobnoise(r * uv * 10.0, 5.0);
            //fragColor = vec4(vec3(val), 1.0);
            fragColor = mix(vec4(0), vec4(1.0), vec4(val));
            // fragColor = mix(texture(iChannel0, uv), vec4(1.0), vec4(val));
        }
        void main(){
            mainImage(gl_FragColor,gl_FragCoord.xy);
        }
        `;
      let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
        .concat(
          THREE.ShaderChunk.fog_pars_vertex,
          "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
        )
        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
      let material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader: vertexShaderSource,
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          iResolution: {
            type: "v3",
            value: new THREE.Vector3(1, 1, 1),
          },
        },
        blending: THREE.AdditiveBlending,
        transparent: !0,
        depthWrite: !1,
        depthTest: !1,
        side: THREE.DoubleSide,
      });
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
      return material;
    },
    getRainMaterial3(threeLayer, image) {
      let size = threeLayer.getMap().getSize();
      const fragmentShader = `
        
        uniform vec3      iResolution;           // viewport resolution (in pixels)
        uniform float     time;                 // shader playback time (in seconds)
        uniform int       iFrame;                // shader playback frame
        uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
        uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube
        #define S(a, b, t) smoothstep(a, b, t)
        // #define CHEAP_NORMALS
        // #define HAS_HEART
        #define USE_POST_PROCESSING

        vec3 N13(float p) {
            //  from DAVE HOSKINS
          vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
          p3 += dot(p3, p3.yzx + 19.19);
          return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
        }

        vec4 N14(float t) {
          return fract(sin(t*vec4(123., 1024., 1456., 264.))*vec4(6547., 345., 8799., 1564.));
        }
        float N(float t) {
            return fract(sin(t*12345.564)*7658.76);
        }

        float Saw(float b, float t) {
          return S(0., b, t)*S(1., b, t);
        }


        vec2 DropLayer2(vec2 uv, float t) {
            vec2 UV = uv;
            
            uv.y += t*0.75;
            vec2 a = vec2(6., 1.);
            vec2 grid = a*2.;
            vec2 id = floor(uv*grid);
            
            float colShift = N(id.x); 
            uv.y += colShift;
            
            id = floor(uv*grid);
            vec3 n = N13(id.x*35.2+id.y*2376.1);
            vec2 st = fract(uv*grid)-vec2(.5, 0);
            
            float x = n.x-.5;
            
            float y = UV.y*20.;
            float wiggle = sin(y+sin(y));
            x += wiggle*(.5-abs(x))*(n.z-.5);
            x *= .7;
            float ti = fract(t+n.z);
            y = (Saw(.85, ti)-.5)*.9+.5;
            vec2 p = vec2(x, y);
            
            float d = length((st-p)*a.yx);
            
            float mainDrop = S(.4, .0, d);
            
            float r = sqrt(S(1., y, st.y));
            float cd = abs(st.x-x);
            float trail = S(.23*r, .15*r*r, cd);
            float trailFront = S(-.02, .02, st.y-y);
            trail *= trailFront*r*r;
            
            y = UV.y;
            float trail2 = S(.2*r, .0, cd);
            float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
            y = fract(y*10.)+(st.y-.5);
            float dd = length(st-vec2(x, y));
            droplets = S(.3, 0., dd);
            float m = mainDrop+droplets*r*trailFront;
            
            //m += st.x>a.y*.45 || st.y>a.x*.165 ? 1.2 : 0.;
            return vec2(m, trail);
        }

        float StaticDrops(vec2 uv, float t) {
          uv *= 40.;
            
            vec2 id = floor(uv);
            uv = fract(uv)-.5;
            vec3 n = N13(id.x*107.45+id.y*3543.654);
            vec2 p = (n.xy-.5)*.7;
            float d = length(uv-p);
            
            float fade = Saw(.025, fract(t+n.z));
            float c = S(.3, 0., d)*fract(n.z*10.)*fade;
            return c;
        }

        vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
            float s = StaticDrops(uv, t)*l0; 
            vec2 m1 = DropLayer2(uv, t)*l1;
            vec2 m2 = DropLayer2(uv*1.85, t)*l2;
            
            float c = s+m1.x+m2.x;
            c = S(.3, 1., c);
            
            return vec2(c, max(m1.y*l0, m2.y*l1));
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
          vec2 uv = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
            vec2 UV = fragCoord.xy/iResolution.xy;
            vec3 M = iMouse.xyz/iResolution.xyz;
            float T = time+M.x*2.;
            
            #ifdef HAS_HEART
            T = mod(time, 102.);
            T = mix(T, M.x*102., M.z>0.?1.:0.);
            #endif
            
            
            float t = T*.2;
            
            float rainAmount = iMouse.z>0. ? M.y : sin(T*.05)*.3+.7;
            
            float maxBlur = mix(3., 6., rainAmount);
            float minBlur = 1.;//2修改为1
            
            float story = 0.;
            float heart = 0.;
            
            #ifdef HAS_HEART
            story = S(0., 70., T);
            
            t = min(1., T/70.);						// remap drop time so it goes slower when it freezes
            t = 1.-t;
            t = (1.-t*t)*70.;
            
            float zoom= mix(.3, 1.2, story);		// slowly zoom out
            uv *=zoom;
            minBlur = 4.+S(.5, 1., story)*3.;		// more opaque glass towards the end
            maxBlur = 6.+S(.5, 1., story)*1.5;
            
            vec2 hv = uv-vec2(.0, -.1);				// build heart
            hv.x *= .5;
            float s = S(110., 70., T);				// heart gets smaller and fades towards the end
            hv.y-=sqrt(abs(hv.x))*.5*s;
            heart = length(hv);
            heart = S(.4*s, .2*s, heart)*s;
            rainAmount = heart;						// the rain is where the heart is
            
            maxBlur-=heart;							// inside the heart slighly less foggy
            uv *= 1.5;								// zoom out a bit more
            t *= .25;
            #else
            float zoom = -cos(T*.2);
            uv *= .7+zoom*.3;
            #endif
            UV = (UV-.5)*(.9+zoom*.1)+.5;
            
            float staticDrops = S(-.5, 1., rainAmount)*2.;
            float layer1 = S(.25, .75, rainAmount);
            float layer2 = S(.0, .5, rainAmount);
            
            
            vec2 c = Drops(uv, t, staticDrops, layer1, layer2);
          #ifdef CHEAP_NORMALS
              vec2 n = vec2(dFdx(c.x), dFdy(c.x));// cheap normals (3x cheaper, but 2 times shittier ;))
            #else
              vec2 e = vec2(.001, 0.);
              float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
              float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
              vec2 n = vec2(cx-c.x, cy-c.x);		// expensive normals
            #endif
            
            
            #ifdef HAS_HEART
            n *= 1.-S(60., 85., T);
            c.y *= 1.-S(80., 100., T)*.8;
            #endif
            
            float focus = mix(maxBlur-c.y, minBlur, S(.1, .2, c.x));
            vec3 col = texture2D(iChannel0, UV+n, focus).rgb;
            
            
            #ifdef USE_POST_PROCESSING
            t = (T+3.)*.5;										// make time sync with first lightnoing
            float colFade = sin(t*.2)*.5+.5+story;
            col *= mix(vec3(1.), vec3(.8, .9, 1.3), colFade);	// subtle color shift
            float fade = S(0., 10., T);							// fade in at the start
            float lightning = sin(t*sin(t*10.));				// lighting flicker
            lightning *= pow(max(0., sin(t+sin(t))), 10.);		// lightning flash
            col *= 1.+lightning*fade*mix(1., .1, story*story);	// composite lightning
            col *= 1.-dot(UV-=.5, UV);							// vignette
                                  
            #ifdef HAS_HEART
              col = mix(pow(col, vec3(1.2)), col, heart);
              fade *= S(102., 97., T);
            #endif
            
            col *= fade;										// composite start and end fade
            #endif
            
            //col = vec3(heart);
            fragColor = vec4(col, 1.);
        }
        void main(){
            mainImage(gl_FragColor,gl_FragCoord.xy);
        }
        `;
      let material = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          iResolution: {
            type: "v3",
            value: new THREE.Vector3(1, 1, 1),
          },
          iChannel0: {
            type: "t",
            value: new THREE.TextureLoader().load(image),
          },
        },
        blending: THREE.AdditiveBlending,
        transparent: !0,
        // depthWrite: !1,
        // depthTest: !1,
        side: THREE.DoubleSide,
      });
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
      return material;
    },
    getBuildMaterial3(threeLayer) {
      let size = threeLayer.getMap().getSize();
      const fragmentShader = `
        uniform vec3      iResolution;           // viewport resolution (in pixels)
        uniform float     time;                 // shader playback time (in seconds)
        uniform int       iFrame;                // shader playback frame
        uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
        //#define CARS
        #define I_MAX 70

        float rand(vec2 n) {
          return fract(sin((n.x*1e2+n.y*1e4+1475.4526)*1e-4)*1e6);
        }

        float noise(vec2 p)
        {
            p = floor(p*200.0);
          return rand(p);
        }
        vec3 polygonXY(float z,vec2 vert1, vec2 vert2, vec3 camPos,vec3 rayDir){
            float t = -(camPos.z-z)/rayDir.z;
            vec2 cross = camPos.xy + rayDir.xy*t;
            if (cross.x>min(vert1.x,vert2.x) && 
                cross.x<max(vert1.x,vert2.x) &&
                cross.y>min(vert1.y,vert2.y) &&
                cross.y<max(vert1.y,vert2.y) &&
              dot(rayDir,vec3(cross,z)-camPos)>0.0){
                  float dist = length(camPos-vec3(cross,z));
                    return vec3(dist, cross.x-min(vert1.x,vert2.x),cross.y-min(vert1.y,vert2.y));
                }
            
            return vec3(101.0,0.0,0.0);
        }
        vec3 polygonYZ(float x,vec2 vert1, vec2 vert2, vec3 camPos,vec3 rayDir){
            float t = -(camPos.x-x)/rayDir.x;
            vec2 cross1 = camPos.yz + rayDir.yz*t;
            if (cross1.x>min(vert1.x,vert2.x) && 
                cross1.x<max(vert1.x,vert2.x) &&
                cross1.y>min(vert1.y,vert2.y) &&
                cross1.y<max(vert1.y,vert2.y)&&
              dot(rayDir,vec3(x,cross1)-camPos)>0.0){
                  float dist = length(camPos-vec3(x,cross1));
                    return vec3(dist, cross1.x-min(vert1.x,vert2.x),cross1.y-min(vert1.y,vert2.y));
                }
            
            return vec3(101.0,0.0,0.0);
        }
        vec3 polygonXZ(float y,vec2 vert1, vec2 vert2, vec3 camPos,vec3 rayDir){
            float t = -(camPos.y-y)/rayDir.y;
            vec2 cross1 = camPos.xz + rayDir.xz*t;
            if (cross1.x>min(vert1.x,vert2.x) && 
                cross1.x<max(vert1.x,vert2.x) &&
                cross1.y>min(vert1.y,vert2.y) &&
                cross1.y<max(vert1.y,vert2.y)&&
              dot(rayDir,vec3(cross1.x,y,cross1.y)-camPos)>0.0){
                  float dist = length(camPos-vec3(cross1.x,y,cross1.y));
                    return vec3(dist, cross1.x-min(vert1.x,vert2.x),cross1.y-min(vert1.y,vert2.y));
                }
            
            return vec3(101.0,0.0,0.0);
        }

        vec3 textureWall(vec2 pos, vec2 maxPos, vec2 squarer,float s,float height,float dist,vec3 rayDir,vec3 norm){
            float randB = rand(squarer*2.0);
            vec3 windowColor =(-0.4+randB*0.8)*vec3(0.3,0.3,0.0)+(-0.4+fract(randB*10.0)*0.8)*vec3(0.0,0.0,0.3)+(-0.4+fract(randB*10000.0)*0.8)*vec3(0.3,0.0,0.0);
            float floorFactor = 1.0;
            vec2 windowSize = vec2(0.65,0.35);
            vec3 wallColor = s*(0.3+1.4*fract(randB*100.0))*vec3(0.1,0.1,0.1)+(-0.7+1.4*fract(randB*1000.0))*vec3(0.02,0.,0.);
          wallColor*=1.3;
            
            vec3 color = vec3(0.0);
            vec3 conturColor = wallColor/1.5;
            if (height<0.51){
              windowColor += vec3(0.3,0.3,0.0);
                windowSize = vec2(0.4,0.4);
                floorFactor = 0.0;

            }
            if (height<0.6){floorFactor = 0.0;}
            if (height>0.75){
              windowColor += vec3(0.0,0.0,0.3);
            }
            windowColor*=1.5;
            float wsize = 0.02;
            wsize+=-0.007+0.014*fract(randB*75389.9365);
            windowSize+= vec2(0.34*fract(randB*45696.9365),0.50*fract(randB*853993.5783));
            
            vec2 contur=vec2(0.0)+(fract(maxPos/2.0/wsize))*wsize;
            if (contur.x<wsize){contur.x+=wsize;}
            if (contur.y<wsize){contur.y+=wsize;}
            
          vec2 winPos = (pos-contur)/wsize/2.0-floor((pos-contur)/wsize/2.0);
            
            float numWin = floor((maxPos-contur)/wsize/2.0).x;
            
            if ( (maxPos.x>0.5&&maxPos.x<0.6) && ( ((pos-contur).x>wsize*2.0*floor(numWin/2.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin/2.0)) )){
                return (0.9+0.2*noise(pos))*conturColor;
            }
            
            if ( (maxPos.x>0.6&&maxPos.x<0.7) &&( ( ((pos-contur).x>wsize*2.0*floor(numWin/3.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin/3.0)) )||
                                                  ( ((pos-contur).x>wsize*2.0*floor(numWin*2.0/3.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin*2.0/3.0)) )) ){
                return (0.9+0.2*noise(pos))*conturColor;
            }
            
            if ( (maxPos.x>0.7) &&( ( ((pos-contur).x>wsize*2.0*floor(numWin/4.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin/4.0)) )||
                                                  ( ((pos-contur).x>wsize*2.0*floor(numWin*2.0/4.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin*2.0/4.0)) )||
                                                  ( ((pos-contur).x>wsize*2.0*floor(numWin*3.0/4.0)) && ((pos-contur).x<wsize*2.0+wsize*2.0*floor(numWin*3.0/4.0)) )) ){
                return (0.9+0.2*noise(pos))*conturColor;
            }
            if ((maxPos.x-pos.x<contur.x)||(maxPos.y-pos.y<contur.y+2.0*wsize)||(pos.x<contur.x)||(pos.y<contur.y)){
                    return (0.9+0.2*noise(pos))*conturColor;
                
            }
            if (maxPos.x<0.14) {
                return (0.9+0.2*noise(pos))*wallColor;
            }
            vec2 window = floor((pos-contur)/wsize/2.0);
            float random = rand(squarer*s*maxPos.y+window);
            float randomZ = rand(squarer*s*maxPos.y+floor(vec2((pos-contur).y,(pos-contur).y)/wsize/2.0));
            float windows = floorFactor*sin(randomZ*5342.475379+(fract(975.568*randomZ)*0.15+0.05)*window.x);
            
          float blH = 0.06*dist*600.0/iResolution.x/abs(dot(normalize(rayDir.xy),normalize(norm.xy)));
            float blV = 0.06*dist*600.0/iResolution.x/sqrt(abs(1.0-pow(abs(rayDir.z),2.0)));
            
          windowColor +=vec3(1.0,1.0,1.0);
            windowColor *= smoothstep(0.5-windowSize.x/2.0-blH,0.5-windowSize.x/2.0+blH,winPos.x);
            windowColor *= smoothstep(0.5+windowSize.x/2.0+blH,0.5+windowSize.x/2.0-blH,winPos.x);
            windowColor *= smoothstep(0.5-windowSize.y/2.0-blV,0.5-windowSize.y/2.0+blV,winPos.y);
            windowColor *= smoothstep(0.5+windowSize.y/2.0+blV,0.5+windowSize.y/2.0-blV,winPos.y);
            
            if ((random <0.05*(3.5-2.5*floorFactor))||(windows>0.65)){
                  if (winPos.y<0.5) {windowColor*=(1.0-0.4*fract(random*100.0));}
                  if ((winPos.y>0.5)&&(winPos.x<0.5)) {windowColor*=(1.0-0.4*fract(random*10.0));}
                    return (0.9+0.2*noise(pos))*wallColor+(0.9+0.2*noise(pos))*windowColor;


            } 
            else{
                windowColor*=0.08*fract(10.0*random);
            }
            
            return (0.9+0.2*noise(pos))*wallColor+windowColor;

        }

        vec3 textureRoof(vec2 pos, vec2 maxPos,vec2 squarer){
            float wsize = 0.025;
            float randB = rand(squarer*2.0);
            vec3 wallColor = (0.3+1.4*fract(randB*100.0))*vec3(0.1,0.1,0.1)+(-0.7+1.4*fract(randB*1000.0))*vec3(0.02,0.,0.);
          vec3 conturColor = wallColor*1.5/2.5;
            vec2 contur = vec2(0.02);
            if ((maxPos.x-pos.x<contur.x)||(maxPos.y-pos.y<contur.y)||(pos.x<contur.x)||(pos.y<contur.y)){
                    return (0.9+0.2*noise(pos))*conturColor;
                
            }
            float step1 = 0.06+0.12*fract(randB*562526.2865);
            pos -=step1;
            maxPos -=step1*2.0;
            if ((pos.x>0.0&&pos.y>0.0&&pos.x<maxPos.x&&pos.y<maxPos.y)&&((abs(maxPos.x-pos.x)<contur.x)||(abs(maxPos.y-pos.y)<contur.y)||(abs(pos.x)<contur.x)||(abs(pos.y)<contur.y))){
                    return (0.9+0.2*noise(pos))*conturColor;
                
            }
            pos -=step1;
            maxPos -=step1*2.0;
            if ((pos.x>0.0&&pos.y>0.0&&pos.x<maxPos.x&&pos.y<maxPos.y)&&((abs(maxPos.x-pos.x)<contur.x)||(abs(maxPos.y-pos.y)<contur.y)||(abs(pos.x)<contur.x)||(abs(pos.y)<contur.y))){
                    return (0.9+0.2*noise(pos))*conturColor;
                
            }
            pos -=step1;
            maxPos -=step1*2.0;
            if ((pos.x>0.0&&pos.y>0.0&&pos.x<maxPos.x&&pos.y<maxPos.y)&&((abs(maxPos.x-pos.x)<contur.x)||(abs(maxPos.y-pos.y)<contur.y)||(abs(pos.x)<contur.x)||(abs(pos.y)<contur.y))){
                    return (0.9+0.2*noise(pos))*conturColor;
                
            }
            
            return (0.9+0.2*noise(pos))*wallColor;
            
        }
        vec3 cars(vec2 squarer, vec2 pos, float dist,float level){
            vec3 color = vec3(0.0);
            float carInten = 3.5/sqrt(dist);
            float carRadis = 0.01; 
            if (dist>2.0) {carRadis *= sqrt(dist/2.0);}
            vec3 car1 = vec3(0.5,0.5,1.0);
            vec3 car2 = vec3(1.0,0.1,0.1);
            float carNumber = 0.5;
            
            float random = noise((level+1.0)*squarer*1.24435824);
            for (int j=0;j<10; j++){
                float i = 0.03+float(j)*0.094;
                if(fract(random*5.0/i)>carNumber){color += car1*carInten*smoothstep(carRadis,0.0,length(pos - vec2(fract(i+time/4.0),0.025)));}
                
                if(fract(random*10.0/i)>carNumber){color += car2*carInten*smoothstep(carRadis,0.0,length(pos - vec2(fract(i-time/4.0),0.975)));}
              if(color.x>0.0) break;
            }
            for (int j=0;j<10; j++){
                float i= 0.03+float(j)*0.094;
                if(fract(random*5.0/i)>carNumber){color += car2*carInten*smoothstep(carRadis,0.0,length(pos - vec2(0.025,fract(i+time/4.0))));}
                if(fract(random*10.0/i)>carNumber){color += car1*carInten*smoothstep(carRadis,0.0,length(pos - vec2(0.975,fract(i-time/4.0))));}
                  if(color.x>0.0) break;

            }
            for (int j=0;j<10; j++){
                float i = 0.03+0.047+float(j)*0.094;
                if(fract(random*100.0/i)>carNumber){color += car1*carInten*smoothstep(carRadis,0.0,length(pos - vec2(fract(i+time/4.0),0.045)));}
                if(fract(random*1000.0/i)>carNumber){color += car2*carInten*smoothstep(carRadis,0.0,length(pos - vec2(fract(i-time/4.0),0.955)));}
                  if(color.x>0.0) break;

            }
            for (int j=0;j<10; j++){
                float i = 0.03+0.047+float(j)*0.094;
                if(fract(random*100.0/i)>carNumber){color += car2*carInten*smoothstep(carRadis,0.0,length(pos - vec2(0.045,fract(i+time/4.0))));}
                if(fract(random*1000.0/i)>carNumber){color += car1*carInten*smoothstep(carRadis,0.0,length(pos - vec2(0.955,fract(i-time/4.0))));}
                  if(color.x>0.0) break;

            }
            return color;
        }
        vec3 textureGround(vec2 squarer, vec2 pos,vec2 vert1,vec2 vert2,float dist){
            vec3 color = (0.9+0.2*noise(pos))*vec3(0.1,0.15,0.1);
            float randB = rand(squarer*2.0);

            vec3 wallColor = (0.3+1.4*fract(randB*100.0))*vec3(0.1,0.1,0.1)+(-0.7+1.4*fract(randB*1000.0))*vec3(0.02,0.,0.);
          float fund = 0.03;
            float bl = 0.01;
            float f = smoothstep(vert1.x-fund-bl,vert1.x-fund,pos.x);
            f *= smoothstep(vert1.y-fund-bl,vert1.y-fund,pos.y);
            f *= smoothstep(vert2.y+fund+bl,vert2.y+fund,pos.y);
            f *= smoothstep(vert2.x+fund+bl,vert2.x+fund,pos.x);

            pos -= 0.0;
            vec2 maxPos = vec2(1.,1.);
            vec2 contur = vec2(0.06,0.06);
            if ((pos.x>0.0&&pos.y>0.0&&pos.x<maxPos.x&&pos.y<maxPos.y)&&((abs(maxPos.x-pos.x)<contur.x)||(abs(maxPos.y-pos.y)<contur.y)||(abs(pos.x)<contur.x)||(abs(pos.y)<contur.y))){
                    color =  vec3(0.1,0.1,0.1)*(0.9+0.2*noise(pos));
                
            }
            pos -= 0.06;
            maxPos = vec2(.88,0.88);
            contur = vec2(0.01,0.01);
            if ((pos.x>0.0&&pos.y>0.0&&pos.x<maxPos.x&&pos.y<maxPos.y)&&((abs(maxPos.x-pos.x)<contur.x)||(abs(maxPos.y-pos.y)<contur.y)||(abs(pos.x)<contur.x)||(abs(pos.y)<contur.y))){
                    color =  vec3(0.,0.,0.);
                
            }
            color = mix(color,(0.9+0.2*noise(pos))*wallColor*1.5/2.5,f);

            pos+=0.06;
            
        #ifdef CARS
            if (pos.x<0.07||pos.x>0.93||pos.y<0.07||pos.y>0.93){
                color+=cars(squarer,pos,dist,0.0);
            }
        #endif
            
            return color;
        }


        void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
            vec2 pos = (fragCoord.xy*2.0 - iResolution.xy) / iResolution.y;
            float t = -time;
            float tt = -time-0.5;
            
            
            vec3 camPos = vec3(5.0+12.0*sin(t*0.05),5.0+ 7.0*cos(t*0.05), 1.9);
            
            vec3 camTarget = vec3(5.0+0.0,5.0+7.0*sin(t*0.05), 0.0);
            if (fract(t/12.0)<0.25){
              camPos = vec3(5.*t,3.1*t,2.1);
            camTarget = vec3(5.*tt,3.1*tt,1.7);
            }
            if (fract(t/12.0)>0.75){
              camPos = vec3(35.,3.1,1.);
            camTarget = vec3(35.+sin(t/10.0),3.1+cos(t/10.0),0.7);
            }
            vec3 camDir = normalize(camTarget-camPos);
            vec3 camUp  = normalize(vec3(0.0, 0.0, -1.0));
            vec3 camSide = cross(camDir, camUp);
            camUp  = cross(camDir, camSide);
            vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*1.6);
            float angle = 0.03*pow(abs(acos(rayDir.x)),4.0);
            //angle = min(0.0,angle);
            vec3 color = vec3(0.0);
            vec2 square = floor(camPos.xy);
            square.x += 0.5-0.5*sign(rayDir.x);
            square.y += 0.5-0.5*sign(rayDir.y);
            float mind = 100.0;
            int k = 0;
            vec3 pol;
            vec2 maxPos;
            vec2 crossG;
            float tSky = -(camPos.z-3.9)/rayDir.z;
            vec2 crossSky = floor(camPos.xy + rayDir.xy*tSky);
            for (int i=1; i<I_MAX; i++){
                        
                vec2 squarer = square-vec2(0.5,0.5)+0.5*sign(rayDir.xy);
                if (crossSky == squarer&&crossSky!=floor(camPos.xy))
                {
                  color += vec3(vec2(0.5,0.15)*abs(angle)*exp(-rayDir.z*rayDir.z*30.0),0.2);
                    break;

                }
                float t;
                float random = rand(squarer);
                float height = 0.0;
                float quartalR = rand(floor(squarer/10.0));
                if (floor(squarer/10.0) == vec2(0.0,0.0)) quartalR = 0.399;
                if (quartalR<0.4) {
                    height = -0.15+0.4*random+smoothstep(12.0,7.0,length(fract(squarer/10.0)*10.0-vec2(5.0,5.0)))*0.8*random+0.9*smoothstep(10.0,0.0,length(fract(squarer/10.0)*10.0-vec2(5.0,5.0)));
                  height*=quartalR/0.4;
                }
                float maxJ=2.0;
                float roof = 1.0;
                if (height<0.3){
                    height = 0.3*(0.7+1.8*fract(random*100.543264));maxJ = 2.0;
                    if (fract(height*1000.0)<0.04) height*=1.3;
                }
                if (height>0.5) {maxJ=3.0;}
                if (height>0.85){maxJ = 4.0;}
                if (fract(height*100.0)<0.15){height = pow(maxJ-1.0,0.3)*height; maxJ = 2.0; roof = 0.0;}

                
                float maxheight = 1.5*pow((maxJ-1.0),0.3)*height+roof*0.07;
                if (camPos.z+rayDir.z*(length(camPos.xy - square) +0.71 - sign(rayDir.z)*0.71)/length(rayDir.xy)<maxheight){
              vec2 vert1r;
                  vec2 vert2r;
                    float zz = 0.0;
                    float prevZZ = 0.0;
                    for(int nf=1;nf<8;nf++){
                        float j = float(nf);
                      if(j>maxJ){break;}
                        prevZZ = zz;
                      zz = 1.5*pow(j,0.3)*height;
                        //prevZZ = zz-0.8;

                    float dia = 1.0/pow(j,0.3);
                      if(j==maxJ){
                            if (roof == 0.0) {break;}
                          zz = 1.5*pow((j-1.0),0.3)*height+0.03+0.04*fract(random*1535.347);
                          dia = 1.0/pow((j-1.0),0.3)-0.2-0.2*fract(random*10000.0);
                      }
                    
                      vec2 v1 = vec2(0.0);//vec2(random*10.0,random*1.0);
                      vec2 v2 = vec2(0.0);//vec2(random*1000.0,random*100.0);
                        float randomF = fract(random*10.0);
                        if (randomF<0.25){ v1 = vec2(fract(random*1000.0),fract(random*100.0));}
                        if (randomF>0.25&&randomF<0.5){ v1 = vec2(fract(random*100.0),0.0);v2 = vec2(0.0,fract(random*1000.0));}
                        if (randomF>0.5&&randomF<0.75){ v2 = vec2(fract(random*1000.0),fract(random*100.0));}
                        if (randomF>0.75){ v1 = vec2(0.0,fract(random*1000.0)); v2 = vec2(fract(random*100.0),0.0);}
                      if (rayDir.y<0.0){
                          float y = v1.y;
                          v1.y = v2.y;
                          v2.y = y;
                      }
                      if (rayDir.x<0.0){
                          float x = v1.x;
                          v1.x = v2.x;
                          v2.x = x;
                      }
                    
                    vec2 vert1 = square+sign(rayDir.xy)*(0.5-0.37*(dia*1.0-1.0*v1));
                    vec2 vert2 = square+sign(rayDir.xy)*(0.5+0.37*(dia*1.0-1.0*v2));
                        if (j==1.0){ 
                            vert1r = vec2(min(vert1.x, vert2.x),min(vert1.y,vert2.y));
                            vert2r = vec2(max(vert1.x, vert2.x),max(vert1.y,vert2.y));
                        }
                    
                    vec3 pxy = polygonXY(zz,vert1,vert2,camPos,rayDir);
                      if (pxy.x<mind){mind = pxy.x; pol = pxy; k=1;maxPos = vec2(abs(vert1.x-vert2.x),abs(vert1.y-vert2.y));}
                    
                    vec3 pyz = polygonYZ(vert1.x,vec2(vert1.y,prevZZ),vec2(vert2.y,zz),camPos,rayDir);
                      if (pyz.x<mind){mind = pyz.x; pol = pyz; k=2;maxPos = vec2(abs(vert1.y-vert2.y),zz-prevZZ);}

                    vec3 pxz = polygonXZ(vert1.y,vec2(vert1.x,prevZZ),vec2(vert2.x,zz),camPos,rayDir);
                      if (pxz.x<mind){mind = pxz.x; pol = pxz; k=3;maxPos = vec2(abs(vert1.x-vert2.x),zz-prevZZ);}
                        

                  }
                    
                  if ((mind<100.0)&&(k==1)){
                      color += textureRoof(vec2(pol.y,pol.z),maxPos,squarer);
                        if (mind>3.0){color*=sqrt(3.0/mind);}

                      break;
                  } 
                  if ((mind<100.0)&&(k==2)){
                      color += textureWall(vec2(pol.y,pol.z),maxPos,squarer,1.2075624928,height,mind,rayDir,vec3(1.0,0.0,0.0));
                      if (mind>3.0){color*=sqrt(3.0/mind);}
                      break;
                  } 
                
                  if ((mind<100.0)&&(k==3)){
                      color += textureWall(vec2(pol.y,pol.z),maxPos,squarer,0.8093856205,height,mind,rayDir,vec3(0.0,1.0,0.0));
                      if (mind>3.0){color*=sqrt(3.0/mind);}

                      break;
                  }
                  t = -camPos.z/rayDir.z;
                crossG = camPos.xy + rayDir.xy*t;
                  if (floor(crossG) == squarer)
                  {
                      mind = length(vec3(crossG,0.0)-camPos);
                      color += textureGround(squarer,fract(crossG),fract(vert1r),fract(vert2r),mind);
                      if (mind>3.0){color*=sqrt(3.0/mind);}

                      break;
                  }
                
                } 
                
                    
                if ((square.x+sign(rayDir.x)-camPos.x)/rayDir.x<(square.y+sign(rayDir.y)-camPos.y)/rayDir.y) {
                    square.x += sign(rayDir.x)*1.0;
                } else {
                    square.y += sign(rayDir.y)*1.0;
                }
                
                if(i==I_MAX-1&&rayDir.z>-0.1) {color += vec3(vec2(0.5,0.15)*abs(angle)*exp(-rayDir.z*rayDir.z*30.0),0.2);}

            }
            fragColor = vec4( color, 1.0);;
        }
        void main(){
            mainImage(gl_FragColor,gl_FragCoord.xy);
        }
        `;
      let material = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          iResolution: {
            type: "v3",
            value: new THREE.Vector3(1, 1, 1),
          },
        },
        blending: THREE.AdditiveBlending,
        transparent: !0,
        // depthWrite: !1,
        // depthTest: !1,
        side: THREE.DoubleSide,
      });
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
      return material;
    },
  },
};
