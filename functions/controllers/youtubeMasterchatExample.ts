import axios from 'axios';
import { youtubeMasterchatController } from './youtubeMasterchat';
import { YOUTUBE_API_KEY } from './secrets';

/**
 * Example usage of the YouTube Masterchat Controller
 * This file demonstrates how to use the controller with different video IDs
 */

/**
 * Get the live stream video ID for a given channel using YouTube API
 * @param channelId - The YouTube channel ID to search for live streams
 * @returns Promise<string | null> - Returns the live video ID or null if no live stream found
 */
async function getLiveStreamVideoId(channelId: string): Promise<string | null> {
  try {
    const url = "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(url, {
      params: {
        part: "id",
        channelId: channelId,
        eventType: "live",
        type: "video",
        key: YOUTUBE_API_KEY,
      },
    });

    const items = response.data.items;
    if (items && items.length > 0) {
      return items[0].id.videoId; // first live video ID
    } else {
      return null; // no livestream found
    }
  } catch (error) {
    console.error("Error fetching livestream video ID:", error);
    return null;
  }
}

// Example function to connect to a specific YouTube video's live chat
export async function connectToVideo(channelId?: string): Promise<void> {
  try {
    let targetChannelId = channelId;
    let targetVideoId = undefined;

    // If no videoId provided, try to find a live stream from the channel
    if (targetChannelId) {
      console.log(`No video ID provided, searching for live stream from channel: ${targetChannelId}`);
      const foundVideoId = await getLiveStreamVideoId(targetChannelId);
      
      if (foundVideoId) {
        console.log(`Found live stream video ID: ${foundVideoId}`);
        targetVideoId = foundVideoId;
      } else {
        console.log('No live stream currently available from the channel');
        return;
      }
    }

    if (!targetVideoId) {
      console.log('No video ID available to connect to');
      return;
    }

    console.log(`Attempting to connect to video: ${targetVideoId}`);
    if (targetChannelId) {
      console.log(`Using channel ID for faster connection: ${targetChannelId}`);
    }
    
    const success = await youtubeMasterchatController.connectToLiveChat(targetVideoId, targetChannelId);
    
    if (success) {
      console.log('Successfully connected to live chat!');
      
      // Get stream metadata
      const metadata = youtubeMasterchatController.getStreamMetadata();
      console.log('Stream metadata:', metadata);
      
      // Check connection status
      const status = youtubeMasterchatController.getConnectionStatus();
      console.log('Connection status:', status);
    } else {
      console.log('Failed to connect to live chat');
    }
  } catch (error) {
    console.error('Error connecting to video:', error);
  }
}

// Example function to disconnect from current live chat
export async function disconnectFromVideo(): Promise<void> {
  try {
    await youtubeMasterchatController.disconnect();
    console.log('Disconnected from live chat');
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
}

// Example function to remove a chat message (requires moderator permissions)
export async function removeChatMessage(chatId: string): Promise<void> {
  try {
    const success = await youtubeMasterchatController.removeChat(chatId);
    if (success) {
      console.log('Chat message removed successfully');
    } else {
      console.log('Failed to remove chat message');
    }
  } catch (error) {
    console.error('Error removing chat message:', error);
  }
}

// Example function to get video comments
export async function getVideoComments(): Promise<void> {
  try {
    const comments = await youtubeMasterchatController.getComments({ top: true });
    console.log('Video comments:', comments);
  } catch (error) {
    console.error('Error getting comments:', error);
  }
}

// Example function to get video transcript
export async function getVideoTranscript(): Promise<void> {
  try {
    const transcript = await youtubeMasterchatController.getTranscript();
    console.log('Video transcript:', transcript);
  } catch (error) {
    console.error('Error getting transcript:', error);
  }
}

// Example usage with different video IDs
export const exampleVideoIds = {
  // Replace these with actual YouTube video IDs
  liveStream1: 'dQw4w9WgXcQ', // Example video ID
  liveStream2: 'jNQXAC9IVRw', // Example video ID
  liveStream3: 'M7lc1UVf-VE'  // Example video ID
};

// Example usage with different channel IDs for faster connection
export const exampleChannelIds = {
  // Replace these with actual YouTube channel IDs
  gamingChannel: 'UCBJycsmduvYEL83R_U4JriQ', // Example: Marques Brownlee
  techChannel: 'UCBJycsmduvYEL83R_U4JriQ',   // Example: Linus Tech Tips
  musicChannel: 'UCBJycsmduvYEL83R_U4JriQ'   // Example: Music channel
};

// Example function to switch between different videos
export async function switchVideo( channelId: string): Promise<void> {
  try {
    // Disconnect from current video
    await youtubeMasterchatController.disconnect();
    
    // Connect to new video
    await connectToVideo(channelId);
  } catch (error) {
    console.error('Error switching videos:', error);
  }
}

/**
 * Helper function to search for live streams from a specific channel
 * @param channelId - The YouTube channel ID to search (optional, defaults to YOUTUBE_CHANNEL_ID)
 * @returns Promise<string | null> - Returns the live video ID or null if not found
 */
export async function findLiveStreams(channelId: string): Promise<string | null> {
  try {
    const targetChannelId = channelId;
    console.log(`Searching for live streams from channel: ${targetChannelId}`);
    
    const liveVideoId = await getLiveStreamVideoId(targetChannelId);
    if (liveVideoId) {
      console.log(`Live Video ID found: ${liveVideoId}`);
      return liveVideoId;
    } else {
      console.log('No live stream currently available from this channel');
      return null;
    }
  } catch (error) {
    console.error('Error searching for live streams:', error);
    return null;
  }
}

// Example function to demonstrate different connection methods
export async function demonstrateConnectionMethods(): Promise<void> {
  console.log('=== Demonstrating different connection methods ===');
  
  // Method 1: Auto-find live stream from default channel
  console.log('\n1. Auto-find live stream from default channel:');
  await connectToVideo();
  
  // Wait a bit then disconnect
  await new Promise(resolve => setTimeout(resolve, 2000));
  await disconnectFromVideo();
  
  // Method 2: Connect to specific video ID
  console.log('\n2. Connect to specific video ID:');
  await connectToVideo(exampleVideoIds.liveStream1);
  
  // Wait a bit then disconnect
  await new Promise(resolve => setTimeout(resolve, 2000));
  await disconnectFromVideo();
  
  // Method 3: Find live stream from specific channel
  console.log('\n3. Find live stream from specific channel:');
  await findLiveStreams(exampleChannelIds.gamingChannel);
  
  console.log('\n=== Demonstration complete ===');
}
