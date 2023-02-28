import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);
//test
var myImageUrls = [
  "gloomy_lf.png",

  "gloomy_rt.png",

  "gloomy_up.png",
  "gloomy_dn.png",

  "gloomy_ft.png",
  "gloomy_bk.png",
];
var myCubeTexture = new THREE.CubeTextureLoader().load(myImageUrls);
var mySpheres = [];
//
var myMouseX = 0;
var myMouseY = 0;
//racaster construct
var myMouse = new THREE.Vector2();
var myRaycaster = new THREE.Raycaster();
document.body.click(function (event) {
  event.preventDefault();
  myMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  myMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  myRaycaster.setFromCamera(myMouse, camera);
});
var myIntersects = myRaycaster.intersectObjects(scene.children);
if (myIntersects.length > 0) {
  var myColor = Math.random() * 0xffffff;
  myIntersects[0].object.color = new THREE.color(myColor);
}
//
document.addEventListener(
  "mousemove",
  function (event) {
    myMouseX = (event.clientX - window.innerWidth / 2) / 100;
    myMouseY = (event.clientY - window.innerHeight / 2) / 100;
  },
  false
);
//
scene.background = myCubeTexture;
var myGeometry = new THREE.SphereBufferGeometry(0.1, 32, 16);
var myMaterial = new THREE.MeshBasicMaterial({ envMap: myCubeTexture });
for (var i = 0; i < 500; i++) {
  var myMesh = new THREE.Mesh(myGeometry, myMaterial);
  myMesh.position.x = Math.random() * 10 - 5;
  myMesh.position.y = Math.random() * 10 - 5;
  myMesh.position.z = Math.random() * 10 - 5;
  myMesh.scale.x = myMesh.scale.y = myMesh.scale.z = Math.random() * 3 + 1;
  scene.add(myMesh);
  mySpheres.push(myMesh);
}
// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
//scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load("李沛宸.jpg");

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(7, 7, 7),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  var myTime = 0.0001 * Date.now();
  camera.position.x += (myMouseX - camera.position.x) * 0.05;
  camera.position.y -= (myMouseY + camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  for (var i = 0; i < mySpheres.length; i++) {
    var mySphere = mySpheres[i];
    mySphere.position.x = 5 * Math.cos(myTime + i);
    mySphere.position.y = 5 * Math.sin(myTime + i * 1.1);
  }

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
