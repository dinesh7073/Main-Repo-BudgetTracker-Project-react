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
            try
            {
                var savedUser = await _usersServices.SaveUserAsync(user);
                return Ok(savedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            try
            {
                Users newuser = new();

                if (user.UserName != null)

                    newuser = await _usersServices.GetUserAsync(user.UserName);

                if (newuser != null && newuser.Password == user.Password)

                    return Ok(newuser);

                else return
                        StatusCode(404, "Un-Authrization access denied");

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
