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
        uniform vec3 color;
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

//const vec3 waterColor = vec3(.1, .6, 0.9);

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
class CoolWater2 extends BaseObject {
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
      // blending: THREE.AdditiveBlending,
      // transparent: !1,
      // depthWrite: !1,
      // depthTest: !0,
      side: THREE.DoubleSide,
    }));
    let size = layer.getMap().getSize();
    material.uniforms.iResolution.value.set(size.width, size.height, 1);
    const geometry = getWaterGeometry(polygon, layer, options.height);
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

function getWaterGeometry(polygon, layer, height) {
  height = layer.distanceToVector3(height, height).x;
  const centerPt = layer.coordinateToVector3(polygon.getCenter());
  const wall = polygon.getShell();
  const positionsV = [];
  let joinLonLat = [];
  wall.forEach((lnglat) => {
    const polyPice = layer.coordinateToVector3(lnglat).sub(centerPt);
    positionsV.push(polyPice);
    joinLonLat.push(polyPice.x);
    joinLonLat.push(polyPice.y);
  });
  for (
    var a = joinLonLat, polySub = [], o = 0, s = 0;
    o < a.length - 2;
    o += 2, s++
  )
    0 === o
      ? (polySub[0] = Math.sqrt(
          (a[2] - a[0]) * (a[2] - a[0]) + (a[3] - a[1]) * (a[3] - a[1])
        ))
      : (polySub[s] =
          polySub[s - 1] +
          Math.sqrt(
            (a[o + 2] - a[o]) * (a[o + 2] - a[o]) +
              (a[o + 3] - a[o + 1]) * (a[o + 3] - a[o + 1])
          ));
  let pos = [],
    uvs = [];
  let polylenth = polySub[polySub.length - 1];
  for (
    let d = 0, u = pos.length, p = uvs.length;
    d < positionsV.length - 1;
    d++
  ) {
    let pv1 = positionsV[d],
      pv2 = positionsV[d + 1],
      polyPice = polySub[d];
    (pos[u++] = pv1.x),
      (pos[u++] = pv1.y),
      (pos[u++] = 0),
      (uvs[p++] = 0 === d ? 0 : polySub[d - 1] / polylenth),
      (uvs[p++] = 0),
      (pos[u++] = pv2.x),
      (pos[u++] = pv2.y),
      (pos[u++] = 0),
      (uvs[p++] = polyPice / polylenth),
      (uvs[p++] = 0),
      (pos[u++] = pv1.x),
      (pos[u++] = pv1.y),
      (pos[u++] = height),
      (uvs[p++] = 0 === d ? 0 : polySub[d - 1] / polylenth),
      (uvs[p++] = 1),
      (pos[u++] = pv1.x),
      (pos[u++] = pv1.y),
      (pos[u++] = height),
      (uvs[p++] = 0 === d ? 0 : polySub[d - 1] / polylenth),
      (uvs[p++] = 1),
      (pos[u++] = pv2.x),
      (pos[u++] = pv2.y),
      (pos[u++] = 0),
      (uvs[p++] = polyPice / polylenth),
      (uvs[p++] = 0),
      (pos[u++] = pv2.x),
      (pos[u++] = pv2.y),
      (pos[u++] = height),
      (uvs[p++] = polyPice / polylenth),
      (uvs[p++] = 1);
  }
  var geometry = new THREE.BufferGeometry();
  geometry.attributes["position"] = new THREE.BufferAttribute(
    new Float32Array(pos),
    3
  );
  geometry.attributes["uv"] = new THREE.BufferAttribute(
    new Float32Array(uvs),
    2
  );
  // geometry.setAttribute(
  //   "position",
  //   new THREE.BufferAttribute(new Float32Array(pos), 3)
  // );
  // geometry.setAttribute(
  //   "uv",
  //   new THREE.BufferAttribute(new Float32Array(uvs), 2)
  // );
  return geometry;
}
export default CoolWater2;
