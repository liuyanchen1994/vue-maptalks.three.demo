<template>
  <div class="container">
    <div id="map" class="hello"></div>
  </div>
</template>
<script>
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import shaders from "./shader";
import customShaders from "../utils/customShader";
import baseMapStyle from "./baseMapStyle";
import snow from "../utils/snow";
import ElectricShield from "../utils/electricShield";
export default {
  name: "snowEffect",
  mixins: [shaders, baseMapStyle, customShaders],
  props: {
    msg: String,
  },
  data() {
    return {
      arcgisUrl:
        "http://58.49.165.89:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1",
      map: null,
      waterCoord: [
        { x: 121.52351527406087, y: 31.254957979616442 },
        { x: 121.51453626464749, y: 31.254668868579596 },
        { x: 121.50838029765124, y: 31.253356060452415 },
        { x: 121.50265770319166, y: 31.251077740328608 },
        { x: 121.49947758216531, y: 31.24924923049952 },
        { x: 121.49833270448887, y: 31.248152901780838 },
        { x: 121.49772686120897, y: 31.24636180242438 },
        { x: 121.49741038322814, y: 31.244374657423396 },
        { x: 121.49782765730068, y: 31.24162888603404 },
        { x: 121.49945937982991, y: 31.23869382693284 },
        { x: 121.50442602335758, y: 31.23431919123241 },
        { x: 121.50498443300788, y: 31.23416600506183 },
        { x: 121.50521584271054, y: 31.233695831048138 },
        { x: 121.50682223728187, y: 31.232462811391617 },
        { x: 121.5092557826431, y: 31.230220735156404 },
        { x: 121.510923041023, y: 31.22829409716187 },
        { x: 121.5149186296327, y: 31.22973405120847 },
        { x: 121.51110818901522, y: 31.234170792114085 },
        { x: 121.50778640469203, y: 31.23689242773183 },
        { x: 121.50357511251534, y: 31.240294223278823 },
        { x: 121.50260843135872, y: 31.24155907626704 },
        { x: 121.50187793010528, y: 31.242764417586272 },
        { x: 121.50180910749683, y: 31.24416838193811 },
        { x: 121.503109098591, y: 31.24633542247486 },
        { x: 121.50552417705126, y: 31.24758674196015 },
        { x: 121.50758585252302, y: 31.248335936934275 },
        { x: 121.50754688177288, y: 31.248581122302326 },
        { x: 121.51531707827529, y: 31.250619130705093 },
        { x: 121.52136248014544, y: 31.250706482998993 },
        { x: 121.52605665096284, y: 31.250584762792727 },
        { x: 121.52351527406087, y: 31.254957979616442 },
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
      this.initLayer();
    },
    initLayer() {
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

        var ball = new ElectricShield(
          this.map.getCenter(),
          { radius: 10000, speed: 1.0 / 100.0 },
          this.getBuildMaterial3(threeLayer, require("../texture/rainbg.jpg")),
          threeLayer
        );

        let mesh = new snow(
          new maptalks.Polygon([this.waterCoord]),
          {
            interactive: false,
          },
          threeLayer
        );
        threeLayer.addMesh(ball);
        // threeLayer.addMesh(mesh);
      };
      threeLayer.addTo(this.map);
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
