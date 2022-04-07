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
import baseMapStyle from "./baseMapStyle";
import ElectricShield from "../utils/electricShield";
//球体效果
export default {
  name: "ballEffect",
  mixins: [shaders, baseMapStyle],
  props: {
    msg: String,
  },
  data() {
    return {
      arcgisUrl:
        "http://58.49.165.89:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1",
      map: null,
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
        // console.log(camera);
        // scene.fog = new THREE.FogExp2(0xff0000, 0.02);
        let light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, -10, 10);
        // light.castShadow = true
        scene.add(light);
        let pl = new THREE.PointLight(0xffffff, 2, 0);
        pl.position.set(0, 10, -10);
        camera.add(pl);

        var ball1 = new ElectricShield(
          this.map.getCenter(),
          { radius: 500, speed: 0.005 },
          this.getElectricShieldMaterial({
            // color: "#32CD32",
            color: "#FFB860",
            opacity: 1,
          }),
          threeLayer
        );
        var ball2 = new ElectricShield(
          this.map.getCenter(),
          { radius: 800, speed: 0.005 },
          this.getRippleShieldMaterial({
            color: "#0099FF",
            // color: "#FFB860",
            opacity: 1,
            num: 2,
          }),
          threeLayer
        );

        var ball3 = new ElectricShield(
          this.map.getCenter(),
          { radius: 1100, speed: 0.005 },
          this.getAlarmShieldMaterial({
            opacity: 0.6,
          }),
          threeLayer
        );

        const texture = new THREE.TextureLoader().load(
          require("../texture/noise.png")
        );
        texture.needsUpdate = true; //使用贴图时进行更新
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var ball4 = new ElectricShield(
          this.map.getCenter(),
          { radius: 1100, speed: 0.005 },
          this.getFbmShieldMaterial({
            color: "#0099FF",
            opacity: 1,
            texture: texture,
          }),
          threeLayer
        );

        var ball5 = new ElectricShield(
          this.map.getCenter(),
          { radius: 1400, speed: 0.005 },
          this.getElectricRippleShieldMaterial({
            color: "#0099FF",
            opacity: 1,
            num: 2
          }),
          threeLayer
        );

        var ball6 = new ElectricShield(
          this.map.getCenter(),
          { radius: 1700, speed: 0.005 },
          this.getLightBeamMaterial({
            color: "#0099FF",
            type: 0,
            dir: 3
          }),
          threeLayer
        );

        var ball7 = new ElectricShield(
          this.map.getCenter(),
          { radius: 6700, speed: 0.04 },
          this.getStarSkyMaterial(),
          threeLayer
        );

        threeLayer.addMesh(ball1);
        threeLayer.addMesh(ball2);
        threeLayer.addMesh(ball4);
        threeLayer.addMesh(ball5);
        threeLayer.addMesh(ball7);
        // threeLayer.addMesh(ball6);
        // threeLayer.addMesh(ball3);
        //=============================================
        threeLayer.config("animation", true);
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
