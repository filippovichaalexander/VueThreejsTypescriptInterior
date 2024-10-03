<template>
  <div class="container">
    <div ref="container" class="three-scene"></div>
    <div class="controls">
      <p>Измените размеры двери</p>
      <label for="niche-width">Ширина двери:</label>
      <input type="number" id="niche-width" v-model.number="doorWidth" />
      <label for="niche-height">Высота двери:</label>
      <input type="number" id="niche-height" v-model.number="doorHeight" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import woodTexture from "@/assets/images/wood-door.jpg";
import wallTextureUrl from "@/assets/images/bricks-wall.jpg";

const doorWidth = ref(0.8);
const doorHeight = ref(2.1);

const container = ref<HTMLDivElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
let controls: OrbitControls | null = null;

onMounted(() => {
  if (container.value) {
    // Создание сцены
    const scene = new THREE.Scene();

    const wallTexture = new THREE.TextureLoader().load(wallTextureUrl);
    wallTexture.repeat.set(1.2, 1.2);
    wallTexture.offset.set(0, 0);
    const materialWall = new THREE.MeshStandardMaterial({
      color: 0xc68c53,
      map: wallTexture,
      metalness: 0.9,
      roughness: 0.1,
    });

    const materialLight = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc,
      map: new THREE.TextureLoader().load(woodTexture),
      metalness: 0.2,
      roughness: 0.8,
    });
    const material = new THREE.MeshStandardMaterial({
      color: 0xd2b48c,
      map: new THREE.TextureLoader().load(woodTexture),
      metalness: 0.7,
      roughness: 0.5,
    });
    const materialKnob = new THREE.MeshStandardMaterial({
      color: 0x808080,
      map: new THREE.TextureLoader().load(woodTexture),
      metalness: 0.1,
      roughness: 0.9,
    });

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(3, 6.5, 3);
    spotLight.intensity = 3;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 10;
    scene.add(spotLight);

    // Добавляем дополнительное диффузное освещение
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(hemisphereLight);

    // создание стены wallA
    const wallAGeometry = new THREE.BoxGeometry(6, 3.2, 0.3);
    const wallA = new THREE.Mesh(wallAGeometry, materialWall);
    wallA.position.set(2, 4.8, 2);
    scene.add(wallA);

    // создание стены wallB
    const wallBGeometry = new THREE.BoxGeometry(3, 3.2, 0.3);
    const wallB = new THREE.Mesh(wallBGeometry, materialWall);
    wallB.position.set(-1, 4.8, 3.35);
    wallB.rotation.y = Math.PI / 2;
    scene.add(wallB);

    // создание стены wallB
    const wallCGeometry = new THREE.BoxGeometry(3, 3.2, 0.3);
    const wallC = new THREE.Mesh(wallCGeometry, materialWall);
    wallC.position.set(5, 4.8, 3.35);
    wallC.rotation.y = Math.PI / 2;
    scene.add(wallC);

    // Создание box по периметру стен
    const floorBottomGeometry = new THREE.BoxGeometry(6.6, 0.3, 2.65);
    const floorBottom = new THREE.Mesh(floorBottomGeometry, materialWall);
    floorBottom.position.set(2, 3.2, 3.675);
    scene.add(floorBottom);

    // Floor Top
    const tileSize = 0.4;
    const tileSpacing = 0.02;
    const tilesPerRow = Math.floor(6.6 / (tileSize + tileSpacing));
    const tilesPerColumn = Math.floor(3.65 / (tileSize + tileSpacing));

    const tileGeometry = new THREE.BoxGeometry(tileSize, 0.05, tileSize);
    const tileMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

    for (let x = 0; x < tilesPerRow; x++) {
      for (let z = 0; z < tilesPerColumn; z++) {
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
          2 - 6.6 / 2 + (tileSize + tileSpacing) * x,
          3.35,
          3.675 - 3.65 / 2 + (tileSize + tileSpacing) * z
        );
        scene.add(tile);
      }
    }

    // Создаем геометрию цилиндра
    const cylinderGeometry = new THREE.CylinderGeometry(
      1.4,
      1.4,
      0.4,
      32,
      1,
      false,
      Math.PI * 0.776,
      Math.PI * 0.444
    );
    const textureLoader = new THREE.TextureLoader();

    // Создаем координаты для прямоугольника
    const x1 = -0.04,
      z1 = 0.02;
    const x2 = 0.04,
      z2 = 0.02;
    const x3 = 0.04,
      z3 = -0.02;
    const x4 = -0.04,
      z4 = -0.02;

    // Создаем массив вершин для прямоугольника
    const vertices = [
      new THREE.Vector3(x1, 0, z1),
      new THREE.Vector3(x2, 0, z2),
      new THREE.Vector3(x2, 0, z2),
      new THREE.Vector3(x3, 0, z3),
      new THREE.Vector3(x3, 0, z3),
      new THREE.Vector3(x4, 0, z4),
      new THREE.Vector3(x4, 0, z4),
      new THREE.Vector3(x1, 0, z1),
    ];

    // Создаем геометрию для линий
    // const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    // Создаем линии
    const shape = new THREE.Shape([
      new THREE.Vector2(x1, z1),
      new THREE.Vector2(x2, z2),
      new THREE.Vector2(x3, z3),
      new THREE.Vector2(x4, z4),
    ]);

    const extrudeSettings = {
      depth: 2.5,
      bevelEnabled: false,
    };
    const shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // const lines = new THREE.LineSegments(geometry, material);
    const mesh = new THREE.Mesh(shapeGeometry, materialLight);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(2, 5.6, 2.2);

    scene.add(mesh);
    // Создаем объект цилиндра
    const cylinder = new THREE.Mesh(cylinderGeometry, material);

    // Поворачиваем цилиндр на 90 градусов вокруг оси X, чтобы он был ориентирован горизонтально
    cylinder.rotation.x = Math.PI / 2;

    // Поднимаем цилиндр на 2 единицы вверх
    cylinder.position.set(2, 4.275, 2);

    // Добавляем цилиндр в сцену
    scene.add(cylinder);

    // создание нишы двери wallA
    const nicheGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.4);
    nicheGeometry.translate(0, 2.25, 0);
    const niche = new THREE.Mesh(nicheGeometry, material);
    niche.position.set(2, 2, 2);
    scene.add(niche);

    // const doorGeometry = new THREE.BoxGeometry(0.8, 2.1, 0.1);
    const doorGeometry = new THREE.BoxGeometry(
      doorWidth.value,
      doorHeight.value,
      0.1
    );

    doorGeometry.translate(0, 2.25, 0);

    const door = new THREE.Mesh(doorGeometry, material);
    door.position.set(0.5, 2, 2.15);
    const updateDoorSize = () => {
      if (door) {
        door.scale.set(doorWidth.value / 1.8, doorHeight.value / 2.2, 1);
      }
    };

    watch([doorWidth, doorHeight], updateDoorSize);

    scene.add(door);

    // door knob
    const doorKnobGeometry = new THREE.SphereGeometry(0.06, 12, 12); // Радиус 0.1, 16 сегментов по ширине и высоте
    const doorKnobMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 }); // Коричневый цвет
    // Создание дверной ручки
    const doorKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
    doorKnob.position.set(-0.25, 2.35, 0.2); // Позиция ручки на высоте 0.9 от плитки
    niche.add(doorKnob);

    const doorKnob2 = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
    doorKnob2.position.set(0.25, 2.35, 0.2); // Позиция ручки на высоте 0.9 от плитки, симметрично оси ниши
    niche.add(doorKnob2); // Добавляем ручку к нише

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.value.offsetWidth, container.value.offsetHeight);
    container.value.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(
      75,
      container.value.offsetWidth / container.value.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6, 6); // Set the camera position higher
    camera.rotation.x = Math.PI / 2; // Rotate the camera 90 degrees around the X-axis

    // camera.lookAt(door.position); // Set the camera target
    // Создание управления камерой
    controls = new OrbitControls(camera, renderer.domElement);

    // Сохранение ссылки на canvas-элемент
    canvasElement.value = renderer.domElement;

    // Применение стиля или класса к canvas-элементу
    canvasElement.value.classList.add("my-canvas");
    canvasElement.value.style.border = "2px solid red";

    // Анимация
    function animate() {
      requestAnimationFrame(animate);
      controls?.update();
      camera.lookAt(-0.5, 3.9, 0.35);
      renderer.render(scene, camera);
    }
    animate();
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.three-scene {
  width: 100%;
  height: 80%;
}

.my-canvas {
  border-radius: 10px;
}
</style>
