<template>
  <div class="container">
    <div ref="container" class="three-scene"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import woodTexture from "@/assets/images/wood-door.jpg";

const container = ref<HTMLDivElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
let controls: OrbitControls | null = null;

onMounted(() => {
  if (container.value) {
    // Создание сцены
    const scene = new THREE.Scene();
    // CSG.init(THREE);
    // Создание камеры

    // Создание сферы
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // const sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);

    // // Фокусировка камеры на сфере
    // camera.lookAt(sphere.position);

    // Создание источника света

    const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 2, 0); // Поместите источник света внутрь комнаты
    spotLight.intensity = 1.5; // Увеличиваем яркость источника света
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 10;
    scene.add(spotLight);

    // Добавляем дополнительное диффузное освещение
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(hemisphereLight);

    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Grey color
    // создание стены wallA
    const wallAGeometry = new THREE.BoxGeometry(6, 3.2, 0.3);
    const wallA = new THREE.Mesh(wallAGeometry, wallMaterial);
    wallA.position.set(2, 4.8, 2);
    scene.add(wallA);

    // создание стены wallB
    const wallBGeometry = new THREE.BoxGeometry(3, 3.2, 0.3);
    const wallB = new THREE.Mesh(wallBGeometry, wallMaterial);
    wallB.position.set(-1, 4.8, 3.35);
    wallB.rotation.y = Math.PI / 2; // Rotate 90 degrees around the X-axis
    scene.add(wallB);

    // создание стены wallB
    const wallCGeometry = new THREE.BoxGeometry(3, 3.2, 0.3);
    const wallC = new THREE.Mesh(wallCGeometry, wallMaterial);
    wallC.position.set(5, 4.8, 3.35); // Установка позиции стены wallC симметрично относительно середины стены wallA
    wallC.rotation.y = Math.PI / 2; // Поворот на 90 градусов вокруг оси Y
    scene.add(wallC);

    // Создание box по периметру стен
    const floorBottomGeometry = new THREE.BoxGeometry(6.6, 0.3, 2.65); // Размеры box
    const floorBottom = new THREE.Mesh(floorBottomGeometry, wallMaterial);
    floorBottom.position.set(2, 3.2, 3.675); // Позиция box
    scene.add(floorBottom);

    // Floor Top (Ceramic Tiles)
    const tileSize = 0.4; // 400mm x 400mm
    const tileSpacing = 0.02; // 2cm spacing between tiles
    const tilesPerRow = Math.floor(6.6 / (tileSize + tileSpacing));
    const tilesPerColumn = Math.floor(3.65 / (tileSize + tileSpacing));

    const tileGeometry = new THREE.BoxGeometry(tileSize, 0.05, tileSize); // Увеличили толщину до 5 см
    const tileMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // White ceramic tiles

    for (let x = 0; x < tilesPerRow; x++) {
      for (let z = 0; z < tilesPerColumn; z++) {
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
          2 - 6.6 / 2 + (tileSize + tileSpacing) * x,
          3.35, // Slightly above the floor bottom
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
    // const woodTexture = textureLoader.load("../assets/images/wood-door");
    // const cubeTexture = textureLoader.load([
    //   "px.png",
    //   "nx.png",
    //   "py.png",
    //   "ny.png",
    //   "pz.png",
    //   "nz.png",
    // ]);
    // Создаем материал
    const materialLight = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc, // Beige color
      map: new THREE.TextureLoader().load(woodTexture),
      metalness: 0.2, // Настройка металличности
      roughness: 0.8, // Настройка шероховатости
      // envMap: cubeTexture, // Использование фона сцены как отражение
    });
    const material = new THREE.MeshStandardMaterial({
      color: 0xd2b48c, // Коричневый цвет
      map: new THREE.TextureLoader().load(woodTexture),
      metalness: 0.7, // Настройка металличности
      roughness: 0.5, // Настройка шероховатости
      // envMap: cubeTexture, // Использование фона сцены как отражение
    });
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
    // const shapeGeometry = new THREE.ShapeGeometry(shape);

    const extrudeSettings = {
      depth: 2.5, // Extrude depth
      bevelEnabled: false, // Disable bevel
    };
    const shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // const lines = new THREE.LineSegments(geometry, material);
    const mesh = new THREE.Mesh(shapeGeometry, materialLight);
    mesh.rotation.x = Math.PI / 2; // Rotate 90 degrees around the X-axis
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
    // nicheGeometry.rotateY(Math.PI / 4);
    const roomMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Grey color
    const niche = new THREE.Mesh(nicheGeometry, material);
    // niche.position.set(0, 6.5, -3);
    niche.position.set(2, 2, 2);
    scene.add(niche);

    // Make 2 meshes..
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshNormalMaterial()
    );
    box.position.set(0, 1, 0); // Set the position of the box

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8));
    sphere.position.set(0, 1, 0); // Position the sphere at the same position as the box

    // Make sure the .matrix of each mesh is current
    box.updateMatrix();
    sphere.updateMatrix();

    // Perform CSG operations
    const subRes = CSG.subtract(box, sphere);

    // Add the subtracted result to the scene
    scene.add(subRes);

    // Create a door
    const doorGeometry = new THREE.BoxGeometry(0.9, 2.1, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(2, 1.05, -3); // Поместите дверь параллельно окну

    scene.add(door);

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
    camera.position.set(0, 7, 7); // Set the camera position higher
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
      camera.lookAt(3, 3, 3);
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
