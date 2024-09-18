using Budget_Tracker_Bend.Modals;
using Budget_Tracker_Bend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget_Tracker_Bend.Controllers
{

    [ApiController]
    [Route("SavingsController")]
    public class SavingsController : Controller
    {
        private readonly SavingsServices _savingsService;

        public SavingsController(SavingsServices services) =>
             _savingsService = services;

        [HttpGet("{UserId:length(24)}GetSavingsByUserId")]
        public async Task<ActionResult<List<Savings>>> GetSavingsByUserId(string UserId)
        {
            var savings = await  _savingsService.GetSavingsByUserIdAsync(UserId);
            return Ok(savings);
        }

        [HttpPost("{UserId:length(24)}CreateSavingsandUpdate")]
        public async Task<IActionResult> SaveSavings(string UserId, [FromBody] Savings savings)
        {
            try
            {

                savings.UserId = UserId;

                var savedSavings = await  _savingsService.SaveSavingsAsync(savings);
                return Ok(savedSavings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{Id:length(24)}DeleteSavings")]
        public async Task<IActionResult> DeleteSavings(string id)

        {
            try
            {
                var result = await  _savingsService.DeleteSavingsAsync(id);
                if (result.DeletedCount > 0)
                {
                    return Ok(new { message = "Savings deleted successfully" });

                }
                else
                {
                    return NotFound(new { message = "Savings not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
