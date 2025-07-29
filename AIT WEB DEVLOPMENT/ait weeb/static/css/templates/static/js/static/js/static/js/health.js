// NEUROGLOVE - Health Monitoring Module

document.addEventListener('DOMContentLoaded', function() {
    initHealthCharts();
    startHealthSimulation();
});

// Global variables for chart instances
let temperatureChart;
let pulseChart;

// Current health values
let currentTemperature = 36.6;
let currentPulse = 75;

/**
 * Initializes the health monitoring charts
 */
function initHealthCharts() {
    // Set up temperature chart
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: Array(20).fill('').map((_, i) => i),
            datasets: [{
                label: 'Body Temperature (°C)',
                data: Array(20).fill(36.6),
                fill: true,
                backgroundColor: 'rgba(13, 202, 240, 0.2)',
                borderColor: 'rgba(13, 202, 240, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 35.5,
                    max: 38,
                    ticks: {
                        stepSize: 0.5
                    }
                },
                x: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}°C`;
                        }
                    }
                }
            }
        }
    });
    
    // Set up pulse chart
    const pulseCtx = document.getElementById('pulseChart').getContext('2d');
    pulseChart = new Chart(pulseCtx, {
        type: 'line',
        data: {
            labels: Array(20).fill('').map((_, i) => i),
            datasets: [{
                label: 'Pulse Rate (BPM)',
                data: Array(20).fill(75),
                fill: true,
                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 50,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                },
                x: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(0)} BPM`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Starts the health data simulation
 */
function startHealthSimulation() {
    // Update health data every 3 seconds
    setInterval(updateHealthData, 3000);
}

/**
 * Updates the health monitoring data with simulated readings
 */
function updateHealthData() {
    // Generate natural variations in temperature (small fluctuations)
    const tempChange = (Math.random() - 0.5) * 0.2;
    currentTemperature = Math.max(35.5, Math.min(38, currentTemperature + tempChange));
    
    // Generate natural variations in pulse (larger fluctuations)
    const pulseChange = (Math.random() - 0.5) * 5;
    currentPulse = Math.max(55, Math.min(95, currentPulse + pulseChange));
    
    // Update temperature chart
    temperatureChart.data.datasets[0].data.push(currentTemperature);
    temperatureChart.data.datasets[0].data.shift();
    temperatureChart.update();
    
    // Update pulse chart
    pulseChart.data.datasets[0].data.push(currentPulse);
    pulseChart.data.datasets[0].data.shift();
    pulseChart.update();
    
    // Update displayed values
    updateDisplayedValues();
}

/**
 * Updates the displayed health values and status indicators
 */
function updateDisplayedValues() {
    const tempValueElement = document.getElementById('temp-value');
    const pulseValueElement = document.getElementById('pulse-value');
    
    // Format and display temperature
    tempValueElement.textContent = `${currentTemperature.toFixed(1)}°C`;
    
    // Format and display pulse
    pulseValueElement.textContent = `${Math.round(currentPulse)} BPM`;
    
    // Update temperature status
    const tempStatus = tempValueElement.nextElementSibling;
    if (currentTemperature < 36 || currentTemperature > 37.5) {
        tempStatus.className = 'reading-status text-warning ms-2';
        tempStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Attention';
    } else {
        tempStatus.className = 'reading-status text-success ms-2';
        tempStatus.innerHTML = '<i class="fas fa-check-circle"></i> Normal';
    }
    
    // Update pulse status
    const pulseStatus = pulseValueElement.nextElementSibling;
    if (currentPulse < 60 || currentPulse > 90) {
        pulseStatus.className = 'reading-status text-warning ms-2';
        pulseStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Attention';
    } else {
        pulseStatus.className = 'reading-status text-success ms-2';
        pulseStatus.innerHTML = '<i class="fas fa-check-circle"></i> Normal';
    }
    
    // Create an "event" randomly (approximately every 5 updates)
    if (Math.random() < 0.2) {
        createHealthEvent();
    }
}

/**
 * Simulates a health event notification
 */
function createHealthEvent() {
    // Only create if container exists
    const healthDemo = document.querySelector('.health-demo');
    if (!healthDemo) return;
    
    // Check if notification already exists
    if (document.querySelector('.health-notification')) return;
    
    // Create event types
    const events = [
        { type: 'info', icon: 'info-circle', message: 'Activity detected: Walking', color: 'info' },
        { type: 'warning', icon: 'exclamation-circle', message: 'Hydration reminder: Drink water', color: 'warning' },
        { type: 'success', icon: 'check-circle', message: 'Daily step goal achieved', color: 'success' }
    ];
    
    // Select random event
    const event = events[Math.floor(Math.random() * events.length)];
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `health-notification alert alert-${event.color} mt-3 mb-0 d-flex align-items-center`;
    notification.innerHTML = `
        <i class="fas fa-${event.icon} me-2"></i>
        <div>${event.message}</div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    healthDemo.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}