// NEUROGLOVE - GPS Tracking Module

document.addEventListener('DOMContentLoaded', function() {
    initMapTracking();
});

// Global variables for current location simulation
let currentLocationIndex = 0;
const locationPath = [
    {x: 300, y: 200, name: "Home", inSafeZone: true},
    {x: 320, y: 180, name: "Garden", inSafeZone: true},
    {x: 330, y: 210, name: "Street", inSafeZone: true},
    {x: 350, y: 190, name: "Neighbor's house", inSafeZone: true},
    {x: 380, y: 160, name: "Corner store", inSafeZone: false},
    {x: 400, y: 190, name: "Park", inSafeZone: false},
    {x: 370, y: 220, name: "Bus stop", inSafeZone: false},
    {x: 340, y: 240, name: "Library", inSafeZone: false},
    {x: 300, y: 230, name: "Community center", inSafeZone: true},
    {x: 280, y: 210, name: "Walking path", inSafeZone: true},
    {x: 290, y: 190, name: "Backyard", inSafeZone: true}
];

// Map settings
let mapZoom = 1.0;

/**
 * Initializes the GPS tracking functionality
 */
function initMapTracking() {
    // Get map elements
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const locationMarker = document.getElementById('location-marker');
    
    // Add event listeners to zoom buttons
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            mapZoom = Math.min(mapZoom + 0.1, 1.5);
            updateMapZoom();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            mapZoom = Math.max(mapZoom - 0.1, 0.7);
            updateMapZoom();
        });
    }
    
    // Start the location tracking simulation
    startLocationSimulation();
}

/**
 * Updates the map zoom level
 */
function updateMapZoom() {
    const map = document.getElementById('map');
    if (map) {
        map.style.transform = `scale(${mapZoom})`;
    }
}

/**
 * Starts the location tracking simulation
 */
function startLocationSimulation() {
    // Update location every 10 seconds
    setInterval(updateLocation, 10000);
    
    // Initialize with first location
    updateLocation();
}

/**
 * Updates the current location with the next point in the path
 */
function updateLocation() {
    // Move to next location point
    currentLocationIndex = (currentLocationIndex + 1) % locationPath.length;
    const currentLocation = locationPath[currentLocationIndex];
    
    // Update marker position
    updateMarkerPosition(currentLocation);
    
    // Update location trail
    updateLocationTrail(currentLocation);
    
    // Update location info
    updateLocationInfo(currentLocation);
    
    // Update timestamp
    updateTimestamp();
}

/**
 * Updates the marker position on the map
 * @param {Object} location - The current location object
 */
function updateMarkerPosition(location) {
    const locationMarker = document.getElementById('location-marker');
    if (locationMarker) {
        locationMarker.setAttribute('cx', location.x);
        locationMarker.setAttribute('cy', location.y);
    }
}

/**
 * Updates the location trail on the map
 * @param {Object} newLocation - The new location to add to the trail
 */
function updateLocationTrail(newLocation) {
    const locationTrail = document.getElementById('location-trail');
    if (!locationTrail) return;
    
    // Get current path data
    let currentPath = locationTrail.getAttribute('d');
    
    // Add new point to path
    currentPath += ` L${newLocation.x},${newLocation.y}`;
    
    // Only keep the last 5 points in the path to avoid clutter
    if (currentPath.split('L').length > 6) {
        const points = currentPath.split(' ');
        currentPath = points[0] + ' ' + points.slice(Math.max(points.length - 5, 1)).join(' ');
    }
    
    // Update the path
    locationTrail.setAttribute('d', currentPath);
}

/**
 * Updates the location information display
 * @param {Object} location - The current location object
 */
function updateLocationInfo(location) {
    const currentLocationEl = document.getElementById('current-location');
    const locationStatusEl = document.getElementById('location-status');
    const batteryLevelEl = document.getElementById('battery-level');
    
    if (currentLocationEl) {
        currentLocationEl.textContent = location.name;
    }
    
    if (locationStatusEl) {
        if (location.inSafeZone) {
            locationStatusEl.textContent = 'Within safe zone';
            locationStatusEl.className = 'text-success';
        } else {
            locationStatusEl.textContent = 'Outside safe zone';
            locationStatusEl.className = 'text-warning';
            
            // Create alert for out-of-bounds condition
            createLocationAlert(location);
        }
    }
    
    // Simulate battery drain
    if (batteryLevelEl) {
        // Start at 85% and decrease slightly each update
        const currentBattery = parseInt(batteryLevelEl.textContent) || 85;
        const newBattery = Math.max(currentBattery - Math.floor(Math.random() * 3), 10);
        batteryLevelEl.textContent = `${newBattery}%`;
        
        // Update color based on battery level
        if (newBattery < 20) {
            batteryLevelEl.className = 'text-danger';
        } else if (newBattery < 50) {
            batteryLevelEl.className = 'text-warning';
        } else {
            batteryLevelEl.className = 'text-success';
        }
    }
}

/**
 * Creates an alert for out-of-bounds location
 * @param {Object} location - The current location object
 */
function createLocationAlert(location) {
    // Create alert only if out of safe zone and alert doesn't already exist
    if (location.inSafeZone || document.querySelector('.location-alert')) return;
    
    const gpsDemo = document.querySelector('.gps-demo');
    if (!gpsDemo) return;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'location-alert alert alert-warning mt-3 mb-0 d-flex align-items-center';
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        <div>Alert: NEUROGLOVE wearer has left the designated safe zone. Current location: ${location.name}</div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    gpsDemo.appendChild(alert);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 8000);
}

/**
 * Updates the last updated timestamp
 */
function updateTimestamp() {
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl) {
        const now = new Date();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        lastUpdatedEl.textContent = `${now.getHours()}:${minutes}:${seconds}`;
    }
}
