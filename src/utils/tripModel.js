import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import * as turf from "@turf/helpers";
import turf_bearing from "@turf/bearing";
import { lineSlice } from "./geoutil";
//default values
var OPTIONS = {
  altitude: 0,
  trip: false,
  rotation: false,
  play: true,
  chunkLength: 1,
};

/**
 * custom  component
 *
 * you can customize your own components
 * */

class tripModel extends BaseObject {
  constructor(lineString, options, model, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, lineString });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);
    const { altitude, chunkLength } = options;
    //generate geometry

    const geometry = new THREE.BoxBufferGeometry(0.1, 0.2, 0.01);

    // //Initialize internal object3d
    // // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
    this._createMesh(geometry);

    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const position = layer.coordinateToVector3(
      lineString.getCoordinates()[0],
      z
    );
    this.model = model;
    this.model.position.copy(position);
    this._calTripData(layer);
    this.on("remove", () => {
      this.getMap().config("draggable", true);
    });
    this.getObject3d().opacity = 0;
    // this.getObject3d().rotation.x = -Math.PI;
  }

  _calTripData(layer) {
    const { lineString, chunkLength } = this.getOptions();
    const lines = lineSlice(lineString, chunkLength);
    const first = lines[0][0];
    const v = layer.coordinateToVector3(first);
    const coordinates = [first],
      positions = [v];
    lines.forEach((line) => {
      for (let i = 0; i < line.length; i++) {
        const coordinate = line[i];
        if (
          coordinate.join(",").toString() ===
          coordinates[coordinates.length - 1].join(",").toString()
        ) {
          continue;
        }
        coordinates.push(coordinate);
        const v = layer.coordinateToVector3(coordinate);
        positions.push(v);
      }
    });
    console.log(coordinates);
    const bearings = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const coordinate = coordinates[i];
      const nextcoordinate = coordinates[i + 1];
      var point1 = turf.point(coordinate);
      var point2 = turf.point(nextcoordinate);
      var bearing = turf_bearing(point1, point2);
      bearings.push((-bearing * Math.PI) / 180);
    }
    console.log(bearings);
    this._tripCoordinates = coordinates;
    this._positions = positions;
    this._bearings = bearings;
    this._idx = -1;
    this._rotating = false;
  }

  _animation() {
    const { play, trip, rotation } = this.getOptions();
    if (!play) {
      this.getMap().config("draggable", true);
      return;
    }
    const { _tripCoordinates, _bearings, _idx, _positions } = this;
    this._idx++;
    this.model.position.copy(_positions[this._idx]);
    const z = this.getLayer().distanceToVector3(200, 200).x;
    // this.model.position.z = z;
    if (this._idx >= _tripCoordinates.length - 1) {
      this._idx = -1;
    }
    if (trip) {
      this.getMap().config("draggable", false);
      this.getMap().setCenter(_tripCoordinates[this._idx]);
    } else {
      this.getMap().config("draggable", true);
    }
    const bearing = _bearings[this._idx];
    if (bearing != undefined) {
      // this.model.rotation.z = bearing;
      //修改
      this.model.rotation.y = bearing + THREE.Math.degToRad(180);
      if (rotation) {
        this.getMap().config("draggable", false);
        if (this._rotating) {
          return;
        }
        if (Math.abs(bearing) >= Math.PI / 3) {
          const view = Object.assign({}, map.getView(), {
            bearing: Math.abs((bearing / Math.PI) * 180),
          });
          this._rotating = true;
          map.animateTo(
            view,
            {
              duration: 600,
            },
            (frame) => {
              if (frame.state.playState === "finished") {
                this._rotating = false;
              }
            }
          );
        }
      } else {
        this.getMap().config("draggable", true);
      }
    }
  }
}

export default tripModel;
