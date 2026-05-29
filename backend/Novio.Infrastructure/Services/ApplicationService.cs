using Novio.Application.DTOs.Applications;
using Novio.Application.Interfaces;
using Novio.Domain.Entities;
using Novio.Domain.Enums;

namespace Novio.Infrastructure.Services;

public class ApplicationService : IApplicationService
{
    private readonly IJobApplicationRepository _applicationRepository;
    private readonly IJobRepository _jobRepository;

    public ApplicationService(
        IJobApplicationRepository applicationRepository,
        IJobRepository jobRepository)
    {
        _applicationRepository = applicationRepository;
        _jobRepository = jobRepository;
    }

    public async Task<ApplicationResponseDto> ApplyAsync(CreateApplicationDto dto, int applicantId)
    {
        var job = await _jobRepository.GetByIdAsync(dto.JobId);

        if (job == null || !job.IsActive)
            throw new Exception("Job not found or not active");

        // Prevent applying to own job
        if (job.EmployerId == applicantId)
            throw new Exception("Cannot apply to your own job");

        // Prevent duplicate applications
        var alreadyApplied = await _applicationRepository.AlreadyAppliedAsync(applicantId, dto.JobId);
        if (alreadyApplied)
            throw new Exception("Already applied to this job");

        var application = new JobApplication
        {
            JobId = dto.JobId,
            ApplicantId = applicantId,
            Status = ApplicationStatus.Pending
        };

        await _applicationRepository.AddAsync(application);

        // Reload with full data
        var created = await _applicationRepository.GetByIdAsync(application.Id);
        return MapToDto(created!);
    }

    public async Task<IEnumerable<ApplicationResponseDto>> GetMyApplicationsAsync(int applicantId)
    {
        var applications = await _applicationRepository.GetByApplicantAsync(applicantId);
        return applications.Select(MapToDto);
    }

    public async Task<IEnumerable<ApplicationResponseDto>> GetJobApplicationsAsync(int jobId, int employerId)
    {
        var job = await _jobRepository.GetByIdAsync(jobId);

        if (job == null)
            throw new Exception("Job not found");

        // Only the employer who owns the job can see applications
        if (job.EmployerId != employerId)
            throw new Exception("Unauthorized");

        var applications = await _applicationRepository.GetByJobAsync(jobId);
        return applications.Select(MapToDto);
    }

    public async Task UpdateStatusAsync(int applicationId, UpdateApplicationStatusDto dto, int employerId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);

        if (application == null)
            throw new Exception("Application not found");

        var job = await _jobRepository.GetByIdAsync(application.JobId);

        // Only employer who owns the job can change status
        if (job!.EmployerId != employerId)
            throw new Exception("Unauthorized");

        application.Status = Enum.Parse<ApplicationStatus>(dto.Status);
        await _applicationRepository.UpdateAsync(application);
    }

    // Converts JobApplication entity to ApplicationResponseDto
    private static ApplicationResponseDto MapToDto(JobApplication a) => new()
    {
        Id = a.Id,
        AppliedAt = a.AppliedAt,
        Status = a.Status.ToString(),
        CvFilePath = a.CvFilePath,
        JobId = a.JobId,
        JobTitle = a.Job?.Title ?? "Unknown",
        Company = a.Job?.Company ?? "Unknown",
        ApplicantId = a.ApplicantId,
        ApplicantName = a.Applicant?.Name ?? "Unknown",
        ApplicantEmail = a.Applicant?.Email ?? "Unknown"
    };
}