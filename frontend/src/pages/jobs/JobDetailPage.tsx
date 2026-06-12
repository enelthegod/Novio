import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById } from '../../api/jobs';
import { applyForJob, uploadCv } from '../../api/applications';
import { useAuth } from '../../context/useAuth';
import Navbar from '../../components/Navbar';
import type { Job } from '../../types';

export default function JobDetailPage() {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applicationId, setApplicationId] = useState<number | null>(null);
    const [error, setError] = useState('');

    // CV upload state
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        getJobById(Number(id))
            .then(setJob)
            .catch(() => navigate('/jobs'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleApply = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setApplying(true);
        setError('');
        try {
            const result = await applyForJob({ jobId: Number(id) });
            setApplicationId(result.id);
            setApplied(true);
        } catch {
            setError('Could not apply. You may have already applied.');
        } finally {
            setApplying(false);
        }
    };

    const handleCvUpload = async () => {
        if (!cvFile || !applicationId) return;
        setUploading(true);
        try {
            await uploadCv(applicationId, cvFile);
            setUploaded(true);
        } catch {
            setError('Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    );

    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link to="/jobs" className="text-blue-600 hover:underline text-sm">
                    ← Back to jobs
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-4">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <p className="text-blue-600 font-medium mt-1">{job.company}</p>
                        </div>
                        <span className="bg-green-50 text-green-700 font-medium px-4 py-2 rounded-full">
                            ${job.salary.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500 mb-6">
                        <span>📍 {job.location}</span>
                        <span>👤 {job.employerName}</span>
                        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <hr className="mb-6" />

                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>

                    <div className="mt-8">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
                        )}

                        {applied ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    ✅ Application submitted successfully!
                                </div>

                                {/* CV upload section */}
                                {!uploaded ? (
                                    <div className="border border-gray-200 rounded-xl p-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload your CV (PDF, optional)
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={e => setCvFile(e.target.files?.[0] ?? null)}
                                            className="block w-full text-sm text-gray-500 mb-3"
                                        />
                                        <button
                                            onClick={handleCvUpload}
                                            disabled={!cvFile || uploading}
                                            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                                        >
                                            {uploading ? 'Uploading...' : 'Upload CV'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                                        📄 CV uploaded successfully!
                                    </div>
                                )}
                            </div>
                        ) : user?.role === 'Applicant' || !isAuthenticated ? (
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {applying ? 'Applying...' : 'Apply for this job'}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}