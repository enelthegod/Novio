namespace Novio.Domain.Entities;

public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Which employer posted this job
    public int EmployerId { get; set; }
    public User Employer { get; set; } = null!;

    // One job can have many applications
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}