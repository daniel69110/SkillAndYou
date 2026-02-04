import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const MainLayout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
};
