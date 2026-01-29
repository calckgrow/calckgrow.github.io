/* --- SOCIAL MEDIA --- */
function calculateYoutube() {
    const views = document.getElementById('ytViews').value;
    const rpm = document.getElementById('ytRpm').value;
    if(views) {
        document.getElementById('ytResult').innerText = "$" + ((views/1000)*rpm*30).toFixed(0);
    } else { alert("Enter views"); }
}

function calculateInsta() {
    const followers = document.getElementById('instaFollowers').value;
    const rate = document.getElementById('instaRate').value;
    if(followers) {
        const earning = (followers * rate / 100) * 10; 
        document.getElementById('instaResult').innerText = "$" + earning.toFixed(0);
    } else { alert("Enter followers"); }
}

/* --- FINANCE --- */
function calculateEMI() {
    const p = document.getElementById('loanAmount').value;
    const r = document.getElementById('interestRate').value / 1200;
    const n = document.getElementById('loanTenure').value * 12;
    if(p && n) {
        const emi = p * r * (Math.pow(1+r, n) / (Math.pow(1+r, n)-1));
        document.getElementById('emiResult').innerText = "₹" + emi.toFixed(0);
    }
}

function calculateSIP() {
    const p = document.getElementById('sipAmount').value;
    const r = document.getElementById('sipRate').value / 1200;
    const n = document.getElementById('sipYears').value * 12;
    if(p) {
        const res = p * ((Math.pow(1+r, n)-1)/r) * (1+r);
        document.getElementById('sipResult').innerText = "₹" + res.toFixed(0);
    }
}

function calculateGST() {
    const amt = parseFloat(document.getElementById('gstAmount').value);
    const tax = parseFloat(document.getElementById('gstRate').value);
    if(amt) {
        document.getElementById('gstResult').innerText = "Total: ₹" + (amt + (amt*tax/100)).toFixed(2);
    }
}

function calculateFD() {
    const p = parseFloat(document.getElementById('fdAmount').value);
    const r = parseFloat(document.getElementById('fdRate').value);
    const t = parseFloat(document.getElementById('fdYears').value);
    if(p) {
        const maturity = p + ((p*r*t)/100);
        document.getElementById('fdResult').innerText = "₹" + maturity.toFixed(0);
    }
}

/* --- DAILY LIFE --- */
function calculateAge() {
    const d1 = document.getElementById('birthDate').value;
    if(d1) {
        const birth = new Date(d1);
        const diff = new Date() - birth;
        const years = Math.abs(new Date(diff).getUTCFullYear() - 1970);
        document.getElementById('ageResult').innerText = years + " Years";
    }
}

function calculateBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value) / 100; 
    if(w && h) {
        const bmi = w / (h * h);
        document.getElementById('bmiResult').innerText = "BMI: " + bmi.toFixed(1);
    }
}

function calculateDiscount() {
    const price = document.getElementById('price').value;
    const disc = document.getElementById('discPercent').value;
    if(price) {
        const final = price - (price * disc / 100);
        document.getElementById('discResult').innerText = "Pay: ₹" + final.toFixed(2);
    }
}

function calculatePercent() {
    const num = document.getElementById('perNum').value;
    const total = document.getElementById('perTotal').value;
    if(num && total) {
        const res = (num / total) * 100;
        document.getElementById('perResult').innerText = res.toFixed(2) + "%";
        
    }
}
