import React from 'react';
import type { NewtonStep, FixedPointStep } from '../../services/api';

interface RootsIterationTableProps {
  type: 'newton' | 'fixed-point';
  newtonSteps?: NewtonStep[];
  fixedPointSteps?: FixedPointStep[];
  activeStep?: number;
  onSelectStep?: (step: number) => void;
}

export const RootsIterationTable: React.FC<RootsIterationTableProps> = ({
  type,
  newtonSteps = [],
  fixedPointSteps = [],
  activeStep,
  onSelectStep,
}) => {
  const steps = type === 'newton' ? newtonSteps : fixedPointSteps;

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Tabla de Iteraciones ({type === 'newton' ? 'Newton-Raphson' : 'Punto Fijo'})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evolución paso a paso del valor de aproximación y cálculo de error.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
          {steps.length} {steps.length === 1 ? 'iteración' : 'iteraciones'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-center">n</th>
              <th className="py-3 px-4">xₙ</th>
              {type === 'newton' ? (
                <>
                  <th className="py-3 px-4">f(xₙ)</th>
                  <th className="py-3 px-4">f'(xₙ)</th>
                </>
              ) : (
                <th className="py-3 px-4">g(xₙ)</th>
              )}
              <th className="py-3 px-4 font-semibold text-indigo-700">xₙ₊₁</th>
              <th className="py-3 px-4">|xₙ₊₁ - xₙ|</th>
              <th className="py-3 px-4">Error Rel.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {type === 'newton'
              ? newtonSteps.map((step) => {
                  const isSelected = activeStep === step.iteration;
                  return (
                    <tr
                      key={step.iteration}
                      onClick={() => onSelectStep && onSelectStep(step.iteration)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/90 font-bold text-indigo-950'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center text-slate-500 font-sans font-bold">
                        {step.iteration}
                      </td>
                      <td className="py-2.5 px-4 text-slate-900">{step.xn.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-slate-600">{step.fxn.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-slate-600">{step.f_prime_xn.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-indigo-700 font-bold bg-indigo-50/30">
                        {step.xn_plus_1.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-4 text-amber-700 font-medium">
                        {step.error_abs < 1e-4
                          ? step.error_abs.toExponential(4)
                          : step.error_abs.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">
                        {step.error_rel !== null && step.error_rel !== undefined
                          ? step.error_rel < 1e-4
                            ? step.error_rel.toExponential(4)
                            : (step.error_rel * 100).toFixed(4) + '%'
                          : '-'}
                      </td>
                    </tr>
                  );
                })
              : fixedPointSteps.map((step) => {
                  const isSelected = activeStep === step.iteration;
                  return (
                    <tr
                      key={step.iteration}
                      onClick={() => onSelectStep && onSelectStep(step.iteration)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/90 font-bold text-indigo-950'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center text-slate-500 font-sans font-bold">
                        {step.iteration}
                      </td>
                      <td className="py-2.5 px-4 text-slate-900">{step.xn.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-slate-600">{step.gxn.toFixed(6)}</td>
                      <td className="py-2.5 px-4 text-indigo-700 font-bold bg-indigo-50/30">
                        {step.xn_plus_1.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-4 text-amber-700 font-medium">
                        {step.error_abs < 1e-4
                          ? step.error_abs.toExponential(4)
                          : step.error_abs.toFixed(6)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">
                        {step.error_rel !== null && step.error_rel !== undefined
                          ? step.error_rel < 1e-4
                            ? step.error_rel.toExponential(4)
                            : (step.error_rel * 100).toFixed(4) + '%'
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RootsIterationTable;
