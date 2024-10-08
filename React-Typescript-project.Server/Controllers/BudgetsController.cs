using Budget_Tracker_Bend.Modals;
using Budget_Tracker_Bend.Services;
using Microsoft.AspNetCore.Mvc;


namespace Budget_Tracker_Bend.Controllers
{
    [ApiController]
    [Route("BudgetsController")]
    public class BudgetsController : Controller
    {
        private readonly BudgetsServices _budgetService;

        public BudgetsController(BudgetsServices services)
        {

            _budgetService = services;

        }




        [HttpGet("{Id:length(24)}GetBudgetById")]
        public async Task<ActionResult<List<Budgets>>> GetBudgetsByUserId(string Id)
        {
            var budgets = await _budgetService.GetBudgetsByUserIdAsync(Id);
            return Ok(budgets);
        }

        [HttpPost("{Id:length(24)}CreateBudgetAndUpdate")]
        public async Task<IActionResult> SaveBudget(Budgets budget)
        {
            try
            {

                var savedBudget = await _budgetService.SaveBudgetAsync(budget);
                return Ok(savedBudget);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{Id:length(24)}DeleteBudget")]
        public async Task<IActionResult> DeleteBudget(string id)
        {
            await _budgetService.DeleteBudgetAsync(id);
            return NoContent();
        }

        [HttpGet("{UserId:length(24)}GetExpenseLimitById")]
        public async Task<ActionResult<List<ExpenseLimit>>> GetExpenseLimitByUserId(string UserId)
        {
            var limits = await _budgetService.GetExpensesLimitByUserIdAsync(UserId);
            return Ok(limits[0]);
        }

        [HttpPost("{UserId:length(24)}CreateExpenseLimitAndUpdate")]
        public async Task<IActionResult> SaveLimit(ExpenseLimit limit)
        {
            try
            {
                var savelimit = await _budgetService.SaveExpensesLimitAsync(limit);
                return Ok(savelimit);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





    }
}
