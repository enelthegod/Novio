using Novio.Application.DTOs.Jobs;
using Novio.Application.Interfaces;
using Novio.Domain.Entities;

namespace Novio.Infrastructure.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _jobRepository;

    public JobService(IJobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    public async Task<IEnumerable<JobResponseDto>> GetActiveJobsAsync()
    {
        var jobs = await _jobRepository.GetActiveJobsAsync();
        return jobs.Select(MapToDto);
    }

    public async Task<IEnumerable<JobResponseDto>> GetMyJobsAsync(int employerId)
    {
        var jobs = await _jobRepository.GetJobsByEmployerAsync(employerId);
        return jobs.Select(MapToDto);
    }

    public async Task<JobResponseDto?> GetByIdAsync(int id)
    {
        var job = await _jobRepository.GetByIdAsync(id);
        return job == null ? null : MapToDto(job);
    }

    public async Task<JobResponseDto> CreateAsync(CreateJobDto dto, int employerId)
    {
        var job = new Job
        {
            Title = dto.Title,
            Description = dto.Description,
            Company = dto.Company,
            Location = dto.Location,
            Salary = dto.Salary,
            EmployerId = employerId
        };

        await _jobRepository.AddAsync(job);

        // Reload with employer data included
        var created = await _jobRepository.GetByIdAsync(job.Id);
        return MapToDto(created!);
    }

    public async Task UpdateAsync(int id, UpdateJobDto dto, int employerId)
    {
        var job = await _jobRepository.GetByIdAsync(id);

        if (job == null)
            throw new Exception("Job not found");

        // Only the employer who created it can update
        if (job.EmployerId != employerId)
            throw new Exception("Unauthorized");

        job.Title = dto.Title;
        job.Description = dto.Description;
        job.Location = dto.Location;
        job.Salary = dto.Salary;
        job.IsActive = dto.IsActive;

        await _jobRepository.UpdateAsync(job);
    }

    public async Task DeleteAsync(int id, int employerId)
    {
        var job = await _jobRepository.GetByIdAsync(id);

        if (job == null)
            throw new Exception("Job not found");

        // Only the employer who created it can delete
        if (job.EmployerId != employerId)
            throw new Exception("Unauthorized");

        await _jobRepository.DeleteAsync(id);
    }

    // Converts Job entity to JobResponseDto
    private static JobResponseDto MapToDto(Job job) => new()
    {
        Id = job.Id,
        Title = job.Title,
        Description = job.Description,
        Company = job.Company,
        Location = job.Location,
        Salary = job.Salary,
        IsActive = job.IsActive,
        CreatedAt = job.CreatedAt,
        EmployerName = job.Employer?.Name ?? "Unknown"
    };
}