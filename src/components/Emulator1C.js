const EMULATOR_DELAY = 500;

// Эмуляция данных
const mockData = {
  '0000123': {
    status: 'В пути',
    startWarehouse: {
      lat: 52.544358,
      lon: 103.888249,
    },
    endWarehouse: {
      lat: 52.562000,
      lon: 103.899999,
    },
    coordsHistoryTemplate: [
      { offset: 0 * 60 * 1000, lat: 52.544358, lon: 103.888249 }, // 0 мин
      { offset: 2 * 60 * 1000, lat: 52.547000, lon: 103.890000 },
      { offset: 4 * 60 * 1000, lat: 52.550000, lon: 103.893000 },
      { offset: 6 * 60 * 1000, lat: 52.553000, lon: 103.896000 },
      { offset: 8 * 60 * 1000, lat: 52.557000, lon: 103.898000 },
      { offset: 10 * 60 * 1000, lat: 52.562000, lon: 103.899999 }, // 10 мин
    ],
  },
  '0000456': {
    status: 'Загружен',
    queueNumber: 3,
    startWarehouse: {
      lat: 52.544358,
      lon: 103.888249,
    },
    endWarehouse: {
      lat: 52.562000,
      lon: 103.899999,
    },
  },
};

let trackingStartTime = null;
let currentCustomCoords = null;

export default {
  async getOrderStatus(orderId, timestamp) {
    await new Promise((resolve) => setTimeout(resolve, EMULATOR_DELAY));

    const data = mockData[orderId];

    if (!data) {
      console.warn(`[EMULATOR] Заказ ${orderId} не найден`);
      return { status: 'Неизвестный заказ' };
    }

    // 🔁 Приоритет — внешние координаты (например, от 1С)
    if (currentCustomCoords && typeof currentCustomCoords.lat === 'number' && typeof currentCustomCoords.lon === 'number') {
      console.log(`[EMULATOR] Используем внешние координаты: [${currentCustomCoords.lat}, ${currentCustomCoords.lon}]`);
      return {
        status: 'В пути',
        lat: currentCustomCoords.lat,
        lon: currentCustomCoords.lon,
        startWarehouse: data.startWarehouse,
        endWarehouse: data.endWarehouse,
      };
    }

    if (data.status === 'В пути') {
      const now = new Date(timestamp); // ✅ Убедимся, что timestamp — Date
      if (isNaN(now.getTime())) {
        console.error('[EMULATOR] Неверное время:', timestamp);
        return {
          status: 'В пути',
          lat: data.coordsHistoryTemplate[0].lat,
          lon: data.coordsHistoryTemplate[0].lon,
          startWarehouse: data.startWarehouse,
          endWarehouse: data.endWarehouse,
        };
      }

      const history = this.buildDynamicHistory(data, now);

      // Устанавливаем trackingStartTime при первом запуске
      if (!trackingStartTime) {
        trackingStartTime = now;
      }

      const startTime = trackingStartTime.getTime();
      const endTime = startTime + history[history.length - 1].offset;

      const elapsed = now.getTime() - startTime;

      // Если вне временного диапазона — возвращаем первую или последнюю точку
      if (elapsed <= 0) {
        return {
          status: 'В пути',
          lat: history[0].lat,
          lon: history[0].lon,
          startWarehouse: data.startWarehouse,
          endWarehouse: data.endWarehouse,
        };
      }

      if (elapsed >= history[history.length - 1].offset) {
        const last = history[history.length - 1];
        return {
          status: 'В пути',
          lat: last.lat,
          lon: last.lon,
          startWarehouse: data.startWarehouse,
          endWarehouse: data.endWarehouse,
        };
      }

      // 🧭 Ищем ближайшие точки для интерполяции
      let i = 0;
      while (
        i < history.length - 1 &&
        elapsed > history[i + 1].offset
      ) {
        i++;
      }

      const pointA = history[i];
      const pointB = history[i + 1];

      if (!pointA || !pointB) {
        console.warn('[EMULATOR] Не найдены точки для интерполяции', i, history);
        return {
          lat: data.startWarehouse.lat,
          lon: data.startWarehouse.lon,
          status: 'В пути',
          startWarehouse: data.startWarehouse,
          endWarehouse: data.endWarehouse,
        };
      }

      // 🧮 Интерполируем между точками
      const total = pointB.offset - pointA.offset;
      const ratio = total === 0 ? 0 : elapsed / total;

      const lat = pointA.lat + (pointB.lat - pointA.lat) * ratio;
      const lon = pointA.lon + (pointB.lon - pointA.lon) * ratio;

      // 🔍 Логируем всё, чтобы увидеть проблему
      console.log(`[EMULATOR] pointA:`, pointA);
      console.log(`[EMULATOR] pointB:`, pointB);
      console.log(`[EMULATOR] elapsed:`, elapsed);
      console.log(`[EMULATOR] ratio:`, ratio);
      console.log(`[EMULATOR] lat:`, lat, 'lon:', lon);

      return {
        status: 'В пути',
        lat,
        lon,
        startWarehouse: data.startWarehouse,
        endWarehouse: data.endWarehouse,
      };
    }

    if (data.status === 'Загружен') {
      return {
        status: 'Загружен',
        queueNumber: data.queueNumber,
        startWarehouse: data.startWarehouse,
        endWarehouse: data.endWarehouse,
      };
    }

    return { status: 'Не определён' };
  },

  // 🧠 Динамическое создание истории от "сейчас"
  buildDynamicHistory(data, now) {
    const baseTime = now.getTime();

    return data.coordsHistoryTemplate.map((point) => ({
      time: new Date(baseTime + point.offset),
      lat: point.lat,
      lon: point.lon,
      offset: point.offset,
    }));
  },

  // 🧪 Установка внешних координат (например, от 1С)
  setDriverCoords(lat, lon) {
    currentCustomCoords = { lat, lon };
    console.log(`[EMULATOR] Новые координаты водителя установлены: [${lat}, ${lon}]`);
  },

  // 🧪 Сброс координат и времени
  clearDriverCoords() {
    currentCustomCoords = null;
    trackingStartTime = null;
    console.log('[EMULATOR] Координаты водителя и время сброшены');
  }
};