import './style.css'
import * as THREE from 'three';

import {TorusGeometry} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

// Sets up camera, perspective, and general geometries within the scene
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.5, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-5,10,-100)


renderer.render(scene, camera);

// Sets up lighting in the scene
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5);
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 200);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


// Creates petals page during navigation
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

// Sets up space 
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Sets up sky globe in scene
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

  camera.position.z = t * +0.01;
  // camera.position.x = t * -0.01;
  // camera.position.y = t * -0.01;
}


// Loads new models a specific location in the scene
function loadGLTF(file, scale, [x,y,z]) {
  const loader = new GLTFLoader();
  const modelLh = new THREE.Object3D( );

  loader.load(
    // resource URL
    file,
    // called when the resource is loaded
    function ( gltf ) {
      modelLh.add( gltf.scene ); // this gltf.scene is centered 
      modelLh.scale.set(1,1,1); // because gltf.scene is big
      modelLh.position.set(x,y,z);
      scene.add( modelLh );
  
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function ( xhr ) {
  
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened' );
  
    }
  );
}

loadGLTF('Tori gate.gltf',1,[0,0,0]);
loadGLTF('Tori gate.gltf',1,[0,0,20]);
loadGLTF('Tori gate.gltf',1,[0,0,40]);
loadGLTF('Tori gate.gltf',1,[0,0,-20]);
loadGLTF('Tori gate.gltf',1,[0,0,-40]);

function transition() {
  document.body.style.opacity = 1;
}


document.body.onscroll = moveCamera;
document.body.onload = transition;


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
