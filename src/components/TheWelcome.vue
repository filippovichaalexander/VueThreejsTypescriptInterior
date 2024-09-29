<template>
  <div class="container">
    <div ref="container" class="three-scene"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";

const container = ref<HTMLDivElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (container.value) {
    // Создание сцены
    const scene = new THREE.Scene();

    // Создание камеры
    const camera = new THREE.PerspectiveCamera(
      75,
      container.value.offsetWidth / container.value.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Создание сферы
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Фокусировка камеры на сфере
    camera.lookAt(sphere.position);

    // Создание источника света
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.value.offsetWidth, container.value.offsetHeight);
    container.value.appendChild(renderer.domElement);

    // Сохранение ссылки на canvas-элемент
    canvasElement.value = renderer.domElement;

    // Применение стиля или класса к canvas-элементу
    canvasElement.value.classList.add("my-canvas");
    canvasElement.value.style.border = "2px solid red";

    // Анимация
    function animate() {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
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
