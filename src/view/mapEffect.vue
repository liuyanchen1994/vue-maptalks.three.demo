<template>
  <div class="container">
    <div id="map" class="hello"></div>
    <div class="attributes">
      <a href="https://maptalks.org">maptalks ❤ </a>
      <a href="https://maptalks.org/maptalks.three">maptalks.three</a>
    </div>
  </div>
</template>
<script>
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import { MeshLineMaterial } from "../utils/THREE.MeshLine";
import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
import GLTFLoader from "three-gltf-loader";
import shaders from "./shader";
import mapStyle from "./baseMapStyle";
import baseMapStyle from "./baseMapStyle";
import rippleWallNew from "../utils/rippleWall_New";
import rippleWall from "../utils/rippleWall";
import ocean from "../utils/ocean";
import arcLine from "../utils/arcLine";
import RingEffect from "../utils/ringEffect";
import RingTextureEffect from "../utils/ringTextureEffect";
import ElectricShield from "../utils/electricShield";
import * as turfhelp from "@turf/helpers";
import transformScale from "@turf/transform-scale";
import coolWater from "../utils/coolWater";
import coolWater2 from "../utils/coolWater2";
import threeMarker from "../utils/threeMarker";
import tripModel from "../utils/tripModel";
import devtools from "devtools-detect";
export default {
  name: "mapEffect",
  mixins: [baseMapStyle, shaders],
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
      halfBallCoord: [121.51846987052856, 31.238264295884044],
      halfBallCoord2: [121.4974390031282, 31.2352161509021],
      randarCoord1: [121.51597457408171, 31.233194316927445],
      randarCoord2: [121.50765454889154, 31.242154336658842],
      cylinderCoord: [121.50696853557473, 31.24378441172011],
      scanRandarCoord: [121.49449201446308, 31.242482082874037],
      bearing: 0,
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
      wallCoord2: [
        [121.50283541362738, 31.23503951840679],
        [121.50429366369418, 31.233716712786624],
        [121.5059306613203, 31.23239450062015],
        [121.50686448673446, 31.231304630043216],
        [121.50636784978126, 31.230973127120986],
        [121.50527474480066, 31.230687479513207],
        [121.50419551987835, 31.230522612188935],
        [121.50363537602128, 31.23171947116012],
        [121.50317527144244, 31.232853806902476],
        [121.50244435035873, 31.23349719662562],
        [121.50220904686243, 31.233693407026898],
        [121.50168958862899, 31.23449345435146],
        [121.50283541362738, 31.23503951840679],
        [121.50283541362738, 31.23503951840679],
      ],
      wallCoord3: [
        [121.49027079720277, 31.246224502694652],
        [121.49175133500768, 31.24237934492764],
        [121.49664679501969, 31.24363689932404],
        [121.49653793747083, 31.244735230631367],
        [121.49675359043547, 31.246434368709462],
        [121.49334490221476, 31.246512848989997],
        [121.49027079720277, 31.246224502694652],
        [121.49027079720277, 31.246224502694652],
      ],
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
    window.addEventListener("devtoolschange", (event) => {
      if (event.detail.isOpen && disableDevtool)
        window.location.href = "https://www.simplelwy.cn";
    });
    this.loadMap();
  },
  methods: {
    loadMap() {
      this.map = new maptalks.Map("map", {
        // center: [114.3938, 30.50838],//武汉
        center: [121.50695457703048, 31.238960386861237], //上海
        zoom: 17,
        minZoom: 15,
        pitch: 60,
        opacity: 0.6,
        bearing: 15,
        view: {
          projection: "baidu",
        },
        attribution: false,
        baseLayer: new maptalks.TileLayer("base", {
          // urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          fogColor: [25, 60, 114],
          urlTemplate: this.mapStyle,
          subdomains: ["a", "b", "c", "d"],
        }).hide(),
      });
      this.map.on("click", (e) => {
        console.log(e.coordinate);
      });
      // this.changeView();
      let buildFeature = [],
        roadFeature = [],
        waterFeature = [];
      let buildSet = JSON.parse(JSON.stringify(shangHaiData));
      buildSet.forEach((item) => {
        item.buildings.features.forEach((b) => {
          if (b.geometry.coordinates[0].length > 3) {
            b.geometry.coordinates[0].map((coord) => {
              let c = window.convertCoord.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });

            b.geometry.coordinates[0].push(b.geometry.coordinates[0][0]);
            b.geometry.coordinates[0].push(b.geometry.coordinates[0][0]);
          }
          buildFeature.push(b);
        });
        item.water.features.forEach((b) => {
          if (b.geometry.coordinates[0].length > 3)
            b.geometry.coordinates[0].map((coord) => {
              let c = window.convertCoord.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
          waterFeature.push(b);
        });
        item.roads.features.forEach((r) => {
          if (r.geometry.coordinates.length > 3) {
            r.geometry.coordinates.map((coord) => {
              let c = window.convertCoord.WGS84_BD(coord[0], coord[1]);
              coord[0] = c[0];
              coord[1] = c[1];
            });
            roadFeature.push(r);
          }
        });
      });
      this.initLayer(buildFeature, roadFeature, waterFeature);
    },

    changeView() {
      this.map.setBearing((this.bearing += 0.1));
      requestAnimationFrame(this.changeView);
    },
    initLayer(features, roadFeature, waterFeature) {
      let threeLayer = new ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        forceRenderOnZooming: true,
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
        pl.position.set(0, -10, 10);
        camera.add(pl);
        //建筑材质
        let buildmaterial = this.getBuildMaterial();
        buildmaterial = this.canvasOne();
        // buildmaterial = this.getBuildTextureShaderMaterial(
        //   require("../texture/texture_004.png"),
        //   { opacity: 1 }
        // );
        //地面材质
        let basematerial = this.getBaseGeometryMaterial();
        //地面
        let baseMesh = this.getBaseMesh(basematerial, threeLayer);
        meshs.push(baseMesh);

        // let skymesh = this.getSkyMesh(threeLayer);
        // meshs.push(skymesh);
        //建筑
        let buildMesh = this.getBuildMesh(features, buildmaterial, threeLayer);

        //水面
        let waterMesh = this.getWaterMesh(waterFeature, threeLayer);
        //道路
        let roadMesh = this.getRoadMesh(roadFeature, threeLayer);
        //半球
        let ballMesh = this.getBallMesh(threeLayer);
        //动画环
        let ringMesh = this.getRingMesh(threeLayer);
        // 扩散圆柱
        let ringBuildMesh = this.getringBuildMesh(threeLayer);
        //雷达
        let randarMesh = this.getRandarMesh(threeLayer);
        //水闸
        // let shuizhaMesh = this.getShuiZhaMesh(threeLayer, scene);
        // this.addThreeText(threeLayer);
        this.addArcLine(threeLayer);
        var boxMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({
            // color: "#2C3135"
            color: "#00295a",
          })
        );
        boxMesh.renderOrder = 70;
        let v = threeLayer.coordinateToVector3(this.map.getCenter());
        boxMesh.add(pl);
        boxMesh.position.set(v.x, v.y, 2);
        // threeLayer.addMesh(boxMesh);
        threeLayer.addMesh(
          meshs.concat(
            buildMesh,
            roadMesh,
            ballMesh,
            ringMesh,
            randarMesh,
            ringBuildMesh,
            waterMesh
          )
        );
        //====================呼吸墙=====================
        let material = this.getBreathWallMaterial({
          opacity: 1,
          color: "#0099FF",
        });
        //呼吸墙
        let mesh = new rippleWall(
          this.wallCord,
          { height: 460, speed: 0.15 },
          material,
          threeLayer
        );
        mesh.getObject3d().renderOrder = 20;
        threeLayer.addMesh(mesh);
        //============================================

        //====================流星墙=====================
        let meteormaterial = this.getMeteorMaterial({
          opacity: 1,
          color: "#FF9900",
        });
        let meteoremesh = new rippleWallNew(
          new maptalks.Polygon(this.wallCoord2),
          { height: 100, speed: 0.025 },
          meteormaterial,
          threeLayer
        );
        meteoremesh.getObject3d().renderOrder = 20;
        threeLayer.addMesh(meteoremesh);
        //=============================================

        //====================波纹墙=====================
        let ripplematerial = this.getRippleWall({
          opacity: 1,
          color: "#0099FF",
        });
        let ripplemesh = new rippleWallNew(
          new maptalks.Polygon(this.wallCoord3),
          { height: 150, speed: 0.035 },
          ripplematerial,
          threeLayer
        );
        ripplemesh.getObject3d().renderOrder = 20;
        threeLayer.addMesh(ripplemesh);
        //============================================
        // threeLayer.config("animation", true);
        this.addGltf(threeLayer, scene);
      };
      threeLayer.addTo(this.map);
    },
    //水闸模型
    getShuiZhaMesh(threeLayer, scene) {
      // THREE.Loader.Handlers.add( /\.dds$/i, new DDSLoader() );
      // const textureResolve = file => require("../model/" + file);

      var objLoader = new OBJLoader();
      var mtlLoader = new MTLLoader();
      // mtlLoader.setPath('Desktop/');
      let that = this;
      let objurl = `http://172.16.1.25:1013/3DModel/obj/bengzhan/bz.obj`, //貌似必须要全路径 相对路径或绝对路径报错
        mtlurl = `http://172.16.1.25:1013/3DModel/obj/bengzhan/bz.mtl`;
      mtlLoader.load(mtlurl, function(materials) {
        materials.preload();
        objLoader.setMaterials(materials);
        // objLoader.setPath('building/');
        objLoader.load(objurl, function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.scale.set(0.001, 0.001, 0.001);
              child.rotation.set((Math.PI * 5) / 2, 80, 0);
            }
          });
          var v = threeLayer.coordinateToVector3(that.map.getCenter());
          // var v = threeLayer.coordinateToVector3(new maptalks.Coordinate([121.63175084592564,29.101067688484296]));
          object.position.x = v.x;
          object.position.y = v.y;
          object.position.z = v.z;
          scene.add(object);
          // mtlLoaded = true;
          threeLayer.renderScene();
        });
      });
    },
    addGltf(threeLayer, scene) {
      const loader = new GLTFLoader();
      loader.load(
        // "http://localhost:1013/3DModel/gltf/moto/moto.gltf",
        modelurl,
        // "http://localhost:1013/3DModel/gltf/drone/drone.gltf",
        (gltf) => {
          var object = gltf.scene;
          object.scale.set(0.01, 0.01, 0.01);//car
          // object.scale.set(0.001, 0.001, 0.001); //drone
          // object.scale.set(0.1, 0.1, 0.1); //moto
          object.rotation.set(Math.PI / 2, 0, 0);

          var v = threeLayer.coordinateToVector3([
            121.50644832088214,
            31.228728428122547,
          ]);
          object.position.copy(v);
          object.renderOrder = 10;
          // object.renderOrder = 5;

          const texture2 = new THREE.TextureLoader().load(
            require("../texture/building.png")
          );
          texture2.needsUpdate = true; //使用贴图时进行更新
          texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
          let material = new THREE.MeshPhongMaterial({
            color: "#CC9933"
            // color: "#001138",
          });
          // material.vertexColors = THREE.VertexColors;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // child.material = material;
              // child.material = this.getTrailWallMaterial({ texture: texture2 });
              // child.material.transparent = !1;
              // child.material.blending = THREE.NoBlending;
              // child.material.depthTest = !0;
              // child.material.wireframe = true;
              // child.renderOrder = 100;
            }
          });
          let pl = new THREE.DirectionalLight(0xffffff, 2, 10);
          // pl.position.y = 10;
          pl.position.set(0, 10, -40);
          pl.rotation.set(Math.PI / 2, Math.PI / 2, Math.PI / 2)
          object.add(pl);
          // scene.add(object);
          let path = [
            // { x: 121.4967878362632, y: 31.230629991359645 },
            // { x: 121.49735482993667, y: 31.230825907267526 },
            // { x: 121.49769739128837, y: 31.230844474463584 },
            // { x: 121.49902464167461, y: 31.230958923381284 },
            { x: 121.49972250126649, y: 31.231072862108338 },
            { x: 121.50077044563626, y: 31.231359622716234 },
            { x: 121.50105840359272, y: 31.231364703888374 },
            { x: 121.50154188161639, y: 31.23113868041745 },
            { x: 121.50203213072352, y: 31.231051486251936 },
            { x: 121.50202207997006, y: 31.231214100671608 },
            { x: 121.50143594325566, y: 31.23339082373219 },
            { x: 121.50226316408086, y: 31.23339193478618 },
          ];
          const lineString = new maptalks.LineString(path);
          const line = threeLayer.toLine(
            lineString,
            { altitude: 200 },
            new THREE.LineBasicMaterial()
          );
          let tripBox = new tripModel(lineString, {}, object, threeLayer);
          // threeLayer.addMesh(tripBox).addMesh(line);
          threeLayer.addMesh(object);
          threeLayer.renderScene();
          threeLayer.addMesh(tripBox);
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
    getWaterMesh(waterFeature, threeLayer) {
      let waters = [];

      const t1 = new THREE.TextureLoader().load(
        require("../texture/noise.png")
      );
      t1.needsUpdate = true; //使用贴图时进行更新
      t1.wrapS = t1.wrapT = THREE.RepeatWrapping;
      const t2 = new THREE.TextureLoader().load(
        require("../texture/thumb_ocean.jpg")
      );
      t2.needsUpdate = true; //使用贴图时进行更新
      t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
      const t3 = new THREE.TextureLoader().load(
        require("../texture/Pebbles_in_mortar_pxr128.jpg")
      );
      t3.needsUpdate = true; //使用贴图时进行更新
      t3.wrapS = t3.wrapT = THREE.RepeatWrapping;
      let material = this.getWaterShader({
        t1: t1,
        t2: t2,
        t3: t3,
      });
      let mesh = threeLayer.toExtrudePolygon(
        new maptalks.Polygon([this.waterCoord]),
        {
          height: 0.1,
          interactive: false,
        },
        material
      );
      mesh.getObject3d().position.z = 0.001;
      // mesh.getObject3d().renderOrder = 2;
      waters.push(mesh);
      waterFeature.forEach((g) => {
        if (g.geometry.type == "Polygon") {
          //water 1
          // var mesh = new ocean(
          //   maptalks.GeoJSON.toGeometry(g),
          //   {
          //     speed: 1 / 500,
          //     // sunColor: "#f00",
          //     waterColor: "#3399FF",
          //     alpha: 1,
          //     waterNormals: require("../texture/waternormals.jpg"),
          //   },
          //   threeLayer
          // );
          //water2
          // var mesh = new coolWater(
          //   maptalks.GeoJSON.toGeometry(g),
          //   {
          //     interactive: false,
          //     color: "#3300FF",
          //     image: require("../texture/waternormals.jpg"),
          //     image2: require("../texture/waternormals.jpg"),
          //   },
          //   threeLayer
          // );
          // mesh.getObject3d().position.z = 0.001;
          //water3
          // let mesh = threeLayer.toExtrudePolygon(
          //   maptalks.GeoJSON.toGeometry(g),
          //   {
          //     height: 1,
          //     interactive: false,
          //   },
          //   material
          // );
          // waters.push(mesh);
        }
      });
      return waters;
    },
    getringBuildMesh(threeLayer) {
      let ringCircle = new maptalks.Circle(this.cylinderCoord, 100);
      let material = this.getWallTextureMaterial({
        image: require("../texture/linear.png"),
        color: "#f00",
        opacity: 0.6,
      });
      let mesh = new rippleWall(
        this.cylinderCoord,
        { height: 250, isCircle: 1, radius: 100 },
        material,
        threeLayer
      );
      // let mesh = threeLayer.toExtrudePolygon(
      //   ringCircle,
      //   {
      //     height: 150,
      //     // topColor: "#fff",
      //     addTopBottom: false
      //   },
      //   material
      // );
      animate();
      let num = 0;
      function animate() {
        num += 0.01;
        if (num > 4) num = 0;
        mesh.getObject3d().scale.set(num, num, 1);
        requestAnimationFrame(animate);
      }
      return [mesh];
    },
    addArcLine(threeLayer) {
      this.ringCoord.forEach((item) => {
        let path = [
          [121.50696853557473, 31.24378441172011],
          [item.x, item.y],
        ];
        let linestring = new maptalks.LineString(path);
        const texture = new THREE.TextureLoader().load(
          require("../texture/lineTexture.png")
        );
        texture.anisotropy = 16;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const camera = threeLayer.getCamera();
        const material = new MeshLineMaterial({
          map: texture,
          useMap: true,
          lineWidth: 13,
          sizeAttenuation: false,
          transparent: true,
          near: camera.near,
          far: camera.far,
        });
        let arcline = new arcLine(
          linestring,
          { altitude: 0, height: 400, speed: 1 / 5 },
          material,
          threeLayer
        );
        threeLayer.addMesh(arcline);
      });
    },
    getRandarMesh(threeLayer) {
      let object = new RingEffect(
        this.randarCoord1,
        { radius: 260, speed: 0.01 },
        this.getRandarMetarial({ color: "#CC3366", type: 2 }),
        threeLayer
      );
      object.getObject3d().renderOrder = 5;
      // let object2 = new RingEffect(
      //   this.halfBallCoord2,
      //   { radius: 560, speed: 0.01 },
      //   this.FlabellumScanMaterial({ color: "#f00" }),
      //   threeLayer
      // );
      // object2.getObject3d().renderOrder = 5;
      // object2.getObject3d().position.z = 0.5;
      this.getScanRandarMesh(threeLayer);
      // let v = threeLayer.coordinateToVector3(this.randarCoord1);
      // //内部半径 外部半径 圆环的分段数(值越大，圆环就越圆) 最小值为1，默认值为8  起始角度(默认值为0) 圆心角，默认值为Math.PI * 2
      // let object = new THREE.Mesh(
      //   new THREE.RingBufferGeometry(0.0001, 1, 20, 5, 0, Math.PI * 2),
      //   this.getRandarMetarial("#CC3366", 2)
      // );
      // object.position.x = v.x;
      // object.position.y = v.y;
      // object.position.z = 0;
      return [object];
    },
    getScanRandarMesh(threeLayer) {
      let mesh = new RingEffect(
        this.cylinderCoord,
        {
          radius: 500,
          speed: 0.025,
          // lineNum: 10
        },
        this.FlabellumScanMaterial(),
        threeLayer
      );
      threeLayer.addMesh(mesh);

      // let v = threeLayer.coordinateToVector3(this.cylinderCoord);
      // const r = threeLayer.distanceToVector3(500, 500).x;
      // let object = new THREE.Mesh(
      //   new THREE.PlaneBufferGeometry(r, r, 2),
      //   this.FlabellumScanMaterial()
      // );
      // object.position.x = v.x;
      // object.position.y = v.y;
      // object.position.z = 0.1;
      // object.renderOrder = 3;
      // threeLayer.addMesh(object);
    },
    getRingMesh(threeLayer) {
      let coords = this.ringCoord;
      let meshes = [];
      coords.forEach((c) => {
        let object = new RingEffect(
          [c.x, c.y],
          { radius: 50, speed: 0.0025 },
          this.getRingEffectMaterial(c.color, c.type),
          threeLayer
        );
        // let v = threeLayer.coordinateToVector3([c.x, c.y]);
        // //内部半径 外部半径 圆环的分段数(值越大，圆环就越圆) 最小值为1，默认值为8  起始角度(默认值为0) 圆心角，默认值为Math.PI * 2
        // let object = new THREE.Mesh(
        //   new THREE.RingBufferGeometry(0.001, 0.1, 20, 5, 0, Math.PI * 2),
        //   this.getRingEffectMaterial(c.color, c.type)
        // );
        // object.position.x = v.x;
        // object.position.y = v.y;
        // object.position.z = 0.1;
        object.renderOrder = 4;
        meshes.push(object);
      });
      return meshes;
    },
    getBallMesh(threeLayer) {
      var ball1 = new ElectricShield(
        this.halfBallCoord,
        { radius: 250 },
        this.getElectricShieldMaterial({
          color: "#9999FF",
          // color: "#32CD32",
          // color: "#FFB860",
          opacity: 1,
        }),
        threeLayer
      );
      // threeLayer.addMesh(ball1);
      ball1.getObject3d().renderOrder = 6;

      // 花朵效果
      let flowermesh = new RingEffect(
        this.halfBallCoord,
        {
          radius: 350,
          speed: 0.035,
        },
        this.getFlowerPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        threeLayer
      );

      var ball2 = new ElectricShield(
        this.halfBallCoord2,
        { radius: 250, speed: 0.015 },
        // getRippleShieldMaterial
        this.getComposedShieldMaterial({
          flowLightColor: "#2AEC04",
          color: "#EDD464",
          num: 3,
          opacity: 1,
        }),
        threeLayer
      );
      ball2.getObject3d().renderOrder = 6;
      // threeLayer.addMesh(ball2);

      const texture = new THREE.TextureLoader().load(
        require("../texture/ring.png")
      );
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        color: "#fff",
        side: THREE.DoubleSide,
      });
      let object = new RingTextureEffect(
        this.halfBallCoord2,
        { radius: 100, speed: 2 },
        material,
        threeLayer
      );

      this.addThreeMarker(threeLayer);
      return [ball1, ball2, flowermesh];
    },
    addThreeMarker(threeLayer) {
      let gridmesh = new RingEffect(
        this.halfBallCoord2,
        {
          radius: 100,
          speed: 0.015,
          altitude: 10,
          // lineNum: 10
        },
        this.getTornadoPulseMaterial({
          color: "#EDD464",
          opacity: 1,
        }),
        threeLayer
      );
      threeLayer.addMesh(gridmesh);

      const markertexture = new THREE.TextureLoader().load(
        require("../texture/lightray2.png")
      );
      let markermaterial = this.getRunTextureMaterial({
        texture: markertexture,
      });
      let marker = new threeMarker(
        this.halfBallCoord2,
        {
          markerWidth: 32,
          markerHeight: 275,
          altitude: 0,
        },
        markermaterial,
        threeLayer
      );
      threeLayer.addMesh(marker);

      let marker2 = new threeMarker(
        this.halfBallCoord2,
        {
          markerWidth: 32,
          markerHeight: 275,
          altitude: 0,
        },
        markermaterial,
        threeLayer
      );
      marker2.getObject3d().rotation.y = THREE.Math.degToRad(90);
      threeLayer.addMesh(marker2);
    },
    addThreeText(threeLayer) {
      let v = threeLayer.coordinateToVector3([
        121.4937012338393,
        31.257663069781028,
      ]);
      var height = 0.01, //厚度
        size = 1, //大小
        curveSegments = 20,
        bevelThickness = 0.1,
        bevelSize = 1,
        bevelEnabled = true; // normal bold
      var loader = new THREE.FontLoader();
      // let fonturl = window.mapConfig.fontUrl; //字体路径 带http
      loader.load(
        "http://localhost:1013/font/gentilis_bold.typeface.json",
        // "http://120.77.3.37/mapEffectDemo/font/gentilis_bold.typeface.json",
        (response) => {
          let font = response;
          let textGeo = new THREE.TextGeometry("maptalks && maptalks.three", {
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
          material = this.getMeteorMaterial({
            animate: true,
            color: "#EDD464",
            opacity: 1,
          });
          let textMesh = new THREE.Mesh(textGeo, material);
          textMesh.scale.set(0.5, 0.5, 0.5);
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
    getRandomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    getRoadMesh(roadFeature, threeLayer) {
      let linemesh = [];
      let material = new THREE.MeshPhongMaterial({
        color: "#FDCD2C",
        transparent: true,
        // blending: THREE.AdditiveBlending
      });
      roadFeature.forEach((g) => {
        if (
          g.geometry &&
          g.geometry.coordinates &&
          g.geometry.type != "MultiLineString"
        ) {
          // material = this.getRippleShieldMaterial({
          //   color: this.getRandomColor(),
          //   dura: Math.random() * 0.007,
          //   opacity: 1
          // });
          let mesh = threeLayer.toExtrudeLine(
            maptalks.GeoJSON.toGeometry(g),
            { altitude: 0, width: 3, height: 0.1 },
            // this.getSeperableBlurMaterial(10),
            material
          );
          let _mesh = mesh.getObject3d();
          _mesh.material.opacity = 0.6;
          linemesh.push(mesh);
        }
        // mesh.addTo(threeLayer)
      });
      return linemesh;
    },
    getBuildMesh(build, buildmaterial, threeLayer) {
      let buildmesh = [];
      const texture = new THREE.TextureLoader().load(
        require("../texture/texture_02.png")
      );
      // texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      const texture2 = new THREE.TextureLoader().load(
        require("../texture/texture_002.png")
      );
      // texture2.needsUpdate = true; //使用贴图时进行更新
      texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 1);
      let material = this.getTrailWallMaterial({
        opacity: 1,
        color: "#EDD464",
        texture: texture,
      });
      // material = this.getBuildWindowMaterial();
      let material2 = this.getTrailWallMaterial({
        opacity: 1,
        color: "#EDD464",
        texture: texture2,
      });
      build.forEach((g) => {
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
      return buildmesh;
    },
    getBuildMesh2(build, buildmaterial, threeLayer) {
      let buildmesh = [];
      let material = buildmaterial;
      let img = require("../texture/texture_03.png");
      // if(height < 100)
      //   img = require("../texture/texture_03.png");
      let texturematerial = this.getBuildTextureShaderMaterial(img, {
        opacity: 1,
      });
      build.forEach((g) => {
        let height = g.properties.height || 0 + 20;
        if (height > 400) {
          material = this.getRippleWall();
        } else material = buildmaterial;
        // else material = texturematerial;
        let addTopBottom = true;
        let mesh = threeLayer.toExtrudePolygon(
          maptalks.GeoJSON.toGeometry(g),
          {
            height: height,
            topColor: "#fff",
            // bottomColor: "#193976",
            addTopBottom: addTopBottom,
          },
          material
        );
        // let extentmesh = this.getExtentBuild(g, height, threeLayer);
        // extentmesh.forEach(x => buildmesh.push(x));
        const topColor = new THREE.Color("#EDD464");
        const bufferGeometry = mesh.getObject3d().geometry;
        const geometry = new THREE.Geometry().fromBufferGeometry(
          bufferGeometry
        );
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
        mesh.getObject3d().geometry = new THREE.BufferGeometry().fromGeometry(
          geometry
        );
        bufferGeometry.dispose();
        geometry.dispose();
        if (height < 600) buildmesh.push(mesh);
        // mesh.addTo(threeLayer)
      });
      return buildmesh;
    },
    // 地面
    getBaseMesh(basematerial, threeLayer) {
      let v = threeLayer.coordinateToVector3([121.48695046, 31.24427468]);
      //添加“底图”
      let base = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(5000, 5000, 2),
        basematerial
      );

      base.position.x = v.x;
      base.position.y = v.y;
      base.position.z = -0.005;
      base.renderOrder = 0;
      return base;
    },
    // 地面
    getSkyMesh(threeLayer) {
      var skyball = new ElectricShield(
        this.map.getCenter(),
        { radius: 20000, speed: 0.4 },
        this.getStarSkyMaterial(),
        threeLayer
      );
      // skyball.getObject3d().renderOrder = 40;
      return skyball;
    },
    //获取建筑材质
    getBuildMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      let material = new THREE.MeshPhongMaterial({
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
    getBuildTextureMaterial() {
      const texture = new THREE.TextureLoader().load(
        require("../texture/texture_03.png")
      );
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 4);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        color: "#fff",
        side: THREE.DoubleSide,
      });
      material.vertexColors = THREE.VertexColors;
      return material;
    },
    // 地面材质
    getBaseGeometryMaterial() {
      // MeshBasicMaterial MeshPhongMaterial
      return new THREE.MeshBasicMaterial({
        // color: "#2C3135"
        color: "#00295a",
      });
    },
    getRoadMaterial() {
      // let material1 = new THREE.LineMaterial({
      //   color: 0x00ffff,
      //   transparent: true,
      //   // vertexColors: THREE.VertexColors,
      //   // side: THREE.BackSide,
      //   linewidth: 4 // in pixels
      //   // vertexColors: THREE.VertexColors,
      //   // dashed: false
      // });
      // return material1;
      let Qg =
        "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
      let Gg =
        "\n  float rands(float p){\n    return fract(sin(p) * 10000.0);\n  }\n";
      let MeteorWall = {
        uniforms: {
          time: {
            //time+=0.0045
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color("#f00"),
          },
          opacity: {
            type: "f",
            value: 0.9,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  letying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  letying vec2 vUv;\n\n  ".concat(
          Qg,
          "\n\n  float nutsack(vec2 uv){\n    uv.x *= sin(1.)*2.;\n    float t =  time*0.4;\n    uv.x = uv.x*180.0;\n    float dx = fract(uv.x);\n    uv.x = floor(uv.x);\n    uv.y *= 0.15;\n    float o=sin(uv.x*215.4);\n    float s=cos(uv.x*33.1)*.3 +.7;\n    float trail = mix(95.0,15.0,s);\n    float yv = 1.0/(fract(1. - uv.y + t*s + o) * trail);\n    yv = smoothstep(0.0,1.0,yv*yv);\n    yv = sin(yv*pi)*(s*5.0);\n    float d = sin(dx*pi);\n    return yv*(d*d);\n  }\n\n  void main() {\n    vec3 col = color * nutsack(vUv); // Get the jizz flowing\n    col += mix(color, vec3(0.,0.,0.), vUv.y);\n    gl_FragColor=vec4(col, opacity * (1. - vUv.y)); // output the spunk\n  }\n"
        ),
      };
      let material = new THREE.ShaderMaterial({
        uniforms: MeteorWall.uniforms,
        defaultAttributeValues: {},
        vertexShader: MeteorWall.vertexShaderSource,
        fragmentShader: MeteorWall.fragmentShaderSource,
        // blending: THREE.NoBlending,
        // blending: THREE.AdditiveBlending,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !0,
        fog: !0,
      });
      animate();
      function animate() {
        MeteorWall.uniforms.time.value += 0.45;
        requestAnimationFrame(animate);
      }
      return material;
    },
    initSpriteLine() {},
    getBuildingsCanvasMaterial(color = "rgba(255,255,255,1)") {
      const width = 256,
        height = 512;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "#070707";

      ctx.fillRect(0, 0, width, 220);
      ctx.fillRect(0, 256, width, 220);

      // let gradient = ctx.createLinearGradient(0, 0, width, 0);
      // gradient.addColorStop("0.0", color);
      // gradient.addColorStop("1.0", 'gray');

      ctx.fillStyle = color;
      // ctx.lineWidth = 40;
      // ctx.shadowColor = shadowColor;
      // ctx.shadowBlur = 70;
      ctx.fillRect(0, 220, width, 50);
      ctx.fillRect(0, 476, width, 50);
      console.log(canvas.toDataURL());
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      texture.repeat.set(1, 4);
      // const material = new THREE.MeshLambertMaterial({
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      return material;
    },

    getRandomValue(min, max, weight) {
      return min + Math.round((max - min) * Math.pow(Math.random(), weight));
    },
    randomRgbColor() {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    randomNum(Min, Max) {
      let Range = Max - Min;
      let Rand = Math.random();
      if (Math.round(Rand * Range) == 0) {
        return Min + 1;
      } else if (Math.round(Rand * Max) == Max) {
        return Max - 1;
      } else {
        let num = Min + Math.round(Rand * Range) - 1;
        return num;
      }
    },
    canvasOne() {
      const width = 512,
        height = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");

      context.clearRect(0, 0, width, height);

      context.fillStyle = "#16366f";
      context.fillRect(0, 0, 1024, 1024);
      let colors2 = ["#00CCFF", "#66FF66", "#fff"];
      let added = [true, false, false];
      for (let x = 10; x < width; x += 50) {
        for (let y = 10; y < height; y += 50) {
          let isLight = added[this.randomNum(0, 2)];
          let hsl = `hsl(183,${this.randomNum(10, 90)}%,${this.randomNum(
            10,
            90
          )}%)`;
          let _color = colors2[this.randomNum(0, 3)];
          if (isLight) {
            context.fillStyle = _color;
            context.fillRect(x, y, 15, 15);
            context.globalAlpha = 1;
            // context.globalCompositeOperation = "lighter";
            context.shadowColor = _color;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
          } else {
            context.fillStyle = "#373839";
            context.fillRect(x, y, 15, 15);
            context.globalAlpha = 1;
            context.shadowColor = "#16366f";
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
          }
        }
      }
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      // texture.repeat.set(1, 1);
      // const material = new THREE.MeshLambertMaterial({
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
      });
      return material;
    },
    canvasTwo() {
      var canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 64;
      var context = canvas.getContext("2d");
      // plain it in white
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, 32, 64);
      let colors2 = ["#00CCFF", "#66FF66", "#fff"];
      // draw the window rows - with a small noise to simulate light variations in each room
      for (var y = 2; y < 64; y += 2) {
        for (var x = 0; x < 32; x += 2) {
          var value = Math.floor(Math.random() * 64);

          context.fillStyle = `rgb(${[value, value, value].join(",")})`;
          // let _color = colors2[this.randomNum(0, 3)];
          // context.fillStyle = _color;
          context.fillRect(x, y, 2, 1);
          context.shadowColor = "#fff";
          context.shadowOffsetX = 0;
          context.shadowOffsetY = 0;
          context.shadowBlur = 10;
        }
      }

      // build a bigger canvas and copy the small one in it
      // This is a trick to upscale the texture without filtering
      var canvas2 = document.createElement("canvas");
      canvas2.width = 512;
      canvas2.height = 1024;
      var context = canvas2.getContext("2d");
      // disable smoothing
      context.imageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;

      context.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
      const texture = new THREE.Texture(canvas2);
      texture.needsUpdate = true; //使用贴图时进行更新
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(0.002, 0.002);
      texture.repeat.set(1, 1);
      // const material = new THREE.MeshLambertMaterial({
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
      });
      return material;
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
  .attributes {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 10;
    a {
      font-size: 16px;
      color: #fff;
      font-family: bahnschrift;
      // padding: 10px;
      letter-spacing: 1px;
      text-decoration: none;
    }
  }
}
</style>
