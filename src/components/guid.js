export default function guid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

export function randomString(len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function randomColor() {
  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
}
export function randomRgbColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}
export function randomNum(Min, Max) {
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
}

export function randomCoord(lon, lat) {
  return [Math.random() / 2 + lon, Math.random() / 2 + lat]
}