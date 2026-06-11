import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/jobs" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute roles={['Employer']}>
                            <EmployerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-applications" element={
                        <ProtectedRoute roles={['Applicant']}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    } />
                    {/* Catch all unknown routes */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;