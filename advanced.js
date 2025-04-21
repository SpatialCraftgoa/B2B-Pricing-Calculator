document.addEventListener("DOMContentLoaded", function () {
    const vrWalkthroughCheckbox = document.getElementById("vrWalkthrough");
    const groundPointsInput = document.getElementById("groundPoints");
    const aerialPointsInput = document.getElementById("aerialPoints");

    function toggleVRInputs() {
        const isChecked = vrWalkthroughCheckbox.checked;
        groundPointsInput.disabled = !isChecked;
        aerialPointsInput.disabled = !isChecked;

        if (!isChecked) {
            groundPointsInput.value = 0;
            aerialPointsInput.value = 0;
        }

        updateTotal(); // update when toggling VR option
    }

    // Dynamic event listeners for all inputs
    document.getElementById("area").addEventListener("input", updateTotal);
    document.getElementById("smartMap").addEventListener("change", updateTotal);
    document.getElementById("aerialVideo").addEventListener("change", updateTotal);
    document.getElementById("vrWalkthrough").addEventListener("change", toggleVRInputs);
    document.getElementById("groundPoints").addEventListener("input", updateTotal);
    document.getElementById("aerialPoints").addEventListener("input", updateTotal);

    toggleVRInputs(); // Initialize
});

// Topo Survey Pricing Logic
function calculateTopoCost(area) {
    if (area <= 8333.3333) {
        return 25000;
    } else if (area <= 30000) {
        return area * 3;
    } else if (area <= 70000) {
        return 90000 + (area - 30000) * 2.5;
    } else {
        return 190000 + (area - 70000) * 2;
    }
}

// Aerial Survey Pricing Logic
function calculateAerialCost(area) {
    if (area <= 50000) {
        return 24995;
    } else if (area <= 100000) {
        return 24995 + (area - 50000) * 0.40;
    } else if (area <= 150000) {
        return 44995 + (area - 100000) * 0.35;
    } else if (area <= 200000) {
        return 62495 + (area - 150000) * 0.30;
    } else {
        return 74995 + (area - 200000) * 0.20;
    }
}

function updateTotal() {
    const area = parseFloat(document.getElementById('area').value);

    if (isNaN(area) || area <= 0) {
        document.getElementById('topoCost').innerText = '₹0.00';
        document.getElementById('aerialCost').innerText = '₹0.00';
        document.getElementById('totalCost').innerText = '₹0.00';
        return;
    }

    const topoCost = calculateTopoCost(area);
    const aerialCost = calculateAerialCost(area);
    let total = topoCost + aerialCost;

    document.getElementById('topoCost').innerText = `₹${topoCost.toLocaleString()}`;
    document.getElementById('aerialCost').innerText = `₹${aerialCost.toLocaleString()}`;

    const smartMapCost = parseFloat(document.getElementById('smartMap').value) || 0;
    total += smartMapCost;

    if (document.getElementById('aerialVideo').checked) {
        total += 15000;
    }

    if (document.getElementById('vrWalkthrough').checked) {
        total += 15000;

        const groundPoints = parseInt(document.getElementById('groundPoints').value) || 0;
        total += groundPoints * 500;

        const aerialPoints = parseInt(document.getElementById('aerialPoints').value) || 0;
        total += aerialPoints * 3000;
    }

    document.getElementById('totalCost').innerText = `₹${total.toLocaleString()}`;
}

function resetForm() {
    document.getElementById('area').value = '';
    document.getElementById('topoCost').innerText = '₹0.00';
    document.getElementById('aerialCost').innerText = '₹0.00';
    document.getElementById('totalCost').innerText = '₹0.00';

    document.getElementById('smartMap').value = '0';
    document.getElementById('aerialVideo').checked = false;
    document.getElementById('vrWalkthrough').checked = false;
    document.getElementById('groundPoints').value = '0';
    document.getElementById('aerialPoints').value = '0';

    document.getElementById('groundPoints').disabled = true;
    document.getElementById('aerialPoints').disabled = true;
}
