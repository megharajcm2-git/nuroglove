// NEUROGLOVE - Home Automation Integration Module

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any home automation related functionality
    // This file is included for potential expansion but the core functionality
    // is currently handled by the gesture.js module
    
    // Set up emergency alert demonstration
    setupEmergencyAlerts();
});

/**
 * Sets up the emergency alert demonstration
 */
function setupEmergencyAlerts() {
    // Simulation of emergency alerts - randomly show an emergency notification
    const emergencyInterval = Math.floor(Math.random() * 45000) + 30000; // Between 30s and 75s
    
    setTimeout(() => {
        showEmergencyAlert();
    }, emergencyInterval);
}

/**
 * Shows an emergency alert demonstration
 */
function showEmergencyAlert() {
    // Create emergency alert types
    const emergencyTypes = [
        { title: "Fall Detected", message: "NEUROGLOVE has detected a potential fall. Sending alert to caregivers." },
        { title: "Abnormal Heart Rate", message: "NEUROGLOVE has detected an abnormal heart rate. Emergency services notified." },
        { title: "Help Requested", message: "User has activated the emergency help gesture. Contacting emergency contacts." }
    ];
    
    // Select a random emergency type
    const emergency = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
    
    // Create modal if it doesn't exist
    let modalElement = document.getElementById('emergencyModal');
    if (!modalElement) {
        modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.id = 'emergencyModal';
        modalElement.setAttribute('tabindex', '-1');
        modalElement.setAttribute('aria-labelledby', 'emergencyModalLabel');
        modalElement.setAttribute('aria-hidden', 'true');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-danger">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="emergencyModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <span id="emergency-title">Emergency Alert</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="emergency-pulse me-3">
                                <i class="fas fa-heartbeat fa-3x text-danger"></i>
                            </div>
                            <div>
                                <p id="emergency-message" class="mb-0">Emergency alert detected.</p>
                            </div>
                        </div>
                        <div class="emergency-actions bg-light p-3 rounded">
                            <div class="row">
                                <div class="col-6">
                                    <strong>Location:</strong><br>
                                    Home - Living Room
                                </div>
                                <div class="col-6">
                                    <strong>Time:</strong><br>
                                    <span id="emergency-time">Now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Dismiss</button>
                        <button type="button" class="btn btn-danger">Contact User</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        
        // Add custom CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .emergency-pulse i {
                animation: emergency-pulse 1.5s infinite;
            }
            @keyframes emergency-pulse {
                0% {
                    transform: scale(0.95);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(1.05);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.95);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update modal content
    document.getElementById('emergency-title').textContent = emergency.title;
    document.getElementById('emergency-message').textContent = emergency.message;
    
    // Set the current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('emergency-time').textContent = `${hours}:${minutes}`;
    
    // Show the modal
    if (typeof bootstrap !== 'undefined') {
        const emergencyModal = new bootstrap.Modal(modalElement);
        emergencyModal.show();
        
        // Play alert sound if possible
        playAlertSound();
    }
}

/**
 * Plays an alert sound for emergency notifications
 */
function playAlertSound() {
    // Create audio context
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        // Create oscillator for beep sound
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(780, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Play beep pattern
        oscillator.start();
        
        // Beep pattern (on-off-on)
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.6);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.8);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1.0);
        
        // Stop after the pattern
        setTimeout(() => {
            oscillator.stop();
        }, 1200);
    } catch (e) {
        console.log('Web Audio API not supported or user interaction required.');
    }
}
