import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FourierPage from './pages/FourierPage';
import HarmonicAnalysisPage from './pages/HarmonicAnalysisPage';
import RootsPage from './pages/roots/RootsPage';
import RegressionPage from './pages/regression/RegressionPage';
import TaylorPage from './pages/taylor/TaylorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="taylor" element={<TaylorPage />} />
          <Route path="regression" element={<RegressionPage />} />
          <Route path="roots" element={<RootsPage />} />
          <Route path="fourier" element={<FourierPage />} />
          <Route path="harmonics" element={<HarmonicAnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;