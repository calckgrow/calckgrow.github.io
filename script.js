function calculatePercentage() {
  let value = document.getElementById("value").value;
  let percent = document.getElementById("percent").value;

  if (value === "" || percent === "") {
    document.getElementById("result").innerText = "Please enter both values";
    return;
  }

  let result = (value * percent) / 100;
  document.getElementById("result").innerText =
    percent + "% of " + value + " = " + result;
}
