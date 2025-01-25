import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserSellerAdmin } from '../services/LoginService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await loginUserSellerAdmin({ email, password });

        if (data.role === 'admin') {
            navigate('/admin/adminDashboard');
        } else if (data.role === 'seller') {
            navigate('/seller/dashboard');
        } else if (data.role === 'user') {
            navigate('/userDashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-violet-900 flex flex-col items-center justify-center px-4">
            {/* Login Form */}
            <div className="max-w-md w-full p-8 bg-gradient-to-b from-black via-[#121212] to-black rounded-lg shadow-lg border border-gray-800">
                <h2 className="text-4xl font-extrabold text-violet-200 text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-700 hover:bg-violet-600 text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Don't have an account?{' '}
                    <button
                        className="text-violet-500 font-semibold hover:underline"
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
