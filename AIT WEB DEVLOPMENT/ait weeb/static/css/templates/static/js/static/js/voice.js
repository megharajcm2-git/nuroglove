// NEUROGLOVE - Voice Generator Module

document.addEventListener('DOMContentLoaded', function() {
    initVoiceGenerator();
});

/**
 * Initializes the AI Voice Generator demo functionality
 */
function initVoiceGenerator() {
    const speakButton = document.getElementById('speak-btn');
    const voiceCommandSelect = document.getElementById('voice-command');
    const gestureText = document.getElementById('gesture-text');
    
    // Check if Speech Synthesis is supported
    if ('speechSynthesis' in window) {
        // Initialize speech synthesis
        const synth = window.speechSynthesis;
        let voices = [];
        
        // Get available voices (this is async in some browsers)
        function loadVoices() {
            voices = synth.getVoices();
        }
        
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
        
        loadVoices();
        
        // Handle speak button click
        speakButton.addEventListener('click', function() {
            const selectedOption = voiceCommandSelect.options[voiceCommandSelect.selectedIndex];
            const textToSpeak = selectedOption.value;
            
            if (textToSpeak) {
                // Update UI to show detected gesture
                gestureText.textContent = selectedOption.text.split(' - ')[1] || selectedOption.text;
                
                // Create speech utterance
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                
                // Try to select a natural-sounding voice
                if (voices.length > 0) {
                    // Prefer a female English voice for accessibility
                    const preferredVoice = voices.find(voice => 
                        voice.name.includes('Samantha') || 
                        voice.name.includes('Google US English Female') ||
                        (voice.lang === 'en-US' && voice.name.includes('Female'))
                    );
                    
                    if (preferredVoice) {
                        utterance.voice = preferredVoice;
                    }
                }
                
                // Set speech properties
                utterance.rate = 1; // Normal speed
                utterance.pitch = 1; // Normal pitch
                utterance.volume = 1; // Full volume
                
                // Speak the text
                synth.speak(utterance);
                
                // Visual feedback during speech
                speakButton.disabled = true;
                speakButton.innerHTML = '<i class="fas fa-volume-up me-2"></i>Speaking...';
                
                // Add the speaking class to gesture text for animation
                gestureText.classList.add('text-info');
                
                // Enable button after speech is complete
                utterance.onend = function() {
                    speakButton.disabled = false;
                    speakButton.innerHTML = '<i class="fas fa-volume-up me-2"></i>Speak';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        gestureText.classList.remove('text-info');
                    }, 3000);
                };
            } else {
                // If no text selected, show alert
                gestureText.textContent = 'Please select a gesture command';
                gestureText.classList.add('text-danger');
                
                setTimeout(() => {
                    gestureText.textContent = 'No gesture detected';
                    gestureText.classList.remove('text-danger');
                }, 3000);
            }
        });
        
        // Handle voice command select change
        voiceCommandSelect.addEventListener('change', function() {
            if (this.value) {
                speakButton.disabled = false;
            } else {
                speakButton.disabled = true;
            }
        });
        
    } else {
        // Speech synthesis not supported
        speakButton.disabled = true;
        speakButton.innerHTML = 'Speech Not Supported';
        voiceCommandSelect.disabled = true;
        gestureText.textContent = 'Your browser does not support speech synthesis';
        gestureText.classList.add('text-danger');
        
        // Create a fallback message
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'alert alert-warning mt-3';
        fallbackDiv.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari for the full experience.';
        speakButton.parentNode.parentNode.appendChild(fallbackDiv);
    }
}