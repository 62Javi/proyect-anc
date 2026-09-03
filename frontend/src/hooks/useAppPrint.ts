// Hook para manejar la impresión de documentos en pdf
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DEFAULT_PAGE_STYLE } from '../utils/printConfig';

export const useAppPrint = (documentTitle: string) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    pageStyle: DEFAULT_PAGE_STYLE,
  });

  return { printRef, handlePrint };
};