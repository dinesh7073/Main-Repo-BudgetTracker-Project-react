using Budget_Tracker_Bend.Modals;
using Budget_Tracker_Bend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Budget_Tracker_Bend.Controllers
{

    [ApiController]
    [Route("TransactionsController")]
    public class TransactionsControllers : Controller
    {
        private readonly TransactionsServices _transactionsServices;
        public TransactionsControllers(TransactionsServices services) =>
             _transactionsServices = services;



        [HttpGet("{UserId:length(24)}GetTransactionsByUserId")]
        public async Task<ActionResult<List<Transactions>>> GetTransactionsByUserId(string UserId)
        {
            var transactions = await  _transactionsServices.GetTransactionsByUserIdAsync(UserId);
            return Ok(transactions);
        }


        [HttpPost("{UserId:length(24)}CreateTransactionsAndUpdate")]
        public async Task<IActionResult> SaveTransaction(string UserId, [FromBody] Transactions transaction)
        {
            try
            {

                transaction.UserId = UserId;

                var savedTransaction = await  _transactionsServices.SaveTransactionAsync(transaction);
                return Ok(savedTransaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("{id:length(24)}DeleteTransaction")]
        public async Task<IActionResult> DeleteTransaction(string id)
        {
            try
            {
                var result = await  _transactionsServices.DeleteTransactionAsync(id);
                if (result.DeletedCount > 0)
                {
                    return Ok(new { message = "Transaction deleted successfully" });
                }
                else
                {
                    return NotFound(new { message = "Transaction not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
