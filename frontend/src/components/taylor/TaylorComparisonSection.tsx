import React from 'react';
import { GitCompare, Award, TrendingDown, CheckCircle } from 'lucide-react';
import type { TaylorResponse } from '../../types/taylor';
import InlineMath from '../InlineMath';

interface TaylorComparisonSectionProps {
  result?: TaylorResponse;
}

export const TaylorComparisonSection: React.FC<TaylorComparisonSectionProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <GitCompare size={32} className="mx-auto text-slate-400" />
        <h3 className="text-base font-bold text-slate-800">
          Ejecuta una simulación en el simulador para ver la comparativa en vivo
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          La comparativa evaluará automáticamente los métodos de Euler, Euler Mejorado, Runge-Kutta 2 y Taylor
          sobre el mismo P.V.I.
        </p>
      </div>
    );
  }

  const { comparison_methods, final_exact_value, has_exact_solution, xf, x_var, y_var, h, order } = result;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-slate-100 text-slate-900 rounded-xl">
            <GitCompare size={20} />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Comparativa Multimétodo: Taylor vs Otros Métodos
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Análisis Comparativo según Programa de Cátedra (Orden 5 y 6)
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          En el cronograma de exposiciones, los grupos siguientes abordan Euler, Euler Mejorado y Runge-Kutta 2.
          Aquí contrastamos numéricamente cómo converge cada método para el mismo paso <InlineMath math={`h = ${h}`} />{' '}
          evaluado en <InlineMath math={`${x_var}_f = ${xf}`} />.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Tabla Comparativa de Resultados en</span>
            <InlineMath math={`${x_var} = ${xf}`} />
          </h3>
          {has_exact_solution && final_exact_value !== null && final_exact_value !== undefined && (
            <div className="text-xs bg-emerald-50 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span>Valor Exacto:</span>
              <InlineMath math={`${y_var}(${xf}) = ${final_exact_value.toFixed(5)}`} />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-black">
                <th className="p-3">Método</th>
                <th className="p-3">Orden Teórico</th>
                <th className="p-3">
                  <span className="flex items-center gap-1">
                    <span>Aproximación</span>
                    <InlineMath math={`\\hat{${y_var}}(${xf})`} />
                  </span>
                </th>
                {has_exact_solution && (
                  <>
                    <th className="p-3">Error Absoluto</th>
                    <th className="p-3">Error Relativo (%)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {comparison_methods.map((method, idx) => {
                const isCurrentTaylor = method.name.includes(`Taylor Orden ${order}`);
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCurrentTaylor ? 'bg-blue-50/60 font-bold text-blue-950' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      {isCurrentTaylor && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <span>{method.name}</span>
                      {isCurrentTaylor && (
                        <span className="text-[10px] uppercase tracking-wider bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full font-black">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <InlineMath math={`O(h^{${method.order}})`} />
                    </td>
                    <td className="p-3 font-mono font-bold">{method.final_value.toFixed(5)}</td>
                    {has_exact_solution && (
                      <>
                        <td className="p-3 font-mono text-slate-600">
                          {method.final_error_abs !== null && method.final_error_abs !== undefined
                            ? method.final_error_abs.toFixed(5)
                            : '-'}
                        </td>
                        <td className="p-3 font-mono">
                          {method.final_error_rel !== null && method.final_error_rel !== undefined ? (
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold ${
                                method.final_error_rel < 1.0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : method.final_error_rel < 5.0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {method.final_error_rel.toFixed(3)}%
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusions and Defense for Grupo 1 */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center gap-2.5 text-blue-400">
          <Award size={20} />
          <h3 className="text-base font-black tracking-tight text-white">
            Conclusiones para la Defensa del Grupo 1 (Taylor)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              Base Teórica Fundacional
            </span>
            <p className="leading-relaxed">
              Todos los métodos de paso simple (Euler, Heun, Runge-Kutta) se diseñan para coincidir con la
              expansión en serie de Taylor hasta cierto orden. Por lo tanto, entender Taylor es comprender
              la génesis de todo el análisis numérico de EDOs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingDown size={14} className="text-blue-400" />
              Poder de la Simulación Simbólica
            </span>
            <p className="leading-relaxed">
              La objeción clásica a Taylor en la bibliografía es el costo de calcular derivadas analíticas a mano.
              En esta plataforma, demostramos cómo la computación simbólica moderna (SymPy) anula esa limitación,
              permitiendo calcular órdenes 2, 3 y 4 de forma instantánea y exacta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaylorComparisonSection;
