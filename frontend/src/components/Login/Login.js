import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();


    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = jwtDecode(tokenResponse.credential);

            try {
                // Send token to backend to verify
                const response = await axios.post('/api/v1/google-login', {code: tokenResponse.code });
            
                // Upon success login, navigate to userpage
                setAuth({ token: response.data.id_token, user: userInfo });
                navigate('/userpage')

            // Throw error if login fails
            } catch (error) {
                console.error('Login failed', error);
            }
        }
    });

    return (
        <button onClick={() => login()}>
            Sign in with Google
        </button>
    )
}

export default Login;