// ===============================
// YouTube Earnings Core Logic
// ===============================

// Utility: format number
function formatNumber(num) {
  return num.toLocaleString();
}

// Utility: currency convert (basic static rates – later API)
function convertCurrency(amount, rate) {
  return (amount * rate).toFixed(2);
}

// Main earnings calculator
function calculateYouTubeEarnings() {
  const views = Number(document.getElementById("views").value);
  const rpm = Number(document.getElementById("rpm").value);

  if (!views || !rpm) {
    alert("Please enter views and RPM");
    return;
  }

  // Earnings formula
  const earning = (views / 1000) * rpm;

  // Time-based breakdown
  const daily = earning;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const yearly = daily * 365;

  // Output
  document.getElementById("daily").innerText = "$" + formatNumber(daily.toFixed(2));
  document.getElementById("weekly").innerText = "$" + formatNumber(weekly.toFixed(2));
  document.getElementById("monthly").innerText = "$" + formatNumber(monthly.toFixed(2));
  document.getElementById("yearly").innerText = "$" + formatNumber(yearly.toFixed(2));
}
