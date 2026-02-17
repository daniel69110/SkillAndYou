import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { RequireAuth } from './auth/RequireAuth';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import SearchPage from './pages/SearchPage';
import ExchangesPage from './pages/ExchangesPage';
import MyReportsPage from './pages/MyReportsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSkillsPage from './pages/AdminSkillPage';
import { MainLayout } from './pages/layout/MainLayout';
import 'react-image-crop/dist/ReactCrop.css';
import HomePage from './pages/Homepage.tsx';
import { Toaster } from 'react-hot-toast';
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage.tsx";
import {ResetPasswordPage} from "./pages/ResetPasswordPage.tsx";
import {MessagesPage} from "./pages/MessagePage.tsx";

function App() {
    return (
        <>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '8px',
                        fontSize: '15px',
                    },
                    success: {
                        style: {
                            background: '#10b981',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />


            <Routes>
                {/* Pages sans Header */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Pages avec Header */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />

                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/profile/:id"
                        element={
                            <RequireAuth>
                                <ProfilePage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/profile/edit"
                        element={
                            <RequireAuth>
                                <EditProfilePage />
                            </RequireAuth>
                        }
                    />

                    <Route path="/search" element={<SearchPage />} />

                    <Route
                        path="/exchanges"
                        element={
                            <RequireAuth>
                                <ExchangesPage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/my-reports"
                        element={
                            <RequireAuth>
                                <MyReportsPage />
                            </RequireAuth>
                        }
                    />

                    <Route path="/admin/reports" element={<AdminReportsPage />} />
                    <Route path="/admin/skills" element={<AdminSkillsPage />} />
                    <Route
                        path="/messages"
                        element={
                            <RequireAuth>
                                <MessagesPage />
                            </RequireAuth>
                        }
                    />

                </Route>
            </Routes>
        </>
    );
}

export default App;
