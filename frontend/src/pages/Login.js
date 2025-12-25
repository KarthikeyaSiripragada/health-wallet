import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import API from '../services/api';

const Login = () => {
    const [loginMode, setLoginMode] = useState('email'); // 'email' or 'phone'
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // New state for OTP
    const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    // Step 1: Request OTP for Phone Login
    const handleSendOTP = async () => {
        if (!phoneNumber) return alert("Please enter a phone number");
        setIsLoading(true);
        try {
            await API.post('/auth/send-otp', { phoneNumber });
            setOtpSent(true);
            alert('OTP sent! Check your server console for the simulated code.');
        } catch (error) {
            alert('Failed to send OTP: ' + (error.response?.data?.error || 'Server Error'));
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP or Standard Email Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (loginMode === 'email') {
                response = await API.post('/auth/login', { email, password });
            } else {
                // Verify the OTP via the new pathway
                response = await API.post('/auth/verify-otp', { phoneNumber, otp });
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (rememberMe && loginMode === 'email') localStorage.setItem('rememberedEmail', email);
            else localStorage.removeItem('rememberedEmail');

            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Login Failed: ' + (error.response?.data?.error || 'Invalid Credentials/OTP'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const response = await API.post('/auth/firebase-login', { token: idToken });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Google Login Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-[420px] bg-card text-card-foreground p-8 rounded-xl border border-border shadow-lg space-y-6">
                
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight">🏥 Health Wallet</h1>
                    <p className="text-sm text-muted-foreground">Secure medical data access</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex p-1 bg-muted rounded-lg">
                    <button 
                        onClick={() => { setLoginMode('email'); setOtpSent(false); }}
                        className={`flex-1 text-sm py-1.5 rounded-md transition-all ${loginMode === 'email' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    >Email</button>
                    <button 
                        onClick={() => setLoginMode('phone')}
                        className={`flex-1 text-sm py-1.5 rounded-md transition-all ${loginMode === 'phone' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    >Phone</button>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {loginMode === 'email' ? (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Phone Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        disabled={otpSent}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring disabled:opacity-50"
                                        required
                                    />
                                    {!otpSent && (
                                        <button 
                                            type="button"
                                            onClick={handleSendOTP}
                                            className="px-3 text-xs bg-secondary text-secondary-foreground rounded-md hover:opacity-80 transition-opacity"
                                        >Get OTP</button>
                                    )}
                                </div>
                            </div>
                            {otpSent && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-medium">Enter 6-digit OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setOtpSent(false)} 
                                        className="text-xs text-primary hover:underline"
                                    >Change number?</button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            Remember Me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (loginMode === 'phone' && !otpSent)}
                        className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60"
                    >
                        {isLoading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-10 rounded-md border border-input bg-background flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                    Google
                </button>

                <p className="text-center text-sm text-muted-foreground">
                    New user? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;