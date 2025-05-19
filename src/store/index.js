import { createStore } from 'vuex';
import Api1C from '@/components/Api1C';

const STORAGE_KEY = 'tracking_state';

const loadStateFromStorage = () => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch {
      return null;
    }
  }
  return null;
};

const savedState = loadStateFromStorage();

export default createStore({
  state: {
    isMapExpanded: localStorage.getItem('isMapExpanded') === 'true',
    serverResponseLog: '',
    initialTrackingDelay: 5000,
  },
  mutations: {
    setMapExpanded(state, value) {
      state.isMapExpanded = value;
      localStorage.setItem('isMapExpanded', value.toString());
    },
    setServerResponseLog(state, log) {
      state.serverResponseLog = log;
    },
  },
  actions: {
    toggleMapSize({ commit, state }) {
      commit('setMapExpanded', !state.isMapExpanded);
    },
  },
  modules: {
    tracking: {
      namespaced: true,
      state: {
        orderId: savedState?.orderId || '',
        driverCoords: savedState?.driverCoords || null,
        startWarehouse: savedState?.startWarehouse || { lat: null, lon: null },
        endWarehouse: savedState?.endWarehouse || { lat: null, lon: null },
        currentOrderStatus: savedState?.currentOrderStatus || null,
        queueNumber: savedState?.queueNumber || null,
        eta: savedState?.eta || null,
        isErrorDialogVisible: savedState?.isErrorDialogVisible || false,
        errorMessage: savedState?.errorMessage || '',
        currentTrackedOrder: savedState?.currentTrackedOrder || null,
        intervalId: null,
        isFollowing: savedState?.isFollowing || false,
        previousCoords: savedState?.previousCoords || null,
        isRouteBuilt: savedState?.isRouteBuilt || false,
        pendingDriverCoords: savedState?.pendingDriverCoords || null,
        isAnimating: savedState?.isAnimating || false,
        initialFocusDone: savedState?.initialFocusDone || false,
        currentAngle: parseFloat(localStorage.getItem('lastDriverAngle')) || 0,
        isReversing: savedState?.isReversing || false,
        isTrackingError: savedState?.isTrackingError || false,
        savedRoute: savedState?.savedRoute || null,
        isTrackingInitializing: savedState?.isTrackingInitializing || false,
      },
      getters: {
        orderId: (state) => state.orderId,
        driverCoords: (state) => state.driverCoords,
        startWarehouse: (state) => state.startWarehouse,
        endWarehouse: (state) => state.endWarehouse,
        currentOrderStatus: (state) => state.currentOrderStatus,
        queueNumber: (state) => state.queueNumber,
        eta: (state) => state.eta,
        isErrorDialogVisible: (state) => state.isErrorDialogVisible,
        errorMessage: (state) => state.errorMessage,
        currentTrackedOrder: (state) => state.currentTrackedOrder,
        isFollowing: (state) => state.isFollowing,
        isTrackingError: (state) => state.isTrackingError,
        savedRoute: (state) => state.savedRoute,
        isTrackingInitializing: (state) => state.isTrackingInitializing,
      },
      mutations: {
        setOrderId(state, value) {
          state.orderId = value;
          saveStateToStorage(state);
        },
        setDriverCoords(state, coords) {
          state.driverCoords = coords;
          saveStateToStorage(state);
        },
        setStartWarehouse(state, warehouse) {
          state.startWarehouse = warehouse;
          saveStateToStorage(state);
        },
        setEndWarehouse(state, warehouse) {
          state.endWarehouse = warehouse;
          saveStateToStorage(state);
        },
        setCurrentOrderStatus(state, status) {
          state.currentOrderStatus = status;
          saveStateToStorage(state);
        },
        setQueueNumber(state, number) {
          state.queueNumber = number;
          saveStateToStorage(state);
        },
        setEta(state, eta) {
          state.eta = eta;
          saveStateToStorage(state);
        },
        setErrorDialogVisible(state, visible) {
          state.isErrorDialogVisible = visible;
          saveStateToStorage(state);
        },
        setErrorMessage(state, message) {
          state.errorMessage = message;
          saveStateToStorage(state);
        },
        setCurrentTrackedOrder(state, order) {
          state.currentTrackedOrder = order;
          saveStateToStorage(state);
        },
        setIntervalId(state, id) {
          state.intervalId = id;
        },
        setIsFollowing(state, value) {
          state.isFollowing = value;
          saveStateToStorage(state);
        },
        setPreviousCoords(state, coords) {
          state.previousCoords = coords;
          saveStateToStorage(state);
        },
        setIsRouteBuilt(state, value) {
          state.isRouteBuilt = value;
          saveStateToStorage(state);
        },
        setPendingDriverCoords(state, coords) {
          state.pendingDriverCoords = coords;
          saveStateToStorage(state);
        },
        setIsAnimating(state, value) {
          state.isAnimating = value;
          saveStateToStorage(state);
        },
        setInitialFocusDone(state, value) {
          state.initialFocusDone = value;
          saveStateToStorage(state);
        },
        setCurrentAngle(state, angle) {
          state.currentAngle = angle;
          localStorage.setItem('lastDriverAngle', angle.toString());
          saveStateToStorage(state);
        },
        setIsReversing(state, value) {
          state.isReversing = value;
          saveStateToStorage(state);
        },
        setIsTrackingError(state, value) {
          state.isTrackingError = value;
          saveStateToStorage(state);
        },
        setSavedRoute(state, route) {
          state.savedRoute = route;
          saveStateToStorage(state);
        },
        setIsTrackingInitializing(state, value) {
          state.isTrackingInitializing = value;
        },
        resetTrackingState(state) {
          state.orderId = '';
          state.driverCoords = null;
          state.startWarehouse = { lat: null, lon: null };
          state.endWarehouse = { lat: null, lon: null };
          state.currentOrderStatus = null;
          state.queueNumber = null;
          state.eta = null;
          state.currentTrackedOrder = null;
          state.pendingDriverCoords = null;
          state.isAnimating = false;
          state.initialFocusDone = false;
          state.isReversing = false;
          state.isFollowing = false;
          state.previousCoords = null;
          state.isRouteBuilt = false;
          state.isTrackingError = false;
          state.savedRoute = null;
          state.isTrackingInitializing = false;
          localStorage.removeItem('tracking_state');
          saveStateToStorage(state);
        },
      },
      actions: {
        async pollOrderStatus({ commit, state, dispatch }) {
          if (!state.currentTrackedOrder) return;

          const now = new Date();
          let attempt = 0;
          const maxAttempts = 2;

          while (attempt < maxAttempts) {
            try {
              const response = await Api1C.getOrderStatus(state.currentTrackedOrder, now);

              if (response.error) {
                let errorData = {};
                try {
                  errorData = JSON.parse(response.error.split('body: ')[1] || '{}');
                } catch {}

                if (errorData.ошибка?.код === 'ORDER_NOT_FOUND') {
                  const orderNumber = errorData.ошибка?.сообщение.match(/Заказ с номером (\S+)/)?.[1] || state.currentTrackedOrder;
                  commit('setErrorMessage', `Заказ с номером ${orderNumber} не найден. Пожалуйста, проверьте номер заказа и попробуйте снова.`);
                  commit('setErrorDialogVisible', true);
                  commit('setCurrentOrderStatus', 'Ошибка');
                  commit('setDriverCoords', null);
                  commit('setStartWarehouse', { lat: null, lon: null });
                  commit('setEndWarehouse', { lat: null, lon: null });
                  commit('setQueueNumber', null);
                  commit('setIsTrackingError', true);
                  dispatch('stopPolling');
                  break;
                }

                if (errorData.ошибка?.код === 'DRIVER_FETCH_ERROR') {
                  commit('setErrorMessage', `Не удалось получить данные о водителе. Пожалуйста, попробуйте снова позже.`);
                  commit('setErrorDialogVisible', true);
                  commit('setIsTrackingError', true);
                  if (attempt < maxAttempts - 1) {
                    attempt++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                  }
                } else {
                  commit('setErrorMessage', `Произошла ошибка: ${response.error}. Пожалуйста, попробуйте снова позже.`);
                  commit('setErrorDialogVisible', true);
                  commit('setIsTrackingError', true);
                }

                if (response.status === 'В пути' && state.intervalId) {
                  commit('setDriverCoords', response.coords || null);
                  commit('setStartWarehouse', response.startWarehouse || { lat: null, lon: null });
                  commit('setEndWarehouse', response.endWarehouse || { lat: null, lon: null });
                  commit('setCurrentOrderStatus', 'В пути');
                  commit('setQueueNumber', response.queueNumber || null);
                  commit('setIsTrackingError', false);
                }
                return;
              }

              commit('setCurrentOrderStatus', response.status);
              commit('setQueueNumber', response.queueNumber || null);

              if (response.status !== 'В пути' && response.status !== 'Загружен') {
                commit('setErrorMessage', 'Отслеживание недоступно для данного статуса заказа.');
                commit('setErrorDialogVisible', true);
                commit('setIsTrackingError', true);
                dispatch('stopPolling');
              } else if (response.status === 'В пути') {
                // Проверка наличия всех необходимых координат
                const hasCoords = response.coords && Array.isArray(response.coords) && response.coords.length >= 2;
                const hasStartWarehouse = response.startWarehouse && response.startWarehouse.lat !== null && response.startWarehouse.lon !== null;
                const hasEndWarehouse = response.endWarehouse && response.endWarehouse.lat !== null && response.endWarehouse.lon !== null;

                if (!hasCoords || !hasStartWarehouse || !hasEndWarehouse) {
                  commit('setErrorMessage', 'Отслеживание недоступно, так как не указаны координаты складов и/или водителя.');
                  commit('setErrorDialogVisible', true);
                  commit('setCurrentOrderStatus', 'Ошибка');
                  commit('setDriverCoords', null);
                  commit('setStartWarehouse', { lat: null, lon: null });
                  commit('setEndWarehouse', { lat: null, lon: null });
                  commit('setQueueNumber', null);
                  commit('setIsTrackingError', true);
                  dispatch('stopPolling');
                } else {
                  commit('setDriverCoords', response.coords);
                  commit('setStartWarehouse', response.startWarehouse);
                  commit('setEndWarehouse', response.endWarehouse);
                  if (!state.intervalId) dispatch('startPolling');
                  commit('setIsTrackingError', false);
                }
              } else {
                commit('setDriverCoords', null);
                commit('setStartWarehouse', { lat: null, lon: null });
                commit('setEndWarehouse', { lat: null, lon: null });
                commit('setCurrentOrderStatus', response.status);
                commit('setEta', null);
                dispatch('stopPolling');
              }
              break;
            } catch (error) {
              console.error('Ошибка при запросе статуса заказа:', error.message);
              const orderNumberMatch = error.message.match(/Заказ с номером (\S+)/);
              if (orderNumberMatch) {
                const orderNumber = orderNumberMatch[1];
                commit('setErrorMessage', `Заказ с номером ${orderNumber} не найден. Пожалуйста, проверьте номер заказа и попробуйте снова.`);
                commit('setErrorDialogVisible', true);
                commit('setIsTrackingError', true);
                dispatch('stopPolling');
                break;
              } else {
                const displayMessage = error.message === 'Failed to fetch'
                  ? 'Не удалось установить соединение с сервером. Проверьте подключение к интернету и попробуйте снова.'
                  : `Не удалось получить данные о заказе: ${error.message}. Проверьте подключение к интернету и попробуйте снова.`;
                commit('setErrorMessage', displayMessage);
                commit('setErrorDialogVisible', true);
                commit('setIsTrackingError', true);
                if (attempt < maxAttempts - 1) {
                  attempt++;
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  continue;
                }
                dispatch('stopPolling');
                break;
              }
            }
          }
        },
        startPolling({ commit, dispatch }) {
          dispatch('stopPolling');
          const intervalId = setInterval(() => dispatch('pollOrderStatus'), 5000);
          commit('setIntervalId', intervalId);
        },
        stopPolling({ commit, state }) {
          if (state.intervalId) {
            clearInterval(state.intervalId);
            commit('setIntervalId', null);
          }
        },
        async startTracking({ commit, state, dispatch }) {
          if (state.isTrackingInitializing) return;

          const orderFormat = /^[A-ZА-Я]{2,4}-[0-9]{6,}$/;
          if (!state.orderId || !orderFormat.test(state.orderId)) {
            commit('setErrorMessage', 'Введите корректный номер заказа (например, НФНФ-000002, АТР-000002, где префикс из 2-4 букв, а номер из 6+ цифр).');
            commit('setErrorDialogVisible', true);
            commit('setIsTrackingError', true);
            return;
          }

          commit('setIsTrackingInitializing', true);
          dispatch('stopPolling');

          commit('setDriverCoords', null);
          commit('setStartWarehouse', { lat: null, lon: null });
          commit('setEndWarehouse', { lat: null, lon: null });
          commit('setCurrentOrderStatus', null);
          commit('setQueueNumber', null);
          commit('setEta', null);
          commit('setErrorDialogVisible', false);
          commit('setErrorMessage', '');
          commit('setIsFollowing', false);
          commit('setPreviousCoords', null);
          commit('setIsRouteBuilt', false);
          commit('setPendingDriverCoords', null);
          commit('setIsAnimating', false);
          commit('setInitialFocusDone', false);
          commit('setIsReversing', false);
          commit('setIsTrackingError', false);
          commit('setSavedRoute', null);
          commit('setCurrentTrackedOrder', state.orderId);

          await new Promise(resolve => setTimeout(resolve, state.initialTrackingDelay));

          await dispatch('pollOrderStatus');
          commit('setIsTrackingInitializing', false);
        },
        resetTracking({ commit, dispatch }) {
          commit('resetTrackingState');
          dispatch('stopPolling');
          Api1C.clearDriverCoords();
        },
        closeErrorDialog({ commit }) {
          commit('setErrorDialogVisible', false);
        },
      },
    },
  },
});

function saveStateToStorage(state) {
  const stateToSave = {
    orderId: state.orderId,
    driverCoords: state.driverCoords,
    startWarehouse: state.startWarehouse,
    endWarehouse: state.endWarehouse,
    currentOrderStatus: state.currentOrderStatus,
    queueNumber: state.queueNumber,
    eta: state.eta,
    isErrorDialogVisible: state.isErrorDialogVisible,
    errorMessage: state.errorMessage,
    currentTrackedOrder: state.currentTrackedOrder,
    isFollowing: state.isFollowing,
    previousCoords: state.previousCoords,
    isRouteBuilt: state.isRouteBuilt,
    pendingDriverCoords: state.pendingDriverCoords,
    isAnimating: state.isAnimating,
    initialFocusDone: state.initialFocusDone,
    currentAngle: state.currentAngle,
    isReversing: state.isReversing,
    isTrackingError: state.isTrackingError,
    savedRoute: state.savedRoute,
    isTrackingInitializing: state.isTrackingInitializing,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch {}
}