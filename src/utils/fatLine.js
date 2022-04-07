import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2";

var OPTIONS = {
  altitude: 0
};

class FatLine extends BaseObject {
  constructor(lineString, options, material, layer) {
    super();
    //geoutil.js getLinePosition
    const { positions } = getLinePosition(lineString, layer);
    const positions1 = _getLinePosition(lineString, layer).positions;

    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      lineString,
      positions: positions1
    });
    this._initOptions(options);

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    const map = layer.getMap();
    const size = map.getSize();
    const width = size.width,
      height = size.height;
    material.resolution.set(width, height);
    const line = new Line2(geometry, material);
    line.computeLineDistances();
    this._createGroup();
    this.getObject3d().add(line);
    const { altitude } = options;
    const z = layer.distanceToVector3(altitude, altitude).x;
    const center = lineString.getCenter();
    const v = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(v);
  }

  setSymbol(material) {
    if (material && material instanceof THREE.Material) {
      material.needsUpdate = true;
      const size = this.getMap().getSize();
      const width = size.width,
        height = size.height;
      material.resolution.set(width, height);
      this.getObject3d().children[0].material = material;
    }
    return this;
  }

  //test Baseobject customize its identity
  identify(coordinate) {
    const layer = this.getLayer(),
      size = this.getMap().getSize(),
      camera = this.getLayer().getCamera(),
      positions = this.getOptions().positions,
      altitude = this.getOptions().altitude;
    let canvas = layer._testCanvas;
    if (!canvas) {
      canvas = layer._testCanvas = document.createElement("canvas");
    }
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");

    const pixels = simplepath.vectors2Pixel(
      positions,
      size,
      camera,
      altitude,
      layer
    );
    const lineWidth = this.getObject3d().children[0].material.linewidth + 3;
    simplepath.draw(context, pixels, "LineString", { lineWidth: lineWidth });
    const pixel = this.getMap().coordToContainerPoint(coordinate);
    if (context.isPointInStroke(pixel.x, pixel.y)) {
      return true;
    }
  }
}

var simplepath = {
  positionsConvert: function(worldPoints, altitude = 0, layer) {
    const vectors = [];
    for (let i = 0, len = worldPoints.length; i < len; i += 3) {
      let x = worldPoints[i],
        y = worldPoints[i + 1],
        z = worldPoints[i + 2];
      if (altitude > 0) {
        z += layer.distanceToVector3(altitude, altitude).x;
      }
      vectors.push(new THREE.Vector3(x, y, z));
    }
    return vectors;
  },

  vectors2Pixel: function(worldPoints, size, camera, altitude = 0, layer) {
    if (!(worldPoints[0] instanceof THREE.Vector3)) {
      worldPoints = simplepath.positionsConvert(worldPoints, altitude, layer);
    }
    const pixels = worldPoints.map(worldPoint => {
      return simplepath.vector2Pixel(worldPoint, size, camera);
    });
    return pixels;
  },

  vector2Pixel: function(world_vector, size, camera) {
    const vector = world_vector.project(camera);
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    const result = {
      x: Math.round(vector.x * halfWidth + halfWidth),
      y: Math.round(-vector.y * halfHeight + halfHeight)
    };
    return result;
  },

  draw: function(context, data, type, options) {
    options = options || {};
    for (var key in options) {
      context[key] = options[key];
    }

    switch (type) {
      case "Circle": {
        // var size = options._size || options.size || 20;
        // let x = data.x || data[0],
        //     y = data.y || data[1];
        // context.beginPath();
        // context.moveTo(x, y);
        // context.arc(x, y, size, 0, Math.PI * 2);
        // context.fill();
        // context.restore();
        break;
      }
      case "LineString": {
        context.beginPath();
        for (var j = 0; j < data.length; j++) {
          var _xy = data[j];
          let x = _xy.x || _xy[0],
            y = _xy.y || _xy[1];
          if (j == 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
          // if(j===data.length-1){
          //     context.lineTo(data[0].x,data[0].y);
          // }
        }
        // context.closePath();
        context.stroke();
        context.restore();
        break;
      }
      default: {
        console.error("type" + type + "is not support now!");
      }
    }
  }
};
export default FatLine;

function getLinePosition(lineString, layer, cenerter) {
  const positions = [];
  const positionsV = [];
  if (Array.isArray(lineString) && lineString[0] instanceof THREE.Vector3) {
    for (let i = 0, len = lineString.length; i < len; i++) {
      const v = lineString[i];
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  } else {
    if (Array.isArray(lineString))
      lineString = new maptalks.LineString(lineString);
    if (!lineString || !(lineString instanceof maptalks.LineString)) return;
    const z = 0;
    const coordinates = lineString.getCoordinates();
    const centerPt = layer.coordinateToVector3(
      cenerter || lineString.getCenter()
    );
    for (let i = 0, len = coordinates.length; i < len; i++) {
      let coordinate = coordinates[i];
      if (Array.isArray(coordinate)) {
        coordinate = new maptalks.Coordinate(coordinate);
      }
      const v = layer.coordinateToVector3(coordinate, z).sub(centerPt);
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  }
  return {
    positions: positions,
    positionsV: positionsV
  };
}

function _getLinePosition(lineString, layer) {
  const positions = [];
  const positionsV = [];
  if (Array.isArray(lineString) && lineString[0] instanceof THREE.Vector3) {
    for (let i = 0, len = lineString.length; i < len; i++) {
      const v = lineString[i];
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  } else {
    if (Array.isArray(lineString))
      lineString = new maptalks.LineString(lineString);
    if (!lineString || !(lineString instanceof maptalks.LineString)) return;
    const z = 0;
    const coordinates = lineString.getCoordinates();
    for (let i = 0, len = coordinates.length; i < len; i++) {
      let coordinate = coordinates[i];
      if (Array.isArray(coordinate))
        coordinate = new maptalks.Coordinate(coordinate);
      const v = layer.coordinateToVector3(coordinate, z);
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  }
  return {
    positions: positions,
    positionsV: positionsV
  };
}
