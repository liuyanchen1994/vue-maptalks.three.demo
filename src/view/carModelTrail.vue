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
import GLTFLoader from "three-gltf-loader";
import tripModel from "../utils/tripModel";
//建筑贴图
export default {
  name: "carModelTrack",
  mixins: [shaders, baseMapStyle],
  props: {
    msg: String,
  },
  data() {
    return {
      arcgisUrl:
        "http://58.49.165.89:8010/ServiceAdapter/MAP/%E7%94%B5%E5%AD%90%E5%9C%B0%E5%9B%BE/07769b53b5243b7d6aea9df803f471c1",
      map: null,
      lineCoord: [
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
        this.addGltf(threeLayer, scene);
        // this.map.setCenter(lineString.getCoordinates()[0]);
      };
      threeLayer.addTo(this.map);
    },
    addGltf(threeLayer, scene) {
      const loader = new GLTFLoader();
      loader.load(
        "http://localhost:1013/3DModel/gltf/drone/drone.gltf",
        (gltf) => {
          var object = gltf.scene;
          // object.scale.set(0.03, 0.03, 0.03);//car
          object.scale.set(0.001, 0.001, 0.001); //drone
          object.rotation.set(Math.PI / 2, 0, 0);

          var v = threeLayer.coordinateToVector3([
            121.50644832088214,
            31.228728428122547,
          ]);
          object.position.copy(v);
          // object.renderOrder = 5;

          const texture2 = new THREE.TextureLoader().load(
            require("../texture/building.png")
          );
          texture2.needsUpdate = true; //使用贴图时进行更新
          texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = this.getTrailWallMaterial({ texture: texture2 });
              // child.material.transparent = !1;
              // child.material.blending = THREE.NoBlending;
              // child.material.depthTest = !1;
              // child.material.wireframe = true;
            }
          });
          let pl = new THREE.PointLight(0xffffff, 2, 0);
          pl.position.set(0, 10, -10);
          object.add(pl);
          scene.add(object);
          // this.lineCoord.reverse()
          const lineString = new maptalks.LineString(this.lineCoord);
          const line = threeLayer.toLine(
            lineString,
            { altitude: 200 },
            new THREE.LineBasicMaterial()
          );
          let tripBox = new tripModel(lineString, {}, object, threeLayer);
          threeLayer.addMesh(tripBox).addMesh(line);
          // threeLayer.renderScene();
        },
        (xhr) => {
          // called while loading is progressing
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          // called when loading has errors
          console.error("An error happened", error);
        }
      );
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
