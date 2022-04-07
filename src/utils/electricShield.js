import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
//default values
var OPTIONS = {
  speed: 0.02,
  radius: 1,
  altitude: 0,
  // interactive: false
};

/**
 * custom  component
 *
 * you can customize your own components
 * */

class ElectricShield extends BaseObject {
  constructor(coordinate, options, material, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, coordinate });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);
    const { altitude, radius } = options;
    //generate geometry
    const r = layer.distanceToVector3(radius, radius).x;
    // SphereBufferGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    // radius — 球体半径，默认为1。
    // widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为8。
    // heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为6。
    // phiStart — 指定水平（经线）起始角度，默认值为0。。
    // phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
    // thetaStart — 指定垂直（纬线）起始角度，默认值为0。
    // thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI
    const geometry = new THREE.SphereBufferGeometry(r, 50, 50, 0, Math.PI * 2);

    //Initialize internal object3d
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
    // this._createMesh(geometry, material);
    this._createGroup();
    const mesh = new THREE.Mesh(geometry, material);
    this.getObject3d().add(mesh);
    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const position = layer.coordinateToVector3(coordinate, z);
    this.getObject3d().position.copy(position);
    this.getObject3d().rotation.x = Math.PI / 2;
  }

  _animation() {
    const ball = this.getObject3d().children[0];
    const speed = this.getOptions().speed;
    ball.material.uniforms.time.value += speed;
  }
}
export default ElectricShield;
