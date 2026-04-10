using EventFinder.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventFinder.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1.0/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        protected string ProfileId => User.FindFirstValue(Constants.ProfileIdClaimName)!;
    }
}