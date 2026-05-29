namespace Novio.Application.DTOs.Applications;

public class ApplicationResponseDto
{
    public int Id { get; set; }
    public DateTime AppliedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? CvFilePath { get; set; }

    // Job info
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;

    // Applicant info
    public int ApplicantId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
}