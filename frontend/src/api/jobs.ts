import api from './axios';
import type { Job } from '../types';

export const getActiveJobs = async (): Promise<Job[]> => {
  const response = await api.get('/Jobs');
  return response.data;
};

export const getJobById = async (id: number): Promise<Job> => {
  const response = await api.get(`/Jobs/${id}`);
  return response.data;
};

export const getMyJobs = async (): Promise<Job[]> => {
  const response = await api.get('/Jobs/my');
  return response.data;
};

export const createJob = async (data: Omit<Job, 'id' | 'createdAt' | 'isActive' | 'employerName'>): Promise<Job> => {
  const response = await api.post('/Jobs', data);
  return response.data;
};

export const updateJob = async (id: number, data: Partial<Job>): Promise<void> => {
  await api.put(`/Jobs/${id}`, data);
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/Jobs/${id}`);
};
