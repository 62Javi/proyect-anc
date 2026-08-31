import { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, Activity, Music, Info, Play, Pause, RotateCcw } from 'lucide-react';
import { analyzeAudio } from '../services/api';
import type { AudioAnalysisResponse } from '../services/api';
import { encodeWAV } from '../utils/wavEncoder';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';

export default function HarmonicAnalysisPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentFreq, setCurrentFreq] = useState<number | null>(null);
  const [result, setResult] = useState<AudioAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Real-time analysis refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Playback refs
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const playbackOffsetRef = useRef<number>(0);
  const playbackRequestFrameRef = useRef<number | null>(null);

  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    // Basic auto-correlation algorithm for pitch detection
    let SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return null; // Silence

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    let buf = buffer.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // Interpolation for better accuracy
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a !== 0) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const updateRealTimeFreq = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (freq && freq > 50 && freq < 2000) {
      setCurrentFreq(freq);
    } else {
      setCurrentFreq(null);
    }
    
    animationFrameRef.current = requestAnimationFrame(updateRealTimeFreq);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Real-time Analyzer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setCurrentFreq(null);
      
      // Start real-time analysis
      updateRealTimeFreq();
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('No se pudo acceder al micrófono');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      
      setCurrentFreq(null);
    }
  };

  const processAudio = async (blob: Blob) => {
    setLoading(true);
    setError(null);
    setAudioBuffer(null);
    setPlaybackTime(0);
    setIsPlaying(false);
    
    try {
      // Convert to WAV first
      const audioContext = new AudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedBuffer);
      
      const wavBlob = encodeWAV(decodedBuffer.getChannelData(0), decodedBuffer.sampleRate);
      
      const file = new File([wavBlob], 'recording.wav', { type: 'audio/wav' });
      const analysis = await analyzeAudio(file);
      setResult(analysis);
    } catch (err: any) {
      setError(`Error al procesar el audio: ${err.message || 'Error desconocido'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioBuffer) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (isPlaying) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      if (playbackRequestFrameRef.current) {
        cancelAnimationFrame(playbackRequestFrameRef.current);
      }
      playbackOffsetRef.current += ctx.currentTime - playbackStartTimeRef.current;
      setIsPlaying(false);
    } else {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const startAt = playbackOffsetRef.current >= audioBuffer.duration ? 0 : playbackOffsetRef.current;
      if (startAt === 0) playbackOffsetRef.current = 0;

      source.start(0, startAt);
      audioSourceRef.current = source;
      playbackStartTimeRef.current = ctx.currentTime;
      setIsPlaying(true);

      source.onended = () => {
        if (isPlaying) {
          setIsPlaying(false);
          playbackOffsetRef.current = 0;
          setPlaybackTime(0);
        }
      };

      const updatePlaybackUI = () => {
        const elapsed = ctx.currentTime - playbackStartTimeRef.current + playbackOffsetRef.current;
        if (elapsed >= audioBuffer.duration) {
          setPlaybackTime(audioBuffer.duration);
          setIsPlaying(false);
          playbackOffsetRef.current = 0;
          return;
        }
        setPlaybackTime(elapsed);
        playbackRequestFrameRef.current = requestAnimationFrame(updatePlaybackUI);
      };
      updatePlaybackUI();
    }
  };

  const resetPlayback = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    if (playbackRequestFrameRef.current) {
      cancelAnimationFrame(playbackRequestFrameRef.current);
    }
    setPlaybackTime(0);
    playbackOffsetRef.current = 0;
    setIsPlaying(false);
  };

  const waveformData = useMemo(() => {
    if (!audioBuffer) return [];
    const rawData = audioBuffer.getChannelData(0);
    const samples = 100; // Number of vertical lines
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[i * blockSize + j]);
      }
      filteredData.push(sum / blockSize);
    }
    const maxAmp = Math.max(...filteredData) || 1;
    return filteredData.map(amp => amp / maxAmp);
  }, [audioBuffer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (playbackRequestFrameRef.current) cancelAnimationFrame(playbackRequestFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (audioSourceRef.current) audioSourceRef.current.stop();
    };
  }, []);

  const spectrumData = result?.spectrum_x.map((x, i) => ({
    freq: x,
    amp: result.spectrum_y[i]
  })).filter((_, i) => i % 2 === 0) || []; // Subsample for performance

  return (
    <div className="min-h-full bg-slate-50/50 text-slate-900 p-4 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 border border-slate-200">
              <Music size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Análisis de Armónicos</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Analiza el espectro de frecuencias de tu voz o instrumentos en tiempo real.</p>
        </header>

        {/* Recording Section */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center space-y-6 shadow-sm">
          {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 hover:scale-105 transition-transform active:scale-95"
              >
              <Mic size={40} />
            </button>
          ) : (
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-10 [animation-delay:500ms]" />
              
              <button
                onClick={stopRecording}
                className="relative w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-100 transition-all duration-300 active:scale-90"
              >
                <div className="w-8 h-8 bg-white rounded-sm animate-pulse" />
              </button>
            </div>
          )}

          <div className="text-center">
            {isRecording && currentFreq && (
              <div className="mb-4 animate-in fade-in zoom-in duration-300">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Detectado</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black text-slate-900 tabular-nums">{Math.round(currentFreq)}</span>
                  <span className="text-xl font-bold text-slate-400">Hz</span>
                </div>
              </div>
            )}
            
            <span className="text-4xl font-black tracking-tighter text-slate-900">
              {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </span>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
              {isRecording ? 'Grabando...' : 'Pulsa para iniciar'}
            </p>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Activity className="text-slate-900 animate-spin" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procesando Espectro...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
            <Info size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Audio Player & Waveform */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlayback}
                    className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200 hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Reproducir Grabación</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {Math.floor(playbackTime / 60)}:{(Math.floor(playbackTime % 60)).toString().padStart(2, '0')} / 
                      {Math.floor((audioBuffer?.duration || 0) / 60)}:{(Math.floor((audioBuffer?.duration || 0) % 60)).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={resetPlayback}
                  className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              {/* Waveform Visualizer */}
              <div className="h-16 flex items-center justify-between gap-[2px]">
                {waveformData.map((amp, i) => {
                  const progress = audioBuffer ? (playbackTime / audioBuffer.duration) : 0;
                  const isPlayed = (i / waveformData.length) < progress;
                  return (
                    <div 
                      key={i}
                      className="flex-1 rounded-full transition-colors duration-200"
                      style={{ 
                        height: `${Math.max(10, amp * 100)}%`,
                        backgroundColor: isPlayed ? '#0F172A' : '#F1F5F9'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Frecuencia Fundamental</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-slate-900">{result.fundamental_frequency.toFixed(1)}</span>
                  <span className="text-lg font-bold text-slate-400">Hz</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Duración</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black">{result.duration.toFixed(2)}</span>
                  <span className="text-lg font-bold text-slate-400">s</span>
                </div>
              </div>
            </div>

            {/* Harmonics Bar Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Activity size={16} className="text-slate-900" />
                Distribución de Armónicos
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.harmonics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="harmonic_index" 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      axisLine={{ stroke: '#F1F5F9' }}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#F8FAFC' }}
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="amplitude" radius={[6, 6, 0, 0]}>
                      {result.harmonics.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0F172A' : '#94A3B8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Full Spectrum Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Activity size={16} className="text-slate-900" />
                Espectro de Frecuencias (FFT)
              </h3>
              {/* ... existing chart code ... */}
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spectrumData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="freq" 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      axisLine={{ stroke: '#F1F5F9' }}
                      tickLine={false}
                      type="number"
                      domain={[0, 2000]}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amp" 
                      stroke="#0F172A" 
                      fill="url(#colorAmp)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline Evolution Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Activity size={16} className="text-slate-900" />
                Evolución de la Fundamental (Hz)
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.timeline}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      axisLine={{ stroke: '#F1F5F9' }}
                      tickLine={false}
                      tickFormatter={(val) => `${val.toFixed(1)}s`}
                    />
                    <YAxis 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                      formatter={(val: any) => [`${Number(val).toFixed(1)} Hz`, 'Frecuencia']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fundamental_frequency" 
                      stroke="#0F172A" 
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                Muestra la variación del tono principal cada 200ms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
