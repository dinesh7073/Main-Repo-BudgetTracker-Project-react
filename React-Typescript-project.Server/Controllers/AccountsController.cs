using Microsoft.AspNetCore.Mvc;
using React_Typescript_project.Server.Modals;
using React_Typescript_project.Server.Services;

namespace React_Typescript_project.Server.Controllers
{

    [ApiController]
    [Route("AccountsController")]
    public class AccountsController : Controller
    {
        private readonly AccountsServices _accountsServuces;
        public AccountsController(AccountsServices services) =>
            _accountsServuces = services;

        [HttpGet("{UserId:length(24)}GetAccountsByUserId")]
        public async Task<ActionResult<List<Accounts>>> GetAccountsByUserId(string UserId)
        {
            var accounts = await _accountsServuces.GetAccountsByUserId(UserId);
            return Ok(accounts);
        }
        [HttpPost("{UserId:length(24)}CreateAccountsAndUpdate")]
        public async Task<IActionResult> SaveAccounts(string UserId, [FromBody] Accounts account)
        {
            try
            {
                account.UserId = UserId;
                var savedAccount = await _accountsServuces.SaveAccountsByUserId(account);
                return Ok(savedAccount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Somthing wait wrong:{ex.Message}");
            }
        }

        [HttpPost("{id:length(24)}DeleteAccount")]
        public async Task<IActionResult> DeleteAccount(string id)
        {

            try
            {

            var reuslt = await _accountsServuces.DeleteAccount(id);
            if(reuslt.DeletedCount  > 0)
            {
                return Ok(new { message = "Account deleted successfully" });
            }
            else
            {
                return NotFound(new {message="Account not found"});
            }
            }catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error:{ex.Message}");
            }

        }

    }
}
