import mapEffect from "./view/mapEffect";
import wallEffect from "./view/wallEffect";
import ballEffect from "./view/ballEffect";
import buildTexture from "./view/buildTexture";
import PluseEffect from "./view/PluseEffect";
import carTrail from "./view/carTrail";
import carModelTrail from "./view/carModelTrail";
import snow from "./view/snowEffect";
import shaderBuild from "./view/shaderBuild";
import hangzhou from "./view/hangzhou";
const routers = [
  {
    path: "/wallEffect",
    name: "wallEffect",
    component: wallEffect,
  },
  {
    path: "/ballEffect",
    name: "ballEffect",
    component: ballEffect,
  },
  {
    path: "/buildTexture",
    name: "buildTexture",
    component: buildTexture,
  },
  {
    path: "/PluseEffect",
    name: "PluseEffect",
    component: PluseEffect,
  },
  {
    path: "/carTrail",
    name: "carTrail",
    component: carTrail,
  },
  {
    path: "/carModelTrail",
    name: "carModelTrail",
    component: carModelTrail,
  },
  {
    path: "/snow",
    name: "snow",
    component: snow,
  },
  {
    path: "/shaderBuild",
    name: "shaderBuild",
    component: shaderBuild,
  },
  {
    path: "/mapEffect",
    name: "mapEffect",
    component: mapEffect,
  },
  {
    path: "/hangzhou",
    name: "hangzhou",
    component: hangzhou,
  },
  {
    path: "/",
    component: hangzhou,
    // component: mapEffect,
  },
];
export default routers;
