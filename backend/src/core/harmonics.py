import io
from typing import Any, Dict

import numpy as np
from scipy.fft import rfft, rfftfreq
from scipy.io import wavfile


class HarmonicAnalyzer:
    def analyze_audio(self, audio_bytes: bytes) -> Dict[str, Any]:
        # Load WAV from bytes
        sample_rate, data = wavfile.read(io.BytesIO(audio_bytes))
        
        # Convert to mono if stereo
        if len(data.shape) > 1:
            data = data.mean(axis=1)
        
        # Normalize data
        data = data / np.max(np.abs(data)) if np.max(np.abs(data)) > 0 else data
        
        n = len(data)
        duration = n / sample_rate
        
        # Perform FFT
        yf = rfft(data)
        xf = rfftfreq(n, 1 / sample_rate)
        
        # Get magnitudes
        magnitudes = np.abs(yf)
        
        # Find fundamental frequency (max magnitude in a reasonable range)
        # Avoid very low frequencies (noise/DC offset)
        min_freq = 50  # Hz
        max_freq = 2000 # Hz for voice/basic instruments
        
        mask = (xf >= min_freq) & (xf <= max_freq)
        if not np.any(mask):
            fundamental = 0.0
        else:
            idx = np.argmax(magnitudes[mask])
            fundamental = xf[mask][idx]
            
        # Detect harmonics (multiples of fundamental)
        harmonics = []
        if fundamental > 0:
            for i in range(1, 11):  # First 10 harmonics
                target_freq = fundamental * i
                # Look in a small window around the target
                window = 20 # Hz
                h_mask = (xf >= target_freq - window) & (xf <= target_freq + window)
                if np.any(h_mask):
                    h_idx = np.argmax(magnitudes[h_mask])
                    actual_freq = xf[h_mask][h_idx]
                    amplitude = magnitudes[h_mask][h_idx]
                    harmonics.append({
                        "frequency": float(actual_freq),
                        "amplitude": float(amplitude),
                        "harmonic_index": i
                    })

        # Decimate spectrum for plotting (limit to 1000 points)
        step = max(1, len(xf) // 1000)
        
        return {
            "fundamental_frequency": float(fundamental),
            "harmonics": harmonics,
            "spectrum_x": xf[::step].tolist(),
            "spectrum_y": magnitudes[::step].tolist(),
            "sample_rate": int(sample_rate),
            "duration": float(duration)
        }
