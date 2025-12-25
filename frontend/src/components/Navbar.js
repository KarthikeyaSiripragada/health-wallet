import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Activity, FileText } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '1rem 2rem', 
            background: '#282c34', 
            color: 'white',
            alignItems: 'center'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🏥 Health Wallet</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Activity size={18} /> Dashboard
                </Link>
                <Link to="/shared">Shared With Me</Link>
                <Link to="/reports" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={18} /> Reports
                </Link>
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );  
};

export default Navbar;