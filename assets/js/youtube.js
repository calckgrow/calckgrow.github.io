/* ===============================
   YouTube Channel Analyzer Logic
   =============================== */

// 🔑 1. CONFIG (API KEY)
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0";

// 🌍 2. RPM MAP (Smart Estimate)
const RPM_MAP = {
  US: [3, 12],
  CA: [2, 8],
  UK: [2, 8],
  AU: [2, 7],
  IN: [0.3, 1.5],
  DEFAULT: [0.5, 4]
};

// 🎯 3. Extract Channel ID from URL or Handle
async function getChannelId(input) {
  // Handle (@username)
  if (input.includes("@")) {
    const handle = input.replace("@", "");
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${YT_API_KEY}`;
    const res = await fetch(url).then(r => r.json());
    return res.items?.[0]?.snippet?.channelId || null;
  }

  // Channel URL
  if (input.includes("youtube.com")) {
    const match = input.match(/channel\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  }

  return null;
}

// 📊 4. Fetch Channel Data
async function fetchChannelData(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${YT_API_KEY}`;
  const res = await fetch(url).then(r => r.json());
  return res.items?.[0] || null;
}

// 🧠 5. Smart RPM Calculator
function calculateRPM(country) {
  const range = RPM_MAP[country] || RPM_MAP.DEFAULT;
  return ((range[0] + range[1]) / 2).toFixed(2);
}

// 💰 6. Earnings Engine
function calculateEarnings(views, rpm) {
  const daily = (views / 1000) * rpm;
  return {
    daily: daily.toFixed(2),
    weekly: (daily * 7).toFixed(2),
    monthly: (daily * 30).toFixed(2),
    yearly: (daily * 365).toFixed(2)
  };
}

// 🚀 7. MAIN ANALYZER
async function analyzeChannel() {
  const input = document.getElementById("channelInput").value.trim();
  if (!input) return alert("Enter Channel URL or @handle");

  const channelId = await getChannelId(input);
  if (!channelId) return alert("Channel not found");

  const data = await fetchChannelData(channelId);
  if (!data) return alert("Unable to fetch data");

  // Extract info
  const subs = Number(data.statistics.subscriberCount);
  const views = Number(data.statistics.viewCount);
  const logo = data.snippet.thumbnails.high.url;
  const banner = data.brandingSettings.image?.bannerExternalUrl;
  const country = data.snippet.country || "DEFAULT";

  const rpm = calculateRPM(country);
  const earnings = calculateEarnings(views / 365, rpm); // avg daily views

  // 🔥 Render to UI
  document.getElementById("chLogo").src = logo;
  document.getElementById("chName").innerText = data.snippet.title;
  document.getElementById("chSubs").innerText = subs.toLocaleString();
  document.getElementById("chCountry").innerText = country;
  document.getElementById("rpm").innerText = `$${rpm}`;

  document.getElementById("daily").innerText = `$${earnings.daily}`;
  document.getElementById("weekly").innerText = `$${earnings.weekly}`;
  document.getElementById("monthly").innerText = `$${earnings.monthly}`;
  document.getElementById("yearly").innerText = `$${earnings.yearly}`;

  if (banner) {
    document.getElementById("chBanner").style.backgroundImage = `url(${banner})`;
  }
}
