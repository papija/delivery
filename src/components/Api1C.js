const BASE_URL = '/test/hs/deliveryInfo/1c';

function encodeBasicAuth(username, password) {
  const credentials = `${username}:${password}`;
  const utf8Bytes = new TextEncoder().encode(credentials);
  return btoa(String.fromCharCode(...utf8Bytes));
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('ru', {
      timeZone: 'Asia/Irkutsk',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date).replace(/(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6');
  } catch {
    const offset = 8 * 60 * 60 * 1000; // UTC+8
    return new Date(date.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, '');
  }
}

export default {
  async getOrderStatus(orderId, timestamp) {
    const url = new URL(BASE_URL, window.location.origin);
    url.searchParams.append('номер', orderId);
    url.searchParams.append('nocache', Date.now().toString());
    let formattedDate = formatDate(timestamp || new Date());
    url.searchParams.append('дата', formattedDate);

    const authHeader = 'Basic ' + encodeBasicAuth('Администратор', '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Таймаут 10 секунд

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();

      if (response.status === 401) throw new Error('Ошибка аутентификации: неверные учетные данные');

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        if (errorData.ошибка?.код === 'DRIVER_FETCH_ERROR' && response.status === 500) {
          return { status: 'Ошибка', error: errorData.ошибка.сообщение, coords: null, startWarehouse: null, endWarehouse: null };
        }
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      const result = JSON.parse(responseText);

      if (result.состояние !== 'В пути') {
        return {
          status: result.состояние || 'Не определен',
          date: result.датаОбновления || null,
          orderNumber: result.номер || null,
          queueNumber: result.номерВОчереди || null,
          ...(result.ошибка && { error: result.ошибка.сообщение, status: 'Ошибка' }),
        };
      }

      const coords = result.координаты?.lat && result.координаты?.lon ? [result.координаты.lat, result.координаты.lon] : null;
      const startWarehouse = result.складОтправления?.lat && result.складОтправления?.lon
        ? { lat: result.складОтправления.lat, lon: result.складОтправления.lon }
        : null;
      const endWarehouse = result.складДоставки?.lat && result.складДоставки?.lon
        ? { lat: result.складДоставки.lat, lon: result.складДоставки.lon }
        : null;

      return { status: result.состояние, date: result.датаОбновления, orderNumber: result.номер, coords, startWarehouse, endWarehouse, queueNumber: result.номерВОчереди };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Превышен таймаут запроса. Проверьте подключение к интернету.');
      }
      throw error;
    }
  },

  clearAuthCache() {
    return { status: 'Кеш не очищен', message: 'Очистите кэш браузера вручную или используйте режим инкогнито' };
  },

  clearDriverCoords() {},

  setDriverCoords() {},

  buildDynamicHistory() {
    return [];
  },
};