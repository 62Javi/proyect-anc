import { useState, useRef } from 'react';
import { Mic, Square, Activity, Music, Info } from 'lucide-react';
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
  Area
} from 'recharts';

export default function HarmonicAnalysisPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [result, setResult] = useState<AudioAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    }
  };

  const processAudio = async (blob: Blob) => {
    setLoading(true);
    setError(null);
    try {
      // Convert to WAV first
      const audioContext = new AudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const wavBlob = encodeWAV(audioBuffer.getChannelData(0), audioBuffer.sampleRate);
      
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

  const spectrumData = result?.spectrum_x.map((x, i) => ({
    freq: x,
    amp: result.spectrum_y[i]
  })).filter((_, i) => i % 2 === 0) || []; // Subsample for performance

  return (
    <div className="min-h-full bg-[#0F0F23] text-[#F8FAFC] p-4 lg:p-8 font-['Atkinson_Hyperlegible']">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center text-[#F97316] border border-[#4338CA]">
              <Music size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Análisis de Armónicos</h1>
          </div>
          <p className="text-[#64748B] text-sm">Analiza el espectro de frecuencias de tu voz o instrumentos en tiempo real.</p>
        </header>

        {/* Recording Section */}
        <section className="bg-[#1E1B4B]/30 border border-[#4338CA]/30 rounded-[32px] p-8 flex flex-col items-center justify-center space-y-6 backdrop-blur-sm">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-[#F97316] flex items-center justify-center text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform active:scale-95"
            >
              <Mic size={40} />
            </button>
          ) : (
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-[#EF4444] animate-ping opacity-25" />
              <div className="absolute inset-0 rounded-full bg-[#EF4444] animate-ping opacity-15 [animation-delay:500ms]" />
              
              <button
                onClick={stopRecording}
                className="relative w-24 h-24 rounded-full bg-[#EF4444] flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300 active:scale-90"
              >
                <div className="w-8 h-8 bg-white rounded-sm animate-pulse" />
              </button>
            </div>
          )}

          <div className="text-center">
            <span className="text-4xl font-black tracking-tighter">
              {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </span>
            <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest mt-2">
              {isRecording ? 'Grabando...' : 'Pulsa para iniciar'}
            </p>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Activity className="text-[#F97316] animate-spin" size={48} />
            <p className="text-sm font-bold text-[#64748B]">PROCESANDO ESPECTRO...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] p-4 rounded-2xl flex items-center gap-3">
            <Info size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E1B4B]/50 p-6 rounded-[24px] border border-[#4338CA]/20">
                <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest">Frecuencia Fundamental</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black">{result.fundamental_frequency.toFixed(1)}</span>
                  <span className="text-lg font-bold text-[#64748B]">Hz</span>
                </div>
              </div>
              <div className="bg-[#1E1B4B]/50 p-6 rounded-[24px] border border-[#4338CA]/20">
                <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest">Duración</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black">{result.duration.toFixed(2)}</span>
                  <span className="text-lg font-bold text-[#64748B]">s</span>
                </div>
              </div>
            </div>

            {/* Harmonics Bar Chart */}
            <div className="bg-[#1E1B4B]/50 p-6 rounded-[32px] border border-[#4338CA]/20 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity size={16} className="text-[#F97316]" />
                Distribución de Armónicos
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.harmonics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27273B" />
                    <XAxis 
                      dataKey="harmonic_index" 
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      axisLine={{ stroke: '#27273B' }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#1E1B4B', border: '1px solid #4338CA', borderRadius: '12px' }}
                    />
                    <Bar dataKey="amplitude" radius={[4, 4, 0, 0]}>
                      {result.harmonics.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#F97316' : '#4338CA'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Full Spectrum Chart */}
            <div className="bg-[#1E1B4B]/50 p-6 rounded-[32px] border border-[#4338CA]/20 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity size={16} className="text-[#F97316]" />
                Espectro de Frecuencias (FFT)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spectrumData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27273B" />
                    <XAxis 
                      dataKey="freq" 
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      axisLine={{ stroke: '#27273B' }}
                      type="number"
                      domain={[0, 2000]}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E1B4B', border: '1px solid #4338CA', borderRadius: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amp" 
                      stroke="#F97316" 
                      fill="url(#colorAmp)" 
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
