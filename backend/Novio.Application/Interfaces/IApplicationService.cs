using Novio.Application.DTOs.Applications;

namespace Novio.Application.Interfaces;

public interface IApplicationService
{
    // Applicant applies for a job
    Task<ApplicationResponseDto> ApplyAsync(CreateApplicationDto dto, int applicantId);

    // Applicant sees their own applications
    Task<IEnumerable<ApplicationResponseDto>> GetMyApplicationsAsync(int applicantId);

    // Employer sees all applications for their job
    Task<IEnumerable<ApplicationResponseDto>> GetJobApplicationsAsync(int jobId, int employerId);

    // Employer changes application status
    Task UpdateStatusAsync(int applicationId, UpdateApplicationStatusDto dto, int employerId);

    // New - upload CV for an existing application
    Task UploadCvAsync(int applicationId, int applicantId, string filePath);
}