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

function calculateCosts() {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const topoCost = 25000;  // Static cost for topographic survey
    const aerialCost = Math.ceil(area * 4.5);  // Calculation for aerial survey cost

    document.getElementById('topoCost').innerText = `₹${topoCost.toLocaleString()}`;
    document.getElementById('aerialCost').innerText = `₹${aerialCost.toLocaleString()}`;

    document.getElementById('totalCost').innerText = `₹${(topoCost + aerialCost).toLocaleString()}`;
}

function updateTotal() {
    const baseTopoCost = 25000;
    const area = parseFloat(document.getElementById('area').value) || 0;
    const aerialCost = Math.ceil(area * 4.5);  

    let total = baseTopoCost + aerialCost;

    // Add Smart Interactive Digital Map cost
    const smartMapCost = parseFloat(document.getElementById('smartMap').value) || 0;
    if (smartMapCost) total += smartMapCost;

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
