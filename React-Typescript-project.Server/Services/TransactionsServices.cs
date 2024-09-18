using Budget_Tracker_Bend.Modals;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Budget_Tracker_Bend.Services
{
    public class TransactionsServices
    {

        private readonly IMongoCollection<Transactions> transactionsModal;

        public TransactionsServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);
            transactionsModal = database.GetCollection<Transactions>(settings.Value.TransactionsCollection);

        }
        public async Task<List<Transactions>> GetTransactionsByUserIdAsync(string userId) =>
      await transactionsModal.Find(transaction => transaction.UserId == userId).ToListAsync();

        public async Task<Transactions> SaveTransactionAsync(Transactions transaction)
        {

            var existingTransaction = await transactionsModal.Find(t => t.Id == transaction.Id).FirstOrDefaultAsync();

            if (existingTransaction == null)
            {
                await transactionsModal.InsertOneAsync(transaction);
            }
            else
            {
                await transactionsModal.ReplaceOneAsync(t => t.Id == transaction.Id, transaction);
            }
            return transaction;
        }
        public async Task<DeleteResult> DeleteTransactionAsync(string id)
        {
            return await transactionsModal.DeleteOneAsync(transaction => transaction.Id == id);
        }


    }
}
