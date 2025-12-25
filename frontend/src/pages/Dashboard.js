import React, { useEffect, useState } from 'react';
import API from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, PlusCircle } from 'lucide-react';

const Dashboard = () => {
    const [vitals, setVitals] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Blood Sugar',
        value: '',
        unit: 'mg/dL'
    });

    useEffect(() => {
        API.get('/vitals')
            .then(res => {
                const data = res.data.map(v => ({
                    ...v,
                    date: new Date(v.date).toLocaleDateString()
                }));
                setVitals(data);
            })
            .catch(() => alert('Failed to load vitals'));
    }, []);

    const addVital = async (e) => {
        e.preventDefault();
        await API.post('/vitals', formData);
        setFormData({ ...formData, value: '' });
        const res = await API.get('/vitals');
        setVitals(res.data.map(v => ({
            ...v,
            date: new Date(v.date).toLocaleDateString()
        })));
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Activity color="#2563eb" /> Health Dashboard
            </h1>

            {/* Add Vital */}
            <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '30px'
            }}>
                <h3><PlusCircle size={18} /> Add Vital</h3>

                <form onSubmit={addVital} style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option>Blood Sugar</option>
                        <option>Blood Pressure</option>
                        <option>Heart Rate</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Value"
                        value={formData.value}
                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                        required
                    />

                    <input readOnly value={formData.unit} style={{ width: '80px' }} />

                    <button style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px'
                    }}>
                        Save
                    </button>
                </form>
            </div>

            {/* Chart */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                height: '420px'
            }}>
                <h3>Vitals Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitals}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
