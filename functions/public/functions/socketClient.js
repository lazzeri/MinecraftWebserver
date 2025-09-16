/**
 * Minimal Socket.IO client: subscribe-only, no DOM manipulation.
 * Exposes on/off helpers and connection state.
 */

/* global io */
/* eslint no-use-before-define: ["error", { "functions": false }] */

(function setupSocketClient(global) {
  const state = {
    socket: null,
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    statusListeners: new Set(),
    errorListeners: new Set(),
    anyListeners: new Set(),
  };

  function notifyStatus(newStatus) {
    state.statusListeners.forEach((listener) => {
      try {
        listener(newStatus);
      } catch (e) {
        /* noop */
      }
    });
  }

  function notifyError(error) {
    state.errorListeners.forEach((listener) => {
      try {
        listener(error);
      } catch (e) {
        /* noop */
      }
    });
  }

  function ensureConnected() {
    if (state.socket) return;
    try {
      state.socket = io({ transports: ['websocket', 'polling'], timeout: 20000, forceNew: true });

      state.socket.on('connect', () => {
        state.isConnected = true;
        state.reconnectAttempts = 0;
        state.reconnectDelay = 1000;
        notifyStatus('connected');
      });

      state.socket.on('disconnect', (reason) => {
        state.isConnected = false;
        notifyStatus('disconnected');
        if (reason !== 'io client disconnect') attemptReconnect();
      });

      state.socket.on('connect_error', (error) => {
        notifyError(error);
        attemptReconnect();
      });

      state.socket.onAny((eventName, ...args) => {
        state.anyListeners.forEach((listener) => {
          try {
            listener(eventName, ...args);
          } catch (e) {
            /* noop */
          }
        });
      });

      notifyStatus('connecting');
    } catch (err) {
      notifyError(err);
    }
  }

  function attemptReconnect() {
    if (state.reconnectAttempts >= state.maxReconnectAttempts) {
      notifyStatus('failed');
      return;
    }
    state.reconnectAttempts += 1;
    const delay = state.reconnectDelay;
    setTimeout(() => {
      if (!state.isConnected) {
        try {
          if (state.socket) state.socket.connect();
          else ensureConnected();
          state.reconnectDelay = Math.min(state.reconnectDelay * 2, 10000);
        } catch (e) {
          notifyError(e);
        }
      }
    }, delay);
  }

  const api = {
    on(event, handler) {
      ensureConnected();
      state.socket.on(event, handler);
      return () => api.off(event, handler);
    },
    off(event, handler) {
      if (!state.socket) return;
      state.socket.off(event, handler);
    },
    onAny(handler) {
      ensureConnected();
      state.anyListeners.add(handler);
      return () => api.offAny(handler);
    },
    offAny(handler) {
      state.anyListeners.delete(handler);
    },
    onStatus(handler) {
      state.statusListeners.add(handler);
      return () => state.statusListeners.delete(handler);
    },
    onError(handler) {
      state.errorListeners.add(handler);
      return () => state.errorListeners.delete(handler);
    },
    disconnect() {
      if (!state.socket) return;
      state.socket.disconnect();
      state.isConnected = false;
      notifyStatus('disconnected');
    },
    getStatus() {
      return { isConnected: state.isConnected, reconnectAttempts: state.reconnectAttempts };
    },
  };

  // Eagerly connect
  ensureConnected();

  // Expose API
  // eslint-disable-next-line no-param-reassign
  global.socketClient = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
