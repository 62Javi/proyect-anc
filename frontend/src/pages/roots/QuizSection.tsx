import React, { useState } from 'react';
import { Check, X, HelpCircle as QuestionIcon, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});

  const questions: Question[] = [
    {
      id: 1,
      question: '1. ¿Qué representa geométricamente el siguiente valor xₙ₊₁ en el método de Newton?',
      options: [
        'El punto medio del intervalo que contiene la raíz.',
        'La intersección de la recta tangente a la curva en (xₙ, f(xₙ)) con el eje x (y = 0).',
        'El punto donde la derivada segunda f\'\'(x) se hace cero.',
        'La media ponderada de las dos iteraciones anteriores.',
      ],
      correctIndex: 1,
      explanation:
        'Correcto. Newton aproxima la función f(x) mediante su recta tangente Lₙ(x) en el punto actual y busca dónde dicha recta corta al eje horizontal (Lₙ(xₙ₊₁) = 0).',
    },
    {
      id: 2,
      question: '2. ¿Qué sucede si durante el proceso iterativo se obtiene f\'(xₙ) = 0?',
      options: [
        'El método acelera su convergencia exponencialmente.',
        'Se garantiza que xₙ es la raíz exacta.',
        'El método falla por división entre cero, ya que la recta tangente es horizontal y paralela al eje x.',
        'El método se convierte automáticamente en el método de bisección.',
      ],
      correctIndex: 2,
      explanation:
        'Exacto. Si la derivada es cero, la recta tangente es horizontal y no intersecta el eje x, produciendo una indeterminación xₙ₊₁ = xₙ - f(xₙ)/0.',
    },
    {
      id: 3,
      question: '3. Según el Teorema 1 de Punto Fijo de la cátedra, ¿qué condición garantiza que el punto fijo en [a, b] sea ÚNICO?',
      options: [
        'Que f(a) y f(b) tengan signos opuestos.',
        'Que la función g(x) sea un polinomio de grado par.',
        'Que exista una constante positiva k < 1 tal que |g\'(x)| ≤ k para todo x en (a, b).',
        'Que la derivada segunda sea estrictamente positiva.',
      ],
      correctIndex: 2,
      explanation:
        'Correcto. La cota de Lipschitz |g\'(x)| ≤ k < 1 asegura mediante el Teorema del Valor Medio que no pueden coexistir dos puntos fijos distintos sin llegar a una contradicción.',
    },
    {
      id: 4,
      question: '4. ¿Por qué se dice que el método de Newton tiene orden de convergencia cuadrático?',
      options: [
        'Porque solo funciona para polinomios cuadráticos (ax² + bx + c).',
        'Porque el error de la siguiente iteración es proporcional al cuadrado del error anterior, duplicando aproximadamente las cifras decimales exactas en cada paso.',
        'Porque requiere calcular siempre 2 iteraciones.',
        'Porque la recta tangente tiene pendiente elevada al cuadrado.',
      ],
      correctIndex: 1,
      explanation:
        '¡Excelente! La convergencia cuadrática implica que lim |xₙ₊₁ - p| / |xₙ - p|² = C, logrando una precisión enorme en muy pocas iteraciones una vez que se está cerca de la raíz.',
    },
    {
      id: 5,
      question: '5. Si transformamos f(x) = 0 en x = g(x) y en el entorno de la raíz |g\'(x)| ≈ 1.8, ¿qué ocurrirá?',
      options: [
        'La sucesión de punto fijo divergerá, alejándose del punto fijo en forma de espiral en el gráfico de telaraña.',
        'La sucesión convergerá más rápido que si |g\'(x)| fuera 0.2.',
        'Se producirá una división por cero.',
        'La raíz cambiará de signo.',
      ],
      correctIndex: 0,
      explanation:
        'Correcto. Al ser |g\'(x)| > 1 se viola la condición de contracción del Teorema del Punto Fijo y la sucesión se aleja del punto fijo.',
    },
  ];

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [qId]: true }));
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 mb-1">
            <QuestionIcon size={22} />
            <h2 className="text-xl font-bold text-slate-900">Dinámica de Clase: Preguntas y Preguntas Rápidas</h2>
          </div>
          <p className="text-slate-600 text-sm">
            Herramienta interactiva para proyectar durante la exposición e interactuar con tus compañeros comprobando la comprensión de los conceptos.
          </p>
        </div>

        {totalAnswered > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 shrink-0">
            <Award className="text-slate-900" size={20} />
            <span className="text-xs font-bold text-slate-900">
              Puntaje: {totalCorrect} / {questions.length}
            </span>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = showResults[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle =
                    'border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700';

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (selected === optIdx) {
                      btnStyle =
                        'border-rose-400 bg-rose-50 text-rose-950 line-through';
                    } else {
                      btnStyle = 'border-slate-100 opacity-50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && optIdx === q.correctIndex && (
                        <Check className="text-emerald-600 shrink-0" size={16} />
                      )}
                      {isAnswered && selected === optIdx && !isCorrect && (
                        <X className="text-rose-600 shrink-0" size={16} />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-bold block mb-1 uppercase text-[10px] tracking-wider">
                    {isCorrect ? '✓ Respuesta Correcta' : '💡 Explicación:'}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default QuizSection;
