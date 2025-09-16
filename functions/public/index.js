// Boot minimal socket client after a short delay
// Loads Socket.IO lib and our socket client, then starts listening

(function () {
  function subscribe() {
    try {
      // Subscribe to all events and log them; adjust to your needs
      window.socketClient.onAny((event, data) => {
        // eslint-disable-next-line no-console
        window.handleCallback(data, window.handleEvent);
      });
      window.socketClient.onStatus((status) => {
        // eslint-disable-next-line no-console
        console.log('[socket-status]', status);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to start socket client', e);
    }
  }

  function bootClient() {
    // Ensure our minimal client is loaded
    if (!window.socketClient) {
      const c = document.createElement('script');
      c.src = '/functions/socketClient.js';
      c.onload = subscribe;
      document.head.appendChild(c);
    } else {
      subscribe();
    }
  }
  function start() {
    // Ensure socket.io is present; if your server serves it at /socket.io/socket.io.js
    if (typeof io === 'undefined') {
      const s = document.createElement('script');
      s.src = '/libs/singleFileLibs/socketIo.js';
      s.onload = bootClient;
      document.head.appendChild(s);
    } else {
      bootClient();
    }
  }

  // wait 3 seconds before starting
  setTimeout(start, 3000);
})();
