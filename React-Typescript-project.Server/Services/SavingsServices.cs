using Budget_Tracker_Bend.Modals;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Budget_Tracker_Bend.Services
{
    public class SavingsServices
    {

        private readonly IMongoCollection<Savings> savingsModal;

        public SavingsServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);
            savingsModal = database.GetCollection<Savings>(settings.Value.SavingsCollection);

        }

        public async Task<List<Savings>> GetSavingsByUserIdAsync(string userId) =>
       await savingsModal.Find(savings => savings.UserId == userId).ToListAsync();

        public async Task<Savings> SaveSavingsAsync(Savings savings)
        {
            var existingSavings = await savingsModal.Find(s => s.Id == savings.Id).FirstOrDefaultAsync();

            if (existingSavings == null)
            {
                await savingsModal.InsertOneAsync(savings);
            }
            else
            {
                await savingsModal.ReplaceOneAsync(s => s.Id == savings.Id, savings);
            }
            return savings;
        }
        public async Task<DeleteResult> DeleteSavingsAsync(string id)
        {
            return await savingsModal.DeleteOneAsync(savings => savings.Id == id);
        }


    }
}
