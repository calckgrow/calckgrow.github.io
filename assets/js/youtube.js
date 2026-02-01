// =============================
// YOUTUBE DEBUG ENGINE (Jasoos Code)
// =============================

// ⚠️ YAHAN APNI KEY PASTE KAREIN
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0"; 

// Helper: Format Numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Helper: Format Money
function formatMoney(amount, symbol) {
    return symbol + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// MAIN FUNCTION
async function analyzeChannel() {
    let input = document.getElementById('channelInput').value.trim();
    const btn = document.querySelector('.analyze-btn');
    
    if (!input) { alert("Please enter a channel name!"); return; }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';
    
    try {
        // STEP 1: Search Call
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${YT_API_KEY}&maxResults=1`;
        
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        // 🛑 JASOOSI: Agar Google ne error diya, to wo yahan pakda jayega
        if (searchData.error) {
            alert("GOOGLE ERROR: " + searchData.error.message);
            btn.innerText = 'Fetch Data';
            return; // Yahin ruk jao
        }

        // Agar sab sahi hai, to aage badho
        if (searchData.items && searchData.items.length > 0) {
            const channelId = searchData.items[0].snippet.channelId;
            
            // STEP 2: Stats Call
            const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
            const statsRes = await fetch(statsUrl);
            const statsData = await statsRes.json();
            
            if (statsData.items && statsData.items.length > 0) {
                updateUI(statsData.items[0]);
            } else {
                alert("Stats not found.");
            }
        } else {
            alert("Channel not found! Name check karein.");
        }

    } catch (error) {
        console.error(error);
        alert("System Error: " + error.message);
    }

    btn.innerText = 'Fetch Data';
}

// UI UPDATE FUNCTION
function updateUI(channel) {
    document.getElementById('channelData').style.display = 'flex';
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    let subs = parseInt(channel.statistics.subscriberCount);
    let estimatedDailyViews = subs * 0.02; 
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;
    if (estimatedDailyViews > 50000000) estimatedDailyViews = 50000000; 

    document.getElementById('viewSlider').value = estimatedDailyViews;
    manualUpdate(estimatedDailyViews);
}

// SLIDER LOGIC
function manualUpdate(val) {
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// CALCULATOR LOGIC
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let baseRPM = parseFloat(document.getElementById('nicheSelect').value);
    let currencyElem = document.getElementById('currencySelect');
    let currency = currencyElem ? currencyElem.value : "USD";

    let minRPM = baseRPM * 0.8; 
    let maxRPM = baseRPM * 1.5; 
    let minDailyUSD = (dailyViews / 1000) * minRPM;
    let maxDailyUSD = (dailyViews / 1000) * maxRPM;

    let rate = 1; let symbol = "$";
    if (currency === "INR") { rate = 85; symbol = "₹"; }
    if (currency === "EUR") { rate = 0.92; symbol = "€"; }
    if (currency === "GBP") { rate = 0.79; symbol = "£"; }

    const fmtRange = (min, max) => `${symbol}${formatNumber(min)} - ${symbol}${formatNumber(max)}`;

    document.getElementById('dailyRes').innerText = fmtRange(minDailyUSD * rate, maxDailyUSD * rate);
    document.getElementById('monthlyRes').innerText = fmtRange((minDailyUSD * 30) * rate, (maxDailyUSD * 30) * rate);
    document.getElementById('yearlyRes').innerText = fmtRange((minDailyUSD * 365) * rate, (maxDailyUSD * 365) * rate);

}

reCalculate();
