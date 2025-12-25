import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { FileText, ExternalLink } from 'lucide-react';

const SharedReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        API.get('/reports/shared')
            .then(res => setReports(res.data))
            .catch(() => alert('Failed to load shared reports'));
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1><FileText /> Reports Shared With Me</h1>

            {reports.length === 0 && <p>No reports shared with you.</p>}

            {reports.map(r => (
                <div key={r.id} style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '10px'
                }}>
                    <strong>{r.type}</strong>
                    <p>Date: {r.date}</p>
                    <a
                        href={`http://localhost:5000/api/reports/download/${r.id}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ExternalLink size={16} /> View / Download
                    </a>
                </div>
            ))}
        </div>
    );
};

export default SharedReports;
