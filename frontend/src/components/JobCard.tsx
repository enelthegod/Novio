import { Link } from 'react-router-dom';
import type { Job } from '../types';

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
          <p className="text-blue-600 font-medium">{job.company}</p>
        </div>
        <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
          ${job.salary.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-4 mt-3 text-sm text-gray-500">
        <span>📍 {job.location}</span>
        <span>👤 {job.employerName}</span>
      </div>
      <p className="text-gray-600 text-sm mt-3 line-clamp-2">{job.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
        <Link to={`/jobs/${job.id}`} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          View Job
        </Link>
      </div>
    </div>
  );
}
