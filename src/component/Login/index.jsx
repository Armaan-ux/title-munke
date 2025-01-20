import "./index.css";
import { signIn } from 'aws-amplify/auth';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Perform login
            const user = await signIn(username, password);

            // Check user group
            const groups = user.signInUserSession.idToken.payload['cognito:groups'];

            if (groups && groups.includes('Admin')) {
                // Redirect to Admin dashboard
                navigate('/admin');
            } else if (groups && groups.includes('User')) {
                // Redirect to User dashboard
                navigate('/user');
            } else {
                // Handle unknown group or no group
                navigate('/welcome');
            }
        } catch (error) {
            setError(error.message || 'Login failed');
        }
    };

    return (
        <div class="login-container">
            <form class="login-form">
                <h2>Title Munke</h2>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleLogin} type="button">Login</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Login;
