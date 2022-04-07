import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import earcut from "earcut"
//default values
var OPTIONS = {
  interactive: false,
  altitude: 0,
};

const fragmentShader = `
      uniform vec3 color;
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

//const vec3 waterColor = vec3(.1, .6, .9);
vec3 waterColor = vec3(color);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 growingUv = sin((uv + iTime / 20.) * 3.);
    vec2 uv2 = texture2D(iChannel0, growingUv).rr;

    fragColor = vec4((1. - texture2D(iChannel1, uv * 0.95 + uv2 * 0.05).rgb * (1. - waterColor)), 1.0);
}
void main(){
    mainImage(gl_FragColor,gl_FragCoord.xy);
}
`;
class CoolWater extends BaseObject {
  constructor(polygon, options, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, polygon });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);

    let textureLoader = new THREE.TextureLoader();
    let iChannel0 = textureLoader.load(options.image);
    iChannel0.wrapS = iChannel0.wrapT = THREE.RepeatWrapping;
    let iChannel1 = textureLoader.load(options.image2 || options.image);
    iChannel1.wrapS = iChannel1.wrapT = THREE.RepeatWrapping;

    let material = (this.material = new THREE.ShaderMaterial({
      fragmentShader,
      uniforms: {
        color: {
          type: "c",
          value: new THREE.Color(options.color || "#3399FF"),
        },
        iTime: {
          type: "f",
          value: 0,
        },
        iResolution: {
          type: "v3",
          value: new THREE.Vector3(1, 1, 1),
        },
        iChannel0: {
          type: "t",
          value: iChannel0,
        },
        iChannel1: {
          type: "t",
          value: iChannel1,
        },
      },
    }));
    // this.material = material;
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
    this.material.uniforms.iTime.value += speed || 1.0 / 30.0;
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
export default CoolWater;
