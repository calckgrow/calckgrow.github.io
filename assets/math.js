// --- QUADRATIC SOLVER LOGIC ---
function solveQuadratic() {
    const a = parseFloat(document.getElementById('quadA').value);
    const b = parseFloat(document.getElementById('quadB').value);
    const c = parseFloat(document.getElementById('quadC').value);
    const out = document.getElementById('quadOut');
    const box = document.getElementById('quadRes');
    const steps = document.getElementById('quadSteps');

    if (isNaN(a) || isNaN(b) || isNaN(c)) return alert("Please fill all fields");
    if (a === 0) return alert(" 'a' cannot be zero in Quadratic Equation");

    const d = (b * b) - (4 * a * c);
    box.style.display = "block";

    if (d > 0) {
        let r1 = (-b + Math.sqrt(d)) / (2 * a);
        let r2 = (-b - Math.sqrt(d)) / (2 * a);
        out.innerText = `x₁= ${r1.toFixed(2)}, x₂= ${r2.toFixed(2)}`;
        steps.innerText = `Discriminant (D) is ${d.toFixed(2)}. Two real roots found.`;
    } else if (d === 0) {
        let r = -b / (2 * a);
        out.innerText = `x = ${r.toFixed(2)}`;
        steps.innerText = `Discriminant is 0. One repeated root found.`;
    } else {
        out.innerText = "Imaginary Roots";
        steps.innerText = `Discriminant is ${d.toFixed(2)} (Negative). No real roots exist.`;
    }
}

// --- PRIME FACTORIZATION LOGIC ---
function factorize() {
    let n = parseInt(document.getElementById('primeIn').value);
    if (isNaN(n) || n < 2) return alert("Enter a number > 1");
    
    let factors = [];
    let d = 2;
    let temp = n;
    while (temp >= d*d) {
        if (temp % d === 0) {
            factors.push(d);
            temp /= d;
        } else { d++; }
    }
    factors.push(temp);
    
    document.getElementById('primeRes').style.display = "block";
    document.getElementById('primeOut').innerText = factors.join(" × ");
}

// --- PERCENTAGE STUDIO LOGIC ---
function calcPerc() {
    const type = document.getElementById('percType').value;
    const v1 = parseFloat(document.getElementById('p1').value);
    const v2 = parseFloat(document.getElementById('p2').value);
    const out = document.getElementById('percOut');
    const box = document.getElementById('percRes');

    if (isNaN(v1) || isNaN(v2)) return;
    box.style.display = "block";

    if (type === "1") out.innerText = ((v1 / 100) * v2).toFixed(2);
    else if (type === "2") out.innerText = ((v1 / v2) * 100).toFixed(2) + "%";
    else {
        let diff = ((v2 - v1) / v1) * 100;
        out.innerText = (diff > 0 ? "+" : "") + diff.toFixed(2) + "%";
    }
}
