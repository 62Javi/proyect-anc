import React from 'react';
import { Printer, ArrowRight, Calculator } from 'lucide-react';
import InlineMath from '../InlineMath';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { RegressionSolverConfig } from '../../types/regression';

interface RegressionExercisesSectionProps {
  onLoadExercise: (config: RegressionSolverConfig) => void;
}

interface SolvedExercise {
  number: number;
  title: string;
  source: string;
  context: string;
  points: { x: number; y: number }[];
  modelType: 'linear' | 'polynomial' | 'exponential' | 'power' | 'saturation';
  degree?: number;
  bestFormula: string;
  r2: number;
  explanation: string;
}

const EXERCISES: SolvedExercise[] = [
  {
    number: 1,
    title: 'Serie de Observaciones y Comparativa de 5 Modelos',
    source: 'TP Nº4 · Ejercicio 1 (Apunte Cátedra ANC)',
    context: 'Dada una tabla experimental de 5 puntos, se requiere ajustar por los 5 modelos del apunte (Lineal, Exponencial, Potencial, Polinómico y Cociente) y determinar cuál es el más adecuado.',
    points: [
      { x: 1, y: 0.5 },
      { x: 2, y: 1.7 },
      { x: 3, y: 3.4 },
      { x: 4, y: 5.7 },
      { x: 5, y: 8.4 },
    ],
    modelType: 'power',
    degree: 2,
    bestFormula: 'y = 0.5009 \\cdot x^{1.7517}',
    r2: 0.9999,
    explanation: 'Tanto el modelo Potencial (r² = 0.99997) como el Polinómico de segundo grado (r² = 0.99994) describen a la perfección la curvatura convexa. El modelo lineal (r² = 0.9768) deja residuos sistemáticos y queda descartado.',
  },
  {
    number: 2,
    title: 'Censo Nacional y Crecimiento Poblacional',
    source: 'TP Nº4 · Ejercicio 2 (Apunte Cátedra ANC)',
    context: 'Serie histórica de población entre 1930 y 1980. Ajuste exponencial/potencial para proyectar la población en 1990, 1995 y 2000.',
    points: [
      { x: 1930, y: 123.203 },
      { x: 1940, y: 131.669 },
      { x: 1950, y: 150.697 },
      { x: 1960, y: 179.323 },
      { x: 1970, y: 203.212 },
      { x: 1980, y: 226.505 },
    ],
    modelType: 'exponential',
    bestFormula: 'y = a \\cdot e^{bx}',
    r2: 0.9852,
    explanation: 'El modelo demográfico malthusiano clásico exponencial muestra una tasa de crecimiento sostenida y permite extrapolar estimaciones a mediano plazo.',
  },
  {
    number: 3,
    title: 'Intensidad de Lluvia (Servicio Meteorológico Nacional)',
    source: 'TP Nº4 · Ejercicio 3 (Apunte Cátedra ANC)',
    context: 'Intensidad de lluvia registrada (ml) en función del tiempo de duración del evento (segundos). Ajuste exponencial y estimación a 200 segundos.',
    points: [
      { x: 5, y: 88.1 },
      { x: 10, y: 72.4 },
      { x: 15, y: 61.37 },
      { x: 20, y: 52.02 },
      { x: 30, y: 42.34 },
      { x: 45, y: 32.13 },
      { x: 60, y: 24.93 },
      { x: 90, y: 20.13 },
      { x: 120, y: 16.58 },
    ],
    modelType: 'exponential',
    bestFormula: 'y = 82.52 \\cdot e^{-0.0142x}',
    r2: 0.9884,
    explanation: 'El decaimiento exponencial representa de manera natural la rápida atenuación de los chaparrones torrenciales tras los primeros instantes de precipitación.',
  },
  {
    number: 4,
    title: 'Cinética de Crecimiento y Ecuación del Cociente',
    source: 'TP Nº4 · Ejercicio 4 (Apunte Cátedra ANC)',
    context: 'Mediciones de laboratorio con efecto de saturación asíntotica. Ajuste mediante inversión de variables 1/y = 1/a + (b/a)(1/x).',
    points: [
      { x: 1, y: 0.4 },
      { x: 2, y: 0.7 },
      { x: 2.5, y: 0.8 },
      { x: 4, y: 1.0 },
      { x: 6, y: 1.2 },
      { x: 8, y: 1.3 },
      { x: 8.5, y: 1.4 },
    ],
    modelType: 'saturation',
    bestFormula: 'y = \\frac{1.7774x}{3.4682 + x}',
    r2: 0.9961,
    explanation: 'El modelo de saturación captura con alta fidelidad la desaceleración del crecimiento a medida que la variable X aumenta, aproximándose a la asíntota horizontal y = a.',
  },
  {
    number: 5,
    title: 'Resistencia del Cemento según Edad de Curado',
    source: 'TP Nº4 · Ejercicio 5 (Prof. Mathieu Kessler / UTN)',
    context: 'Estudio de la resistencia a la compresión (kg/cm²) de probetas de hormigón en función de los días de maduración (1 a 32 días).',
    points: [
      { x: 1, y: 13.0 },
      { x: 2, y: 21.9 },
      { x: 3, y: 29.8 },
      { x: 7, y: 32.4 },
      { x: 12, y: 36.8 },
      { x: 20, y: 38.9 },
      { x: 28, y: 41.8 },
      { x: 32, y: 43.6 },
    ],
    modelType: 'saturation',
    bestFormula: 'y = \\frac{47.12x}{2.81 + x}',
    r2: 0.9873,
    explanation: 'El fraguado del cemento experimenta un endurecimiento rápido en la primera semana (curva pronunciada) y luego se estabiliza hacia un valor límite resistente.',
  },
  {
    number: 6,
    title: 'Producción Mundial de Petróleo (ONU 1880 - 1990)',
    source: 'TP Nº4 · Ejercicio 6 (ONU / UTN)',
    context: 'Evolución de la extracción de barriles de crudo durante más de un siglo. Discusión sobre modelos polinómicos frente a los límites físicos del agotamiento geológico (curva de Hubbert).',
    points: [
      { x: 1880, y: 30 },
      { x: 1900, y: 149 },
      { x: 1920, y: 689 },
      { x: 1940, y: 2150 },
      { x: 1960, y: 7674 },
      { x: 1970, y: 16669 },
      { x: 1980, y: 21732 },
      { x: 1990, y: 17153 },
    ],
    modelType: 'polynomial',
    degree: 3,
    bestFormula: 'y = a_1 + a_2x + a_3x^2 + a_4x^3',
    r2: 0.9912,
    explanation: 'La producción mundial alcanzó un pico y desaceleró, por lo que una función cúbica o de campana modela mejor la fase de ascenso y estancamiento que una exponencial infinita.',
  },
];

export const RegressionExercisesSection: React.FC<RegressionExercisesSectionProps> = ({ onLoadExercise }) => {
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-TP4');

  return (
    <div className="space-y-6">
      {/* Top Banner de Acción */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Ejercicios Resueltos - TP Nº 4</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Resolución de los Problemas 1 hasta el 6 del Trabajo Práctico.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Imprimir Guía Completa PDF</span>
        </button>
      </div>

      {/* CONTENEDOR IMPRIMIBLE */}
      <div ref={printRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
        {EXERCISES.map((ex) => (
          <div
            key={ex.number}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all print:border-slate-300 print:shadow-none print:break-inside-avoid"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Ejercicio Nº {ex.number}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {ex.points.length} puntos
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{ex.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{ex.context}</p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Modelo recomendado:</span>
                  <span className="font-bold text-slate-900 uppercase text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {ex.modelType}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Ecuación de ajuste:</span>
                  <span className="font-mono font-bold text-slate-900">
                    <InlineMath math={ex.bestFormula} />
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Bondad de ajuste:</span>
                  <span className="font-mono font-bold text-slate-900">r² = {ex.r2.toFixed(4)}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                "{ex.explanation}"
              </p>
            </div>

            <button
              onClick={() =>
                onLoadExercise({
                  modelType: ex.modelType,
                  degree: ex.degree,
                  points: ex.points,
                  title: ex.title,
                  source: ex.source,
                })
              }
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm print:hidden"
            >
              <Calculator size={14} />
              <span>Cargar en Calculadora Interactiva</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegressionExercisesSection;
