// Navigation Functions
function openCalc(id) {
  // Hide Menu
  document.getElementById('mainMenu').style.display = 'none';
  // Show Selected Calculator
  document.getElementById(id).style.display = 'block';
}

function goHome() {
  // Hide all sections
  let sections = document.querySelectorAll('.container');
  sections.forEach(sec => sec.style.display = 'none');
  // Show Menu
  document.getElementById('mainMenu').style.display = 'grid';
}

// --- Calculator Logic Starts Below ---

function calculatePercentage() {
  let val = document.getElementById("value").value;
  let per = document.getElementById("percent").value;
  if(val=="" || per=="") { alert("Enter values"); return; }
  document.getElementById("result").innerText = (val * per) / 100;
}

function calculateGST() {
  let p = document.getElementById("gstPrice").value;
  let g = document.getElementById("gstPercent").value;
  if(p=="" || g=="") { alert("Enter values"); return; }
  let amt = (p * g) / 100;
  let tot = parseFloat(p) + parseFloat(amt);
  document.getElementById("gstResult").innerText = "GST: " + amt + " | Total: " + tot;
}

function calculateEMI() {
  let p = document.getElementById("emiPrincipal").value;
  let r = document.getElementById("emiRate").value;
  let n = document.getElementById("emiMonths").value;
  if(p=="" || r=="" || n=="") return;
  let mr = r / 12 / 100;
  let emi = (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  document.getElementById("emiResult").innerText = "EMI: " + emi.toFixed(2);
}

function calculateSIP() {
  let p = document.getElementById("sipAmount").value;
  let r = document.getElementById("sipRate").value;
  let t = document.getElementById("sipYears").value;
  if(p=="" || r=="" || t=="") return;
  let mr = r / 12 / 100;
  let m = t * 12;
  let mat = p * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr);
  document.getElementById("sipResult").innerText = "Maturity: " + mat.toFixed(2);
}

function calculateAge() {
  let dob = document.getElementById("dob").value;
  if(!dob) return;
  let b = new Date(dob);
  let n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) age--;
  document.getElementById("ageResult").innerText = "Age: " + age + " Years";
}

// 👇 YAHAN APNI KEY DAALNI HAI 👇
const apiKey = 'AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0'; 
// --- 1. API DATA FETCHING (Fix kiya hua code) ---
async function fetchYoutubeData() {
    let input = document.getElementById('ytInput').value;
    
    // Button par "Checking..." animation
    const btn = document.querySelector('button[onclick="fetchYoutubeData()"]');
    const originalText = btn ? btn.innerText : 'Check';
    if(btn) btn.innerText = "Checking...";

    if (!input) { alert("Link paste karein!"); if(btn) btn.innerText = originalText; return; }
    
    input = input.trim(); 

    try {
        let apiUrl = '';
        let videoId = '';

        // ID nikalna
        if (input.includes('youtu.be/')) {
            videoId = input.split('youtu.be/')[1];
        } else if (input.includes('v=')) {
            videoId = input.split('v=')[1];
        }

        // Clean ID
        if (videoId) {
            if (videoId.indexOf('?') !== -1) videoId = videoId.split('?')[0];
            if (videoId.indexOf('&') !== -1) videoId = videoId.split('&')[0];
            apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
        } 
        else if (input.includes('@')) {
            const handle = input.split('@')[1].split('/')[0];
            apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=@${handle}&key=${apiKey}`;
        } else {
            alert("Sirf Video ya Channel link dalein.");
            if(btn) btn.innerText = originalText;
            return;
        }

        // API Call
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let viewCount = data.items[0].statistics.viewCount;
            
            // Sliders update karna
            document.getElementById('slViews').value = viewCount;
            updateMcCalc(); // Calculation start
            
            if(btn) btn.innerText = "Done ✅";
            setTimeout(() => { if(btn) btn.innerText = originalText; }, 2000);

        } else {
            alert("Data nahi mila. API Key ya Link check karein.");
            if(btn) btn.innerText = originalText;
        }

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
        if(btn) btn.innerText = originalText;
    }
}

// --- 2. ADVANCED CALCULATOR LOGIC (MediaCube Style) ---
let timeMultiplier = 1; // Default: Daily

function setTimeScale(scale, element) {
    document.querySelectorAll('.mc-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    if(scale === 'daily') timeMultiplier = 1;
    if(scale === 'weekly') timeMultiplier = 7;
    if(scale === 'monthly') timeMultiplier = 30;
    if(scale === 'annual') timeMultiplier = 365;

    document.getElementById('timeLabel').innerText = `ESTIMATED ${scale.toUpperCase()} EARNINGS`;
    updateMcCalc();
}

function updateMcCalc() {
    // Sliders se value lena
    const views = parseFloat(document.getElementById('slViews').value) || 0;
    const cpm = parseFloat(document.getElementById('slCPM').value) || 0;
    const playbackRate = parseFloat(document.getElementById('slPlayback').value) / 100;
    const premShare = parseFloat(document.getElementById('slPremShare').value) / 100;
    const premRPM = parseFloat(document.getElementById('slPremRPM').value) || 0;

    // Text Update
    document.getElementById('valViews').innerText = parseInt(views).toLocaleString();
    document.getElementById('valCPM').innerText = "$" + cpm.toFixed(2);
    document.getElementById('valPlayback').innerText = (playbackRate * 100).toFixed(0) + "%";
    document.getElementById('valPremShare').innerText = (premShare * 100).toFixed(0) + "%";
    document.getElementById('valPremRPM').innerText = "$" + premRPM.toFixed(2);

    // Math Logic
    let adRevenue = (views * playbackRate * cpm) / 1000;
    let premRevenue = (views * premShare * premRPM) / 1000;
    let totalDaily = adRevenue + premRevenue;

    // Final Numbers
    let finalTotal = totalDaily * timeMultiplier;
    let finalAds = adRevenue * timeMultiplier;
    let finalPrem = premRevenue * timeMultiplier;
    let effRPM = views > 0 ? (totalDaily / views) * 1000 : 0;

    // Result Show
    document.getElementById('totalMoney').innerText = finalTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    // INR Conversion (Current approx rate: 84)
    document.getElementById('totalRupee').innerText = (finalTotal * 84).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    // Breakdown Update
    document.getElementById('adIncome').innerText = finalAds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('premIncome').innerText = finalPrem.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('effRPM').innerText = effRPM.toFixed(2);
}

// --- 3. INSTAGRAM RESTORED (Jo galti se delete ho gaya tha) ---
function calculateInsta() {
    let f = document.getElementById("instaFollowers").value;
    document.getElementById("instaResult").innerText = "Est. Earnings: $" + (f*0.01).toFixed(2);
}

function calculateAdsense() {
  let i = document.getElementById("adsenseImpressions").value;
  let c = document.getElementById("adsenseCTR").value;
  let p = document.getElementById("adsenseCPC").value;
  let earn = ((i*c)/100) * p;
  document.getElementById("adsenseResult").innerText = "Revenue: $" + earn.toFixed(2);
}

function calculateSalary() {
  let ctc = document.getElementById("ctc").value;
  document.getElementById("salaryResult").innerText = "Monthly: " + (ctc/12).toFixed(2);
}

function calculateTax() {
  let inc = document.getElementById("income").value;
  let tax = 0;
  if(inc > 300000) tax = (inc - 300000) * 0.05; // Simplified
  document.getElementById("taxResult").innerText = "Est. Tax: " + tax.toFixed(2);
}

