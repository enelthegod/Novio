using Microsoft.EntityFrameworkCore;
using Novio.Application.Interfaces;
using Novio.Domain.Entities;
using Novio.Infrastructure.Data;

namespace Novio.Infrastructure.Repositories;

public class JobRepository : BaseRepository<Job>, IJobRepository
{
    public JobRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Job>> GetActiveJobsAsync()
    {
        return await _dbSet
            .Where(j => j.IsActive)
            .Include(j => j.Employer)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Job>> GetJobsByEmployerAsync(int employerId)
    {
        return await _dbSet
            .Where(j => j.EmployerId == employerId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }
}