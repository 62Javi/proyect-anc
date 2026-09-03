// Configuración de impresión en pdf
export const DEFAULT_PAGE_STYLE = `
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm; /* Margen estándar de PDF */
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Evita que las tarjetas, fórmulas o secciones se corten por la mitad entre hojas */
    section, 
    .card, 
    .exercise-card, 
    .print-no-break {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Oculta elementos que no deben salir en el archivo final */
    .print\\:hidden,
    button {
      display: none !important;
    }
  }
`;