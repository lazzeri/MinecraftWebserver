/**
 * Test helper: subscribe to socket events via a provided callback.
 * Pure functionality, no DOM usage.
 */

/* global socketClient */

(function setupTestSubscription(global) {
  function subscribeToSocket(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    const unsubscribers = [];

    // status changes
    unsubscribers.push(socketClient.onStatus((status) => callback({ type: 'status', status })));

    // errors
    unsubscribers.push(socketClient.onError((error) => callback({ type: 'error', error })));

    // all events passthrough
    unsubscribers.push(
      socketClient.onAny((eventName, ...args) => callback({ type: 'event', eventName, args })),
    );

    // convenience channel for YouTube chat if used by backend
    unsubscribers.push(
      socketClient.on('/youtube-chat', (data) => callback({ type: 'youtube_chat', data })),
    );

    return function unsubscribeAll() {
      while (unsubscribers.length) {
        const unsub = unsubscribers.pop();
        try { if (typeof unsub === 'function') unsub(); } catch (e) { /* noop */ }
      }
    };
  }

  // expose API
  // eslint-disable-next-line no-param-reassign
  global.subscribeToSocket = subscribeToSocket;
  if (typeof module !== 'undefined' && module.exports) module.exports = subscribeToSocket;
})(typeof window !== 'undefined' ? window : this);
