<template>
  <div id="app">
    <router-view />
    <!-- <HelloWorld msg="" /> -->
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
a {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  color: #fff;
}
@font-face {
  font-family: HuXiaoBo-NanShen;
  src: url("./assets/HuXiaoBoNanShenTi-2.otf");
}
@font-face {
  font-family: SourceHanSansCN;
  src: url("./assets/SourceHanSansCN-Regular.ttf");
}
@font-face {
  font-family: bahnschrift;
  src: url("./assets/bahnschrift.ttf");
}
@font-face {
  font-family: Agency_FB_Bold;
  src: url("./assets/Agency_FB_Bold.otf");
}
</style>

<style lang="scss">
.infoCon {
  // position: relative;
  width: 149px;
  height: 122px;
  font-family: "Microsoft YaHei";
  color: #feffff;
  background: rgba(25, 155, 255, 0.6);
  border-radius: 2px 2px 0px 0px;
  transform: skewY(-15deg);
  -webkit-transform: skewY(-15deg); /*兼容-webkit-引擎浏览器*/
  -moz-transform: skewY(-15deg); /*兼容-moz-引擎浏览器*/
  // background: linear-gradient(
  //   to bottom,
  //   rgba(25, 215, 246, 1) 10%,
  //   rgba(25, 215, 246, 0)
  // );

  .rankNum {
    width: 25px;
    height: 25px;
    color: #1168ea;
    border-radius: 50%;
    text-align: center;
    line-height: 25px;
    background: #fff;
    font-size: 16px;
    top: -12px;
    left: 60px;
    position: absolute;
  }
  .triangle {
    width: 0;
    height: 0;
    border: 15px solid rgba(25, 155, 255, 0.6);
    border-bottom-color: transparent; /* 设置透明背景色 */
    border-left-color: transparent;
    border-right-color: transparent;
    left: 60px;
    bottom: -30px;
    position: absolute;
  }
  .areaName {
    width: 100%;
    height: 40px;
    float: left;
    margin: 10px 0 5px 0;
    text-align: center;
    line-height: 40px;
    font-size: 21px;
    border-radius: 10px;
  }
  .typeName {
    width: 100%;
    height: 13px;
    font-size: 12px;
    font-weight: 400;
  }
  .botCon {
    width: 100%;
    float: left;
    height: 40px;
    margin: 15px 0;
    .leftPercent {
      width: 60%;
      height: 40px;
      line-height: 40px;
      color: #fbd444;
      font-size: 17px;
      font-weight: 500;
      float: left;
    }
    .arrow {
      width: 10%;
      float: left;
    }
    .rightPercent {
      width: 30%;
      height: 40px;
      line-height: 40px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
      float: left;
    }
  }
}
</style>
