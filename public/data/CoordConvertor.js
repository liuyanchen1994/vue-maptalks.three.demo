window.convertCoord = {
  PI: Math.PI,
  x_pi: (Math.PI * 3000.0) / 180.0,
  //84坐标系转百度坐标
  WGS84_BD(wgsLon, wgsLat) {
    let c = this.wgs84_gcj02(wgsLon, wgsLat);
    return this.gcj02_bd09ll(c[0], c[1]);
  },
  //百度坐标系转84坐标系
  BD_WGS84(wgsLon, wgsLat) {
    let c = this.bd09ll_gcj02(wgsLon, wgsLat);
    return this.gcj02_wgs84(c[0], c[1]);
  },
  //WGS-84 to GCJ-02
  wgs84_gcj02(wgsLon, wgsLat) {
    if (this.outOfChina(wgsLat, wgsLon)) return [wgsLon, wgsLat];
    let d = this.delta(wgsLat, wgsLon);
    return [wgsLon + d.lon, wgsLat + d.lat];
  },
  //GCJ-02 to WGS-84
  gcj02_wgs84: function(gcjLon, gcjLat) {
    if (this.outOfChina(gcjLat, gcjLon)) return [gcjLon, gcjLat];

    let d = this.delta(gcjLat, gcjLon);
    return [gcjLon - d.lon, gcjLat - d.lat];
  },
  //GCJ-02 to BD-09
  gcj02_bd09ll: function(gcjLon, gcjLat) {
    let x = gcjLon,
      y = gcjLat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    let bdLon = z * Math.cos(theta) + 0.0065;
    let bdLat = z * Math.sin(theta) + 0.006;
    return [bdLon, bdLat];
  },
  //BD-09 to GCJ-02
  bd09ll_gcj02: function(bdLon, bdLat) {
    let x = bdLon - 0.0065,
      y = bdLat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    let gcjLon = z * Math.cos(theta);
    let gcjLat = z * Math.sin(theta);
    return [gcjLon, gcjLat];
  },
  delta: function(lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    let a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    let ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    let dLat = this.transformLat(lon - 105.0, lat - 35.0);
    let dLon = this.transformLon(lon - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * this.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return {
      lat: dLat,
      lon: dLon,
    };
  },
  transformLat: function(x, y) {
    let ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
        320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  },
  transformLon: function(x, y) {
    let ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
        300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0;
    return ret;
  },
  outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
  },
};

var disableDevtool = false;
