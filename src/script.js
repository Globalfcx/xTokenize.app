import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import MouseMeshInteraction from './three_mmi';
import * as dat from 'lil-gui';
import gsap from 'gsap';
import { RedFormat } from 'three';

/**
 * Debug
 */
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = -5;
scene.add(camera);


/*
*Lights 
*/
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-3, 2, 0);
scene.add(directionalLight);

let introOpacity = 1;
const introScreen = document.querySelector('.intro-screen');
const loadingBarElement = document.querySelector('.loading-bar');

// introScreen.style.opacity = `${introOpacity}`
introScreen.style.background = `rgba(0, 0, 0, 1)`

console.log(introScreen.style.backgroundColor);

/*
*Loading manager 
*/
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
  //   // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(introScreen, { 
        duration: 3, 
        opacity: 0, 
        onComplete: () => {
          introScreen.style.display = 'none';
        } 
      })

      

       // Update loadingBarElement
      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    }, 500)
   },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
  }
);

/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager);

/**
 * Cube texture loader
 */

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/**
 * envirenment map
 */

const envMap = cubeTextureLoader.load([
  'env/px.png',
  'env/nx.png',
  'env/py.png',
  'env/ny.png',
  'env/pz.png',
  'env/nz.png'
]);

// set envirenment map
scene.background = envMap;


/**
 * Objects
 */

// Texture
const texture = textureLoader.load('textures/mars.png');

// outer geometry
const geometry = new THREE.SphereGeometry(1.55, 32, 32);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  envMap: envMap,
  metalness: 0.5
});

const mars = new THREE.Mesh(geometry, material);
mars.name = "mars";
scene.add(mars);

// temp
// const helperGeometry = new THREE.SphereGeometry(1.56, 64, 64);
// const hellperMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true
// });
// const helperMesh = new THREE.Mesh(helperGeometry, hellperMaterial);
// // scene.add(helperMesh);

// console.log(helperMesh.geometry.attributes.position.array);

// const helperArray = helperMesh.geometry.attributes.position.array;

// const button = document.querySelector('.next-point');

// let pointCounter = 0;

// const pointGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
// const pointMaterial = new THREE.MeshBasicMaterial({
//   color: 0x00ff00
// })

// const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);

// scene.add(pointMesh)

// pointMesh.position.set(0, 1.8, 0)

// document.addEventListener('keydown', () => {
//   pointMesh.position.set(helperArray[pointCounter], helperArray[pointCounter + 1], helperArray[pointCounter + 2]);
//   console.log(pointMesh.position);
//   pointCounter += 3;
// })

/**
 * country positions
 */
const positions = {
  japan: new THREE.Vector3(-1.034, 0.802, 0.848),
  korea: new THREE.Vector3(1.200, 0.989, 0.118),
  poland: new THREE.Vector3(-0.378, -1.205, 0.914),
  philippines: new THREE.Vector3(-0.679, -0.596, -1.271),
  africa: new THREE.Vector3(1.236, -0.802, -0.512)
}

// position: new THREE.Vector3(-0.96, 0.92, -0.80),

/**
 * Dots 
 */
// dot geometry
const dotGeometry = new THREE.CircleBufferGeometry(0.04, 32);

// dot texture
const goldenDot = textureLoader.load('goldenDot.png');

// dot material
const dotMatirial = new THREE.MeshStandardMaterial({
  transparent: true,
  map: goldenDot,
  alphaTest: true,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending
});

// css selectors
let popup = document.querySelector('.popup-wrapper').style;

const popupContent = document.querySelector('.popup').style;

// dot japan
const dotJapan = new THREE.Mesh(dotGeometry, dotMatirial);
dotJapan.name = 'japan'
dotJapan.position.set(positions.japan.x, positions.japan.y, positions.japan.z)
dotJapan.rotation.set(0.767, 0.598, 0.4);
// scene.add(dotJapan);

// popup function japan
const popupJapan = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../popup1.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  // enter button
  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-japan', 'enter-button');

  // twitter button
  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-japan');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/jye_br8";
    window.open("https://mobile.twitter.com/jye_br8", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://japan.globalfcx.com";
    window.open("https://japan.globalfcx.com", "_blank");
  })
}

// dot korea
const dotKorea = new THREE.Mesh(dotGeometry, dotMatirial);
dotKorea.name = "dot-korea";
dotKorea.position.set(positions.korea.x, positions.korea.y, positions.korea.z);
dotKorea.rotation.set(-2.562, -0.579, -1.6);
// scene.add(dotKorea);

// popup function korea
const popupKorea = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../popup2.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-korea', 'enter-button');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-korea');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/DE77VJsZOIfUpJx";
    window.open("https://mobile.twitter.com/DE77VJsZOIfUpJx", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://southkorea.globalfcx.com";
    window.open("https://southkorea.globalfcx.com", "_blank");
  })
}

// dot Poland
const dotPoland = new THREE.Mesh(dotGeometry, dotMatirial);
dotPoland.name = "dot-poland"
dotPoland.position.set(positions.poland.x, positions.poland.y, positions.poland.z)
dotPoland.rotation.set(4.385, 0.698, 0);
// scene.add(dotPoland);

// popup function poland
const popupPoland = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../popup3.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-poland', 'enter-button');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-poland');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://twitter.com/TomyWoo";
    window.open("https://twitter.com/TomyWoo", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("https://poland.globalfcx.com", "_blank");
  })
}


// dot Philippines
const dotPhilippines = new THREE.Mesh(dotGeometry, dotMatirial);
dotPhilippines.name = "dot-philippiens"
dotPhilippines.position.set(positions.philippines.x, positions.philippines.y, positions.philippines.z)
dotPhilippines.rotation.set(0.206, 0.529, 0);
// scene.add(dotPhilippines);

// popup function philippiens
const popupPhilippines = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../popup4.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-philippines', 'enter-button');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-philippines');

  // // twitter profile1
  // const profile1 = document.createElement('div');
  // twitterButton.appendChild(profile1);
  // profile1.classList.add('profile', 'profile1');

  // profile1.addEventListener('click', () => {
  //   // location.href = "https://mobile.twitter.com/CryptoSena08";
  //   window.open("https://mobile.twitter.com/CryptoSena08", "_blank");
  // });

  // // twitter profile2
  // const profile2 = document.createElement('div');
  // twitterButton.appendChild(profile2);
  // profile2.classList.add('profile', 'profile2');

  // profile2.addEventListener('click', () => {
  //   // location.href = "https://mobile.twitter.com/MrQuackazier";
  //   window.open("https://mobile.twitter.com/MrQuackazier", "_blank");
  // });

  // // twitter profile3
  // const profile3 = document.createElement('div');
  // twitterButton.appendChild(profile3);
  // profile3.classList.add('profile', 'profile3');

  // profile3.addEventListener('click', () => {
  //   // location.href = "https://twitter.com/xwatercity16";
  //   window.open("https://twitter.com/xwatercity16", "_blank");
  // });

  // twitter profile4
  const profile4 = document.createElement('div');
  twitterButton.appendChild(profile4);
  profile4.classList.add('profile', 'profile4');

  profile4.addEventListener('click', () => {
    // location.href = "https://mobile.twitter.com/cosme_marygrace";
    window.open("https://mobile.twitter.com/cosme_marygrace", "_blank");
  });

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://philippines.globalfcx.com";
    window.open("https://philippines.globalfcx.com", "_blank");
  })
}

// popup function africa
const popupAfrica = () => {
  popup.display = 'flex';
  popupContent.backgroundImage = "url('./../popup4.png')";
  popupContent.backgroundSize = 'contain';
  popupContent.backgroundPosition = 'center';
  popupContent.backgroundRepeat = 'no-repeat';

  // close button
  const closeButton = document.createElement('div');
  document.querySelector('.popup').appendChild(closeButton);
  closeButton.classList.add('close-btn');

  const closeIcon = document.createElement('i');
  closeButton.appendChild(closeIcon);
  closeIcon.setAttribute('class', 'fa-solid fa-xmark');

  const enterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(enterButton);
  enterButton.classList.add('enter-button-africa', 'enter-button');

  const twitterButton = document.createElement('div');
  document.querySelector('.popup').appendChild(twitterButton);
  twitterButton.classList.add('twitter-button-africa');

  twitterButton.addEventListener('click', () => {
    // location.href = "https://twitter.com/TomyWoo";
    window.open("https://twitter.com/new_scholar?s=21&t=W91B02KsdsGEez5XJHbtzA", "_blank");
  })

  document.querySelector('.close-btn').addEventListener('click', () => {
    popup.display = 'none';
    closeButton.remove();
    enterButton.remove();
    twitterButton.remove();
  });

  enterButton.addEventListener('click', () => {
    // location.href = "https://poland.globalfcx.com";
    window.open("http://southafrica.globalfcx.com/", "_blank");
  })
}

/**
 * Curves
 */

// curve material
const curveMaterial = new THREE.LineBasicMaterial({
  color: 0x00e7fb,
  transparent: true,
  opacity: 0.5,
  linewidth: 5
});

// curve japan to korea
{
  const middlePoint = new THREE.Vector3(-0.935, 0.965, -0.978);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.japan,
    middlePoint,
    positions.korea
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveJapanToKorea = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curveJapanToKorea);
}

// curve japan to philippines
{
  const middlePoint = new THREE.Vector3(-1.5177, 0.890, -1.569);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.japan,
    middlePoint,
    positions.philippines
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveJapanToPhilippines = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curveJapanToPhilippines);
}

//curve korea to philippines
{
  const middlePoint = new THREE.Vector3(-1.510, 0.690, -1.977);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.korea,
    middlePoint,
    positions.philippines
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveKoreaToPhilippines = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curveKoreaToPhilippines);
}

// curve japan to poland
{
  const middlePoint = new THREE.Vector3(0.236, 2, -1.977);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.japan,
    middlePoint,
    positions.poland
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveJapanToPoland = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curveJapanToPoland);
}

// curve korea to poland
{
  const middlePoint = new THREE.Vector3(0.236, 1.062, -1.977);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.korea,
    middlePoint,
    positions.poland
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveKoreaToPoland = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curveKoreaToPoland);
}

// curve philippines to poland
{
  const middlePoint = new THREE.Vector3(0.236, 1.962, -1.977);
  const curve = new THREE.QuadraticBezierCurve3(
    positions.philippines,
    middlePoint,
    positions.poland
  );

  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const curvePhilippinesToPoland = new THREE.Line(curveGeometry, curveMaterial);

  // scene.add(curvePhilippinesToPoland);
}

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

/**
 * HTML points
 */

const points = [
  {
    position: new THREE.Vector3(positions.japan.x, positions.japan.y, positions.japan.z),
    element: document.querySelector('.point-0')
  },
  {
    position: new THREE.Vector3(positions.korea.x, positions.korea.y, positions.korea.z),
    element: document.querySelector('.point-1')
  },
  {
    position: new THREE.Vector3(positions.poland.x, positions.poland.y, positions.poland.z),
    element: document.querySelector('.point-2')
  },
  {
    position: new THREE.Vector3(positions.philippines.x, positions.philippines.y, positions.philippines.z),
    element: document.querySelector('.point-3')
  },
  // {
  //   position: new THREE.Vector3(positions.africa.x, positions.africa.y, positions.africa.z),
  //   element: document.querySelector('.point-4')
  // }
];

points[0].element.addEventListener('click', () => {
  popupJapan();
});

points[1].element.addEventListener('click', () => {
  popupKorea();
});

points[2].element.addEventListener('click', () => {
  popupPoland();
});

points[3].element.addEventListener('click', () => {
  popupPhilippines();
});

// points[4].element.addEventListener('click', () => {
//   popupAfrica();
// });

/**
 * Resize
 */

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = mars.position;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.maxDistance = 4;
controls.minDistance = 2;
controls.enablePan = false;


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Go through each point
  for (const point of points) {
    // Get 2D screen position
    const screenPosition = point.position.clone()
    screenPosition.project(camera)

    // Set the raycaster
    raycaster.setFromCamera(screenPosition, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    // No intersect found
    if (intersects.length === 0) {
      // Show
      point.element.classList.add('visible')
    }

    // Intersect found
    else {
      // Get the distance of the intersection and the distance of the point
      const intersectionDistance = intersects[0].distance
      const pointDistance = point.position.distanceTo(camera.position)

      // Intersection is close than the point
      if (intersectionDistance < pointDistance) {
        // Hide
        point.element.classList.remove('visible')
      }
      // Intersection is further than the point
      else {
        // Show
        point.element.classList.add('visible')
      }
    }

    const translateX = screenPosition.x * sizes.width * 0.5
    const translateY = - screenPosition.y * sizes.height * 0.5
    point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();