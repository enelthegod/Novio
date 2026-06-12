import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyJobs, createJob, deleteJob } from '../../api/jobs';
import { getJobApplications, updateApplicationStatus } from '../../api/applications';
import { useAuth } from '../../context/useAuth';
import Navbar from '../../components/Navbar';
import type { Job, JobApplication } from '../../types';

export default function EmployerDashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'Employer') navigate('/jobs');
    }, [user, navigate]);

    useEffect(() => {
        getMyJobs()
            .then(setJobs)
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);
        try {
            const newJob = await createJob({
                title, description, company, location,
                salary: Number(salary)
            });
            setJobs(prev => [newJob, ...prev]);
            setShowForm(false);
            resetForm();
        } catch {
            setFormError('Failed to create job. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this job?')) return;
        try {
            await deleteJob(id);
            setJobs(prev => prev.filter(j => j.id !== id));
            if (selectedJobId === id) {
                setSelectedJobId(null);
                setApplications([]);
            }
        } catch {
            alert('Failed to delete job.');
        }
    };

    const handleViewApplications = async (jobId: number) => {
        if (selectedJobId === jobId) {
            setSelectedJobId(null);
            setApplications([]);
            return;
        }
        setSelectedJobId(jobId);
        const data = await getJobApplications(jobId);
        setApplications(data);
    };

    const handleStatusChange = async (appId: number, status: string) => {
        try {
            await updateApplicationStatus(appId, status);
            setApplications(prev =>
                prev.map(a => a.id === appId ? { ...a, status: status as JobApplication['status'] } : a)
            );
        } catch {
            alert('Failed to update status.');
        }
    };

    const resetForm = () => {
        setTitle(''); setDescription(''); setCompany('');
        setLocation(''); setSalary(''); setFormError('');
    };

    const statusColors: Record<string, string> = {
        Pending: 'bg-yellow-50 text-yellow-700',
        Reviewed: 'bg-blue-50 text-blue-700',
        Accepted: 'bg-green-50 text-green-700',
        Rejected: 'bg-red-50 text-red-700',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
                    <button
                        onClick={() => { setShowForm(!showForm); resetForm(); }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        {showForm ? 'Cancel' : '+ Post a Job'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Job</h2>
                        {formError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{formError}</div>
                        )}
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Frontend Developer" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input value={company} onChange={e => setCompany(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Tech Corp" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input value={location} onChange={e => setLocation(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. London" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
                                <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. 50000" required />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4} placeholder="Describe the role..." required />
                            </div>
                            <div className="col-span-2">
                                <button type="submit" disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                                    {submitting ? 'Posting...' : 'Post Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg">No jobs posted yet</p>
                        <p className="text-sm mt-1">Click "Post a Job" to get started</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                                        <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewApplications(job.id)}
                                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                                        >
                                            {selectedJobId === job.id ? 'Hide' : 'Applications'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {selectedJobId === job.id && (
                                    <div className="mt-4 border-t pt-4">
                                        {applications.length === 0 ? (
                                            <p className="text-sm text-gray-400">No applications yet</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {applications.map(app => (
                                                    <div key={app.id} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{app.applicantName}</p>
                                                        <p className="text-gray-500 text-xs">{app.applicantEmail}</p>
                                                        {app.cvFilePath && (
                                                              <a>
                                                                href={`http://localhost:5000${app.cvFilePath}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 text-xs hover:underline"
                                                            
                                                                📄 View CV
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                                                            {app.status}
                                                        </span>
                                                        <select
                                                            value={app.status}
                                                            onChange={e => handleStatusChange(app.id, e.target.value)}
                                                            className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Reviewed">Reviewed</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            )}
        </div>
    </div >
);
}