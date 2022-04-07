<template>
  <div class="container">
    <div id="map" class="hello"></div>
  </div>
</template>
<script>
// var pbf2json = require("pbf2json"),
//   through = require("through2");
var Pbf = require("pbf"),
  geobuf = require("geobuf");
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import * as turfhelp from "@turf/helpers";
import transformScale from "@turf/transform-scale";
import LZString from "lz-string";
import shaders from "./shader";
import rippleWallNew from "../utils/rippleWall_New";
import customPolygon from "../utils/customPolygon";
import customPalneBuffer from "../utils/customPalneBuffer";
import Terrain from "../utils/terrain";
import axios from "axios";
import { Layers } from "three";
export default {
  name: "hangzhou",
  mixins: [shaders],
  props: {
    msg: String,
  },
  data() {
    return {
      map: null,
      threeLayer: null,
      altitude: {
        landuse: 0.3,
        water: 0.5,
        road: 0.6,
        build: 0.7,
        moutain: 0.8,
      },
      renderOrder: {
        ground: 1,
        landuse: 2,
        water: 3,
        road: 4,
        build: 5,
        moutain: 7,
      },
      colors: {
        ground: "#0F0D29",
        landuse: "#1A3127",
        road: "#010001",
        build: "#0F2F6B",
        // build: "#001138",
      },
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      this.map = new maptalks.Map("map", {
        center: [120.19158208535214, 30.239683129536814],
        zoom: 12,
        pitch: 40,
        baseLayer: new maptalks.TileLayer("base", {
          urlTemplate: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          subdomains: ["a", "b", "c", "d"],
        }).hide(),
      });
      this.map.on("click", (e) => {
        console.log(e.coordinate);
      });
      this.initLayer();
    },
    initLayer() {
      let threeLayer = new ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        forceRenderOnZooming: true,
        animation: true,
      });
      let meshs = [];
      threeLayer.prepareToDraw = (gl, scene, camera) => {
        let light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, -10, 10);
        scene.add(light);
        let pl = new THREE.PointLight(0xffffff, 2, 0);
        pl.position.set(0, 10, -10);
        camera.add(pl);
      };
      threeLayer.addTo(this.map);
      this.threeLayer = threeLayer;
      setTimeout(() => {
        //地面
        this.loadGround();
        // 土地利用面
        this.loadLandUseData();
        // 水面
        this.loadWaterData();
        // 道路
        this.loadRoadData();
        //建筑
        this.loadBuildData();
        //山
        this.loadMoutainData();
      });
    },
    //加载地面
    loadGround() {
      let material = new THREE.MeshBasicMaterial({
        color: this.colors.ground,
      });
      let v = this.threeLayer.coordinateToVector3(this.map.getCenter());
      let ground = new customPalneBuffer(
        this.map.getCenter(),
        {
          radius: 500000,
          interactive: false,
        },
        material,
        this.threeLayer
      );
      ground.getObject3d().position.z = -0.1;
      ground.getObject3d().renderOrder = this.renderOrder.ground;
      this.threeLayer.addMesh(ground);
    },
    //加载土地利用面pbf数据
    loadLandUseData() {
      axios
        .get("http://localhost:1013/3DModel/hangzhou/hangzhou-landuse.pbf", {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let data = res.data;
          let geojson = geobuf.decode(new Pbf(data)); // 对GeoBuf解码
          // console.info(JSON.stringify(geojson));
          console.log(geojson.features.length, "landuseLength");
          this.addLandUse(geojson);
        });
    },
    //加载土地利用面
    addLandUse(data) {
      let material = new THREE.MeshBasicMaterial({
        color: this.colors.landuse,
      });
      let landuseMeshes = [];
      data.features.forEach((item) => {
        let polygon = maptalks.GeoJSON.toGeometry(item);
        let landuseMesh = new customPolygon(
          polygon,
          { interactive: false },
          material,
          this.threeLayer
        );
        // let landuseMesh = this.threeLayer.toExtrudePolygon(
        //   polygon,
        //   { height: 0.1, interactive: false },
        //   material
        // );
        landuseMesh.getObject3d().position.z = this.toThreeZ(
          this.altitude.landuse
        );
        landuseMesh.getObject3d().renderOrder = this.renderOrder.landuse;
        landuseMeshes.push(landuseMesh);
      });
      this.threeLayer.addMesh(landuseMeshes);
    },
    //读取pbf水域数据
    loadWaterData() {
      axios
        .get("http://localhost:1013/3DModel/hangzhou/hangzhou-water.pbf", {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let data = res.data;
          let geojson = geobuf.decode(new Pbf(data)); // 对GeoBuf解码
          console.log(geojson.features.length, "waterTotal");
          this.addWater(geojson);
        });
    },
    //加载水域
    addWater(data) {
      const t1 = new THREE.TextureLoader().load(
        require("../texture/noise.png")
      );
      // t1.needsUpdate = true; //使用贴图时进行更新
      t1.wrapS = t1.wrapT = THREE.RepeatWrapping;
      const t2 = new THREE.TextureLoader().load(
        require("../texture/thumb_ocean.jpg")
      );
      // t2.needsUpdate = true; //使用贴图时进行更新
      t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
      const t3 = new THREE.TextureLoader().load(
        require("../texture/Pebbles_in_mortar_pxr128.jpg")
      );
      // t3.needsUpdate = true; //使用贴图时进行更新
      t3.wrapS = t3.wrapT = THREE.RepeatWrapping;
      let opts = {
        t1: t1,
        t2: t2,
        t3: t3,
        cloudCover: 0.3,
        md: 8,
      };
      let material = this.getWaterShader(opts);
      let polygons = [];
      data.features.forEach((item) => {
        let polygon = maptalks.GeoJSON.toGeometry(item);
        const properties = item.properties;
        properties.height = 0.1;
        polygon.setProperties(properties);
        polygons.push(polygon);
      });
      let waterMeshes = this.threeLayer.toExtrudePolygons(
        polygons,
        {
          topColor: "#fff",
          interactive: false,
        },
        material
      );
      waterMeshes.getObject3d().position.z = this.toThreeZ(this.altitude.water);
      waterMeshes.getObject3d().renderOrder = this.renderOrder.water;
      this.threeLayer.addMesh(waterMeshes);
    },
    //读取道路pbf数据
    loadRoadData() {
      axios
        .get("http://localhost:1013/3DModel/hangzhou/hangzhou-roads.pbf", {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let data = res.data;
          let geojson = geobuf.decode(new Pbf(data)); // 对GeoBuf解码
          // console.info(JSON.stringify(geojson));
          console.log(geojson.features.length, "roadTotal");
          let arrays = this.splitArrays(geojson.features, 300);
          for (let i = 0; i < arrays.length; i++) {
            setTimeout(() => {
              this.addRoad(arrays[i]);
            }, 100);
          }
        });
    },
    //加载道路
    addRoad(data) {
      let material = new THREE.MeshBasicMaterial({
        color: this.colors.road,
      });
      material = new THREE.LineBasicMaterial({
        linewidth: 1,
        color: this.colors.road,
        transparent: true,
      });
      let lineStrings = [];
      data.forEach((item) => {
        let linestring = maptalks.GeoJSON.toGeometry(item);
        lineStrings.push(linestring);
      });
      let roadMeshes = this.threeLayer.toLines(
        lineStrings,
        { interactive: false },
        // { interactive: false, minZoom: 11, maxZoom: 19 },
        material
      );
      // roadMesh.getObject3d().renderOrder = this.renderOrder.road;
      this.threeLayer.addMesh(roadMeshes);
    },
    loadBuildData() {
      let material = this.getBuildMaterial();
      axios
        .get("http://localhost:1013/3DModel/hangzhou/hangzhou-building.pbf", {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let data = res.data;
          let geojson = geobuf.decode(new Pbf(data)); // 对GeoBuf解码
          // console.info(JSON.stringify(geojson));
          console.log(geojson.features.length, "buildingLength");
          let arrays = this.splitArrays(geojson.features, 3000);
          for (let i = 0; i < arrays.length; i++) {
            setTimeout(() => {
              this.addBuilding(arrays[i], material);
            }, 1000);
          }
        });
    },
    addBuilding(data, material) {
      const texture = new THREE.TextureLoader().load(
        require("../texture/texture_05.png")
      );
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set()
      let _material = this.getTrailWallMaterial({
        opacity: 1,
        color: "#1D82FE",
        texture: texture,
      });
      _material.blending = THREE.NoBlending;
      _material.transparent = !1;
      let polygons = [];
      let outsideMeshes = [];
      
      const topColor = new THREE.Color(this.colors.build);
      data.forEach((item) => {
        if (
          item &&
          item.geometry &&
          item.geometry.type == "Polygon" &&
          item.geometry.coordinates &&
          item.geometry.coordinates.length > 0
          // item.geometry.coordinates[0].length > 0
        ) {
          let polygon = maptalks.GeoJSON.toGeometry(item);
          let height = item.properties.Floor * 4;
          const properties = item.properties;
          properties.height = height;
          polygon.setProperties(properties);
          polygons.push(polygon);

          // let t_poly = turfhelp.polygon(item.geometry.coordinates);
          // let trancformPoly = transformScale(t_poly, 1.03);
          // item.geometry.coordinates = trancformPoly.geometry.coordinates;
          // let trailmesh = new rippleWallNew(
          //   maptalks.GeoJSON.toGeometry(item),
          //   { height: height, speed: 0, interactive: false },
          //   // { height: height, speed: 0.000005 },
          //   _material,
          //   this.threeLayer
          // );
          // outsideMeshes.push(trailmesh);
        }
      });
      // material = this.getTrailWallMaterial({
      //   opacity: 1,
      //   color: "#EDD464",
      //   texture: texture,
      // });
      let insideMeshes = this.threeLayer.toExtrudePolygons(
        polygons,
        {
          topColor: "#fff",
          interactive: false,
          // asynchronous: true
        },
        _material
      );
      const bufferGeometry = insideMeshes.getObject3d().geometry;
      const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);

      const { vertices, faces, faceVertexUvs } = geometry;
      for (let i = 0, len = faces.length; i < len; i++) {
        const { a, b, c } = faces[i];
        const p1 = vertices[a],
          p2 = vertices[b],
          p3 = vertices[c];
        //top face
        if (p1.z > 0 && p2.z > 0 && p3.z > 0) {
          const vertexColors = faces[i].vertexColors;
          for (let j = 0, len1 = vertexColors.length; j < len1; j++) {
            vertexColors[j].r = topColor.r;
            vertexColors[j].g = topColor.g;
            vertexColors[j].b = topColor.b;
          }
          const uvs = faceVertexUvs[0][i];
          for (let j = 0, len1 = uvs.length; j < len1; j++) {
            uvs[j].x = 0;
            uvs[j].y = 0;
          }
        }
      }
      insideMeshes.getObject3d().geometry = new THREE.BufferGeometry().fromGeometry(
        geometry
      );
      bufferGeometry.dispose();
      geometry.dispose();
      // roadMesh.getObject3d().renderOrder = this.renderOrder.road;
      this.threeLayer.addMesh(insideMeshes);
      // this.threeLayer.addMesh(outsideMeshes);
    },
    loadMoutainData() {
      fetch("http://localhost:1013/3DModel/hangzhou/hangzhou.dem")
        .then((res) => res.text())
        .then((evadata) => {
          evadata = LZString.decompressFromBase64(evadata);
          evadata = JSON.parse(evadata);
          const roads = evadata,
            data = [];
          const elevationMap = {};
          roads.forEach((element) => {
            let coordinates = element.l;
            if (coordinates) {
              const elevation = element.h;
              elevationMap[elevation] = elevation;
              coordinates.slice(0, coordinates.length - 1).forEach((lnglat) => {
                lnglat[2] = elevation * 2;
                data.push(lnglat);
              });
            }
          });
          this.addMoutain(data);
        });
    },
    addMoutain(data) {
      var terrainMaterial = new THREE.MeshPhongMaterial({
        side: 2,
        transparent: true,
        color: "#4c7d42",
      });
      terrainMaterial.opacity = 0.7;
      terrainMaterial = this.getRippleWall({ color: "#4c7d42" });
      const m = new Terrain(
        data,
        { interactive: false },
        terrainMaterial,
        this.threeLayer
      );
      m.getObject3d().position.z = this.toThreeZ(this.altitude.moutain);
      m.getObject3d().renderOrder = this.renderOrder.moutain;
      this.threeLayer.addMesh(m);
    },
    getBuildMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      let material = new THREE.MeshPhongMaterial({
        color: this.colors.build,
      });
      material.vertexColors = THREE.VertexColors;
      return material;
    },
    toThreeZ(altitude) {
      const z = this.threeLayer.distanceToVector3(altitude, altitude).x;
      return z;
    },
    splitArrays(data, senArrLen) {
      //处理成len个一组的数据
      let data_len = data.length;
      let arrOuter_len =
        data_len % senArrLen === 0
          ? data_len / senArrLen
          : parseInt(data_len / senArrLen + "") + 1;
      let arrSec_len = data_len > senArrLen ? senArrLen : data_len; //内层数组的长度
      let arrOuter = new Array(arrOuter_len); //最外层数组
      let arrOuter_index = 0; //外层数组的子元素下标
      // console.log(data_len % len);
      for (let i = 0; i < data_len; i++) {
        if (i % senArrLen === 0) {
          arrOuter_index++;
          let len = arrSec_len * arrOuter_index;
          //将内层数组的长度最小取决于数据长度对len取余，平时最内层由下面赋值决定
          arrOuter[arrOuter_index - 1] = new Array(data_len % senArrLen);
          if (arrOuter_index === arrOuter_len)
            //最后一组
            data_len % senArrLen === 0
              ? (len = (data_len % senArrLen) + senArrLen * arrOuter_index)
              : (len =
                  (data_len % senArrLen) + senArrLen * (arrOuter_index - 1));
          let arrSec_index = 0; //第二层数组的索引
          for (let k = i; k < len; k++) {
            //第一层数组的开始取决于第二层数组长度*当前第一层的索引
            arrOuter[arrOuter_index - 1][arrSec_index] = data[k];
            arrSec_index++;
          }
        }
      }
      return arrOuter;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  .hello {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(25, 60, 114, 1) 10%,
      rgba(25, 215, 246, 0)
    );
  }
}
</style>
