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
    }

    vrWalkthroughCheckbox.addEventListener("change", toggleVRInputs);
    toggleVRInputs(); // Ensure the correct state on page load
});

//Topo Survey Pricing Logic
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
        alert("Please enter a valid area greater than zero.");
        return;
    }

    const topoCost = calculateTopoCost(area);
    const aerialCost = calculateAerialCost(area);
    let total = topoCost + aerialCost;
    // Update the displayed cost
    document.getElementById('topoCost').innerText = `₹${topoCost.toLocaleString()}`;
    document.getElementById('aerialCost').innerText = `₹${aerialCost.toLocaleString()}`;

    // Add Smart Interactive Digital Map cost
    const smartMapCost = parseFloat(document.getElementById('smartMap').value) || 0;
    total += smartMapCost;

    // Check if aerial video add-on is selected
    if (document.getElementById('aerialVideo').checked) {
        total += 15000;
    }

    // Check if VR Walkthrough is selected
    if (document.getElementById('vrWalkthrough').checked) {
        total += 15000;

        // Add additional 360° ground points cost
        const groundPoints = parseInt(document.getElementById('groundPoints').value) || 0;
        total += groundPoints * 500;

        // Add additional 360° aerial points cost
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
