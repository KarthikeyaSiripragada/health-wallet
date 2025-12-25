import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Upload, Share2, ExternalLink } from 'lucide-react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('Blood Test');
    const [date, setDate] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [activeShareId, setActiveShareId] = useState(null);

    const fetchReports = async () => {
        try {
            const response = await API.get('/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);
    
    // ✅ Upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('report', file);
        formData.append('type', reportType);
        formData.append('date', date);

        try {
            await API.post('/reports/upload', formData);
            alert('Upload successful!');
            setFile(null);
            setDate('');
            fetchReports();
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    // ✅ Download (JWT-safe)
    const handleDownload = async (reportId) => {
        try {
            const response = await API.get(`/reports/download/${reportId}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'report.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Download failed');
        }
    };

    // ✅ Share
    const handleShare = async (reportId) => {
        try {
            await API.post('/reports/share', {
                report_id: reportId,
                viewer_email: shareEmail
            });
            alert('Report shared successfully!');
            setActiveShareId(null);
            setShareEmail('');
        } catch (error) {
            alert(error.response?.data?.error || 'Share failed');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1><FileText size={28} /> Medical Reports</h1>

            {/* Upload Section */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <h3><Upload size={18} /> Upload New Report</h3>
                <form onSubmit={handleUpload} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option>Blood Test</option>
                        <option>X-Ray</option>
                        <option>Prescription</option>
                        <option>Other</option>
                    </select>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <button type="submit">Upload</button>
                </form>
            </div>

            {/* Reports List */}
            <div style={{ display: 'grid', gap: '15px' }}>
                {reports.map((report) => (
                    <div
                        key={report.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <strong>{report.type}</strong>
                            <p style={{ color: '#666' }}>Date: {report.date}</p>
                            <button onClick={() => handleDownload(report.id)}>
                                <ExternalLink size={16} /> View / Download
                            </button>
                        </div>

                        <div>
                            <button onClick={() => setActiveShareId(report.id)}>
                                <Share2 size={16} /> Share
                            </button>

                            {activeShareId === report.id && (
                                <div style={{ marginTop: '10px' }}>
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        value={shareEmail}
                                        onChange={(e) => setShareEmail(e.target.value)}
                                    />
                                    <button onClick={() => handleShare(report.id)}>Confirm</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
