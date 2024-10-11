using Budget_Tracker_Bend;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using React_Typescript_project.Server.Modals;

namespace React_Typescript_project.Server.Services
{
    public class AccountsServices
    {
        private readonly IMongoCollection<Accounts> accountModal;

        public AccountsServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);
            accountModal = database.GetCollection<Accounts>(settings.Value.AccountsCollection);

        }
        public async Task<List<Accounts>> GetAccountsByUserId(string userId) =>
            await accountModal.Find(account => account.UserId == userId).ToListAsync();

        public async Task<Accounts> SaveAccountsByUserId(Accounts account)
        {
            var exisitingAccount = await accountModal.Find(a => a.Id == account.Id).FirstOrDefaultAsync();
            if (exisitingAccount == null)
            {
                await accountModal.InsertOneAsync(account);
            }
            else
            {
                await accountModal.ReplaceOneAsync(a => a.Id == account.Id, account);
            }
            return account;
        }
        public async Task<DeleteResult> DeleteAccount(string id)
        {
            return await accountModal.DeleteOneAsync(account => account.Id == id);
        }




    }
}
