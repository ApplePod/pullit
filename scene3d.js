import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('no canvas');

const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 800 : 2000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 28;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geo = new THREE.BufferGeometry();
const pos = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const palette = [
  new THREE.Color('#00E5A8'),
  new THREE.Color('#5B5BF0'),
  new THREE.Color('#FF6B7A'),
  new THREE.Color('#8B5CF6'),
];
for (let i = 0; i < particleCount; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 80;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;
}
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({
  size: isMobile ? 0.12 : 0.18,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(geo, mat);
scene.add(particles);

const rings = [];
[0x00e5a8, 0x5b5bf0, 0xff6b7a].forEach((col, i) => {
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(6 + i * 2.5, 0.06, 16, 100),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35 })
  );
  torus.rotation.x = Math.PI / 2 + i * 0.3;
  scene.add(torus);
  rings.push(torus);
});

function makeTextSprite(text, color, scale = 12) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = 'bold 200px Pretendard, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 140);
  const tex = new THREE.CanvasTexture(c);
  const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(sm);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

const big3 = makeTextSprite('3', '#00E5A8', isMobile ? 8 : 14);
big3.position.set(-8, 2, -5);
scene.add(big3);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const pl1 = new THREE.PointLight(0x00e5a8, 2, 50);
pl1.position.set(10, 5, 10);
scene.add(pl1);
const pl2 = new THREE.PointLight(0x5b5bf0, 2, 50);
pl2.position.set(-10, -5, 8);
scene.add(pl2);

let mouseX = 0;
let mouseY = 0;
if (!isMobile) {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  particles.rotation.y = t * 0.02;
  particles.rotation.x = Math.sin(t * 0.1) * 0.05;
  rings.forEach((ring, i) => {
    ring.rotation.z = t * (0.15 + i * 0.05);
  });
  big3.position.y = 2 + Math.sin(t * 0.8) * 0.8;
  camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
