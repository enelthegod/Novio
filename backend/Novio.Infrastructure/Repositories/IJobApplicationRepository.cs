using Novio.Domain.Entities;

namespace Novio.Application.Interfaces;

public interface IJobApplicationRepository : IRepository<JobApplication>
{
    // Get all applications sent by one applicant
    Task<IEnumerable<JobApplication>> GetByApplicantAsync(int applicantId);

    // Get all applications for one job (employer sees who applied)
    Task<IEnumerable<JobApplication>> GetByJobAsync(int jobId);

    // Check if applicant already applied to this job
    Task<bool> AlreadyAppliedAsync(int applicantId, int jobId);
}