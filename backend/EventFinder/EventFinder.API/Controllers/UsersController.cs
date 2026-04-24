using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventFinder.API.Controllers
{
    [ApiController]
    [Route("api/v1.0/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        private string CurrentUserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException();


        public UsersController(IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _userManager = userManager;
        }
        [Authorize]

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfileDto>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [Authorize]

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProfileDto>> GetById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        [Authorize]

        [HttpPost]
        public async Task<ActionResult<ProfileDto>> Create(ProfileDto dto)
        {
            var created = await _userService.CreateUserAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        [Authorize]

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ProfileDto>> Update(Guid id, ProfileDto dto)
        {
            var result = await _userService.UpdateUserAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteUserRequest request)
        {
            var deleted = await _userService.DeleteUserAsync(id, request.Password);
            ApplicationUser user = await _userManager.FindByIdAsync(CurrentUserId);
            await _userManager.DeleteAsync(user);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }

    public class DeleteUserRequest
    {
        public string Password { get; set; } = null!;
    }
}