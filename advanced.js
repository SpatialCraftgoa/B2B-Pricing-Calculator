
    document.addEventListener("DOMContentLoaded", function () {
        const topoCheckbox = document.getElementById("topoCheckbox");
        const aerialCheckbox = document.getElementById("aerialCheckbox");
        const areaInput = document.getElementById("area");

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

            updateTotal();
        }

        function toggleAreaInput() {
            const isAnySurveySelected = topoCheckbox.checked || aerialCheckbox.checked;
            areaInput.disabled = !isAnySurveySelected;

            if (!isAnySurveySelected) {
                areaInput.value = '';
            }

            updateTotal();
        }

        // Bind event listeners
        topoCheckbox.addEventListener("change", toggleAreaInput);
        aerialCheckbox.addEventListener("change", toggleAreaInput);
        areaInput.addEventListener("input", updateTotal);
        document.getElementById("smartMap").addEventListener("change", updateTotal);
        document.getElementById("aerialVideo").addEventListener("change", updateTotal);
        document.getElementById("vrWalkthrough").addEventListener("change", toggleVRInputs);
        groundPointsInput.addEventListener("input", updateTotal);
        aerialPointsInput.addEventListener("input", updateTotal);

        // Initial state
        toggleAreaInput();
        toggleVRInputs();
    });

    function calculateTopoCost(area) {
        if (area <= 8333.3333) return 25000;
        if (area <= 30000) return area * 3;
        if (area <= 70000) return 90000 + (area - 30000) * 2.5;
        return 190000 + (area - 70000) * 2;
    }

    function calculateAerialCost(area) {
        if (area <= 50000) return 24995;
        if (area <= 100000) return 24995 + (area - 50000) * 0.40;
        if (area <= 150000) return 44995 + (area - 100000) * 0.35;
        if (area <= 200000) return 62495 + (area - 150000) * 0.30;
        return 74995 + (area - 200000) * 0.20;
    }

    function updateTotal() {
        const area = parseFloat(document.getElementById("area").value);
        const isTopoSelected = document.getElementById("topoCheckbox").checked;
        const isAerialSelected = document.getElementById("aerialCheckbox").checked;

        let topoCost = 0;
        let aerialCost = 0;
        let total = 0;

        if (!isNaN(area) && area > 0) {
            if (isTopoSelected) {
                topoCost = calculateTopoCost(area);
                document.getElementById("topoCost").innerText = `₹${topoCost.toLocaleString()}`;
                document.getElementById("topoCostRow").style.display = "block";
            } else {
                document.getElementById("topoCostRow").style.display = "none";
            }

            if (isAerialSelected) {
                aerialCost = calculateAerialCost(area);
                document.getElementById("aerialCost").innerText = `₹${aerialCost.toLocaleString()}`;
                document.getElementById("aerialCostRow").style.display = "block";
            } else {
                document.getElementById("aerialCostRow").style.display = "none";
            }

            total += topoCost + aerialCost;
        } else {
            document.getElementById("topoCost").innerText = "₹0.00";
            document.getElementById("aerialCost").innerText = "₹0.00";
        }

        const smartMapCost = parseFloat(document.getElementById("smartMap").value) || 0;
        total += smartMapCost;

        if (document.getElementById("aerialVideo").checked) {
            total += 15000;
        }

        if (document.getElementById("vrWalkthrough").checked) {
            total += 15000;
            total += (parseInt(document.getElementById("groundPoints").value) || 0) * 500;
            total += (parseInt(document.getElementById("aerialPoints").value) || 0) * 3000;
        }

        document.getElementById("totalCost").innerText = `₹${total.toLocaleString()}`;
    }

    function resetForm() {
        document.getElementById("topoCheckbox").checked = false;
        document.getElementById("aerialCheckbox").checked = false;
        document.getElementById("area").value = '';
        document.getElementById("area").disabled = true;
        document.getElementById("topoCost").innerText = "₹0.00";
        document.getElementById("aerialCost").innerText = "₹0.00";
        document.getElementById("totalCost").innerText = "₹0.00";

        document.getElementById("smartMap").value = "0";
        document.getElementById("aerialVideo").checked = false;
        document.getElementById("vrWalkthrough").checked = false;
        document.getElementById("groundPoints").value = "0";
        document.getElementById("aerialPoints").value = "0";
        document.getElementById("groundPoints").disabled = true;
        document.getElementById("aerialPoints").disabled = true;}