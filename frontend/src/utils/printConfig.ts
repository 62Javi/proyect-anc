// Configuración de impresión en pdf
export const DEFAULT_PAGE_STYLE = `
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm; /* Margen estándar de PDF */
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Oculta absolutamente todas las barras de scroll en el PDF */
    *, *::before, *::after {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    *::-webkit-scrollbar,
    ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    /* Eliminar desbordamientos y barras de desplazamiento en contenedores */
    .overflow-x-auto,
    div[class*="overflow-x-auto"],
    .katex,
    .katex-display {
      overflow: visible !important;
      overflow-x: visible !important;
    }

    /* Ajustar tamaño de KaTeX para que las fórmulas largas quepan en ancho A4 sin cortarse */
    .katex-display {
      margin: 0.25em 0 !important;
    }
    .katex {
      font-size: 0.82em !important;
    }

    /* Evita que las tarjetas, fórmulas o secciones se corten por la mitad entre hojas */
    section, 
    .card, 
    .exercise-card, 
    .print-no-break {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Oculta elementos interactivos no imprimibles */
    .print\\:hidden,
    button {
      display: none !important;
    }
  }
`;