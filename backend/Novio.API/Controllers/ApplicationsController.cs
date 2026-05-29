using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Novio.Application.DTOs.Applications;
using Novio.Application.Interfaces;
using System.Security.Claims;

namespace Novio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    // Applicant applies for a job
    [HttpPost]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> Apply(CreateApplicationDto dto)
    {
        try
        {
            var applicantId = GetUserId();
            var result = await _applicationService.ApplyAsync(dto, applicantId);
            return CreatedAtAction(nameof(GetMyApplications), result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Applicant sees their own applications
    [HttpGet("my")]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> GetMyApplications()
    {
        var applicantId = GetUserId();
        var result = await _applicationService.GetMyApplicationsAsync(applicantId);
        return Ok(result);
    }

    // Employer sees applications for their job
    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        try
        {
            var employerId = GetUserId();
            var result = await _applicationService.GetJobApplicationsAsync(jobId, employerId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Employer updates application status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateApplicationStatusDto dto)
    {
        try
        {
            var employerId = GetUserId();
            await _applicationService.UpdateStatusAsync(id, dto, employerId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Helper - reads user id from JWT token
    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}