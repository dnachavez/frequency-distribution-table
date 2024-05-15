// Function to handle input changes and update the table accordingly
function handleInputChange() {
    const table = document.getElementById('fdtTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const classIntervalInput = rows[i].cells[0].getElementsByTagName('input')[0];
        const frequencyInput = rows[i].cells[1].getElementsByTagName('input')[0];

        // Check if the last row is filled and add a new row if so
        if (classIntervalInput.value && frequencyInput.value && !isNaN(frequencyInput.value)) {
            if (i === rows.length - 1) {
                addRow(); // Add a new row if the last row has input
            }
        }
    }

    updateTable(); // Update the table with new data
}

// Function to add a new row to the table
function addRow() {
    const table = document.getElementById('fdtTable').getElementsByTagName('tbody')[0]; // Get the tbody element of the table
    const newRow = table.insertRow(); // Insert a new row

    // Create and append cells to the new row
    const classIntervalCell = newRow.insertCell(0);
    const frequencyCell = newRow.insertCell(1);
    const midpointCell = newRow.insertCell(2);
    const fxCell = newRow.insertCell(3);
    const dCell = newRow.insertCell(4);
    const fdCell = newRow.insertCell(5);
    const lcbCell = newRow.insertCell(6);
    const ucbCell = newRow.insertCell(7);
    const cmCell = newRow.insertCell(8);
    const cfLessCell = newRow.insertCell(9);
    const cfGreaterCell = newRow.insertCell(10);

    // Create and append input elements for class interval and frequency
    const classIntervalInput = document.createElement('input');
    classIntervalInput.type = 'text';
    classIntervalInput.className = 'input-field';
    classIntervalInput.oninput = handleInputChange;
    classIntervalCell.appendChild(classIntervalInput);

    const frequencyInput = document.createElement('input');
    frequencyInput.type = 'number';
    frequencyInput.className = 'input-field';
    frequencyInput.oninput = handleInputChange;
    frequencyCell.appendChild(frequencyInput);
}

// Function to update the table with calculated values
function updateTable() {
    const table = document.getElementById('fdtTable'); // Get the table element
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'); // Get all rows in the tbody

    let cumulativeFrequency = 0; // Initialize cumulative frequency
    const classIntervals = [];
    const frequencies = [];
    const midpoints = [];
    let maxFrequency = 0; // Initialize maximum frequency
    let assumedMean = 0; // Initialize assumed mean

    // Loop through each row to get class intervals and frequencies
    for (let i = 0; i < rows.length - 1; i++) {
        const classInterval = rows[i].cells[0].getElementsByTagName('input')[0].value;
        const frequency = parseInt(rows[i].cells[1].getElementsByTagName('input')[0].value);

        if (classInterval && !isNaN(frequency)) {
            classIntervals.push(classInterval); // Add class interval to array
            frequencies.push(frequency); // Add frequency to array
        }
    }

    // Loop through each class interval to calculate the required values and determine the assumed mean
    for (let i = 0; i < classIntervals.length; i++) {
        const classInterval = classIntervals[i];
        const frequency = frequencies[i];

        // Split class interval into lower and upper limits
        const [lowerLimit, upperLimit] = classInterval.split('-').map(Number);
        if (isNaN(lowerLimit) || isNaN(upperLimit)) {
            continue; // Skip invalid class intervals
        }

        const midpoint = (lowerLimit + upperLimit) / 2; // Calculate midpoint
        midpoints.push(midpoint); // Add midpoint to array

        // Update the assumed mean if the current frequency is the highest
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            assumedMean = midpoint;
        }
    }

    // Loop through each class interval to calculate the required values
    for (let i = 0; i < classIntervals.length; i++) {
        const classInterval = classIntervals[i];
        const frequency = frequencies[i];

        // Split class interval into lower and upper limits
        const [lowerLimit, upperLimit] = classInterval.split('-').map(Number);
        if (isNaN(lowerLimit) || isNaN(upperLimit)) {
            continue; // Skip invalid class intervals
        }

        const midpoint = midpoints[i]; // Get the midpoint
        const fx = frequency * midpoint; // Calculate fx
        const d = midpoint - assumedMean; // Calculate deviation from assumed mean
        const fd = frequency * d; // Calculate fd
        const lcb = (lowerLimit + (lowerLimit - 1)) / 2; // Calculate lower class boundary
        const ucb = (upperLimit + (upperLimit + 1)) / 2; // Calculate upper class boundary
        const cm = (lowerLimit + upperLimit) / 2; // Calculate class mark

        cumulativeFrequency += frequency; // Update cumulative frequency
        const cfLess = cumulativeFrequency; // Calculate CF <
        const cfGreater = frequencies.slice(i + 1).reduce((a, b) => a + b, 0); // Calculate CF >

        // Update table cells with calculated values
        rows[i].cells[2].innerText = midpoint.toFixed(1);
        rows[i].cells[3].innerText = fx.toFixed(1);
        rows[i].cells[4].innerText = d.toFixed(1);
        rows[i].cells[5].innerText = fd.toFixed(1);
        rows[i].cells[6].innerText = lcb.toFixed(1);
        rows[i].cells[7].innerText = ucb.toFixed(1);
        rows[i].cells[8].innerText = cm.toFixed(1);
        rows[i].cells[9].innerText = cfLess;
        rows[i].cells[10].innerText = cfGreater;
    }

    // Calculate descending cumulative frequency (CF >) correctly
    let descendingCumulativeFrequency = 0;
    for (let i = frequencies.length - 1; i >= 0; i--) {
        descendingCumulativeFrequency += frequencies[i];
        rows[i].cells[10].innerText = descendingCumulativeFrequency;
    }
}

// Initialize the table with one empty row
addRow();
