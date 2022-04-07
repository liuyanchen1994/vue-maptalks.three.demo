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
  name: "buildTexture",
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
            this.getWaterShader()
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

        const markertexture = new THREE.TextureLoader().load(
          require("../texture/lightray_yellow.jpg")
        );
        let markermaterial = this.getRunTextureMaterial({
          texture: markertexture,
        });
        // markermaterial = new THREE.MeshBasicMaterial({
        //   // color: "#336699"
        //   color: "#001138",
        // });
        let marker = new threeMarker(
          [121.50237525596432, 31.23463280126761],
          {
            markerWidth: 32,
            markerHeight: 456,
            altitude: 0,
          },
          markermaterial,
          threeLayer
        );
        threeLayer.addMesh(marker);
        
        
        let marker2 = new threeMarker(
          [121.50237525596432, 31.23463280126761],
          {
            markerWidth: 32,
            markerHeight: 456,
            altitude: 0,
          },
          markermaterial,
          threeLayer
        );
        marker2.getObject3d().rotation.y=THREE.Math.degToRad(90);
        threeLayer.addMesh(marker2);
        // this.addThreeText(threeLayer);

        let gridmesh = new ringEffect(
          [121.50237525596432, 31.23463280126761],
          {
            radius: 100,
            speed: 0.025,
            // lineNum: 10
          },
          this.getGridPulseMaterial({
            color: "#EDD464",
            opacity: 1,
          }),
          threeLayer
        );
        threeLayer.addMesh(gridmesh);

        let beammesh = new ringEffect(
          [121.50190863154506, 31.231551748357415],
          {
            radius: 100,
            speed: 0.025,
            // lineNum: 10
          },
          this.getEmphasizePulseMaterial({
            color: "#EDD464",
            opacity: 1
          }),
          threeLayer
        );
        threeLayer.addMesh(beammesh);

        // let linematerial = this.getLightningLineMaterial({
        //   lineWidth: 100,
        //   color: "#fff",
        //   colorEnd: "0f0",
        //   trailOpacity: 0.7,
        //   percent: 0.6,
        //   num: 20,
        //   opacity: 1,
        // });
        // this.ringCoord.forEach((item) => {
        //   let path = [
        //     [121.50696853557473, 31.24378441172011],
        //     [item.x, item.y],
        //   ];
        //   let linestring = new maptalks.LineString(path);
        //   let arcline = new arcLine(
        //     linestring,
        //     { altitude: 0, height: 400, speed: 0.5 },
        //     linematerial,
        //     threeLayer
        //   );
        //   arcline.getObject3d().renderOrder = 5;
        //   // threeLayer.addMesh(arcline);
        // });
      };
      threeLayer.addTo(this.map);
    },
    addThreeText(threeLayer) {
      let v = threeLayer.coordinateToVector3(this.map.getCenter());
      var height = 0.01, //厚度
        size = 1, //大小
        curveSegments = 20,
        bevelThickness = 0.1,
        bevelSize = 0.1,
        bevelEnabled = false; // normal bold
      var loader = new THREE.FontLoader();
      // let fonturl = window.mapConfig.fontUrl; //字体路径 带http
      loader.load(
        "http://172.16.1.25:1013/font/gentilis_bold.typeface.json",
        (response) => {
          let font = response;
          let textGeo = new THREE.TextGeometry("Hello World", {
            font: font,
            size: size,
            height: height,
            curveSegments: curveSegments,

            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: bevelEnabled,
          });

          textGeo.computeBoundingBox();
          textGeo.computeVertexNormals();
          textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
          let material = new THREE.MeshBasicMaterial({
            // color: "#336699"
            color: "#fff",
          });
          material.vertexColors = THREE.VertexColors;
          material = this.getMeteorMaterial({ animate: true });
          let textMesh = new THREE.Mesh(textGeo, material);
          textMesh.scale.set(0.1, 0.1, 0.1);
          textMesh.rotation.x = Math.PI / 2;
          textMesh.position.x = v.x;
          textMesh.position.y = v.y;
          textMesh.position.z = 0.2;
          textMesh.renderOrder = 5;
          // textMesh.translateX(opts.translateX || 0);
          // textMesh.translateZ(opts.translateZ || 0);
          let pointLight = new THREE.PointLight(0xffffff, 2, 0);
          pointLight.position.set(0, 10, -10);
          textMesh.add(pointLight);
          threeLayer.addMesh(textMesh);
        }
      );
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
