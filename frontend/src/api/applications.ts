import api from './axios';
import type { JobApplication } from '../types';

export const applyForJob = async (data: { jobId: number }): Promise<JobApplication> => {
  const response = await api.post('/Applications', data);
  return response.data;
};

export const getMyApplications = async (): Promise<JobApplication[]> => {
  const response = await api.get('/Applications/my');
  return response.data;
};

export const getJobApplications = async (jobId: number): Promise<JobApplication[]> => {
  const response = await api.get(`/Applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string): Promise<void> => {
  await api.put(`/Applications/${id}/status`, { status });
};


export const uploadCv = async (applicationId: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/Applications/${applicationId}/cv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.filePath;
};
