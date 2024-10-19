using Budget_Tracker_Bend.Modals;
using Budget_Tracker_Bend.Services;
using Microsoft.AspNetCore.Mvc;
using React_Typescript_project.Server.Modals;

namespace Budget_Tracker_Bend.Controllers
{
    [ApiController]
    [Route("UsersController")]
    public class UsersController : Controller
    {
        private readonly UsersServices _usersServices;
        public UsersController(UsersServices services) =>
              _usersServices = services;

        [HttpGet]
        public async Task<ActionResult<List<Users>>> GetUsers()
        {
            var users = await _usersServices.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id:length(24)}GetUserById")]
        public async Task<ActionResult<Users>> GetUser(string id)
        {
            var user = await _usersServices.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("CreateUsersAndUpdate")]
        public async Task<IActionResult> SaveUser(Users user)
        {
            var alreadyExists = await _usersServices.GetUserByEmailAsync(user.Email);
            if (alreadyExists != null && alreadyExists.Id != user.Id)
            {
                return StatusCode(409, "A user with this email already exists.");
            }
            else
            {
                try
                {
                    if (user.Id != null)
                    {
                        user.Id = alreadyExists?.Id ?? user.Id;
                    }
                    //user.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password, 13);
                    var savedUser = await _usersServices.SaveUserAsync(user);
                    return Ok(savedUser);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            try
            {
                Users newuser = new();

                if (user.UserName != null)
                {
                    newuser = await _usersServices.GetUserAsync(user.UserName);
                    //var validPassword = BCrypt.Net.BCrypt.EnhancedVerify(user.Password, newuser.Password);
                    return Ok(newuser);
                }
                else
                {
                    return
                        StatusCode(404, "Un-Authrization access denied");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("SendOtp")]
        public async Task<IActionResult> SendOtp(Users userobj)
        {
            try
            {
                if (string.IsNullOrEmpty(userobj.Email))
                {
                    return BadRequest("Email is required.");
                }

                var user = await _usersServices.GetUserByEmailAsync(userobj.Email);

                if (user == null)
                {
                    return NotFound("User with the provided email does not exist.");
                }

                return Ok(new { UserId = user.Id, Message = "OTP sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] Users resetpassuser)
        {
            try
            {
                if (string.IsNullOrEmpty(resetpassuser.Id) || string.IsNullOrEmpty(resetpassuser.Id))
                {
                    return BadRequest("UserId and NewPassword are required.");
                }
                var user = await _usersServices.GetUserByIdAsync(resetpassuser.Id);
                if (user.Password == resetpassuser.Password)
                {
                    return BadRequest("Previous password can't be use as new password, enter another password.");
                }
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Check if new password matches the current password (commented out for now)
                // var isSamePassword = BCrypt.Net.BCrypt.Verify(resetPasswordRequest.NewPassword, user.PasswordHash);
                // if (isSamePassword)
                // {
                //     return BadRequest("Previous password can't be used as the new password. Please enter a different password.");
                // }

                user.Password = resetpassuser.Password;
                await _usersServices.SaveUserAsync(user);

                return Ok("Password has been successfully updated.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPost("RemoveUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _usersServices.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            await _usersServices.DeleteUserAsync(id);
            return NoContent();
        }


    }
}
