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
import rippleWall from "../utils/rippleWall";
import rippleWallNew from "../utils/rippleWall_New";
//围墙效果
export default {
  name: "wallEffect",
  mixins: [shaders, baseMapStyle],
  props: {
    msg: String,
  },
  data() {
    return {
      arcgisUrl:
        "http://58.49.165.89:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1",
      map: null,
      wallCord: [
        [121.50759037657753, 31.2482676781687],
        [121.5056258164493, 31.24767544155547],
        [121.50339844467047, 31.246446923156665],
        [121.50315089762903, 31.246386836724902],
        [121.50224701002122, 31.245134485084925],
        [121.50208168472543, 31.245125725248382],
        [121.50192727129453, 31.24458408716201],
        [121.50176988223961, 31.24373026337428],
        [121.5018879803093, 31.242792052207918],
        [121.50260835866662, 31.241568679961823],
        [121.50539034446977, 31.23909565461844],
        [121.5057900460174, 31.23899436664233],
        [121.5079755376758, 31.237133893963296],
        [121.50955830627919, 31.238122026097304],
        [121.51084172648714, 31.23827559416176],
        [121.51079499457666, 31.23821943292847],
        [121.5106223934608, 31.240243582690645],
        [121.51043485794622, 31.242285350720504],
        [121.51081306597436, 31.24384372050159],
        [121.51134783753139, 31.24477122033876],
        [121.50766416676665, 31.24827326531903],
        [121.50759037657753, 31.2482676781687],
        [121.50759037657753, 31.2482676781687],
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
        zoom: 16,
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

        //====================呼吸墙=====================
        let material = this.getBreathWallMaterial({
          opacity: 1,
          color: "#0099FF",
        });
        //呼吸墙
        let mesh = new rippleWall(
          this.wallCord,
          { height: 260, speed: 0.035 },
          material,
          threeLayer
        );
        threeLayer.addMesh(mesh);
        //============================================

        //====================波纹墙=====================
        let t_poly = turfhelp.polygon([this.wallCord]);
        let trancformPoly = transformScale(t_poly, 1.5);
        let rippleCoord = trancformPoly.geometry.coordinates;
        let ripplematerial = this.getRippleWall({
          opacity: 1,
          color: "#0099FF",
        });
        let ripplemesh = new rippleWallNew(
          new maptalks.Polygon(rippleCoord),
          { height: 260, speed: 0.015 },
          ripplematerial,
          threeLayer
        );
        threeLayer.addMesh(ripplemesh);
        //============================================

        //====================流星墙=====================
        let t_poly1 = turfhelp.polygon([this.wallCord]);
        let trancformPoly1 = transformScale(t_poly1, 2);
        let rippleCoord1 = trancformPoly1.geometry.coordinates;
        let meteormaterial = this.getMeteorMaterial({
          opacity: 0.7,
          color: "#EDD464",
        });
        let meteoremesh = new rippleWallNew(
          new maptalks.Polygon(rippleCoord1),
          { height: 300, speed: 0.025 },
          meteormaterial,
          threeLayer
        );
        threeLayer.addMesh(meteoremesh);
        //=============================================

        //====================漂浮墙=====================
        let t_poly2 = turfhelp.polygon([this.wallCord]);
        let trancformPoly2 = transformScale(t_poly2, 2.5);
        let rippleCoord2 = trancformPoly2.geometry.coordinates;
        let Floatermaterial = this.getFloaterWallMaterial({
          opacity: 0.7,
          color: "#EDD464",
        });
        let Floatermesh = new rippleWallNew(
          new maptalks.Polygon(rippleCoord2),
          { height: 300, speed: 0.025 },
          Floatermaterial,
          threeLayer
        );
        threeLayer.addMesh(Floatermesh);
        //=============================================

        //====================运动的图片贴图围墙 可以作为建筑贴图效果=====================
        let t_poly3 = turfhelp.polygon([this.wallCord]);
        let trancformPoly3 = transformScale(t_poly3, 3);
        let rippleCoord3 = trancformPoly3.geometry.coordinates;
        const texture = new THREE.TextureLoader().load(
          require("../texture/texture_02.png")
        );
        texture.needsUpdate = true; //使用贴图时进行更新
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(0.002, 0.002);
        // texture.repeat.set(1, 1);
        let Trailmaterial = this.getTrailWallMaterial({
          opacity: 0.8,
          color: "#EDD464",
          texture: texture,
        });
        let trailmesh = new rippleWallNew(
          new maptalks.Polygon(rippleCoord3),
          { height: 300, speed: 0.005 },
          Trailmaterial,
          threeLayer
        );
        threeLayer.addMesh(trailmesh);
        //===================================================================


        //====================火墙=====================
        let t_poly4 = turfhelp.polygon([this.wallCord]);
        let trancformPoly4 = transformScale(t_poly4, 3.5);
        let rippleCoord4 = trancformPoly4.geometry.coordinates;
        let firematerial = this.getSparkWallMaterial({
          opacity: 1,
          color: "#EDD464",
        });
        let firemesh = new rippleWallNew(
          new maptalks.Polygon(rippleCoord4),
          { height: 1000, speed: 0.025 },
          firematerial,
          threeLayer
        );
        threeLayer.addMesh(firemesh);
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
