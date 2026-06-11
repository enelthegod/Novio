import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyApplications } from '../../api/applications';
import { useAuth } from '../../context/useAuth';
import Navbar from '../../components/Navbar';
import type { JobApplication } from '../../types';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'Applicant') navigate('/jobs');
    }, [user, navigate]);

    useEffect(() => {
        getMyApplications()
            .then(setApplications)
            .finally(() => setLoading(false));
    }, []);

    const statusColors: Record<string, string> = {
        Pending: 'bg-yellow-50 text-yellow-700',
        Reviewed: 'bg-blue-50 text-blue-700',
        Accepted: 'bg-green-50 text-green-700',
        Rejected: 'bg-red-50 text-red-700',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">My Applications</h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg">No applications yet</p>
                        <Link to="/jobs" className="text-blue-600 hover:underline text-sm mt-2 block">
                            Browse jobs →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h2>
                                        <p className="text-blue-600 font-medium text-sm">{app.company}</p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <Link to={`/jobs/${app.jobId}`} className="text-sm text-blue-600 hover:underline">
                                        View job →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}