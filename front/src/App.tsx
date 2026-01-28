import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { RequireAuth } from './auth/RequireAuth';
import {ProfilePage} from "./pages/ProfilePage.tsx";
import {EditProfilePage} from "./pages/EditProfilePage.tsx";
import SearchPage from './pages/SearchPage';
import ExchangesPage from "./pages/ExchangesPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={
                <RequireAuth>
                    <Dashboard />
                </RequireAuth>
            }/>

            <Route path="/profile/:id" element={
                <RequireAuth>
                    <ProfilePage />
                </RequireAuth>
            } />

            <Route path="/profile/edit" element={
                <RequireAuth>
                    <EditProfilePage />
                </RequireAuth>
            } />

            <Route path="/search" element={
                <SearchPage />
            } />
            <Route path="/exchanges" element={<ExchangesPage />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
