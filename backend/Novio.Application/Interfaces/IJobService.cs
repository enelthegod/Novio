using Novio.Application.DTOs.Jobs;

namespace Novio.Application.Interfaces;

public interface IJobService
{
    Task<IEnumerable<JobResponseDto>> GetActiveJobsAsync();
    Task<IEnumerable<JobResponseDto>> GetMyJobsAsync(int employerId);
    Task<JobResponseDto?> GetByIdAsync(int id);
    Task<JobResponseDto> CreateAsync(CreateJobDto dto, int employerId);
    Task UpdateAsync(int id, UpdateJobDto dto, int employerId);
    Task DeleteAsync(int id, int employerId);
}