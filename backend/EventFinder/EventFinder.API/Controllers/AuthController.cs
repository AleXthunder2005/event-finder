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
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            ITokenClaimsService tokenService,
            IAuthService authService,
            IOptions<AppOptions> appOptions,
            IRepository<User> userRepostiory,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _authService = authService;
            _appOptions = appOptions;
            _userRepository = userRepostiory;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Register called for email: {Email}", request.Email);

            var result = await _authService.RegisterAsync(request, cancellationToken);

            if (!result.Success)
            {
                _logger.LogWarning("Register failed for {Email}: {ErrorCode} - {Message}", request.Email, result.ErrorCode, result.Message);
                if (result.ResultCode == ServiceResultCode.Conflict)
                {
                    return Conflict();
                }
                return BadRequest();
            }

            _logger.LogInformation("Register succeeded for {Email}", request.Email);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            _logger.LogInformation("Login attempt for email: {Email}", request.Email);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: user not found for {Email}", request.Email);
                return NotFound();
            }

            if (user.IsEmailVerified == false)
            {
                _logger.LogWarning("Login forbidden: email not verified for {Email}", request.Email);
                return Forbid();
            }

            var valid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!valid)
            {
                _logger.LogWarning("Login failed: invalid password for {Email}", request.Email);
                return Unauthorized();
            }

            var token = _tokenService.GetToken(user.Id, user.UserProfileId.ToString());
            _logger.LogInformation("Login successful for {Email}, user id: {UserId}", request.Email, user.Id);
            return Ok(new { token });
        }

        [HttpGet("verify")]
        public async Task<IActionResult> Verify(string token, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Verify called with token: {TokenPrefix}...", token?.Substring(0, Math.Min(8, token?.Length ?? 0)));

            var result = await _authService.VerifyEmailAsync(token, cancellationToken);

            if (result.Success)
            {
                _logger.LogInformation("Email verification succeeded, generating JWT");
                var jwtToken = await _authService.GenerateJwtTokenAsync(token);
                return Ok(new { token = jwtToken });
            }

            if (result.ErrorCode == "token_expired")
            {
                _logger.LogWarning("Verification failed: token expired");
                return StatusCode(StatusCodes.Status410Gone, new
                {
                    error = result.ErrorCode,
                    message = result.Message
                });
            }

            _logger.LogWarning("Verification failed: {ErrorCode} - {Message}", result.ErrorCode, result.Message);
            return BadRequest(new
            {
                error = result.ErrorCode,
                message = result.Message
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("ResetPassword (forgot) called for email: {Email}", request.Email);

            var result = await _authService.ResetPasswordAsync(request.Email, cancellationToken);

            if (!result.Success)
            {
                _logger.LogWarning("ResetPassword failed for {Email}: {ErrorCode} - {Message}", request.Email, result.ErrorCode, result.Message);
                if (result.ResultCode == ServiceResultCode.NotFound)
                {
                    return NotFound();
                }
                return BadRequest();
            }

            _logger.LogInformation("ResetPassword (forgot) succeeded for {Email}", request.Email);
            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ChangePassword(ResetPasswodResponse resetPasswodRequest, CancellationToken cancellationToken)
        {
            _logger.LogInformation("ChangePassword called with token: {TokenPrefix}...", resetPasswodRequest.Token?.Substring(0, Math.Min(8, resetPasswodRequest.Token?.Length ?? 0)));

            var result = await _authService.ChangePasswordAsync(resetPasswodRequest.Token, resetPasswodRequest.NewPassword, cancellationToken);

            if (result.Success)
            {
                _logger.LogInformation("ChangePassword succeeded, generating JWT");
                var jwtToken = await _authService.GenerateJwtTokenAsync(resetPasswodRequest.Token);
                return Ok(new { token = jwtToken });
            }

            if (result.ErrorCode == "token_expired")
            {
                _logger.LogWarning("ChangePassword failed: token expired");
                return StatusCode(StatusCodes.Status410Gone, new
                {
                    error = result.ErrorCode,
                    message = result.Message
                });
            }

            _logger.LogWarning("ChangePassword failed: {ErrorCode} - {Message}", result.ErrorCode, result.Message);
            return BadRequest(new
            {
                error = result.ErrorCode,
                message = result.Message
            });
        }
    }
}