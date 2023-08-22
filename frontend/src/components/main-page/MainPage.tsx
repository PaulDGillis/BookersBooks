import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Navbar from '../navbar/navbar';

function MainPage() {
    const { logout } = useAuth();

    return (
        <>
        <Navbar />
        </>
    )
}
  
export default MainPage