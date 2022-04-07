<template>
  <div class="container">
    <div id="map" class="hello"></div>
  </div>
</template>
<script>
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import * as turfhelp from "@turf/helpers";
import transformScale from "@turf/transform-scale";
import shaders from "./shader";
import baseMapStyle from "./baseMapStyle";
import rippleWallNew from "../utils/rippleWall_New";
import ringEffect from "../utils/ringEffect";
import threeMarker from "../utils/threeMarker";
//建筑贴图
export default {
  name: "PluseEffect",
  mixins: [shaders, baseMapStyle],
  props: {
    msg: String,
  },
  data() {
    return {
      arcgisUrl:
        "http://58.49.165.89:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1",
      map: null,
      ringCoord: [
        {
          type: 0,
          color: "#00CC66",
          x: 121.50250164857313,
          y: 31.243789458316513,
        },
        {
          type: 0,
          color: "#0099FF",
          x: 121.51291188098662,
          y: 31.244421532174822,
        },
        {
          type: 1,
          color: "#330099",
          x: 121.51796909388086,
          y: 31.248206777683762,
        },
        {
          type: 1,
          color: "#660099",
          x: 121.52267887095772,
          y: 31.248935801323146,
        },
        {
          type: 1,
          color: "#990066",
          x: 121.52153070821298,
          y: 31.24196504645719,
        },
        {
          type: 0,
          color: "#993399",
          x: 121.51208010071852,
          y: 31.234559325931574,
        },
        {
          type: 1,
          color: "#99FF00",
          x: 121.49698356203153,
          y: 31.244124073226594,
        },
        {
          type: 0,
          color: "#FF6600",
          x: 121.49653131626006,
          y: 31.248431574261996,
        },
        {
          type: 0,
          color: "#660066",
          x: 121.49082450780874,
          y: 31.24684749146745,
        },
        {
          type: 0,
          color: "#660066",
          x: 121.5185101479437,
          y: 31.23863411430602,
        },
      ],
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      this.mapStyle1 = this.mapStyle1.replace(" ", "");
      this.map = new maptalks.Map("map", {
        center: [121.50095457703048, 31.238960386861237], //上海
        zoom: 17,
        pitch: 50,
        view: {
          projection: "baidu",
        },
        baseLayer: new maptalks.TileLayer("base", {
          // urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          urlTemplate: this.mapStyle,
          subdomains: ["a", "b", "c", "d"],
        }),
      });
      this.map.on("click", (e) => {
        console.log(e.coordinate);
      });

      let buildFeature = [];
      let buildSet = JSON.parse(JSON.stringify(shangHaiData));
      buildSet.forEach((item) => {
        item.buildings.features.forEach((b, index) => {
          if (b.geometry.coordinates[0].length > 3) {
            b.geometry.coordinates[0].map((coord) => {
              let c = window.convertCoord.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
            b.geometry.coordinates[0].push(b.geometry.coordinates[0][0]);
            b.geometry.coordinates[0].push(b.geometry.coordinates[0][0]);
            b.geometry.coordinates[0].push(b.geometry.coordinates[0][0]);
          }
          buildFeature.push(b);
        });
      });
      this.initLayer(buildFeature);
      // let layer = new maptalks.VectorLayer("aaa").addTo(this.map);
      // let marker = new maptalks.Marker(this.map.getCenter(), {
      //   symbol: {
      //     markerFile: require("../texture/marker.png"),
      //   },
      // }).addTo(layer);
    },
    initLayer(buildFeature) {
      let threeLayer = new ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
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

        this.addBuild(buildFeature, threeLayer);

        this.addPluse(threeLayer);
      };
      threeLayer.addTo(this.map);
    },
    addPluse(threeLayer) {
      let meshes = [];
      let materials = [
        this.getGridPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getFogPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getAlternateCurtainPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getGammaCurtainPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getDropPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getFlowerPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getTornadoPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getVortexPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getDotPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        this.getBreathPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
      ];
      this.ringCoord.forEach((item, index) => {
        let mesh = new ringEffect(
          [item.x, item.y],
          {
            radius: 100,
            speed: 0.025,
            // lineNum: 10
          },
          materials[index],
          threeLayer
        );
        mesh.setCoordinates([item.x, item.y]);
        meshes.push(mesh);
      });
      threeLayer.addMesh(meshes);
    },
    addTrailObject(threeLayer){
      
    },
    addBuild(buildFeature, threeLayer) {
      let buildmesh = [];
      const texture = new THREE.TextureLoader().load(
        require("../texture/texture_02.png")
      );
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      const texture2 = new THREE.TextureLoader().load(
        require("../texture/texture_002.png")
      );
      texture2.needsUpdate = true; //使用贴图时进行更新
      texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 1);
      let material = this.getTrailWallMaterial({
        opacity: 1,
        color: "#EDD464",
        texture: texture,
      });
      let material2 = this.getTrailWallMaterial({
        opacity: 1,
        color: "#EDD464",
        texture: texture2,
      });
      buildFeature.forEach((g) => {
        let height = g.properties.height || 0 + 20;
        let mesh = threeLayer.toExtrudePolygon(
          maptalks.GeoJSON.toGeometry(g),
          {
            height: height,
            topColor: "#fff",
            interactive: false,
          },
          this.getBuildMaterial()
        );
        if (g.geometry.type == "Polygon") {
          let t_poly = turfhelp.polygon(g.geometry.coordinates);
          let trancformPoly = transformScale(t_poly, 1.03);
          g.geometry.coordinates = trancformPoly.geometry.coordinates;
          let trailmesh = new rippleWallNew(
            maptalks.GeoJSON.toGeometry(g),
            { height: height, speed: 0, interactive: false },
            // { height: height, speed: 0.000005 },
            height > 400 ? material2 : material,
            threeLayer
          );
          buildmesh.push(trailmesh);
        }
        buildmesh.push(mesh);
      });
      threeLayer.addMesh(buildmesh);
    },
    getBuildMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      let material = new THREE.MeshBasicMaterial({
        // color: "#336699"
        color: "#001138",
      });
      material.vertexColors = THREE.VertexColors;
      return material;
      // let tmap = new THREE.TextureLoader().load(require("../texture/buildVert3.png"));
      // tmap.wrapS = tmap.wrapT = THREE.RepeatWrapping;
      // tmap.anisotropy = 10;
      // let material3 = new THREE.MeshPhongMaterial({
      //   map: THREE.ImageUtils.loadTexture(require('./buildVert3.png'))
      // })
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
  }
}
</style>
