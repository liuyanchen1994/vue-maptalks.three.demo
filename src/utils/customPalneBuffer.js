import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
//default values
var OPTIONS = {
  radius: 1,
  altitude: 0,
  interactive: false,
};

class customPalneBuffer extends BaseObject {
  constructor(coordinate, options, material, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      coordinate,
    });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);
    const { altitude, radius } = options;
    //generate geometry
    const r = layer.distanceToVector3(radius, radius).x;
    const geometry = new THREE.PlaneBufferGeometry(r, r, 2);

    this._createMesh(geometry, material);
    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const position = layer.coordinateToVector3(coordinate, z);
    this.getObject3d().position.copy(position);
  }

  setCoordinates(coordinate) {
    const position = this.getLayer().coordinateToVector3(coordinate);
    this.getObject3d().position.copy(position);
  }
}
export default customPalneBuffer;
