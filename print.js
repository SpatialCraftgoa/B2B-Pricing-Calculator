async function downloadPDF() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const village = document.getElementById('village').value.trim();
  const state = document.getElementById('state').value.trim();
  const surveyNo = document.getElementById('surveyNo').value.trim();
  const subDivisionNo = document.getElementById('subDivisionNo').value.trim();
  const area = parseFloat(document.getElementById('area')?.value || "0");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ✅ Frame/buffer border
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  const logoBase64 = '';
  if (logoBase64) {
    const img = new Image();
    img.src = logoBase64;
    await new Promise(resolve => img.onload = resolve);
    doc.addImage(img, 'PNG', 70, 10, 50, 50);
  }

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const quoteDate = `${dd}/${mm}/${yyyy}`;
  const expiryDate = new Date(today);
  expiryDate.setMonth(today.getMonth() + 1);
  const expiryDateStr = `${String(expiryDate.getDate()).padStart(2, '0')}/${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${expiryDate.getFullYear()}`;
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const quoteNumber = `QTN-${dd}${mm}${String(yyyy).slice(2)}-${suffix}`;

  doc.setFontSize(16);
  doc.text("Quotation", 105, 15, { align: "center" });

  doc.setFontSize(10);
  const lines = [
    "AFONSO SPATIALCRAFT LLP",
    "FLOOR Flat BS/2 A-1",
    "Bldg J F Correia Complex",
    "NEAR APOLLO PHARMACY",
    "Borda, Margao Goa 403601, India",
    "GSTIN: 30ACEFA6283H1ZM",
    "Phone: 7057067906",
    "Email: contact@spatialcraft.in",
    "www.spatialcraft.in"
  ];
  lines.forEach((line, i) => doc.text(line, 14, 25 + i * 5));

  // 🡸 shifted slightly left
  doc.text(`Quote Number: ${quoteNumber}`, 135, 25);
  doc.text(`Quote Date: ${quoteDate}`, 135, 30);
  doc.text(`Expiry Date: ${expiryDateStr}`, 135, 35);
  doc.text("Place Of Supply: Goa (30)", 135, 40);

  doc.setFontSize(12);
  doc.text("Bill To", 14, 75);
  doc.setFontSize(10);
  doc.text(name, 14, 80);
  doc.text(email, 14, 85);

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  
  let subText = "SUB: Survey of Property";
  
  // Check if only one of the surveys is selected
  if (document.getElementById('topoCheckbox').checked && !document.getElementById('aerialCheckbox').checked) {
    subText = "SUB: Topographical Survey of Property";
  } else if (!document.getElementById('topoCheckbox').checked && document.getElementById('aerialCheckbox').checked) {
    subText = "SUB: Aerial Survey of Property";
  } else if (surveyNo || subDivisionNo) {
    // Check if both surveys are selected
    subText += " bearing";
    if (surveyNo) subText += ` Survey No ${surveyNo}`;
    if (subDivisionNo) subText += ` / ${subDivisionNo}`;
    if (village) subText += `, ${village}`;
    if (state) subText += `, ${state}`;
  }
  
  doc.text(subText, 14, 95);
  
  doc.setFont(undefined, "normal");

  const items = [];

  // Check for Aerial Survey selection
  const aerialSelected = document.getElementById('aerialCheckbox')?.checked; // Assuming there's a checkbox for this

  // If Aerial Survey is selected
  if (aerialSelected) {
    const aerialCost = calculateAerialCost(area);
    if (aerialCost > 0) {
      items.push({ desc: "Aerial Survey", qty: 1, price: aerialCost });
    }
  }

  // Check for Topographical Survey selection
  const topoSelected = document.getElementById('topoCheckbox')?.checked; // Assuming there's a checkbox for this

  // If Topographical Survey is selected
  if (topoSelected) {
    const topoCost = calculateTopoCost(area);
    if (topoCost > 0) {
      items.push({ desc: "Topographical Survey", qty: 1, price: topoCost });
    }
  }

  // Add Smart Interactive Digital Map if selected
  const smartMapValue = parseFloat(document.getElementById('smartMap')?.value || "0");
  if (smartMapValue) {
    const label = {
      5000: "Smart Interactive Digital Map (Monthly)",
      25000: "Smart Interactive Digital Map (6 Months)",
      50000: "Smart Interactive Digital Map (Yearly)"
    }[smartMapValue] || "Smart Interactive Digital Map";
    items.push({ desc: label, qty: 1, price: smartMapValue });
  }

  // Add Aerial Site Overview Video if selected
  if (document.getElementById('aerialVideo')?.checked) {
    items.push({ desc: "Aerial Site Overview Video", qty: 1, price: 15000 });
  }

  // Add 360° VR Walkthrough if selected
  if (document.getElementById('vrWalkthrough')?.checked) {
    items.push({ desc: "360° VR Walkthrough (5 Aerial Points)", qty: 1, price: 15000 });
    const groundQty = parseInt(document.getElementById('groundPoints')?.value || "0");
    const aerialQty = parseInt(document.getElementById('aerialPoints')?.value || "0");
    if (groundQty > 0) items.push({ desc: "Additional Ground 360° Points", qty: groundQty, price: 500 });
    if (aerialQty > 0) items.push({ desc: "Additional Aerial 360° Points", qty: aerialQty, price: 3000 });
  }

  const tableBody = items.map((item, index) => {
    const amount = item.qty * item.price;
    return [
      `${index + 1}`,
      item.desc,
      item.qty.toFixed(2),
      `Rs. ${formatIndian(item.price.toFixed(2))}`,
      `Rs. ${formatIndian(amount.toFixed(2))}`
    ];
  });

  doc.autoTable({
    startY: 105,
    head: [["#", "Item & Description", "Qty", "Rate", "Amount"]],
    body: tableBody,
    styles: { cellPadding: 2, fontSize: 9 },
    margin: { left: 12, right: 12 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 85 },
      2: { cellWidth: 18 },
      3: { cellWidth: 32 },
      4: { cellWidth: 33 }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalInWords = "Indian Rupee " + numberToWords(Math.floor(subtotal)) + " Only";

  doc.setFontSize(10);
  doc.text(`Sub Total: Rs. ${formatIndian(subtotal.toFixed(2))} (+ Taxes)`, 120, finalY);
  doc.text(`Total: Rs. ${formatIndian(subtotal.toFixed(2))} (+ Taxes)`, 120, finalY + 6);

  const wordsWrapped = doc.splitTextToSize(`Total In Words: ${totalInWords}`, 180);
  doc.text(wordsWrapped, 14, finalY + 14);

  doc.text("Terms & Conditions:", 14, finalY + 22);
  doc.text("- Payment terms: 50% at time of Booking and rest before Delivery", 14, finalY + 28);
  doc.text("- One-time project offer. Future projects as per new proposal", 14, finalY + 34);
  doc.text("Authorized Signature", 150, finalY + 55);

  doc.save(`${quoteNumber}-Quote.pdf`);
}

function formatIndian(x) {
  x = x.toString().split(".");
  let intPart = x[0];
  let decPart = x.length > 1 ? "." + x[1] : "";
  let last3 = intPart.slice(-3);
  let other = intPart.slice(0, -3);
  if (other !== "") last3 = "," + last3;
  return other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + last3 + decPart;
}

function calculateTopoCost(area) {
  if (area <= 8333.3333) return 25000;
  if (area <= 30000) return area * 3;
  if (area <= 70000) return 90000 + (area - 30000) * 2.5;
  return 190000 + (area - 70000) * 2;
}

function calculateAerialCost(area) {
  if (area <= 50000) return 24995;
  if (area <= 100000) return 24995 + (area - 50000) * 0.4;
  if (area <= 150000) return 44995 + (area - 100000) * 0.35;
  if (area <= 200000) return 62495 + (area - 150000) * 0.3;
  return 74995 + (area - 200000) * 0.2;
}

function numberToWords(num) {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (isNaN(num)) return "Invalid Number";
  if (num === 0) return "Zero";
  const n = ("000000000" + num).slice(-9);
  const crore = parseInt(n.slice(0, 2));
  const lakh = parseInt(n.slice(2, 4));
  const thousand = parseInt(n.slice(4, 6));
  const hundred = parseInt(n.slice(6, 9));
  let str = "";
  if (crore) str += a[crore] + " Crore ";
  if (lakh) str += b[lakh] + " Lakh ";
  if (thousand) str += a[thousand] + " Thousand ";
  if (hundred) str += a[hundred] + " Hundred ";
  return str.trim();
}
