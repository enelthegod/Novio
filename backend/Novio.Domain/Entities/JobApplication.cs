using Novio.Domain.Enums;

namespace Novio.Domain.Entities;

public class JobApplication
{
    public int Id { get; set; }
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public string? CvFilePath { get; set; }

    // Which applicant sent this
    public int ApplicantId { get; set; }
    public User Applicant { get; set; } = null!;

    // Which job this is for
    public int JobId { get; set; }
    public Job Job { get; set; } = null!;
}