using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Novio.Application.DTOs.Jobs;
using Novio.Application.Interfaces;
using System.Security.Claims;

namespace Novio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    // Public - anyone can see active jobs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var jobs = await _jobService.GetActiveJobsAsync();
        return Ok(jobs);
    }

    // Public - anyone can see a single job
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var job = await _jobService.GetByIdAsync(id);
        return job == null ? NotFound() : Ok(job);
    }

    // Employer only - their own jobs
    [HttpGet("my")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> GetMyJobs()
    {
        var employerId = GetUserId();
        var jobs = await _jobService.GetMyJobsAsync(employerId);
        return Ok(jobs);
    }

    // Employer only - create a job
    [HttpPost]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Create(CreateJobDto dto)
    {
        try
        {
            var employerId = GetUserId();
            var job = await _jobService.CreateAsync(dto, employerId);
            return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Employer only - update their job
    [HttpPut("{id}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Update(int id, UpdateJobDto dto)
    {
        try
        {
            var employerId = GetUserId();
            await _jobService.UpdateAsync(id, dto, employerId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Employer only - delete their job
    [HttpDelete("{id}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var employerId = GetUserId();
            await _jobService.DeleteAsync(id, employerId);
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