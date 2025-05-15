<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <button class="follow-button" :class="{ active: isFollowing }" @click="toggleFollow" title="Следить за водителем">
      {{ isFollowing ? '🛑 Стоп' : '🔍 Слежение' }}
    </button>
    <button class="geolocation-button" @click="askUserLocation" title="Центрировать на вашем городе">
      <img src="https://cdn-icons-png.flaticon.com/512/2267/2267918.png" alt="Город" width="20" />
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';

const emit = defineEmits(['update:eta']);
const store = useStore();

const driverCoords = computed(() => store.getters['tracking/driverCoords']);
const startWarehouse = computed(() => store.getters['tracking/startWarehouse']);
const endWarehouse = computed(() => store.getters['tracking/endWarehouse']);
const orderStatus = computed(() => store.getters['tracking/currentOrderStatus']);
const isFollowing = computed(() => store.getters['tracking/isFollowing']);
const previousCoords = computed(() => store.state.tracking.previousCoords);
const isRouteBuilt = computed(() => store.state.tracking.isRouteBuilt);
const pendingDriverCoords = computed(() => store.state.tracking.pendingDriverCoords);
const isAnimating = computed(() => store.state.tracking.isAnimating);
const initialFocusDone = computed(() => store.state.tracking.initialFocusDone);
const currentAngle = computed(() => store.state.tracking.currentAngle);
const isReversing = computed(() => store.state.tracking.isReversing);
const savedRoute = computed(() => store.state.tracking.savedRoute);
const currentTrackedOrder = computed(() => store.getters['tracking/currentTrackedOrder']);

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [1, -34],
});

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [1, -34],
});

const carIcon = L.divIcon({
  html: `<div class="car-marker-container"><img src="https://cdn-icons-png.flaticon.com/512/15303/15303815.png" class="car-marker" style="width: 32px; height: 32px;" /></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'car-marker-wrapper',
});

let map = null;
let driverMarker = null;
let routeLine = null;
let startMarker = null;
let endMarker = null;
let animationFrame = null;
let isMounted = false;
const maxRotationSpeed = 150;

function initMap() {
  map = L.map('map').setView([52.2864, 104.2810], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  window.addEventListener('resize', handleResize);
  restoreMapState();
}

function handleResize() {
  if (map && isMounted) {
    map.invalidateSize();
  }
}

function _onResize() {
  handleResize();
}

async function updateMarkers(start, end) {
  if (!isMounted) return;

  if (orderStatus.value !== 'В пути' || !start || !end || typeof start.lat !== 'number' || typeof start.lon !== 'number' || typeof end.lat !== 'number' || typeof end.lon !== 'number') {
    return;
  }

  if (isRouteBuilt.value && routeLine) {
    if (startMarker) {
      startMarker.setLatLng([start.lat, start.lon]);
      startMarker.setPopupContent('Склад отправления');
    } else {
      startMarker = L.marker([start.lat, start.lon], { icon: greenIcon }).addTo(map).bindPopup('Склад отправления');
    }

    if (endMarker) {
      endMarker.setLatLng([end.lat, end.lon]);
      endMarker.setPopupContent('Склад назначения');
    } else {
      endMarker = L.marker([end.lat, end.lon], { icon: redIcon }).addTo(map).bindPopup('Склад назначения');
    }
    return;
  }

  if (startMarker) map.removeLayer(startMarker);
  if (endMarker) map.removeLayer(endMarker);
  if (routeLine) map.removeLayer(routeLine);

  startMarker = L.marker([start.lat, start.lon], { icon: greenIcon }).addTo(map).bindPopup('Склад отправления');
  endMarker = L.marker([end.lat, end.lon], { icon: redIcon }).addTo(map).bindPopup('Склад назначения');

  const coords = await getRouteFromOSRM(start, end);
  if (coords.length > 0) {
    routeLine = L.polyline(coords, { color: '#0077ff', weight: 4, opacity: 0.6 }).addTo(map);
    store.commit('tracking/setSavedRoute', coords);
    store.commit('tracking/setIsRouteBuilt', true);
  } else {
    store.commit('tracking/setErrorMessage', 'Не удалось построить маршрут. Попробуйте позже.');
    store.commit('tracking/setErrorDialogVisible', true);
  }

  if (pendingDriverCoords.value) {
    moveDriverSmoothly(pendingDriverCoords.value);
    store.commit('tracking/setPendingDriverCoords', null);
  }
}

async function getRouteFromOSRM(start, end) {
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.routes || data.routes.length === 0) return [];
    return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  } catch {
    return [];
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function areCoordsEqual(coords1, coords2) {
  if (!coords1 || !coords2) return false;
  return coords1[0] === coords2[0] && coords1[1] === coords2[1];
}

function cubicBezier(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

function interpolateAngle(start, end, progress, duration) {
  const angleDiff = ((end - start + 180) % 360) - 180;
  const maxAngleChange = (maxRotationSpeed * duration) / 1000;
  const interpolatedAngle = start + angleDiff * progress;
  const clampedAngle = start + Math.min(Math.max(angleDiff * progress, -maxAngleChange * progress), maxAngleChange * progress);
  return { angle: clampedAngle, isReversing: Math.abs(angleDiff) > 90 };
}

function moveDriverSmoothly(newCoords) {
  if (!isMounted) return;
  if (!Array.isArray(newCoords) || newCoords.length !== 2) return;

  const current = newCoords;
  const prev = previousCoords.value;

  if (prev && areCoordsEqual(current, prev)) {
    if (isAnimating.value) store.commit('tracking/setPendingDriverCoords', current);
    return;
  }

  if (endWarehouse.value && typeof endWarehouse.value.lat === 'number' && typeof endWarehouse.value.lon === 'number') {
    const distance = calculateDistance(current[0], current[1], endWarehouse.value.lat, endWarehouse.value.lon);
    const now = new Date();
    const hour = now.getHours();
    const averageSpeedKmh = (hour >= 8 && hour < 10) || (hour >= 17 && hour < 19) ? 20 : 40;
    const distanceKm = distance / 1000;
    const speedKmPerSecond = averageSpeedKmh / 3600;
    const timeSeconds = distanceKm / speedKmPerSecond;
    const eta = timeSeconds / 60;
    store.commit('tracking/setEta', eta);
    emit('update:eta', eta);
  } else {
    store.commit('tracking/setEta', null);
    emit('update:eta', null);
  }

  if (!prev) {
    driverMarker = L.marker(current, { icon: carIcon, rotationAngle: currentAngle.value })
      .addTo(map)
      .bindPopup('<div class="driver-popup">Курьер</div>', {
        className: 'custom-driver-popup',
        offset: [0, -5],
        autoClose: true,
        closeOnClick: true,
      });
    store.commit('tracking/setPreviousCoords', current);
    if (isRouteBuilt.value && !initialFocusDone.value) {
      map.flyTo(current, 14, { duration: 1.5 });
      store.commit('tracking/setInitialFocusDone', true);
    }
    return;
  }

  if (isAnimating.value) {
    store.commit('tracking/setPendingDriverCoords', current);
    return;
  }

  store.commit('tracking/setIsAnimating', true);

  const startLat = prev[0];
  const startLon = prev[1];
  const targetLat = current[0];
  const targetLon = current[1];

  const distance = calculateDistance(startLat, startLon, targetLat, targetLon);
  const speed = 20;
  const duration = Math.max(1000, (distance / speed) * 1000);
  const steps = Math.round(duration / 16);
  let stepCount = 0;
  const durationPerStep = duration / steps;

  const controlPoint1Lat = startLat + (targetLat - startLat) * 0.3;
  const controlPoint1Lon = startLon + (targetLon - startLon) * 0.3;
  const controlPoint2Lat = startLat + (targetLat - startLat) * 0.7;
  const controlPoint2Lon = startLon + (targetLon - startLon) * 0.7;

  const startAngle = currentAngle.value;
  const newAngle = safeCalculateBearing(startLat, startLon, targetLat, targetLon);
  store.commit('tracking/setCurrentAngle', newAngle);

  const { angle: interpolatedAngle, isReversing: reversing } = interpolateAngle(startAngle, newAngle, 1, duration);
  store.commit('tracking/setIsReversing', reversing);

  if (isReversing.value) {
    if (driverMarker) driverMarker.setLatLng(prev);
    store.commit('tracking/setPreviousCoords', prev);
    if (isFollowing.value && map) map.setView(prev, 20, { animate: true });
    store.commit('tracking/setIsAnimating', false);

    if (pendingDriverCoords.value) {
      const nextCoords = pendingDriverCoords.value;
      store.commit('tracking/setPendingDriverCoords', null);
      moveDriverSmoothly(nextCoords);
    }
    return;
  }

  function animateStep() {
    if (stepCount < steps && isMounted) {
      const t = stepCount / steps;
      const lat = cubicBezier(t, startLat, controlPoint1Lat, controlPoint2Lat, targetLat);
      const lon = cubicBezier(t, startLon, controlPoint1Lon, controlPoint2Lon, targetLon);

      const { angle: interpolatedAngle } = interpolateAngle(startAngle, newAngle, t, duration);

      if (driverMarker) {
        try {
          driverMarker.setLatLng([lat, lon]);

          if (typeof driverMarker.setRotationAngle === 'function') {
            driverMarker.setRotationAngle(interpolatedAngle);
          } else {
            const markerElContainer = driverMarker.getElement()?.querySelector('.car-marker-container');
            const markerEl = driverMarker.getElement()?.querySelector('.car-marker');
            if (markerElContainer) {
              markerElContainer.style.transition = 'transform 0.016s linear';
              markerElContainer.style.transform = `rotate(${interpolatedAngle}deg)`;
            }
            if (markerEl) {
              markerEl.style.transition = 'transform 0.016s linear';
              markerEl.style.transform = `rotate(${interpolatedAngle}deg)`;
            }
          }
        } catch {}
      }

      if (isFollowing.value && map && driverMarker) {
        map.flyTo(driverMarker.getLatLng(), 18, { duration: durationPerStep / 1000 });
      }

      stepCount++;
      animationFrame = setTimeout(() => requestAnimationFrame(animateStep), durationPerStep);
    } else if (isMounted) {
      if (driverMarker) driverMarker.setLatLng(current);
      store.commit('tracking/setPreviousCoords', current);
      if (isFollowing.value && map) map.setView(current, 20, { animate: true });
      store.commit('tracking/setIsAnimating', false);

      if (pendingDriverCoords.value) {
        const nextCoords = pendingDriverCoords.value;
        store.commit('tracking/setPendingDriverCoords', null);
        moveDriverSmoothly(nextCoords);
      }
    }
  }

  animateStep();
}

function safeCalculateBearing(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') return currentAngle.value;
  const degToRad = (deg) => (deg * Math.PI) / 180;
  const radToDeg = (rad) => (rad * 180) / Math.PI;
  const y = Math.sin(degToRad(lon2 - lon1)) * Math.cos(degToRad(lat2));
  const x = Math.cos(degToRad(lat1)) * Math.sin(degToRad(lat2)) - Math.sin(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.cos(degToRad(lon2 - lon1));
  const brng = Math.atan2(y, x);
  return (radToDeg(brng) + 360) % 360;
}

function toggleFollow() {
  store.commit('tracking/setIsFollowing', !isFollowing.value);
  if (isFollowing.value && driverMarker && map) {
    map.flyTo(driverMarker.getLatLng(), 18, { duration: 1.5 });
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
  } else if (map) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
  }
}

function startFollowing() {
  if (!isFollowing.value) toggleFollow();
}

function stopFollowing() {
  if (isFollowing.value) toggleFollow();
}

function askUserLocation() {
  if (!navigator.geolocation || !isMounted) {
    alert('Геолокация не поддерживается вашим браузером или компонент демонтирован.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!isMounted) return;
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      if (map) map.flyTo([lat, lon], 13, { duration: 1.5 });
    },
    (error) => alert('Не удалось получить местоположение: ' + error.message),
    { timeout: 3000 }
  );
}

function clearTrackingElements() {
  if (!isMounted) return;
  store.commit('tracking/setIsRouteBuilt', false);
  store.commit('tracking/setIsAnimating', false);
  store.commit('tracking/setPendingDriverCoords', null);
  store.commit('tracking/setInitialFocusDone', false);
  store.commit('tracking/setEta', null);
  emit('update:eta', null);
  if (startMarker && map) map.removeLayer(startMarker);
  if (endMarker && map) map.removeLayer(endMarker);
  if (routeLine && map) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
  if (driverMarker && map) map.removeLayer(driverMarker);
  startMarker = null;
  endMarker = null;
  driverMarker = null;
  store.commit('tracking/setPreviousCoords', null);
  store.commit('tracking/setSavedRoute', null);
  if (!isFollowing.value && map) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
  }
}

function resetMap() {
  if (!isMounted) return;
  clearTrackingElements();
}

function restoreMapState() {
  if (!currentTrackedOrder.value || orderStatus.value !== 'В пути' || !startWarehouse.value || !endWarehouse.value) return;

  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }

  if (startWarehouse.value && endWarehouse.value) {
    startMarker = L.marker([startWarehouse.value.lat, startWarehouse.value.lon], { icon: greenIcon }).addTo(map).bindPopup('Склад отправления');
    endMarker = L.marker([endWarehouse.value.lat, endWarehouse.value.lon], { icon: redIcon }).addTo(map).bindPopup('Склад назначения');
  }

  if (savedRoute.value && savedRoute.value.length > 0) {
    routeLine = L.polyline(savedRoute.value, { color: '#0077ff', weight: 4, opacity: 0.6 }).addTo(map);
    store.commit('tracking/setIsRouteBuilt', true);
  }

  if (driverCoords.value && Array.isArray(driverCoords.value) && driverCoords.value.length === 2) {
    driverMarker = L.marker(driverCoords.value, { icon: carIcon, rotationAngle: currentAngle.value })
      .addTo(map)
      .bindPopup('<div class="driver-popup">🚗 Это ваш курьер</div>', {
        className: 'custom-driver-popup',
        offset: [0, -5],
        autoClose: true,
        closeOnClick: true,
      });
    store.commit('tracking/setPreviousCoords', driverCoords.value);
    map.flyTo(driverCoords.value, 16, { duration: 2 });
    if (isFollowing.value) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    }
  }
}

watch(() => [startWarehouse.value, endWarehouse.value, orderStatus.value], ([newStart, newEnd, status]) => {
  if (isMounted && status === 'В пути' && newStart && newEnd && typeof newStart.lat === 'number' && typeof newStart.lon === 'number' && typeof newEnd.lat === 'number' && typeof newEnd.lon === 'number') {
    updateMarkers(newStart, newEnd);
  } else {
    store.commit('tracking/setEta', null);
    emit('update:eta', null);
  }
}, { deep: true });

watch(() => driverCoords.value, (coords) => {
  if (isMounted && Array.isArray(coords) && coords.length === 2) {
    if (isRouteBuilt.value) moveDriverSmoothly(coords);
    else store.commit('tracking/setPendingDriverCoords', coords);
  }
}, { immediate: true });

watch(() => [isFollowing.value, driverMarker?.getLatLng()], ([following, latLng]) => {
  if (following && map && driverMarker && latLng) map.flyTo(latLng, 18, { duration: 1.5 });
}, { immediate: true });

onMounted(() => {
  isMounted = true;
  initMap();
  if (store.state.tracking.currentTrackedOrder) store.dispatch('tracking/pollOrderStatus');
});

onUnmounted(() => {
  isMounted = false;
  if (animationFrame) clearTimeout(animationFrame);
  if (map) {
    window.removeEventListener('resize', handleResize);
    map.remove();
    map = null;
  }
  driverMarker = null;
  routeLine = null;
  startMarker = null;
  endMarker = null;
});

defineExpose({ startFollowing, stopFollowing, clearTrackingElements, _onResize, resetMap });
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.follow-button,
.geolocation-button {
  position: absolute;
  left: 10px;
  z-index: 999;
  padding: 8px 12px;
  background: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.follow-button {
  bottom: 10px;
}

.geolocation-button {
  bottom: 50px;
}

.follow-button:hover,
.geolocation-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.geolocation-button img {
  pointer-events: none;
  user-select: none;
}

.car-marker-container {
  transition: transform 0.016s linear;
}

.car-marker {
  transform-origin: center;
  transition: transform 0.016s linear;
}
</style>