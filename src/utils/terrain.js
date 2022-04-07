import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import tin from "@turf/tin";
import { point } from "@turf/helpers";
//default values
const OPTIONS = {
  altitude: 0,
};

/**
 * custom Terrain component
 *
 * you can customize your own components
 * */
class Terrain extends BaseObject {
  constructor(data, options, material, layer) {
    options = maptalks.Util.extend({ data, layer }, OPTIONS, options);
    super();
    this._initOptions(options);

    const { buffGeom, minHeight } = getGeometry(data, layer, (buffGeom) => {
      this.getObject3d().geometry = buffGeom;
      //   this.getObject3d().geometry.needsUpdate = true;
    });
    this._createMesh(buffGeom, material);
    const z = layer.distanceToVector3(options.altitude, options.altitude).x;
    this.getObject3d().position.z = z;
  }

  /**
   * animationShow test
   *
   * */
  animateShow(options = {}, cb) {
    if (this._showPlayer) {
      this._showPlayer.cancel();
    }
    if (maptalks.Util.isFunction(options)) {
      options = {};
      cb = options;
    }
    const duration = options["duration"] || 1000,
      easing = options["easing"] || "out";
    const player = (this._showPlayer = maptalks.animation.Animation.animate(
      {
        scale: 1,
      },
      {
        duration: duration,
        easing: easing,
      },
      (frame) => {
        const scale = frame.styles.scale;
        if (scale > 0) {
          this.getObject3d().scale.set(1, 1, scale);
        }
        if (cb) {
          cb(frame, scale);
        }
      }
    ));
    player.play();
    return player;
  }
}

function getGeometry(data = [], layer, callback) {
  if (!Array.isArray(data)) {
    data = [data];
  }
  const points = [];
  let minHeight = Infinity;
  data.forEach((element) => {
    let lnglat, height;
    if (Array.isArray(element)) {
      lnglat = [element[0], element[1]];
      height = element[2];
    } else {
      lnglat = element.lnglat || element.xy || element._lnglat || element._xy;
      height = element.height || element.z || element.h;
    }
    if (height !== undefined) {
      minHeight = Math.min(minHeight, height);
    }
    if (lnglat && height !== undefined) {
      const point = {
        geometry: {
          coordinates: lnglat,
          type: "Point",
        },
        properties: {
          z: height,
        },
      };
      points.push(point);
    }
  });
  const indexMap = {};
  const positions = [];
  const zs = [];
  const zMap = {};
  for (let i = 0, len = points.length; i < len; i++) {
    const { geometry, properties } = points[i];
    const lnglat = geometry.coordinates;
    const key = lnglat.toString();
    indexMap[key] = i;
    const height = properties.z;
    let z = zMap[height];
    if (z === undefined) {
      z = zMap[height] = layer.distanceToVector3(height, height).x;
    }
    const v = layer.coordinateToVector3(lnglat, z);
    positions.push(v);
    zs.push(v.z);
  }

  const id = maptalks.Util.GUID();
  const minZ = layer.distanceToVector3(minHeight, minHeight).x;
  const buffGeom = new THREE.BufferGeometry();

  const geometry = new THREE.Geometry();
  geometry.vertices = positions;
  var results = {
    id: id,
    result: {
      type: "FeatureCollection",
      features: [],
    },
    faces: [],
  };
  let _points = {
    features: points,
  };
  if (points && Array.isArray(points)) {
    results.result = tin(_points, "z");
  }
  var features = results.result.features;
  var faces = [];
  if (features.length > 0) {
    for (var i = 0, len = features.length; i < len; i++) {
      var g = features[i].geometry;
      var lnglats = g.coordinates[0];
      for (var j = 0, len1 = lnglats.length; j < len1 - 1; j++) {
        var index = indexMap[lnglats[j].toString()];
        faces.push(index);
      }
    }
  }
  var fs = [];
  for (var i = 0, len2 = faces.length; i < len2; i += 3) {
    var index1 = faces[i],
      index2 = faces[i + 1],
      index3 = faces[i + 2];
    if (!(zs[index1] > minZ) && !(zs[index2] > minZ) && !(zs[index3] > minZ)) {
      continue;
    }
    fs.push(index1, index2, index3);
  }
  results.faces = fs;
  let _faces = results.faces;
  for (let i = 0, len = _faces.length; i < len; i += 3) {
    const index1 = _faces[i],
      index2 = _faces[i + 1],
      index3 = _faces[i + 2];
    // if ((!(_positions[index1].z > _minZ) && (!(_positions[index2].z > _minZ)) && (!(_positions[index3].z > _minZ)))) {
    //     continue;
    // }
    const face = new THREE.Face3(index1, index2, index3);
    geometry.faces.push(face);
  }
  geometry.computeVertexNormals();
  geometry.computeFaceNormals();
  // geometry.computeFlatVertexNormals();
  // geometry.computeMorphNormals();
  buffGeom.fromGeometry(geometry);
  return {
    buffGeom,
    minHeight,
  };
}
export default Terrain;
