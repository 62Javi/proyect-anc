declare module 'react-plotly.js' {
  import { Component } from 'react';
  interface PlotProps {
    data: any[];
    layout?: any;
    useResizeHandler?: boolean;
    className?: string;
    style?: any;
    onInitialized?: (figure: any, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: any, graphDiv: HTMLElement) => void;
    onPurge?: (figure: any, graphDiv: HTMLElement) => void;
    onError?: (err: any) => void;
  }
  export default class Plot extends Component<PlotProps> {}
}
