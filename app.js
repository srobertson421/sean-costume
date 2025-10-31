// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

let pollTimeout = null;
let resetDataTimer = null;
const API_ENDPOINT = 'https://api.npoint.io/307c922c070913b2bebb'; // Replace with your actual API endpoint

const rickTextEl = document.getElementById('rick-text');
const rickVideoEl = document.getElementById('rick-video');

async function pollData(url, intervalMs = 3000) {
  if(pollTimeout) {
    clearTimeout(pollTimeout);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Or .text() or other response methods
    console.log("Fetched data:", data);

    if(!resetDataTimer && data.value) {
      resetDataTimer = setTimeout(() => resetTimer(), 15000);
      showVideo();
    }

  } catch (error) {
    console.error("Error during polling:", error);
    // Handle error, e.g., show a message to the user, implement retry logic
  } finally {
    // Schedule the next poll regardless of success or failure
    pollTimeout = setTimeout(() => pollData(url, intervalMs), intervalMs);
  }
}

async function resetTimer() {
  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({value: false})
  })
  .catch(err => console.log)
  .finally(() => {
    hideVideo();
    clearTimeout(resetDataTimer);
    resetDataTimer = null;
  });
}

function showVideo() {
  rickTextEl.style.display = 'none';
  rickVideoEl.style.display = 'block';

  rickVideoEl.play();
}

function hideVideo() {
  rickVideoEl.pause();
  rickVideoEl.currentTime = 0;

  rickTextEl.style.display = 'block';
  rickVideoEl.style.display = 'none';
}

// Start polling
pollData(API_ENDPOINT, 3000); // Poll every 3 seconds