import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import earcut from "earcut";
//default values
var OPTIONS = {
  interactive: false,
  altitude: 0,
};

const fragmentShader = `
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
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
			      float downSpeed = 0.3+(sin(iTime*0.4+float(k+i*20))+1.0)*0.00008;
            vec2 uv = (fragCoord.xy / iResolution.x)+vec2(0.01*sin((iTime+float(k*6185))*0.6+float(i))*(5.0/float(i)),downSpeed*(iTime+float(k*1352))*(1.0/float(i)));
            vec2 uvStep = (ceil((uv)*cellSize-vec2(0.5,0.5))/cellSize);
            float x = fract(sin(dot(uvStep.xy,vec2(12.9898+float(k)*12.0,78.233+float(k)*315.156)))* 43758.5453+float(k)*12.0)-0.5;
            float y = fract(sin(dot(uvStep.xy,vec2(62.2364+float(k)*23.0,94.674+float(k)*95.0)))* 62159.8432+float(k)*12.0)-0.5;

            float randomMagnitude1 = sin(iTime*2.5)*0.7/cellSize;
            float randomMagnitude2 = cos(iTime*2.5)*0.7/cellSize;

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
class snow extends BaseObject {
  constructor(polygon, options, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, polygon });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);

    
    let material = (this.material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: {
        iTime: {
          type: "f",
          value: 0,
        },
        iResolution: {
          type: "v3",
          value: new THREE.Vector3(1, 1, 1),
        }
      },
      // blending: THREE.AdditiveBlending,
      // transparent: !1,
      // depthWrite: !1,
      // depthTest: !0,
      side: THREE.DoubleSide,
    }));
    let size = layer.getMap().getSize();
    material.uniforms.iResolution.value.set(size.width, size.height, 1);
    const geometry = getWaterGeometry(polygon, layer);
    this._createMesh(geometry, material);

    //set object3d position
    const { altitude } = options;
    const z = layer.distanceToVector3(altitude, altitude).x;
    const center = polygon.getCenter();
    const v = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(v);
  }

  _animation() {
    const speed = this.getOptions().speed;
    this.material.uniforms.iTime.value += speed || 1.0 / 100.0;
  }
}

function getSingleGeometry(polygon, layer, centerPt) {
  //if lnglats
  if (Array.isArray(polygon)) {
    polygon = new maptalks.Polygon(polygon);
  }

  const shell = polygon.getShell();
  const holes = polygon.getHoles();
  const lnglats = shell;
  const positions = [],
    holesIndices = [],
    positionsV = [];
  lnglats.forEach((lnglat) => {
    const v = layer.coordinateToVector3(lnglat).sub(centerPt);
    positions.push(v.x, v.y, v.z);
    positionsV.push(v);
  });
  if (holes && holes.length > 0) {
    holes.forEach((hole) => {
      holesIndices.push(positionsV.length);
      hole.forEach((lnglat) => {
        const v = layer.coordinateToVector3(lnglat).sub(centerPt);
        positions.push(v.x, v.y, v.z);
        positionsV.push(v);
      });
    });
  }
  const hole = holesIndices.length > 0 ? holesIndices : undefined;
  const faces = earcut(positions, hole, 3);
  return {
    positionsV,
    faces,
  };
}

function getWaterGeometry(polygon, layer) {
  const geometry = new THREE.Geometry();
  let positions = [],
    fcs = [];
  const centerPt = layer.coordinateToVector3(polygon.getCenter());
  if (polygon instanceof maptalks.Polygon) {
    const { positionsV, faces } = getSingleGeometry(polygon, layer, centerPt);
    positions = positionsV;
    fcs = faces;
  } else {
    const lnglats = polygon.getCoordinates();
    for (let i = 0, len = lnglats.length; i < len; i++) {
      const { positionsV, faces } = getSingleGeometry(
        lnglats[i],
        layer,
        centerPt
      );
      if (i > 0) {
        const LEN = positions.length;
        for (let i = 0, len = faces.length; i < len; i++) {
          faces[i] += LEN;
        }
      }
      positionsV.forEach((p) => {
        positions.push(p);
      });
      faces.forEach((f) => {
        fcs.push(f);
      });
    }
  }

  geometry.vertices = positions;
  for (let i = 0, len = fcs.length; i < len; i += 3) {
    const face = new THREE.Face3(fcs[i], fcs[i + 1], fcs[i + 2]);
    geometry.faces.push(face);
  }
  // geometry.computeFlatVertexNormals();
  // geometry.computeMorphNormals();
  geometry.computeVertexNormals();
  geometry.computeFaceNormals();
  return geometry;
}
export default snow;
