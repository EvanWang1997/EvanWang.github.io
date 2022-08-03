import './style.css'
import * as THREE from 'three';

import { TorusGeometry } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5);
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 200);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


// Creates pedals page during navigation
const x = 0, y = 0;

const petalShape = new THREE.Shape();

petalShape.moveTo( x + 0.2, y + 0.2 );
petalShape.bezierCurveTo( x + 0.2, y + 0.2, x + 0.1, y, x, y );
petalShape.bezierCurveTo( x - 0.2, y, x - 0.2, y + 0.3,x - 0.2, y + 0.3 );
petalShape.bezierCurveTo( x + 0.4, y + 0.5, x + 0.5, y + 0.3, x + 0.5, y + 0.2 );
petalShape.bezierCurveTo( x + 0.5, y + 0.2, x + 0.5, y, x + 0.3, y );
petalShape.bezierCurveTo( x + 0.2, y, x + 0.15, y + 0.15, x + 0.15, y + 0.15 );

function addPetal() {
  const starGeometry = new THREE.ShapeGeometry(petalShape);
  const starMaterial = new THREE.MeshStandardMaterial({color: 0xfdab9f});
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  const [r1,r2,r3] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  star.rotation.set(r1,r2,r3)
  scene.add(star);
}

// Populates scene with random pedals scattered about
Array(500).fill().forEach(addPetal);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const stoneTexture = new THREE.TextureLoader().load('stone.jpg');

const stone = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: stoneTexture})
)

scene.add(stone);

const skyTexture = new THREE.TextureLoader().load('sky.jpg');

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(3,500,500),
  new THREE.MeshBasicMaterial({map: skyTexture})

)

sky.position.z = 30;
sky.position.setX(-10);

scene.add(sky);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  sky.rotation.x += 0.05;
  sky.rotation.y += 0.075;
  sky.rotation.z += 0.05;

  stone.rotation.y += 0.01;
  stone.rotation.z += 0.01;

  camera.position.z = t * -0.03;
  camera.position.x = t * -0.01;
  camera.position.y = t * -0.01;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.02;
  torus.rotation.y += 0.02;
  torus.rotation.z += 0.02;
  renderer.render(scene, camera);
}

animate();
