using EventFinder.Application.DTOs;
using EventFinder.Application.Interfaces;
using EventFinder.Domain.Entities;
using EventFinder.Infrastructure.Identity;
using EventFinder.Infrastructure.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace EventFinder.API.Controllers
{
    [Route("api/v1.0/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly ITokenClaimsService _tokenService;

        private readonly IAuthService _authService;

        private readonly IOptions<AppOptions> _appOptions;

        private readonly IRepository<User> _userRepository;

        public AuthController(UserManager<ApplicationUser> userManager, ITokenClaimsService tokenService, IAuthService authService, IOptions<AppOptions> appOptions)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _authService = authService;
            _appOptions = appOptions;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.RegisterAsync(request, cancellationToken);

            if (!result.Success)
            {
                if (result.ResultCode == ServiceResultCode.Conflict)
                {
                    return Conflict();
                }

                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return NotFound();
            }

            if (user.IsEmailVerified == false)
            {
                return Forbid();
            }

            var valid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!valid)
            {
                return Unauthorized();
            }

            var token = _tokenService.GetToken(user.Id, user.UserId.ToString());
            return Ok(new { token });
        }

        [HttpGet("verify")]
        public async Task<IActionResult> Verify(string token, CancellationToken cancellationToken)
        {
            var result = await _authService.VerifyEmailAsync(token, cancellationToken);

            if (result.Success)
            {
                var jwtToken = await _authService.GenerateJwtTokenAsync(token);
                return Ok(new { token = jwtToken });
            }

            if (result.ErrorCode == "token_expired")
            {
                return StatusCode(StatusCodes.Status410Gone, new
                {
                    error = result.ErrorCode,
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                error = result.ErrorCode,
                message = result.Message
            });
        }

        [Authorize]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ResetPassword([FromBody] string email, CancellationToken cancellationToken)
        {
            var result = await _authService.ResetPasswordAsync(email, cancellationToken);

            if (!result.Success)
            {
                if (result.ResultCode == ServiceResultCode.NotFound)
                {
                    return NotFound();
                }

                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ChangePassword(ResetPasswodRequest resetPasswodRequest, CancellationToken cancellationToken)
        {
            var result = await _authService.ChangePasswordAsync(resetPasswodRequest.Token, resetPasswodRequest.NewPassword, cancellationToken);

            if (result.Success)
            {
                var jwtToken = await _authService.GenerateJwtTokenAsync(resetPasswodRequest.Token);
                return Ok(new { token = jwtToken });
            }

            if (result.ErrorCode == "token_expired")
            {
                return StatusCode(StatusCodes.Status410Gone, new
                {
                    error = result.ErrorCode,
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                error = result.ErrorCode,
                message = result.Message
            });
        }
    }
}