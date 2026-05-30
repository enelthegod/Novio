export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Employer' | 'Applicant';
}

export interface AuthResponse {
    token: string;
    name: string;
    email: string;
    role: string;
}

export interface Job {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
    salary: number;
    isActive: boolean;
    createdAt: string;
    employerName: string;
}

export interface JobApplication {
    id: number;
    appliedAt: string;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
    cvFilePath?: string;
    jobId: number;
    jobTitle: string;
    company: string;
    applicantId: number;
    applicantName: string;
    applicantEmail: string;
}