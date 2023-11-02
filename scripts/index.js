const CLIENT_ID = '2b6a27eb8a6246eeb2cbc59f4efc2bf3';
const REDIRECT_URI = 'chrome-extension://gdjijfomjlekclepiijgiecjpjbcnjlk/callback.html';

const SPOTIFY_AUTH_URL = 'accounts.spotify.com/authorize';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const SCOPES = 'user-library-read';

document.getElementById('login-button').addEventListener('click', () => {
    const state = Math.random().toString(36).substring(2);
    const loginUrl = `https://${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${state}&response_type=token&show_dialog=true`;
    chrome.tabs.create({ url: loginUrl });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'spotifyToken') {
      const token = request.token;
      // You can use the token to make requests to the Spotify API
      // For example, fetch user's playlists and display them
      fetch(`${SPOTIFY_API_URL}/me/playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const playlistList = document.getElementById('playlist-list');
          playlistList.innerHTML = ''; // Clear existing data
          data.items.forEach((playlist) => {
            const playlistName = playlist.name;
            playlistList.innerHTML += `<p>${playlistName}</p>`;
          });
        });
    }
  });