import * as THREE from "three";
import * as maptalks from "maptalks";
import * as earcut from "earcut"
import { BaseObject } from "maptalks.three";
//default values
var OPTIONS = {
  textureWidth: 512,
  textureHeight: 512,
  sunColor: 0xffffff,
  betaVersion: 0,
  waterNormals: null,
  side: THREE.DoubleSide,
  depthTest: true,
  alpha: 0.5,
  waterColor: "#15e8a9",
  noiseScale: 0.1,
  interactive: false,
  altitude: 0
};

/**
 * custom component
 * */
THREE.ShaderLib["water"] = {
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib["fog"],
    {
      normalSampler: { type: "t", value: null },
      mirrorSampler: { type: "t", value: null },
      alpha: { type: "f", value: 1.0 },
      time: { type: "f", value: 0.0 },
      distortionScale: { type: "f", value: 20.0 },
      noiseScale: { type: "f", value: 1.0 },
      textureMatrix: { type: "m4", value: new THREE.Matrix4() },
      sunColor: { type: "c", value: new THREE.Color(0x7f7f7f) },
      sunDirection: {
        type: "v3",
        value: new THREE.Vector3(0.70707, 0.70707, 0)
      },
      eye: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
      waterColor: { type: "c", value: new THREE.Color(0x555555) }
    }
  ]),

  vertexShader: [
    "uniform mat4 textureMatrix;",
    "uniform float time;",

    "varying vec4 mirrorCoord;",
    "varying vec3 worldPosition;",
    "varying vec3 modelPosition;",
    "varying vec3 surfaceX;",
    "varying vec3 surfaceY;",
    "varying vec3 surfaceZ;",

    "void main()",
    "{",
    "	mirrorCoord = modelMatrix * vec4(position, 1.0);",
    "	worldPosition = mirrorCoord.xyz;",
    "	modelPosition = position;",
    "	surfaceX = vec3( modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]);",
    "	surfaceY = vec3( modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]);",
    "	surfaceZ = vec3( modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]);",

    "	mirrorCoord = textureMatrix * mirrorCoord;",
    "	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D mirrorSampler;",
    "uniform float alpha;",
    "uniform float time;",
    "uniform float distortionScale;",
    "uniform float noiseScale;",
    "uniform sampler2D normalSampler;",
    "uniform vec3 sunColor;",
    "uniform vec3 sunDirection;",
    "uniform vec3 eye;",
    "uniform vec3 waterColor;",

    "varying vec4 mirrorCoord;",
    "varying vec3 worldPosition;",
    "varying vec3 modelPosition;",
    "varying vec3 surfaceX;",
    "varying vec3 surfaceY;",
    "varying vec3 surfaceZ;",

    "void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, in float shiny, in float spec, in float diffuse, inout vec3 diffuseColor, inout vec3 specularColor)",
    "{",
    "	vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));",
    "	float direction = max(0.0, dot(eyeDirection, reflection));",
    "	specularColor += pow(direction, shiny) * sunColor * spec;",
    "	diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;",
    "}",

    "vec3 getNoise(in vec2 uv)",
    "{",
    "	vec2 uv0 = uv / (103.0 * noiseScale) + vec2(time / 17.0, time / 29.0);",
    "	vec2 uv1 = uv / (107.0 * noiseScale) - vec2(time / -19.0, time / 31.0);",
    "	vec2 uv2 = uv / (vec2(8907.0, 9803.0) * noiseScale) + vec2(time / 101.0, time /   97.0);",
    "	vec2 uv3 = uv / (vec2(1091.0, 1027.0) * noiseScale) - vec2(time / 109.0, time / -113.0);",
    "	vec4 noise = texture2D(normalSampler, uv0) +",
    "		texture2D(normalSampler, uv1) +",
    "		texture2D(normalSampler, uv2) +",
    "		texture2D(normalSampler, uv3);",
    "	return noise.xyz * 0.5 - 1.0;",
    "}",

    THREE.ShaderChunk["common"],
    THREE.ShaderChunk["fog_pars_fragment"],

    "void main()",
    "{",
    "	vec3 worldToEye = eye - worldPosition;",
    "	vec3 eyeDirection = normalize(worldToEye);",

    // Get noise based on the 3d position
    "	vec3 noise = getNoise(modelPosition.xy * 1.0);",
    "	vec3 distordCoord = noise.x * surfaceX + noise.y * surfaceY;",
    "	vec3 distordNormal = distordCoord + surfaceZ;",

    // Revert normal if the eye is bellow the mesh
    "	if(dot(eyeDirection, surfaceZ) < 0.0)",
    "		distordNormal = distordNormal * -1.0;",

    // Compute diffuse and specular light (use normal and eye direction)
    "	vec3 diffuseLight = vec3(0.0);",
    "	vec3 specularLight = vec3(0.0);",
    "	sunLight(distordNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);",

    // Compute final 3d distortion, and project it to get the mirror sampling
    "	float distance = length(worldToEye);",
    "	vec2 distortion = distordCoord.xy * distortionScale * sqrt(distance) * 0.07;",
    " vec3 mirrorDistord = mirrorCoord.xyz + vec3(distortion.x, distortion.y, 1.0);",
    " vec3 reflectionSample = texture2DProj(mirrorSampler, mirrorDistord).xyz;",

    // Compute other parameters as the reflectance and the water appareance
    "	float theta = max(dot(eyeDirection, distordNormal), 0.0);",
    "	float reflectance = 0.3 + (1.0 - 0.3) * pow((1.0 - theta), 3.0);",
    "	vec3 scatter = max(0.0, dot(distordNormal, eyeDirection)) * waterColor;",

    // Compute final pixel color
    "	vec3 albedo = mix(sunColor * diffuseLight * 0.3 + scatter, (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);",

    " vec3 outgoingLight = albedo;",
    THREE.ShaderChunk["fog_fragment"],

    " gl_FragColor = vec4( outgoingLight, alpha );",
    "}"
  ].join("\n")
};

THREE.Water = function(renderer, camera, scene, options) {
  THREE.Object3D.call(this);
  this.name = "water_" + this.id;

  function optionalParameter(value, defaultValue) {
    return value !== undefined ? value : defaultValue;
  }

  options = options || {};

  this.matrixNeedsUpdate = true;

  var width = optionalParameter(options.textureWidth, 512);
  var height = optionalParameter(options.textureHeight, 512);
  this.clipBias = optionalParameter(options.clipBias, -0.0001);
  this.alpha = optionalParameter(options.alpha, 1.0);
  this.time = optionalParameter(options.time, 0.0);
  this.normalSampler = optionalParameter(options.waterNormals, null);
  this.sunDirection = optionalParameter(
    options.sunDirection,
    new THREE.Vector3(0.70707, 0.70707, 0.0)
  );
  this.sunColor = new THREE.Color(
    optionalParameter(options.sunColor, 0xffffff)
  );
  this.waterColor = new THREE.Color(
    optionalParameter(options.waterColor, 0x7f7f7f)
  );
  this.eye = optionalParameter(options.eye, new THREE.Vector3(0, 0, 0));
  this.distortionScale = optionalParameter(options.distortionScale, 20.0);
  this.noiseScale = optionalParameter(options.noiseScale, 1.0);
  this.side = optionalParameter(options.side, THREE.FrontSide);
  this.fog = optionalParameter(options.fog, false);

  this.renderer = renderer;
  this.scene = scene;
  this.mirrorPlane = new THREE.Plane();
  this.normal = new THREE.Vector3(0, 0, 1);
  this.cameraWorldPosition = new THREE.Vector3();
  this.rotationMatrix = new THREE.Matrix4();
  this.lookAtPosition = new THREE.Vector3(0, 0, -1);
  this.clipPlane = new THREE.Vector4();

  if (camera instanceof THREE.PerspectiveCamera) {
    this.camera = camera;
  } else {
    this.camera = new THREE.PerspectiveCamera();
    console.log(this.name + ": camera is not a Perspective Camera!");
  }

  this.textureMatrix = new THREE.Matrix4();

  this.mirrorCamera = this.camera.clone();

  this.texture = new THREE.WebGLRenderTarget(width, height);
  this.tempTexture = new THREE.WebGLRenderTarget(width, height);
  this.dummyTexture = new THREE.WebGLRenderTarget(1, 1);

  var mirrorShader = THREE.ShaderLib["water"];
  var mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);

  this.material = new THREE.ShaderMaterial({
    fragmentShader: mirrorShader.fragmentShader,
    vertexShader: mirrorShader.vertexShader,
    uniforms: mirrorUniforms,
    transparent: true,
    side: this.side,
    fog: this.fog
  });

  this.mesh = new THREE.Object3D();

  this.material.uniforms.mirrorSampler.value = this.texture;
  this.material.uniforms.textureMatrix.value = this.textureMatrix;
  this.material.uniforms.alpha.value = this.alpha;
  this.material.uniforms.time.value = this.time;
  this.material.uniforms.normalSampler.value = this.normalSampler;
  this.material.uniforms.sunColor.value = this.sunColor;
  this.material.uniforms.waterColor.value = this.waterColor;
  this.material.uniforms.sunDirection.value = this.sunDirection;
  this.material.uniforms.distortionScale.value = this.distortionScale;
  this.material.uniforms.noiseScale.value = this.noiseScale;

  this.material.uniforms.eye.value = this.eye;

  if (!THREE.Math.isPowerOfTwo(width) || !THREE.Math.isPowerOfTwo(height)) {
    this.texture.generateMipmaps = false;
    this.tempTexture.generateMipmaps = false;
  }

  this.updateTextureMatrix();
  this.render();
};

THREE.Water.prototype = Object.create(THREE.Object3D.prototype);

THREE.Water.prototype.renderWithMirror = function(otherMirror) {
  // update the mirror matrix to mirror the current view
  this.updateTextureMatrix();
  this.matrixNeedsUpdate = false;

  // set the camera of the other mirror so the mirrored view is the reference view
  var tempCamera = otherMirror.camera;
  otherMirror.camera = this.mirrorCamera;

  // render the other mirror in temp texture
  otherMirror.render(true);

  // render the current mirror
  this.render();
  this.matrixNeedsUpdate = true;

  // restore material and camera of other mirror
  otherMirror.camera = tempCamera;

  // restore texture matrix of other mirror
  otherMirror.updateTextureMatrix();
};

THREE.Water.prototype.updateTextureMatrix = function() {
  if (this.parent != undefined) {
    this.mesh = this.parent;
  }
  function sign(x) {
    return x ? (x < 0 ? -1 : 1) : 0;
  }

  this.updateMatrixWorld();
  this.camera.updateMatrixWorld();

  this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);

  this.rotationMatrix.extractRotation(this.matrixWorld);
  this.normal = new THREE.Vector3(0, 0, 1).applyEuler(this.mesh.rotation);
  var cameraLookAt = new THREE.Vector3(0, 0, 1).applyEuler(
    this.camera.rotation
  );
  if (this.normal.dot(cameraLookAt) < 0) {
    var meshNormal = new THREE.Vector3(0, 0, 1).applyEuler(this.mesh.rotation);
    this.normal.reflect(meshNormal);
  }

  var view = this.mesh.position.clone().sub(this.cameraWorldPosition);
  view.reflect(this.normal).negate();
  view.add(this.mesh.position);

  this.rotationMatrix.extractRotation(this.camera.matrixWorld);

  this.lookAtPosition.set(0, 0, -1);
  this.lookAtPosition.applyMatrix4(this.rotationMatrix);
  this.lookAtPosition.add(this.cameraWorldPosition);

  var target = this.mesh.position.clone().sub(this.lookAtPosition);
  target.reflect(this.normal).negate();
  target.add(this.mesh.position);

  this.up.set(0, -1, 0);
  this.up.applyMatrix4(this.rotationMatrix);
  this.up.reflect(this.normal).negate();

  this.mirrorCamera.position.copy(view);
  this.mirrorCamera.up = this.up;
  this.mirrorCamera.lookAt(target);
  this.mirrorCamera.aspect = this.camera.aspect;

  this.mirrorCamera.updateProjectionMatrix();
  this.mirrorCamera.updateMatrixWorld();
  this.mirrorCamera.matrixWorldInverse.getInverse(
    this.mirrorCamera.matrixWorld
  );

  // Update the texture matrix
  this.textureMatrix.set(
    0.5,
    0.0,
    0.0,
    0.5,
    0.0,
    0.5,
    0.0,
    0.5,
    0.0,
    0.0,
    0.5,
    0.5,
    0.0,
    0.0,
    0.0,
    1.0
  );
  this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
  this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

  // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
  // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
  this.mirrorPlane.setFromNormalAndCoplanarPoint(
    this.normal,
    this.mesh.position
  );
  this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

  this.clipPlane.set(
    this.mirrorPlane.normal.x,
    this.mirrorPlane.normal.y,
    this.mirrorPlane.normal.z,
    this.mirrorPlane.constant
  );

  var q = new THREE.Vector4();
  var projectionMatrix = this.mirrorCamera.projectionMatrix;

  q.x =
    (sign(this.clipPlane.x) + projectionMatrix.elements[8]) /
    projectionMatrix.elements[0];
  q.y =
    (sign(this.clipPlane.y) + projectionMatrix.elements[9]) /
    projectionMatrix.elements[5];
  q.z = -1.0;
  q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

  // Calculate the scaled plane vector
  var c = new THREE.Vector4();
  c = this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(q));

  // Replacing the third row of the projection matrix
  projectionMatrix.elements[2] = c.x;
  projectionMatrix.elements[6] = c.y;
  projectionMatrix.elements[10] = c.z + 1.0 - this.clipBias;
  projectionMatrix.elements[14] = c.w;

  var worldCoordinates = new THREE.Vector3();
  worldCoordinates.setFromMatrixPosition(this.camera.matrixWorld);
  this.eye = worldCoordinates;
  this.material.uniforms.eye.value = this.eye;
};

THREE.Water.prototype.render = function(isTempTexture) {
  if (this.matrixNeedsUpdate) {
    this.updateTextureMatrix();
  }

  this.matrixNeedsUpdate = true;

  // Render the mirrored view of the current scene into the target texture
  if (this.scene !== undefined && this.scene instanceof THREE.Scene) {
    // Remove the mirror texture from the scene the moment it is used as render texture
    // https://github.com/jbouny/ocean/issues/7
    this.material.uniforms.mirrorSampler.value = this.dummyTexture;

    var renderTexture =
      isTempTexture !== undefined && isTempTexture
        ? this.tempTexture
        : this.texture;
    // this.renderer.render(this.scene, this.mirrorCamera, renderTexture, true);

    this.material.uniforms.mirrorSampler.value = renderTexture.texture;
  }
};
class Ocean extends BaseObject {
  constructor(polygon, options, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, polygon });
    if (!options.waterNormals) {
      throw new Error("waterNormals is null");
    }
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);

    const waterNormalsTexture = new THREE.TextureLoader().load(
      options.waterNormals
    );
    waterNormalsTexture.wrapS = waterNormalsTexture.wrapT =
      THREE.RepeatWrapping;
    options.waterNormals = waterNormalsTexture;

    const water = new THREE.Water(
      layer.getThreeRenderer(),
      layer.getCamera(),
      layer.getScene(),
      options
    );
    const geometry = this.getOceanGeometry(polygon, layer);
    this._createMesh(geometry, water.material);

    this.getObject3d().add(water);
    this.water = water;
    //set object3d position
    const { altitude } = options;
    const z = layer.distanceToVector3(altitude, altitude).x;
    const center = polygon.getCenter();
    const v = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(v);
  }

  getSymbol() {
    return this.water.material;
  }

  setSymbol(material) {
    this.water.material = material;
    return this;
  }

  _animation() {
    const water = this.water;
    let options = this.getOptions();
    water.material.uniforms.time.value += options.speed || 1.0 / 60.0;
    water.render();
  }
  getSingleGeometry(polygon, layer, centerPt) {
    //if lnglats
    if (Array.isArray(polygon)) {
      polygon = new maptalks.Polygon(polygon);
    }

    const shell = polygon.getShell();
    const holes = polygon.getHoles();
    const lnglats = shell;
    const positions = [],
      holesIndices = [],
      positionsV = [];
    lnglats.forEach(lnglat => {
      const v = layer.coordinateToVector3(lnglat).sub(centerPt);
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    });
    if (holes && holes.length > 0) {
      holes.forEach(hole => {
        holesIndices.push(positionsV.length);
        hole.forEach(lnglat => {
          const v = layer.coordinateToVector3(lnglat).sub(centerPt);
          positions.push(v.x, v.y, v.z);
          positionsV.push(v);
        });
      });
    }
    const hole = holesIndices.length > 0 ? holesIndices : undefined;
    const faces = earcut(positions, hole, 3);
    return {
      positionsV,
      faces
    };
  }

  getOceanGeometry(polygon, layer) {
    const geometry = new THREE.Geometry();
    let positions = [],
      fcs = [];
    const centerPt = layer.coordinateToVector3(polygon.getCenter());
    if (polygon instanceof maptalks.Polygon) {
      const { positionsV, faces } = this.getSingleGeometry(
        polygon,
        layer,
        centerPt
      );
      positions = positionsV;
      fcs = faces;
    } else {
      const lnglats = polygon.getCoordinates();
      for (let i = 0, len = lnglats.length; i < len; i++) {
        const { positionsV, faces } = this.getSingleGeometry(
          lnglats[i],
          layer,
          centerPt
        );
        if (i > 0) {
          const LEN = positions.length;
          for (let i = 0, len = faces.length; i < len; i++) {
            faces[i] += LEN;
          }
        }
        positionsV.forEach(p => {
          positions.push(p);
        });
        faces.forEach(f => {
          fcs.push(f);
        });
      }
    }

    geometry.vertices = positions;
    for (let i = 0, len = fcs.length; i < len; i += 3) {
      const face = new THREE.Face3(fcs[i], fcs[i + 1], fcs[i + 2]);
      geometry.faces.push(face);
    }
    // geometry.computeFlatVertexNormals();
    // geometry.computeMorphNormals();
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();
    return geometry;
  }
}
export default Ocean;
