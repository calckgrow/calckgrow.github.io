function calculateEMI() {
  let P = document.getElementById("loan").value;
  let R = document.getElementById("rate").value / 12 / 100;
  let N = document.getElementById("time").value * 12;

  if (!P || !R || !N) {
    document.getElementById("result").innerText = "Please enter all values";
    return;
  }

  let EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

  let totalPayment = EMI * N;
  let totalInterest = totalPayment - P;

  document.getElementById("emi").innerText =
    "Monthly EMI: ₹" + EMI.toFixed(2);

  document.getElementById("interest").innerText =
    "Total Interest: ₹" + totalInterest.toFixed(2);

  document.getElementById("total").innerText =
    "Total Payment: ₹" + totalPayment.toFixed(2);
}
