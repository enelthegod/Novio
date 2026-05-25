using Microsoft.EntityFrameworkCore;
using Novio.Application.Interfaces;
using Novio.Domain.Entities;
using Novio.Infrastructure.Data;

namespace Novio.Infrastructure.Repositories;

public class JobApplicationRepository : BaseRepository<JobApplication>, IJobApplicationRepository
{
    public JobApplicationRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<JobApplication>> GetByApplicantAsync(int applicantId)
    {
        return await _dbSet
            .Where(a => a.ApplicantId == applicantId)
            .Include(a => a.Job)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<JobApplication>> GetByJobAsync(int jobId)
    {
        return await _dbSet
            .Where(a => a.JobId == jobId)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();
    }

    public async Task<bool> AlreadyAppliedAsync(int applicantId, int jobId)
    {
        return await _dbSet
            .AnyAsync(a => a.ApplicantId == applicantId && a.JobId == jobId);
    }
}