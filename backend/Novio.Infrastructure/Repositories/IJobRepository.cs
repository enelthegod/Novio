using Novio.Domain.Entities;

namespace Novio.Application.Interfaces;

public interface IJobRepository : IRepository<Job>
{
    // Get only active jobs for the public listing page
    Task<IEnumerable<Job>> GetActiveJobsAsync();

    // Get all jobs posted by a specific employer
    Task<IEnumerable<Job>> GetJobsByEmployerAsync(int employerId);
}