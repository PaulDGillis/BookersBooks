import { AuthProvider } from "./hooks/useAuth.tsx";
import MainPage from './components/main-page/MainPage.tsx';
import RegisterPage from './components/register-page/RegisterPage.tsx';
import LogInPage from './components/login-page/LogInPage.tsx';
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <AuthProvider /> }>
                    <Route index element={ <MainPage /> } />
                    <Route path='login' element={ <LogInPage /> } />
                    <Route path='register' element={ <RegisterPage /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}