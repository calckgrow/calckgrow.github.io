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
async function fetchYoutubeData() {
    let input = document.getElementById('ytInput').value;
    const loading = document.getElementById('loadingMsg');
    const viewsInput = document.getElementById('ytViews');

    if (!input) { alert("Link paste karein!"); return; }
    
    input = input.trim(); 
    loading.style.display = 'block';

    try {
        let apiUrl = '';
        let videoId = '';

        // 1. Link se ID nikalne ka Naya Tarika (Sabse Zaroori)
        if (input.includes('youtu.be/')) {
            videoId = input.split('youtu.be/')[1];
        } else if (input.includes('v=')) {
            videoId = input.split('v=')[1];
        }

        // ID saaf karna (agar ?si= ya &t= laga ho to hatana)
        if (videoId) {
            // Ye line ?si= wale error ko theek karegi 👇
            if (videoId.indexOf('?') !== -1) videoId = videoId.split('?')[0];
            if (videoId.indexOf('&') !== -1) videoId = videoId.split('&')[0];
            
            apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
        } 
        else if (input.includes('@')) {
            const handle = input.split('@')[1].split('/')[0];
            apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=@${handle}&key=${apiKey}`;
        } else {
            alert("Link galat hai! Sirf Video ya Channel link dalein.");
            loading.style.display = 'none';
            return;
        }

        // Data Lana
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            viewsInput.value = data.items[0].statistics.viewCount;
            calculateYoutube(); // Auto calculate
            
        } else {
            alert("Data nahi mila. (Link check karein)");
        }

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
    loading.style.display = 'none';
}

// Slider khiskane par ye function chalega
function updateSlider(source) {
    const viewSlider = document.getElementById('viewSlider');
    const rpmSlider = document.getElementById('rpmSlider');
    const viewsHidden = document.getElementById('ytViews');
    const rpmHidden = document.getElementById('ytRPM');
    
    // Sliders aur Numbers ko sync karna
    if(source === 'views') {
        viewsHidden.value = viewSlider.value;
        document.getElementById('viewDisplay').innerText = parseInt(viewSlider.value).toLocaleString();
    }
    if(source === 'rpm') {
        rpmHidden.value = rpmSlider.value;
        document.getElementById('rpmDisplay').innerText = "$" + rpmSlider.value;
    }

    // Turant Calculate karna
    calculateYoutube();
}

// Ye naya calculation logic hai jo screen par numbers dikhayega
function calculateYoutube() {
    const views = document.getElementById('ytViews').value;
    const rpm = document.getElementById('ytRPM').value;
    
    if(views && rpm) {
        const dollars = (views / 1000) * rpm;
        const rupees = dollars * 84;
        
        // Agar naya design mil jaye to wahan update karo
        if(document.getElementById('dailyDollar')) {
            document.getElementById('dailyDollar').innerText = dollars.toFixed(2);
            document.getElementById('dailyRupee').innerText = rupees.toFixed(2);
        }
    }
  
}

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
