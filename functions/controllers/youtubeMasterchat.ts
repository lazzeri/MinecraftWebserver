import { Masterchat, stringify, MasterchatError } from '@hitomaru/masterchat';
import { triggerWebsocketEvent } from './websocket';

export class YouTubeMasterchatController {
  private masterchat: Masterchat | null = null;
  private videoId: string | null = null;
  private channelId: string | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to YouTube live chat using masterchat
   * @param videoId - The YouTube video ID to connect to
   * @param channelId - Optional channel ID for faster instantiation
   * @returns Promise<boolean> - Returns true if connection is successful
   */
  async connectToLiveChat(videoId: string, channelId?: string): Promise<boolean> {
    try {
      // Disconnect from previous connection if exists
      if (this.masterchat && this.isConnected) {
        await this.disconnect();
      }

      this.videoId = videoId;
      this.channelId = channelId || null;

      // Initialize masterchat with video ID
      if (channelId) {
        // Faster instantiation when channel ID is known
        this.masterchat = new Masterchat(videoId, channelId, { mode: 'live' });
        // Populate metadata if needed
        await this.masterchat.populateMetadata();
      } else {
        // Full initialization with metadata fetching
        this.masterchat = await Masterchat.init(videoId);
        this.channelId = this.masterchat.channelId;
      }

      // Set up event listeners
      this.setupEventListeners();

      // Start listening for live chat
      this.masterchat.listen();
      this.isConnected = true;

      console.log(`Successfully connected to YouTube live chat for video: ${videoId}`);
      if (this.masterchat.title) {
        console.log(`Stream title: ${this.masterchat.title}`);
        console.log(`Channel: ${this.masterchat.channelName} (${this.channelId})`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to connect to YouTube live chat for video ${videoId}:`, error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from the current live chat
   */
  async disconnect(): Promise<void> {
    if (this.masterchat && this.isConnected) {
      try {
        this.masterchat.stop();
        this.isConnected = false;
        this.masterchat = null;
        this.videoId = null;
        this.channelId = null;
        console.log('Disconnected from YouTube live chat');
      } catch (error) {
        console.error('Error disconnecting from YouTube live chat:', error);
      }
    }
  }

  /**
   * Get the current connection status
   */
  getConnectionStatus(): {
    isConnected: boolean;
    videoId: string | null;
    channelId: string | null;
  } {
    return {
      isConnected: this.isConnected,
      videoId: this.videoId,
      channelId: this.channelId,
    };
  }

  /**
   * Set up event listeners for the masterchat instance
   */
  private setupEventListeners(): void {
    if (!this.masterchat) return;

    // Listen for chat messages
    this.masterchat.on('chat', (chat) => {
      const messageText = chat.message ? stringify(chat.message) : '';
      console.log('New chat message:', chat.authorName, messageText);

      // Forward the chat message to websocket clients
      triggerWebsocketEvent('youtube-chat', {
        type: 'chat',
        videoId: this.videoId,
        channelId: this.channelId,
        data: {
          id: chat.id,
          message: messageText,
          authorName: chat.authorName,
          authorChannelId: chat.authorChannelId,
          timestamp: chat.timestamp,
          isOwner: chat.isOwner,
          isModerator: chat.isModerator,
          isVerified: chat.isVerified,
          rawMessage: chat.message,
        },
      });
    });

    // Listen for all actions (more comprehensive event handling)
    this.masterchat.on('actions', (actions) => {
      // Filter different types of actions
      const chats = actions.filter((action) => action.type === 'addChatItemAction');
      const superChats = actions.filter((action) => action.type === 'addSuperChatItemAction');
      const superStickers = actions.filter((action) => action.type === 'addSuperStickerItemAction');
      const memberships = actions.filter((action) => action.type === 'addMembershipItemAction');
      const membershipMilestones = actions.filter(
        (action) => action.type === 'addMembershipMilestoneItemAction',
      );
      const polls = actions.filter(
        (action) => action.type === 'showPollPanelAction' || action.type === 'updatePollAction',
      );
      const modeChanges = actions.filter((action) => action.type === 'modeChangeAction');

      // Forward all actions to websocket clients
      triggerWebsocketEvent('youtube-chat', {
        type: 'actions',
        videoId: this.videoId,
        channelId: this.channelId,
        data: {
          chats,
          superChats,
          superStickers,
          memberships,
          membershipMilestones,
          polls,
          modeChanges,
          allActions: actions,
        },
      });
    });

    // Listen for error events with proper error handling
    this.masterchat.on('error', (error) => {
      console.error('Masterchat error:', error);

      let errorMessage = 'Unknown error occurred';
      let errorCode = 'unknown';

      if (error instanceof MasterchatError) {
        errorCode = error.code;
        switch (error.code) {
          case 'disabled':
            errorMessage = 'Live chat is disabled';
            break;
          case 'membersOnly':
            errorMessage = 'No permission (members-only)';
            break;
          case 'private':
            errorMessage = 'No permission (private video)';
            break;
          case 'unavailable':
            errorMessage = 'Deleted OR wrong video id';
            break;
          case 'unarchived':
            errorMessage = 'Live stream recording is not available';
            break;
          case 'denied':
            errorMessage = 'Access denied (429)';
            break;
          case 'invalid':
            errorMessage = 'Invalid request';
            break;
          default:
            errorMessage = error.message || 'Unknown error occurred';
        }
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }

      triggerWebsocketEvent('youtube-chat', {
        type: 'error',
        videoId: this.videoId,
        channelId: this.channelId,
        error: {
          code: errorCode,
          message: errorMessage,
          originalError: error,
        },
      });
    });

    // Listen for end events
    this.masterchat.on('end', () => {
      console.log('Live stream ended');
      this.isConnected = false;

      triggerWebsocketEvent('youtube-chat', {
        type: 'end',
        videoId: this.videoId,
        channelId: this.channelId,
        message: 'Live stream has ended',
      });
    });
  }

  /**
   * Get live stream metadata
   */
  getStreamMetadata(): {
    title: string | null;
    channelName: string | null;
    channelId: string | null;
    videoId: string | null;
  } {
    if (!this.masterchat) {
      return {
        title: null,
        channelName: null,
        channelId: null,
        videoId: null,
      };
    }

    return {
      title: this.masterchat.title || null,
      channelName: this.masterchat.channelName || null,
      channelId: this.masterchat.channelId || null,
      videoId: this.videoId,
    };
  }

  /**
   * Get video comments (not live chats)
   */
  async getComments(options?: { top?: boolean }): Promise<any> {
    if (!this.masterchat) {
      throw new Error('Not connected to any live chat');
    }

    try {
      return await this.masterchat.getComments(options);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  /**
   * Get a specific comment by ID
   */
  async getComment(commentId: string): Promise<any> {
    if (!this.masterchat) {
      throw new Error('Not connected to any live chat');
    }

    try {
      return await this.masterchat.getComment(commentId);
    } catch (error) {
      console.error('Error getting comment:', error);
      throw error;
    }
  }

  /**
   * Get transcript of the video
   */
  async getTranscript(language?: string): Promise<any> {
    if (!this.masterchat) {
      throw new Error('Not connected to any live chat');
    }

    try {
      return await this.masterchat.getTranscript(language || 'en');
    } catch (error) {
      console.error('Error getting transcript:', error);
      throw error;
    }
  }

  /**
   * Remove a chat message (requires proper credentials and permissions)
   * Note: This requires the bot to have moderator permissions and proper credentials
   */
  async removeChat(chatId: string): Promise<boolean> {
    if (!this.masterchat || !this.isConnected) {
      throw new Error('Not connected to any live chat');
    }

    try {
      await this.masterchat.remove(chatId);
      console.log(`Chat message removed: ${chatId}`);
      return true;
    } catch (error) {
      console.error('Error removing chat message:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const youtubeMasterchatController = new YouTubeMasterchatController();
