// ==========================
// REAL YouTube Channel Fetch Logic
// ==========================

// 🔑 1. CONFIG (API KEY)
// Aapki Key waisi hi rehne di hai maine
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTwH2w4u62eO-_wVqYDJx0"; 

// 🎯 Extract channel identifier
async function getChannelId(input) {
    input = input.trim();

    // Handle (@username)
    if (input.startsWith("@")) {
        // ✅ FIX 1: Backticks (` `) lagaye
        const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${input.substring(1)}&key=${YT_API_KEY}`;
        const res = await fetch(searchURL).then(r => r.json());
        return res.items?.[0]?.snippet?.channelId || null;
    }

    // Channel URL
    const match = input.match(/channel\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    return null;
}

// 📡 Fetch channel details
async function fetchChannelData(channelId) {
    // ✅ FIX 2: Backticks (` `) lagaye
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
    const res = await fetch(url).then(r => r.json());
    return res.items?.[0] || null;
}

// 💰 Smart RPM estimate
function estimateRPM(country) {
    if (country === "US") return 6;
    if (country === "IN") return 1; // India ka RPM badha diya thoda
    return 3;
}

// 🚀 MAIN ANALYZER
async function analyzeChannel() {
    const input = document.getElementById("channelInput").value;
    if (!input) return alert("Enter Channel URL or @handle");

    const channelId = await getChannelId(input);
    if (!channelId) return alert("Channel not found");

    const data = await fetchChannelData(channelId);
    if (!data) return alert("Failed to fetch channel data");

    const subs = Number(data.statistics.subscriberCount);
    const totalViews = Number(data.statistics.viewCount);
    const videos = Number(data.statistics.videoCount);
    const country = data.snippet.country || "Global";
    const logo = data.snippet.thumbnails.high.url;

    // Earnings estimate
    const rpm = estimateRPM(country);
    const dailyViews = totalViews / 365; // Simple average
    const daily = (dailyViews / 1000) * rpm;

    // Render UI
    document.getElementById("chLogo").src = logo;
    document.getElementById("chLogo").style.display = "block"; // Logo show karein
    document.getElementById("chName").innerText = data.snippet.title;
    document.getElementById("chSubs").innerText = subs.toLocaleString() + " Subs";
    document.getElementById("chViews").innerText = totalViews.toLocaleString() + " Views";
    
    // Result Box Show karein
    document.getElementById("channelData").style.display = "block";

    // ✅ FIX 3, 4, 5: Backticks (` `) lagaye earnings show karne ke liye
    document.getElementById("daily").innerText = `$${daily.toFixed(2)}`;
    document.getElementById("monthly").innerText = `$${(daily * 30).toFixed(2)}`;
    document.getElementById("yearly").innerText = `$${(daily * 365).toFixed(2)}`;
}
