// Here we can use the callbackdata for whatever, structure:
/*
    {
    "id": "ChwKGkNJVDN3OGpqM1k4REZiQUsxZ0FkN3ljeUR3",
    "timestamp": "2025-09-16T17:12:20.819Z",
    "timestampUsec": "1758042740819177",
    "authorName": "- Luca",
    "authorChannelId": "UC767amZnOAsVgKpwFlN4Ewg",
    "authorPhoto": "https://yt4.ggpht.com/ytc/AIdro_mhU62Igv60xDKtdKBrs-9JqhIC2QykbgJbTksBC2Oz1Hw=s64-c-k-c0x00ffffff-no-rj",
    "message": "test",
    "rawMessage": "test",
    "isOwner": false,
    "isVerified": false,
    "isModerator": false
    }
    */

window.handleEvent = (data) => {
  console.log('HANDLE DATA', data);
};
