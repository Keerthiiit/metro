

let scale = 1;
let isDragging = false;
let startX, startY;
let offsetX = 0;
let offsetY = 0;
const dragSpeed = 0.4; // Adjust for drag sensitivity
const xBoundary = 2000; // Maximum allowed offset in the X direction
const yBoundary = 2000; // Maximum allowed offset in the Y direction
const minScale = 1; // Prevent zooming out below this scale
const map = document.getElementById('map');

// Center point for zooming
let centerX = 0; // Initialize with default center, can be updated by user
let centerY = 0;

map.style.transition = "transform 0.2s ease-out"; // Smooth transitions

// Function to set custom zoom center
function setZoomCenter(x, y) {
    centerX = x;
    centerY = y;
}

// Zoom functions with center focus adjustment
function zoomIn() {
    const prevScale = scale;
    scale *= 1.2;
    updateOffsetForZoom(prevScale);
    updateMapTransform();
}

function zoomOut() {
    if (scale > minScale) {
        const prevScale = scale;
        scale /= 1.2;
        updateOffsetForZoom(prevScale);
        updateMapTransform();
    }
}

// Update offset to keep zoom center in focus
function updateOffsetForZoom(prevScale) {
    offsetX -= (centerX * (scale - prevScale));
    offsetY -= (centerY * (scale - prevScale));

    // Apply boundaries to keep within limits
    offsetX = Math.max(-xBoundary, Math.min(xBoundary, offsetX));
    offsetY = Math.max(-yBoundary, Math.min(yBoundary, offsetY));
}

// Function to apply transform for scaling and positioning
function updateMapTransform() {
    map.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
}

// Event listeners for zoom buttons
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);

// Function to start dragging
function startDragging(e) {
    if (e.button === 0) { // Left mouse button
        isDragging = true;
        map.style.transition = ""; // Disable transition during dragging
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    }
}

// Function to stop dragging
function stopDragging() {
    isDragging = false;
    map.style.transition = "transform 0.2s ease-out"; // Re-enable transition
}

// Drag function with boundary control
function dragMap(e) {
    if (isDragging) {
        const deltaX = (e.clientX - startX) * dragSpeed;
        const deltaY = (e.clientY - startY) * dragSpeed;

        // Update offsets with boundary limits
        offsetX = Math.max(-xBoundary, Math.min(xBoundary, offsetX + deltaX));
        offsetY = Math.max(-yBoundary, Math.min(yBoundary, offsetY + deltaY));

        // Update startX and startY for smooth continuous dragging
        startX = e.clientX;
        startY = e.clientY;

        updateMapTransform();
    }
}

// Initialize dragging listeners
map.addEventListener('mousedown', startDragging);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('mousemove', dragMap);

// Example usage: Set custom center point

setZoomCenter(80, 1); // Change coordinates to set your desired zoom center












let selectedFrom = null;
let selectedTo = null;
let selectedFromId = null; // Variable to store the "From" station ID
let selectedToId = null; // Variable to store the "To" station ID

// Function to show the "From" flag
function showFromFlag(stationId) {
    hideAllFlags(); // Hide all flags before showing the selected one
    const fromFlag = document.querySelector(`#${stationId}fromFlag`);
    if (fromFlag) {
        fromFlag.parentNode.style.display = 'block'; // Show the specific "From" flag
    }
}

// Function to show the "To" flag
function showToFlag(stationId) {
    // Hide the previous "To" flag if it's already set
    if (selectedTo !== null) {
        const previousToFlag = document.querySelector(`#${selectedToId}toFlag`);
        if (previousToFlag) {
            previousToFlag.parentNode.style.display = 'none'; // Hide the previous "To" flag
        }
    }

    // Set the new "To" flag
    const toFlag = document.querySelector(`#${stationId}toFlag`);
    if (toFlag) {
        toFlag.parentNode.style.display = 'block'; // Show the new "To" flag
    }

    // Update the selected "To" station to the newly clicked station
    selectedTo = stationId;
    selectedToId = stationId; // Save the new "To" station ID
}

// Function to hide all flags
function hideAllFlags() {
    document.querySelectorAll('.fromFlags > foreignObject, .toFlags > foreignObject').forEach(flag => {
        flag.style.display = 'none'; // Hide all flags
    });
}

// Function to reset "From" selection
function resetFromSelection() {
    const fromFlag = document.querySelector(`#${selectedFromId}fromFlag`);
    if (fromFlag) {
        fromFlag.parentNode.style.display = 'none'; // Hide the "From" flag
    }
    selectedFrom = null; // Reset the selected "From" station
    selectedFromId = null; // Reset the saved "From" station ID
    hideAllFlags(); // Ensure all flags are hidden
}

// Function to reset "To" selection
function resetToSelection() {
    const toFlag = document.querySelector(`#${selectedToId}toFlag`);
    if (toFlag) {
        toFlag.parentNode.style.display = 'none'; // Hide the "To" flag
    }
    selectedTo = null; // Reset the selected "To" station
    selectedToId = null; // Reset the saved "To" station ID
}

function getStationNameById(stationId) {
    for (const line of lines) {
        const station = line.stations.find(s => s.id === stationId);
        if (station) {
            return station.name; // Return the station name if found
        }
    }
    return null; // Return null if not found
}

document.addEventListener("DOMContentLoaded", function () {
    // Initially hide all flags
    hideAllFlags();

    const stations = document.querySelectorAll('.station, .interchange, .transferStation');
    stations.forEach(station => {
        station.addEventListener('click', () => {
            const stationId = station.parentNode.id; // Get the ID of the clicked station
            const stationName = getStationNameById(stationId); // Retrieve station name by ID

            // Logic for handling "From" selection
            if (selectedFrom === null) {
                // No "From" selected, set current station as "From"
                selectedFrom = stationName; // Set the new "From" station name
                selectedFromId = stationId; // Save the "From" station ID for future use
                document.getElementById("startSearch").value = stationName; // Update "From" input with station name
                showFromFlag(stationId); // Show the "From" flag
            } else if (selectedFrom === stationName) {
                // Clicking the same "From" station, reset the selection
                resetFromSelection();
            } else if (selectedTo === null) {
                // If a "From" is selected and no "To" selected, set current station as "To"
                selectedTo = stationName; // Set the new "To" station
                selectedToId = stationId; // Save the "To" station ID for future use
                document.getElementById("endSearch").value = stationName; // Update "To" input with station name
                showToFlag(stationId); // Show the "To" flag
            } else if (selectedTo === stationName) {
                // Clicking the same "To" station, reset the selection
                resetToSelection();
            } else {
                // If both are selected and a different station is clicked
                resetToSelection(); // Hide the previous "To" flag
                selectedTo = stationName; // Set the new "To" station
                selectedToId = stationId; // Update the "To" station ID for future use
                document.getElementById("endSearch").value = stationName; // Update "To" input with station name
                showToFlag(stationId); // Show the new "To" flag
            }
        });
    });

    populateDropdowns(); // Initialize dropdown with lines on page load
});

// Function to interchange stations
function interchangeStations() {
    // Get references to the input fields
    const startSearch = document.getElementById('startSearch');
    const endSearch = document.getElementById('endSearch');

    // Temporarily store the values and IDs for swapping
    const tempStationName = startSearch.value;  // Name of the "From" station
    const tempStationId = selectedFromId;        // ID of the "From" station

    // Swap the values
    startSearch.value = endSearch.value;          // Set "From" to the current "To" value
    endSearch.value = tempStationName;            // Set "To" to the original "From" value

    // Update the selected variables
    const tempSelectedFrom = selectedFrom;        // Store the original "From" selection
    const tempSelectedTo = selectedTo;            // Store the original "To" selection

    selectedFrom = selectedTo;                    // Update "From" to the current "To"
    selectedTo = tempSelectedFrom;                // Update "To" to the original "From"

    // Update IDs as well
    const tempSelectedFromId = selectedFromId;    // Store the original "From" ID
    selectedFromId = selectedToId;                // Update "From" ID to the current "To" ID
    selectedToId = tempSelectedFromId;            // Update "To" ID to the original "From" ID

    // Hide all flags and show the updated flags
    hideAllFlags();                                // Hide all flags first
    showFromFlag(selectedFromId);                  // Show the flag for the new "From"
    showToFlag(selectedToId);                      // Show the flag for the new "To"
}

// Event listener for the interchange button
document.getElementById('interchangeBtn').addEventListener('click', interchangeStations);


// Function to populate the dropdowns with train lines for both From and To
function populateDropdowns() {
    populateDropdown('startOptions', 'startSearch', 'From');
    populateDropdown('endOptions', 'endSearch', 'To');
}

// Function to populate a specific dropdown
function populateDropdown(dropdownId, searchInputId, label) {
    const dropdownContainer = document.getElementById(dropdownId);
    dropdownContainer.innerHTML = ''; // Clear previous options

    lines.forEach((line, index) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = `${line.color} line-item`;
        lineDiv.textContent = line.name;
        lineDiv.dataset.index = index;
        lineDiv.onclick = (event) => {
            event.stopPropagation(); // Prevent closing the dropdown when clicking on an option
            openPopup(line.stations, line.name, line.color, label);
        };
        dropdownContainer.appendChild(lineDiv);
    });
}


// Initialize dropdowns on page load
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns(); // Call the refactored function to populate both dropdowns
});

// Show dropdown when input is focused
function showDropdown() {
    document.getElementById("startOptions").classList.add("show");
}




// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownFrom = document.getElementById("startOptions");
    const searchInputFrom = document.getElementById("startSearch");
    const popupFrom = document.getElementById("dataPopup");

    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // Check if the click was outside the From dropdown, popup, and the search input
    if (!dropdownFrom.contains(event.target) && !popupFrom.contains(event.target) && event.target !== searchInputFrom) {
        dropdownFrom.classList.remove("show"); // Close From dropdown
        closePopup(); // Close From popup
    }

    // Check if the click was outside the To dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo) {
        dropdownTo.classList.remove("show"); // Close To dropdown
        closeToPopup(); // Close To popup
    }
});


// Close popup
function closePopup() {
    document.getElementById("dataPopup").style.display = "none";
}

function closeToPopup() {
    document.getElementById("dataPopup").style.display = "none";
}

// Function to show the "To" dropdown
function showToDropdown() {
    document.getElementById("endOptions").classList.add("show");
}


// Close "To" popup
function closeToPopup() {
    const popup = document.getElementById("dataPopupTo");
    if (popup) {
        popup.style.display = "none"; // Hide the popup
    }
}


// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // Check if the click was outside the dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo) {
        dropdownTo.classList.remove("show"); // Close "To" dropdown
        closeToPopup(); // Close "To" popup
    }
});




// Function to open the station popup for both From and To


// Close popup
function closePopup() {
    document.getElementById("dataPopup").style.display = "none";
    document.getElementById("dataPopupTo").style.display = "none";
}

// Close popup
function closePopup() {
    const popup = document.getElementById("dataPopup");
    if (popup) {
        popup.style.display = "none"; // Hide the From popup
    }
    const popupTo = document.getElementById("dataPopupTo");
    if (popupTo) {
        popupTo.style.display = "none"; // Hide the To popup
    }
}

// Close dropdown and popup when clicking outside
document.addEventListener("click", function (event) {
    const dropdownFrom = document.getElementById("startOptions");
    const searchInputFrom = document.getElementById("startSearch");
    const popupFrom = document.getElementById("dataPopup");

    const dropdownTo = document.getElementById("endOptions");
    const searchInputTo = document.getElementById("endSearch");
    const popupTo = document.getElementById("dataPopupTo");

    // New container for the search popup
    const searchPopupContainer = document.querySelector('.search-popup-container');

    // Check if the click was outside the From dropdown, popup, and the search input
    if (!dropdownFrom.contains(event.target) && !popupFrom.contains(event.target) && event.target !== searchInputFrom && !searchPopupContainer.contains(event.target)) {
        dropdownFrom.classList.remove("show"); // Close From dropdown
        closePopup(); // Close From popup
    }

    // Check if the click was outside the To dropdown, popup, and the search input
    if (!dropdownTo.contains(event.target) && !popupTo.contains(event.target) && event.target !== searchInputTo && !searchPopupContainer.contains(event.target)) {
        dropdownTo.classList.remove("show"); // Close To dropdown
        closePopup(); // Close To popup
    }
});



// Function to reset all data, including flags, date, and time
function resetAll() {
    // Clear input fields for "From" and "To"
    document.getElementById("startSearch").value = '';
    document.getElementById("endSearch").value = '';

    // Clear date and time fields
    document.getElementById("journey-date").value = '';
    document.getElementById("journey-time").value = '';

    // Reset selected station variables
    selectedFrom = null;
    selectedFromId = null;
    selectedTo = null;
    selectedToId = null;

    // Clear the route and fare table if it exists
    const routeTable = document.getElementById("routeTable"); // Assuming table ID is 'routeTable'
    if (routeTable) {
        routeTable.innerHTML = ''; // Clear table content
    }

    hideAllFlags();

    // Close any open dropdowns and popups
    closePopup();
    document.getElementById("startOptions").classList.remove("show");
    document.getElementById("endOptions").classList.remove("show");


}


// Attach the reset function to the Reset button
document.querySelector(".reset-button").addEventListener("click", resetAll);


function filterStations(type) {
    const searchInput = document.getElementById(`${type}Search`);

    // Detect when the "Backspace" key is pressed
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
            searchInput.value = ''; // Clear the entire input field
            event.preventDefault(); // Prevent default backspace behavior
            filterStations(type); // Update the dropdown to show all options
        }
    });

    const filter = searchInput.value.toUpperCase();
    const options = document.querySelectorAll(`#${type}Options div`);

    options.forEach(option => {
        const textValue = option.textContent || option.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option.style.display = ''; // Show option if it matches the filter
        } else {
            option.style.display = 'none'; // Hide option if it doesn't match the filter
        }
    });
}

function filterpopupStations() {
    const searchInput = document.getElementById('popupInput'); // Get the search input
    const filter = searchInput.value.toUpperCase(); // Get the filter text in uppercase
    const options = document.querySelectorAll('#popupStationList li'); // Get all list items

    // Filter the list based on the input value
    options.forEach(option => {
        const textValue = option.textContent || option.innerText; // Get text content
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            option.style.display = ''; // Show matching option
        } else {
            option.style.display = 'none'; // Hide non-matching option
        }
    });
}

// Close popup and reset input field when clicking outside
document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("dataPopup");
    const searchInput = document.getElementById("popupInput");

    // Check if the click was outside the dropdown and input field
    if (!dropdown.contains(event.target) && event.target !== searchInput) {
        closePopup(); // Close the popup
        searchInput.value = ''; // Clear the input field
        filterpopupStations(); // Reset filtering
    }
});

document.getElementById('popupInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action on Enter key
    }
});

function openPopup(stations, lineName, lineColor, label) {
    const popup = document.getElementById(label === 'From' ? "dataPopup" : "dataPopupTo");
    const popupList = document.getElementById(label === 'From' ? "popupStationList" : "popupStationListTo");

    // Set popup header color based on line color
    popup.className = `data-popup ${lineColor}`;
    popupList.innerHTML = ''; // Clear previous stations

    // Filter out the selected "From" station in the "To" list
    const filteredStations = (label === 'To' && selectedFromId !== null)
        ? stations.filter(station => station.id !== selectedFromId)
        : stations;

    filteredStations.forEach((station, index) => {
        const stationItem = document.createElement("li");
        stationItem.className = `${lineColor} station-item`;
        stationItem.innerHTML = `
            <div class="sub-result-left"><i class="circle">${index + 1}</i></div>
            <div class="sub-result-right">
                <div class="sub-result-name">${station.name}</div>
            </div>`;

        // Add click event to set the "From" or "To" field and close popup
        stationItem.onclick = () => {
            if (label === 'From') {
                document.getElementById("startSearch").value = station.name; // Set the "From" field
                showFromFlag(station.id); // Show the "From" flag on the map
                selectedFrom = station.name; // Update the selected "From" station
                selectedFromId = station.id; // Save the "From" station ID
            } else {
                document.getElementById("endSearch").value = station.name; // Set the "To" field
                showToFlag(station.id); // Show the "To" flag on the map
                selectedTo = station.name; // Update the selected "To" station
                selectedToId = station.id; // Save the "To" station ID
            }
            closePopup(); // Close popup for both
            document.getElementById(label === 'From' ? "startOptions" : "endOptions").classList.remove("show"); // Close dropdown
        };

        popupList.appendChild(stationItem);
    });

    popup.style.display = "block"; // Show the popup
}




const lines = [
    {
        name: "Blue Line",
        color: "blue",
        stations: [
            { name: 'Vasant Kunj', 'id': 'VTJ' },
            { name: 'Sarfarazganj', 'id': 'SAJ' },
            { name: 'Musabagh', 'id': 'MBH' },
            { name: 'Balaganj', 'id': 'BGJ' },
            { name: 'Thakurganj', 'id': 'TRJ' },
            { name: 'Nawajganj', 'id': 'NJJ' },
            { name: 'Medical College', 'id': 'MCE' },
            { name: 'City Rly', 'id': 'CYY' },
            { name: 'Pandey Ganj', 'id': 'PYJ' },
            { name: 'Aminabad', 'id': 'AAD' },
            { name: 'Gautam Buddha Marg', 'id': 'GDG' },

        ]
    },
    {
        name: "Red Line",
        color: "red",
        stations: [
            { name: 'Munshi Pulia', 'id': 'MIA' },
            { name: 'Indra Nagar', 'id': 'INR' },
            { name: 'Lekhraj Market', 'id': 'LJT' },
            { name: 'Mahanagar', 'id': 'MNR' },
            { name: 'Vishwavidyalaya', 'id': 'VIA' },
            { name: 'IT College', 'id': 'ILE' },
            { name: 'Badshah Nagar', 'id': 'BHR' },
            { name: 'RS Mishra Nagar', 'id': 'RRR' },
            { name: 'KD Singh Babu Stadium', 'id': 'KBM' },
            { name: 'HazratGanj', 'id': 'HTJ' },
            { name: 'Sachivalaya', 'id': 'SVA' },
            { name: 'HussainGanj', 'id': 'HIJ' },
            { name: 'Charbagh', 'id': 'CBH' },
            { name: 'Durgapuri', 'id': 'DAI' },
            { name: 'Mawaiya', 'id': 'MAA' },
            { name: 'Alambagh Bus Stand', 'id': 'ABD' },
            { name: 'Alambagh', 'id': 'ABH' },
            { name: 'Singar Nagar', 'id': 'SRR' },
            { name: 'Krishna Nagar', 'id': 'KAR' },
            { name: 'Transport Nagar', 'id': 'TRR' },
            { name: 'Amausi', 'id': 'AUI' },
            { name: 'Chowdhary Charan Singh', 'id': 'CHH' },

        ]
    },

];


const connections = {
    "VTJ": ['SAJ'],
    "SAJ": ['VTJ', 'MBH'],
    "MBH": ['SAJ', 'BGJ'],
    "BGJ": ['MBH', 'TRJ'],
    "TRJ": ['BGJ', 'NJJ'],
    "NJJ": ['TRJ', 'MCE'],
    "MCE": ['NJJ', 'CYY'],
    "CYY": ['MCE', 'PYJ'],
    "PYJ": ['CYY', 'AAD'],
    "AAD": ['PYJ', 'GDG'],
    "GDG": ['AAD'],
    "MIA": ['INR'],
    "INR": ['MIA', 'LJT'],
    "LJT": ['INR', 'MNR'],
    "MNR": ['LJT', 'VIA'],
    "VIA": ['MNR', 'ILE'],
    "ILE": ['VIA', 'BHR'],
    "BHR": ['ILE', 'RRR'],
    "RRR": ['BHR', 'KBM'],
    "KBM": ['RRR', 'HTJ'],
    "HTJ": ['KBM', 'SVA'],
    "SVA": ['HTJ', 'HIJ'],
    "HIJ": ['SVA', 'CBH'],
    "CBH": ['HIJ', 'DAI'],
    "DAI": ['CBH', 'MAA'],
    "MAA": ['DAI', 'ABD'],
    "ABD": ['MAA', 'ABH'],
    "ABH": ['ABD', 'SRR'],
    "SRR": ['ABH', 'KAR'],
    "KAR": ['SRR', 'TRR'],
    "TRR": ['KAR', 'AUI'],
    "AUI": ['TRR', 'CHH'],
    "CHH": ['AUI'],
};

// Define stations with IDs
const stations = [
    { name: 'Vasant Kunj', 'id': 'VTJ' },
    { name: 'Sarfarazganj', 'id': 'SAJ' },
    { name: 'Musabagh', 'id': 'MBH' },
    { name: 'Balaganj', 'id': 'BGJ' },
    { name: 'Thakurganj', 'id': 'TRJ' },
    { name: 'Nawajganj', 'id': 'NJJ' },
    { name: 'Medical College', 'id': 'MCE' },
    { name: 'City Rly', 'id': 'CYY' },
    { name: 'Pandey Ganj', 'id': 'PYJ' },
    { name: 'Aminabad', 'id': 'AAD' },
    { name: 'Gautam Buddha Marg', 'id': 'GDG' },

    { name: 'Munshi Pulia', 'id': 'MIA' },
    { name: 'Indra Nagar', 'id': 'INR' },
    { name: 'Lekhraj Market', 'id': 'LJT' },
    { name: 'Mahanagar', 'id': 'MNR' },
    { name: 'Vishwavidyalaya', 'id': 'VIA' },
    { name: 'IT College', 'id': 'ILE' },
    { name: 'Badshah Nagar', 'id': 'BHR' },
    { name: 'RS Mishra Nagar', 'id': 'RRR' },
    { name: 'KD Singh Babu Stadium', 'id': 'KBM' },
    { name: 'HazratGanj', 'id': 'HTJ' },
    { name: 'Sachivalaya', 'id': 'SVA' },
    { name: 'HussainGanj', 'id': 'HIJ' },
    { name: 'Charbagh', 'id': 'CBH' },
    { name: 'Durgapuri', 'id': 'DAI' },
    { name: 'Mawaiya', 'id': 'MAA' },
    { name: 'Alambagh Bus Stand', 'id': 'ABD' },
    { name: 'Alambagh', 'id': 'ABH' },
    { name: 'Singar Nagar', 'id': 'SRR' },
    { name: 'Krishna Nagar', 'id': 'KAR' },
    { name: 'Transport Nagar', 'id': 'TRR' },
    { name: 'Amausi', 'id': 'AUI' },
    { name: 'Chowdhary Charan Singh', 'id': 'CHH' },


];

// Find shortest path using Breadth-First Search
function findShortestPath(start, end) {
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let station = path[path.length - 1];

        if (station === end) return path.length - 1;

        if (!visited.has(station)) {
            visited.add(station);
            let neighbors = connections[station] || [];
            neighbors.forEach(neighbor => {
                let newPath = [...path, neighbor];
                queue.push(newPath);
            });
        }
    }
    return -1;
}




document.getElementById('showRouteFare').addEventListener('click', function () {
    // Get selected station values
    const selectedFrom = document.getElementById('startSearch').value;
    const selectedTo = document.getElementById('endSearch').value;

    const selectedFromId = getStationId(selectedFrom);
    const selectedToId = getStationId(selectedTo);

    // Validate selected stations
    if (!selectedFromId || !selectedToId) {
        alert('Please select both start and end stations.');
        return;
    }

    // Get journey date and time values
    const journeyDate = document.getElementById('journey-date').value;
    const journeyTime = document.getElementById('journey-time').value;

    // Validate journey date and time
    if (!journeyDate || !journeyTime) {
        alert('Please select both journey date and time.');
        return;
    }

    // If all validations pass, calculate fare
    const shortestPath = findShortestPath(selectedFromId, selectedToId);
    if (shortestPath === -1) {
        alert('No route found between the selected stations.');
        return;
    }

    const fare = shortestPath * 10; // Example fare calculation
    const numberOfStations = shortestPath; // Assuming the number of stations is the same as the path length

    // Populate fare display
    document.getElementById('fromResult').textContent = selectedFrom;
    document.getElementById('toResult').textContent = selectedTo;
    document.getElementById('dateResult').textContent = journeyDate;
    document.getElementById('timeResult').textContent = journeyTime;
    document.getElementById('fareResult').textContent = `Rs ${fare}`;
    document.getElementById('stationsResult').textContent = numberOfStations;

    // Show the fare display
    document.getElementById('fareDisplay').style.display = 'block';
});

// Function to close the fare display
function closeFareDisplay() {
    document.getElementById('fareDisplay').style.display = 'none';
}



// Function to get station ID based on station name
function getStationId(stationName) {
    // Assuming stations is an array of objects with id and name properties
    const station = stations.find(s => s.name === stationName);
    return station ? station.id : null;
}

