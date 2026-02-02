// =============================
// YOUTUBE INTELLIGENCE ENGINE (UI PRO EDITION)
// =============================

// ⚠️ API KEY YAHAN PASTE KAREIN
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0"; 

// Helper: Format Numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Helper: Format Money Range
function formatMoneyRange(min, max, symbol) {
    const fmt = (n) => {
        if(n >= 1000000) return (n/1000000).toFixed(1) + 'M';
        if(n >= 1000) return (n/1000).toFixed(1) + 'K';
        return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };
    return `${symbol}${fmt(min)} - ${symbol}${fmt(max)}`;
}

// 1. MAIN FUNCTION: Analyze Channel with Progress Bar
async function analyzeChannel() {
    let input = document.getElementById('channelInput').value.trim();
    const btn = document.querySelector('.analyze-btn');
    const progressBox = document.getElementById('progressBox');
    const progressBar = document.getElementById('progressBar');
    
    if (!input) { alert("Please enter a channel name!"); return; }

    // Start Animation
    btn.disabled = true; // Disable button while loading
    btn.style.opacity = "0.7";
    btn.innerText = "Analyzing...";
    
    progressBox.style.display = 'block';
    progressBar.style.width = '30%'; // Quick start

    try {
        // Step 1: Search
        progressBar.style.width = '50%'; // Halfway
        
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${YT_API_KEY}&maxResults=1`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items && searchData.items.length > 0) {
            const channelId = searchData.items[0].snippet.channelId;
            
            // Step 2: Get Stats
            progressBar.style.width = '80%'; // Almost there
            
            const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
            const statsRes = await fetch(statsUrl);
            const statsData = await statsRes.json();
            
            if (statsData.items && statsData.items.length > 0) {
                // Success!
                progressBar.style.width = '100%';
                setTimeout(() => {
                    updateUI(statsData.items[0]);
                    resetLoading();
                }, 500); // Small delay to show 100%
            } else {
                alert("Stats not found for this channel.");
                resetLoading();
            }
        } else {
            alert("Channel not found! Try correct spelling.");
            resetLoading();
        }
    } catch (error) {
        console.error(error);
        alert("Connection Error. Please try again.");
        resetLoading();
    }
}

function resetLoading() {
    const btn = document.querySelector('.analyze-btn');
    const progressBox = document.getElementById('progressBox');
    
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.innerText = "Fetch Data";
    
    // Hide progress bar slowly
    setTimeout(() => {
        progressBox.style.display = 'none';
        document.getElementById('progressBar').style.width = '0%';
    }, 1000);
}

// 2. UPDATE UI
function updateUI(channel) {
    document.getElementById('channelData').style.display = 'flex';
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    // Smart Estimation
    let subs = parseInt(channel.statistics.subscriberCount);
    let estimatedDailyViews = subs * 0.03; // 3% Activity
    
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;
    if (estimatedDailyViews > 50000000) estimatedDailyViews = 50000000; 

    // Update Slider
    let slider = document.getElementById('viewSlider');
    slider.max = 50000000; 
    slider.value = estimatedDailyViews;
    
    manualUpdate(estimatedDailyViews);
}

// 3. SLIDER UPDATE
function manualUpdate(val) {
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// 4. CALCULATION ENGINE
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let baseRPM = parseFloat(document.getElementById('nicheSelect').value);
    
    let currencyElem = document.getElementById('currencySelect');
    let currency = currencyElem ? currencyElem.value : "USD";

    let minRPM = baseRPM * 0.8; 
    let maxRPM = baseRPM * 1.5; 

    let minDailyUSD = (dailyViews / 1000) * minRPM;
    let maxDailyUSD = (dailyViews / 1000) * maxRPM;

    let rate = 1; 
    let symbol = "$";

    if (currency === "INR") { rate = 85; symbol = "₹"; }
    if (currency === "EUR") { rate = 0.92; symbol = "€"; }
    if (currency === "GBP") { rate = 0.79; symbol = "£"; }

    document.getElementById('dailyRes').innerText = formatMoneyRange(minDailyUSD * rate, maxDailyUSD * rate, symbol);
    
    document.getElementById('monthlyRes').innerText = formatMoneyRange(
        (minDailyUSD * 30) * rate, 
        (maxDailyUSD * 30) * rate, 
        symbol
    );
    
    document.getElementById('yearlyRes').innerText = formatMoneyRange(
        (minDailyUSD * 365) * rate, 
        (maxDailyUSD * 365) * rate, 
        symbol
    );
}

// Init
reCalculate();
