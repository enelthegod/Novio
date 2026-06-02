import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveJobs } from '../../api/jobs';
import { useAuth } from '../../context/useAuth';
import JobCard from '../../components/JobCard';
import type { Job } from '../../types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    getActiveJobs()
      .then(data => {
        setJobs(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      )
    );
  }, [search, jobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/jobs" className="text-xl font-bold text-blue-600">Novio</Link>
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                {user?.role === 'Employer' && (
                  <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">Dashboard</Link>
                )}
                {user?.role === 'Applicant' && (
                  <Link to="/my-applications" className="text-sm text-blue-600 hover:underline">My Applications</Link>
                )}
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Sign in</Link>
                <Link to="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-blue-600 text-white py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Find your next job</h1>
          <p className="text-blue-100 mb-8">Browse hundreds of opportunities</p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company or location..."
            className="w-full max-w-xl px-5 py-3 rounded-xl text-gray-900 focus:outline-none shadow"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found</p>
        ) : (
          <div className="grid gap-4">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
