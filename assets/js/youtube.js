// =============================
// WORLD CLASS YOUTUBE LOGIC v2
// =============================

// ⚠️ PASTE YOUR SECURE KEY HERE
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0"; 

// Helper: Format Numbers (1,200,000 -> 1.2M)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// 1. FETCH CHANNEL DATA (FIXED: Now uses Handle Lookup)
async function analyzeChannel() {
    let input = document.getElementById('channelInput').value.trim();
    const btn = document.querySelector('.analyze-btn');
    
    if (!input) { alert("Please enter a channel handle!"); return; }

    // Ensure handle starts with '@'
    if (!input.startsWith("@")) {
        input = "@" + input; 
    }

    // Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
    
    // NEW API CALL: forHandle (More Accurate than Search)
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${input}&key=${YT_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.items && data.items.length > 0) {
            // Channel Found!
            updateUI(data.items[0]);
        } else {
            alert("Channel not found! Make sure to use the exact handle (e.g. @MrBeast)");
        }
    } catch (error) {
        console.error(error);
        alert("API Error: Check your Key or Quota.");
    }

    // Reset Button
    btn.innerText = 'Fetch Data';
}

// 2. UPDATE UI
function updateUI(channel) {
    document.getElementById('channelData').style.display = 'flex';
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    // Estimate Daily Views (Active channels get ~1-5% of subs as daily views)
    // We limit this to a reasonable max for calculation safety
    let subs = parseInt(channel.statistics.subscriberCount);
    let estimatedDailyViews = subs * 0.02; // 2% Activity Ratio
    
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;
    
    // Auto-update slider
    document.getElementById('viewSlider').value = estimatedDailyViews;
    manualUpdate(estimatedDailyViews);
}

// 3. SLIDER UPDATE
function manualUpdate(val) {
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// 4. CALCULATION ENGINE (WITH CURRENCY)
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let rpm = parseFloat(document.getElementById('nicheSelect').value);
    let currency = document.getElementById('currencySelect').value;

    // Base Calculation in USD
    let dailyEarnUSD = (dailyViews / 1000) * rpm;
    let monthlyEarnUSD = dailyEarnUSD * 30;
    let yearlyEarnUSD = dailyEarnUSD * 365;

    // Currency Conversion Rates (Approx)
    let rate = 1;
    let symbol = "$";

    if (currency === "INR") { rate = 85; symbol = "₹"; }
    if (currency === "EUR") { rate = 0.92; symbol = "€"; }
    if (currency === "GBP") { rate = 0.79; symbol = "£"; }

    // Display with Formatting
    document.getElementById('dailyRes').innerText = formatMoney(dailyEarnUSD * rate, symbol);
    document.getElementById('monthlyRes').innerText = formatMoney(monthlyEarnUSD * rate, symbol);
    document.getElementById('yearlyRes').innerText = formatMoney(yearlyEarnUSD * rate, symbol);
}

// Helper: Format Money
function formatMoney(amount, symbol) {
    return symbol + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Ini
t
reCalculate();
