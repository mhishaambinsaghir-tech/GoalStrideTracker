import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import Dashboard  from './pages/Dashboard';
import Goals      from './pages/Goals';
import GoalDetail from './pages/GoalDetail';
import Calendar   from './pages/Calendar';
import Analytics  from './pages/Analytics';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
          }} />
          <Routes>
            <Route path="/"            element={<Dashboard />}  />
            <Route path="/goals"       element={<Goals />}      />
            <Route path="/goals/:id"   element={<GoalDetail />} />
            <Route path="/calendar"    element={<Calendar />}   />
            <Route path="/analytics"   element={<Analytics />}  />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
