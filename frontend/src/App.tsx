import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FourierPage from './pages/FourierPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="fourier" element={<FourierPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;