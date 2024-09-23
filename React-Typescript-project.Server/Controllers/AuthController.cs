using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using React_Typescript_project.Server.Modals;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace React_Typescript_project.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login(UserLogin login)
        {
            // Validate user credentials (e.g., check from database)
            // Here, we're assuming a simple check with hardcoded values. In real apps, you'd query a database.
            if (IsValidUser(login.UserName, login.Password))
            {
                var token = GenerateJwtToken(login.UserName);


                return Ok( new { token });
            }
            return Unauthorized();
        }

        // Function to validate the username and password
        private bool IsValidUser(string username, string password)
        {
            // Replace this with your own validation logic, e.g., checking against a database
            // For example: return _userService.ValidateUser(username, password);

            // Dummy validation: for now, consider username "user" and password "password123" as valid
            if (username == "user@gmail.com" && password == "password123")
            {
                return true;
            }
            return false;
        }

        // JWT token generation logic
        private string GenerateJwtToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(_configuration["Jwt:ExpiresInMinutes"])),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult Protected()
        {
            return Ok("This is a protected API endpoint.");
        }
    }

    //// UserLogin class to receive login details from the frontend
    //public class UserLogin
    //{
    //    public string Username { get; set; }
    //    public string Password { get; set; }
    //}
}