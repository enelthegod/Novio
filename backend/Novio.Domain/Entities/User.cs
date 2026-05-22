using Novio.Domain.Enums;

namespace Novio.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Stored as hashed string, never plain text
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // One user can have many job applications
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}