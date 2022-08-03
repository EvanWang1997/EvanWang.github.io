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

// Sets default camera position in scene
const [camDefX, camDefY, camDefZ] = [-5,10,-100];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(camDefX, camDefY, camDefZ)


renderer.render(scene, camera);

// Sets up lighting in the scene
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5);
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xADD8E6);
scene.add(ambientLight);


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
  const petalGeometry = new THREE.ShapeGeometry(petalShape);
  const petalMaterial = new THREE.MeshStandardMaterial({color: 0xfdab9f});
  const petal = new THREE.Mesh(petalGeometry, petalMaterial);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  const [r1,r2,r3] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  petal.position.set(x,y,z);
  petal.rotation.set(r1,r2,r3)
  scene.add(petal);
}

// Populates scene with random pedals scattered about
Array(1000).fill().forEach(addPetal);

// Sets up space 
const spaceTexture = new THREE.TextureLoader().load('sky-background.jpg');
scene.background = spaceTexture;


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = camDefZ - t * 0.05;
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
