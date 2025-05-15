<template>
  <div class="container">
    <div class="main-wrapper" :class="{ 'expanded': isMapExpanded }">
      <div class="map-wrapper">
        <Map
          ref="mapRef"
          :start-warehouse="startWarehouse"
          :end-warehouse="endWarehouse"
          :driver-coords="driverCoords"
          :order-status="currentOrderStatus"
          @update:eta="updateEta"
        />
        <button @click.stop="toggleMapSize" class="expand-button" :title="isMapExpanded ? 'Свернуть карту' : 'Развернуть карту'">
          <span v-if="!isMapExpanded">↔</span>
          <span v-else>↕</span>
        </button>
      </div>
      <div class="control-panel" :class="{ 'expanded-control': isMapExpanded }">
        <div class="input-section">
          <input v-model="orderId" placeholder="Введите номер заказа (например, 000003)" class="order-input" />
          <div class="button-group">
            <button @click="startTracking" class="track-button">Отследить</button>
            <button @click="resetTracking" class="reset-button">Сброс</button>
          </div>
        </div>
        <div class="details-panel" v-if="(currentOrderStatus && ['В пути', 'Загружен'].includes(currentOrderStatus)) || queueNumber || eta !== null">
          <h3 class="details-title">Детали заказа</h3>
          <div class="details-content">
            <p v-if="currentOrderStatus && ['В пути', 'Загружен'].includes(currentOrderStatus)" class="status-text">
              <svg class="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Текущий статус: {{ currentOrderStatus }}
            </p>
            <p v-if="queueNumber" class="queue-text">
              <svg class="queue-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3h18M3 7h18M3 11h18M3 15h18"/>
              </svg>
              Позиция в очереди: {{ queueNumber }}
            </p>
            <p v-if="eta !== null && currentOrderStatus === 'В пути'" class="eta-text">
              <svg class="eta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Время до прибытия: {{ eta.toFixed(0) }} мин
            </p>
          </div>
        </div>
      </div>
      <div class="dialog-backdrop" v-if="isErrorDialogVisible" @click="closeErrorDialog">
        <div class="error-dialog" @click.stop>
          <h3 class="details-title">
            <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 19h20L12 2z"/>
              <path d="M12 16h0"/>
              <path d="M12 8v4"/>
            </svg>
            Ошибка
          </h3>
          <div class="details-content">
            <p class="error-text">{{ errorMessage }}</p>
          </div>
          <button @click="closeErrorDialog" class="close-button">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import Map from '@/components/Map.vue';

const store = useStore();

const orderId = computed({
  get: () => store.getters['tracking/orderId'],
  set: (value) => store.commit('tracking/setOrderId', value),
});
const driverCoords = computed(() => store.getters['tracking/driverCoords']);
const startWarehouse = computed(() => store.getters['tracking/startWarehouse']);
const endWarehouse = computed(() => store.getters['tracking/endWarehouse']);
const currentOrderStatus = computed(() => store.getters['tracking/currentOrderStatus']);
const queueNumber = computed(() => store.getters['tracking/queueNumber']);
const eta = computed(() => store.getters['tracking/eta']);
const isErrorDialogVisible = computed(() => store.getters['tracking/isErrorDialogVisible']);
const errorMessage = computed(() => store.getters['tracking/errorMessage']);
const isMapExpanded = computed(() => store.state.isMapExpanded);
const currentTrackedOrder = computed(() => store.getters['tracking/currentTrackedOrder']);
const isTrackingError = computed(() => store.getters['tracking/isTrackingError']);

const mapRef = ref(null);
let resizeTimeout = null;

const startTracking = () => {
  if (currentTrackedOrder.value === orderId.value) {
    if (currentOrderStatus.value && ['В пути', 'Загружен'].includes(currentOrderStatus.value)) {
      store.commit('tracking/setErrorMessage', `Заказ ${orderId.value} уже отслеживается`);
      store.commit('tracking/setErrorDialogVisible', true);
      return;
    }
  }

  if (mapRef.value) mapRef.value.clearTrackingElements();

  store.dispatch('tracking/startTracking');
};

const resetTracking = () => {
  store.dispatch('tracking/resetTracking');
  if (mapRef.value) {
    mapRef.value.clearTrackingElements();
    mapRef.value.resetMap();
  }
  localStorage.removeItem('tracking_state');
};

const closeErrorDialog = () => store.dispatch('tracking/closeErrorDialog');

const toggleMapSize = () => {
  store.dispatch('toggleMapSize');
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (mapRef.value) mapRef.value._onResize();
  }, 300);
};

const updateEta = (newEta) => store.commit('tracking/setEta', newEta);

onMounted(() => {
  if (mapRef.value) {
    resizeTimeout = setTimeout(() => {
      if (mapRef.value) mapRef.value._onResize();
    }, 300);
  }
});

onUnmounted(() => {
  store.dispatch('tracking/stopPolling');
  if (resizeTimeout) clearTimeout(resizeTimeout);
  if (mapRef.value) mapRef.value.clearTrackingElements();
});
</script>

<style scoped>
.container {
  height: auto;
  background-color: white;
  padding: 20px;
  position: relative;
}

.main-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.3s ease;
}

.main-wrapper.expanded {
  flex-direction: column;
}

.map-wrapper {
  position: relative;
  width: 700px;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.main-wrapper.expanded .map-wrapper {
  width: 100%;
  height: 600px;
}

.expand-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1001;
  background-color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.expand-button:hover {
  background-color: #e0e0e0;
}

.control-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
}

.main-wrapper.expanded .control-panel {
  position: absolute;
  top: 35px;
  right: 35px;
  width: 300px;
  z-index: 1000;
}

.input-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease-out forwards;
  transition: transform 0.3s ease;
}

.input-section:hover {
  transform: scale(1.02);
}

.order-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.order-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.button-group {
  display: flex;
  gap: 10px;
}

.track-button,
.reset-button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.track-button {
  background-color: #007bff;
  color: #ffffff;
}

.track-button:hover {
  background-color: #0056b3;
}

.reset-button {
  background-color: #dc3545;
  color: #ffffff;
}

.reset-button:hover {
  background-color: #c82333;
}

.details-panel {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  animation: slideDown 0.5s ease-out forwards;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-dialog {
  background-color: #fff5f5;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #ffcccc;
  z-index: 3000;
  animation: slideDown 0.5s ease-out forwards;
  max-width: 450px;
  width: 90%;
}

.error-icon {
  color: #e63946;
  margin-right: 8px;
  vertical-align: middle;
  width: 24px;
  height: 24px;
}

.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: linear-gradient(90deg, #e63946, #d00000);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: linear-gradient(90deg, #d00000, #b00000);
  transform: scale(1.02);
}

.close-button:active {
  transform: scale(0.98);
}

.details-title {
  margin: 0 0 15px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 1.5;
  word-wrap: break-word;
}

.status-text,
.queue-text,
.eta-text {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon,
.queue-icon,
.eta-icon {
  width: 18px;
  height: 18px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .main-wrapper {
    flex-direction: column;
  }

  .map-wrapper {
    width: 100%;
    height: 500px;
  }

  .control-panel {
    width: 100%;
  }

  .main-wrapper.expanded .control-panel {
    position: static;
    width: 100%;
  }

  .error-dialog {
    width: 90%;
    max-width: 320px;
  }
}
</style>