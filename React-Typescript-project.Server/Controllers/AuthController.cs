using Budget_Tracker_Bend.Modals;
using Budget_Tracker_Bend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
  //using Microsoft.IdentityModel.Tokens;
using React_Typescript_project.Server.Modals;
  //using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace React_Typescript_project.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UsersServices _usersServices;

        public AuthController(IConfiguration configuration, UsersServices services)
        {
            _configuration = configuration;
            _usersServices = services;
        }



        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            try
            {
                Users newuser = new();

                if (user.UserName != null)

                    newuser = await _usersServices.GetUserAsync(user.UserName);

                var validPassword = BCrypt.Net.BCrypt.EnhancedVerify(user.Password, newuser.Password);

                if (newuser != null && validPassword)
                {
                    //  var token = GenerateJwtToken(user.UserName);

                    //  return Ok(new {token});
                }
                else return
                        StatusCode(404, "Un-Authrization access denied");
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
            return Unauthorized();
        }
    }
}
        