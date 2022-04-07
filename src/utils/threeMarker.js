import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
//default values
var OPTIONS = {
  markerWidth: 30,
  markerHeight: 30,
  altitude: 0,
  interactive: false,
};

class threeMarker extends BaseObject {
  constructor(coordinate, options, material, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      coordinate,
    });
    super();
    this._initOptions(options);
    const { altitude, markerWidth, markerHeight } = options;
    //generate geometry
    let w = layer.distanceToVector3(markerWidth, markerWidth).x;
    let h = layer.distanceToVector3(markerHeight, markerHeight).x;
    const geometry = new THREE.PlaneBufferGeometry(w, h, 2);

    this._createGroup();
    const mesh = new THREE.Mesh(geometry, material);
    this.getObject3d().add(mesh);
    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const jz = h / 2;
    const position = layer.coordinateToVector3(coordinate, z + jz);
    this.getObject3d().position.copy(position);
    this.getObject3d().rotation.x = Math.PI / 2;
  }

  _animation() {
    const ring = this.getObject3d().children[0];
    const speed = this.getOptions().speed;
    if (speed) ring.rotation.y += THREE.Math.degToRad(speed);
  }
}
export default threeMarker;
