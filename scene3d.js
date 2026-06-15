import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('no canvas');

const isMobile = window.innerWidth < 768;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 32);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

/* ── particle nebula ── */
const COUNT = isMobile ? 1200 : 3500;
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(COUNT * 3);
const cols = new Float32Array(COUNT * 3);
const sizes = new Float32Array(COUNT);
const palette = [
  new THREE.Color('#00E5A8'),
  new THREE.Color('#5B5BF0'),
  new THREE.Color('#FF6B7A'),
  new THREE.Color('#8B5CF6'),
  new THREE.Color('#ffffff'),
];
for (let i = 0; i < COUNT; i++) {
  const r = 20 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
  pos[i * 3 + 2] = r * Math.cos(phi) * 0.8;
  const c = palette[Math.floor(Math.random() * palette.length)];
  cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  sizes[i] = Math.random();
}
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particles = new THREE.Points(geo, new THREE.PointsMaterial({
  size: isMobile ? 0.14 : 0.22,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
}));
scene.add(particles);

/* ── wireframe weakness globe ── */
const globe = new THREE.Mesh(
  new THREE.IcosahedronGeometry(8, 2),
  new THREE.MeshBasicMaterial({ color: 0x00e5a8, wireframe: true, transparent: true, opacity: 0.12 })
);
globe.position.set(12, -4, -15);
scene.add(globe);

const globe2 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5, 1),
  new THREE.MeshBasicMaterial({ color: 0x5b5bf0, wireframe: true, transparent: true, opacity: 0.08 })
);
globe2.position.set(-14, 6, -20);
scene.add(globe2);

/* ── torus rings ── */
const rings = [];
[[6, 0x00e5a8], [9, 0x5b5bf0], [12, 0xff6b7a]].forEach(([r, col], i) => {
  const t = new THREE.Mesh(
    new THREE.TorusGeometry(r, 0.05, 12, 80),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.25 })
  );
  t.rotation.x = Math.PI / 2 + i * 0.4;
  scene.add(t);
  rings.push(t);
});

/* ── floating math glyphs ── */
const glyphs = [];
const glyphChars = ['∫', 'π', 'x²', 'Δ', 'Σ', '3', 'fx', 'lim'];
glyphChars.forEach((ch, i) => {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = ['#00E5A8', '#5B5BF0', '#FF6B7A'][i % 3];
  ctx.font = 'bold 72px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending });
  const sp = new THREE.Sprite(mat);
  const angle = (i / glyphChars.length) * Math.PI * 2;
  sp.position.set(Math.cos(angle) * 18, Math.sin(angle) * 10, -8 + i);
  sp.scale.set(3, 3, 1);
  sp.userData = { angle, speed: 0.3 + Math.random() * 0.4, baseY: sp.position.y };
  scene.add(sp);
  glyphs.push(sp);
});

/* ── giant 3 sprite ── */
function textSprite(txt, color, scale) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = 'bold 220px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(txt, 128, 140);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending,
  }));
  sp.scale.set(scale, scale, 1);
  return sp;
}
const big3 = textSprite('3', '#00E5A8', isMobile ? 10 : 18);
big3.position.set(-6, 1, -10);
scene.add(big3);

/* ── lights ── */
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
const pl1 = new THREE.PointLight(0x00e5a8, 3, 60);
pl1.position.set(15, 8, 12);
scene.add(pl1);
const pl2 = new THREE.PointLight(0x5b5bf0, 2.5, 60);
pl2.position.set(-12, -6, 10);
scene.add(pl2);
const pl3 = new THREE.PointLight(0xff6b7a, 1.5, 40);
pl3.position.set(0, 12, 5);
scene.add(pl3);

/* ── scroll + mouse ── */
let scrollY = 0;
let mouseX = 0, mouseY = 0;
let scrollTarget = { y: 0, intensity: 0 };

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  scrollTarget.y = scrollY / (document.body.scrollHeight - window.innerHeight);
}, { passive: true });

window.addEventListener('pullit-scroll', (e) => {
  scrollTarget.intensity = e.detail?.intensity ?? 0;
});

if (!isMobile && !reduced) {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

const clock = new THREE.Clock();
let smoothScroll = 0, smoothIntensity = 0;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  smoothScroll += (scrollTarget.y - smoothScroll) * 0.05;
  smoothIntensity += (scrollTarget.intensity - smoothIntensity) * 0.08;

  particles.rotation.y = t * 0.015 + smoothScroll * 2;
  particles.rotation.x = Math.sin(t * 0.08) * 0.08 + smoothScroll * 0.5;

  rings.forEach((ring, i) => {
    ring.rotation.z = t * (0.1 + i * 0.04) + smoothScroll * (i + 1);
  });

  globe.rotation.x = t * 0.15;
  globe.rotation.y = t * 0.2 + smoothScroll;
  globe2.rotation.x = -t * 0.1;
  globe2.rotation.y = t * 0.25;

  glyphs.forEach((g) => {
    const a = g.userData.angle + t * g.userData.speed;
    g.position.x = Math.cos(a) * (16 + smoothIntensity * 4);
    g.position.y = g.userData.baseY + Math.sin(t * 0.6 + g.userData.angle) * 2;
    g.material.opacity = 0.12 + smoothIntensity * 0.15;
  });

  big3.position.y = 1 + Math.sin(t * 0.7) * 1.2;
  big3.material.opacity = 0.08 + smoothIntensity * 0.12;
  big3.scale.setScalar((isMobile ? 10 : 18) * (1 + smoothIntensity * 0.2));

  const camZ = 32 - smoothScroll * 8 - smoothIntensity * 6;
  camera.position.x += (mouseX * 5 - camera.position.x) * 0.04;
  camera.position.y += (-mouseY * 4 - camera.position.y) * 0.04;
  camera.position.z += (camZ - camera.position.z) * 0.05;
  camera.lookAt(0, smoothScroll * 2, 0);

  pl1.intensity = 3 + smoothIntensity * 2;
  pl3.intensity = 1.5 + Math.sin(t * 2) * 0.5;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export { scene, camera };
