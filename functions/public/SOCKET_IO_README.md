# Socket.IO Frontend Integration

This document describes the lightweight Socket.IO frontend integration for receiving YouTube live chat data.

## Overview

The frontend Socket.IO client automatically connects to the backend server and receives real-time YouTube live chat data. It provides a clean interface for displaying chat messages, connection status, and stream information.

## Files

- `functions/socketClient.js` - Main Socket.IO client class
- `functions/testSocketConnection.js` - Test utilities for debugging
- `views/mainPage.hbs` - HTML template with integrated UI

## Features

### Automatic Connection
- Connects to Socket.IO server on page load
- Automatic reconnection with exponential backoff
- Connection status indicators

### YouTube Live Data Handling
- Receives chat messages in real-time
- Displays author information (moderator, owner, verified status)
- Shows timestamps and message content
- Handles Super Chats, memberships, and other actions

### UI Components
- Live chat message display
- Connection status panel
- Stream information (Video ID, Channel ID, message count)
- Manual disconnect/reconnect controls
- Test functionality

## Usage

### Basic Usage
The Socket.IO client initializes automatically when the page loads. No additional setup is required.

### Custom Event Handlers
You can set custom event handlers for different types of events:

```javascript
window.youtubeSocketClient.setEventHandlers({
  onChatMessage: function(message) {
    // Custom chat message handling
    console.log('New message:', message);
  },
  onConnectionStatus: function(status) {
    // Custom connection status handling
    console.log('Status changed:', status);
  },
  onError: function(error) {
    // Custom error handling
    console.log('Error:', error);
  }
});
```

### Testing
Use the test functions available in the browser console:

```javascript
// Check connection status
socketTests.checkConnectionStatus();

// Simulate YouTube chat data
socketTests.simulateYouTubeChat();

// Send test message to server
socketTests.sendTestMessage();

// Test reconnection
socketTests.testReconnection();
```

## Data Format

### Chat Messages
```javascript
{
  id: "chat-message-id",
  author: "Username",
  message: "Chat message text",
  timestamp: 1234567890,
  isOwner: false,
  isModerator: false,
  isVerified: true,
  videoId: "youtube-video-id",
  channelId: "youtube-channel-id"
}
```

### Connection Status
```javascript
{
  isConnected: true,
  reconnectAttempts: 0
}
```

## Configuration

### Socket.IO Options
The client uses these default options:
- Transports: `['websocket', 'polling']`
- Timeout: `20000ms`
- Force new connection: `true`

### Reconnection Settings
- Max attempts: `5`
- Initial delay: `1000ms`
- Exponential backoff with max delay: `10000ms`

## Error Handling

The client handles various error scenarios:
- Connection failures
- Network interruptions
- YouTube API errors
- Invalid data formats

All errors are logged to the console and can be handled with custom error handlers.

## Browser Compatibility

- Modern browsers with WebSocket support
- Fallback to polling if WebSocket is not available
- Uses Socket.IO v4.5.0 client library

## Development

### Adding New Event Types
To handle new types of YouTube data, extend the `handleYouTubeData` method in `socketClient.js`:

```javascript
case 'new-event-type':
  this.handleNewEventType(data);
  break;
```

### Custom UI Components
The UI is built with Bootstrap classes and can be easily customized by modifying the HTML template and CSS styles.

## Troubleshooting

### Connection Issues
1. Check browser console for error messages
2. Verify server is running on correct port
3. Check network connectivity
4. Use test functions to verify functionality

### No Messages Received
1. Ensure YouTube live chat is active
2. Check backend YouTube connection
3. Verify Socket.IO server is broadcasting data
4. Use `socketTests.simulateYouTubeChat()` to test frontend

### Performance Issues
- Messages are limited to last 50 in display
- Auto-scroll can be disabled if needed
- Consider implementing message filtering for high-traffic streams
