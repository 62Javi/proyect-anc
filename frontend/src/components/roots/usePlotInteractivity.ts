import React, { useState, useRef, useEffect, useCallback } from 'react';

interface UsePlotInteractivityOptions {
  baseSpan: number;
  baseCenter: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
}

export function usePlotInteractivity({
  baseSpan,
  baseCenter,
  minZoom = 0.05,
  maxZoom = 40,
  initialZoom = 1,
}: UsePlotInteractivityOptions) {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [panOffset, setPanOffset] = useState<number>(0);
  const [panOffsetY, setPanOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const lastTouchDistRef = useRef<number | null>(null);

  const effectiveSpan = Math.max(1e-6, baseSpan / zoom);
  const effectiveCenter = baseCenter + panOffset;
  const currentMinX = effectiveCenter - effectiveSpan / 2;
  const currentMaxX = effectiveCenter + effectiveSpan / 2;

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(maxZoom, Number((z * 1.3).toFixed(3))));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(minZoom, Number((z / 1.3).toFixed(3))));
  }, [minZoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanOffset(0);
    setPanOffsetY(0);
  }, []);

  const handleCenterOn = useCallback(
    (targetX: number) => {
      setPanOffset(targetX - baseCenter);
    },
    [baseCenter]
  );

  // Non-passive wheel event listener on container for smooth zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((z) => {
        const next = Math.max(minZoom, Math.min(maxZoom, z * factor));
        return Number(next.toFixed(3));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [minZoom, maxZoom]);

  // Mouse Drag (Pan) Handlers (2D: X and Y)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button (left click)
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const deltaPx = e.clientX - startXRef.current;
      const deltaPy = e.clientY - startYRef.current;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;

      const width = containerRef.current.clientWidth || 600;
      const deltaDomainX = (deltaPx / width) * (baseSpan / zoom);
      setPanOffset((p) => p - deltaDomainX);

      // Y pan scaled to pixel movement (drag down = move view down)
      const height = containerRef.current.clientHeight || 400;
      const deltaDomainY = (deltaPy / height) * 20;
      setPanOffsetY((py) => py + deltaDomainY);
    },
    [baseSpan, zoom]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Touch Handlers for mobile screens
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      lastTouchDistRef.current = null;
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Pinch to zoom initialization
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistRef.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && containerRef.current) {
        const deltaPx = e.touches[0].clientX - startXRef.current;
        const deltaPy = e.touches[0].clientY - startYRef.current;
        startXRef.current = e.touches[0].clientX;
        startYRef.current = e.touches[0].clientY;

        const width = containerRef.current.clientWidth || 600;
        const deltaDomainX = (deltaPx / width) * (baseSpan / zoom);
        setPanOffset((p) => p - deltaDomainX);

        const height = containerRef.current.clientHeight || 400;
        const deltaDomainY = (deltaPy / height) * 20;
        setPanOffsetY((py) => py + deltaDomainY);
      } else if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scale = dist / lastTouchDistRef.current;
        lastTouchDistRef.current = dist;

        setZoom((z) => {
          const next = Math.max(minZoom, Math.min(maxZoom, z * scale));
          return Number(next.toFixed(3));
        });
      }
    },
    [baseSpan, zoom, minZoom, maxZoom]
  );

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    lastTouchDistRef.current = null;
    setIsDragging(false);
  }, []);

  return {
    zoom,
    panOffset,
    panOffsetY,
    setZoom,
    setPanOffset,
    setPanOffsetY,
    isDragging,
    containerRef,
    effectiveSpan,
    effectiveCenter,
    currentMinX,
    currentMaxX,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleCenterOn,
    dragProps: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onDoubleClick: handleResetZoom,
    },
  };
}

export default usePlotInteractivity;
