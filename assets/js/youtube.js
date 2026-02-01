// =============================
// WORLD CLASS YOUTUBE LOGIC
// =============================

// ⚠️ Replace 'YOUR_KEY_HERE' with your actual secure key from Google Cloud
const YT_API_KEY = "AIzaSy..."; // <-- AAPKI KEY YAHAN AAYEGI

// Helper: Format Numbers (1,200,000 -> 1.2M)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Helper: Format Money
function formatMoney(amount) {
    return "$" + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// 1. EXTRACT CHANNEL ID
async function getChannelId(input) {
    input = input.trim();
    
    // If input is a Handle (@mrbeast)
    if (input.startsWith("@")) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${input}&key=${YT_API_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data.items?.[0]?.snippet?.channelId || null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    
    // If input is standard URL
    // (Regex to find channel ID)
    return null; // For now simplified, handles are best
}

// 2. FETCH DATA
async function analyzeChannel() {
    const input = document.getElementById('channelInput').value;
    const btn = document.querySelector('.analyze-btn');
    
    if (!input) { alert("Please enter a channel name!"); return; }

    // Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
    
    // Try to get ID
    let channelId = await getChannelId(input);
    
    // Direct API Call for stats
    if (channelId) {
        const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
        const res = await fetch(statsUrl);
        const data = await res.json();
        
        if (data.items) {
            updateUI(data.items[0]);
        }
    } else {
        alert("Channel not found. Try using the Handle (e.g. @tseries)");
    }

    // Reset Button
    btn.innerText = 'Fetch Data';
}

// 3. UPDATE UI WITH REAL DATA
function updateUI(channel) {
    // Show Channel Header
    document.getElementById('channelData').style.display = 'flex';
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    // Get Total Views & Avg Daily Views (Approx)
    // YouTube API doesn't give "Daily Views", so we estimate based on Total/Videos or assume a standard growth
    // For this calculator, let's assume active channels get 1% of subs as daily views (Heuristic)
    let subs = parseInt(channel.statistics.subscriberCount);
    let estimatedDailyViews = subs * 0.05; // 5% of subs watch daily (active channel)
    
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;

    // Update Slider & Calc
    document.getElementById('viewSlider').value = estimatedDailyViews;
    manualUpdate(estimatedDailyViews);
}

// 4. MANUAL SLIDER UPDATE
function manualUpdate(val) {
    // Update Text Display
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// 5. MAIN CALCULATION ENGINE
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let rpm = document.getElementById('nicheSelect').value;

    // Formula: (Views / 1000) * RPM
    let dailyEarn = (dailyViews / 1000) * rpm;
    let monthlyEarn = dailyEarn * 30;
    let yearlyEarn = dailyEarn * 365;

    // Animation Effect for Money
    document.getElementById('dailyRes').innerText = formatMoney(dailyEarn);
    document.getElementById('monthlyRes').innerText = formatMoney(monthlyEarn);
    document.getElementById('yearlyRes').innerText = formatMoney(yearlyEarn);
}

// Init

reCalculate();
