using Budget_Tracker_Bend.Modals;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Budget_Tracker_Bend.Services
{
    public class BudgetsServices
    {

        private readonly IMongoCollection<Budgets> budgetsModal;
        private readonly IMongoCollection<ExpenseLimit> expenseLimitModal;
        public BudgetsServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);

            budgetsModal = database.GetCollection<Budgets>(settings.Value.BudgetsCollection);
            expenseLimitModal = database.GetCollection<ExpenseLimit>(settings.Value.ExpensesLimitCollection);
        }


        public async Task<List<Budgets>> GetBudgetsByUserIdAsync(string userId) =>
            await budgetsModal.Find(budget => budget.UserId == userId).ToListAsync();

        public async Task<Budgets> SaveBudgetAsync(Budgets budget)
        {
            var existingBudget = await budgetsModal.Find(b => b.Id == budget.Id).FirstOrDefaultAsync();

            if (existingBudget == null)
            {
                await budgetsModal.InsertOneAsync(budget);
            }
            else
            {
                await budgetsModal.ReplaceOneAsync(b => b.Id == budget.Id, budget);
            }

            return budget;
        }
        public async Task<DeleteResult> DeleteBudgetAsync(string id)
        {
            return await budgetsModal.DeleteOneAsync(budget => budget.Id == id);
        }



        public async Task<List<ExpenseLimit>> GetExpensesLimitByUserIdAsync(string userId) =>
          await expenseLimitModal.Find(limit => limit.UserId == userId).ToListAsync();

        public async Task<ExpenseLimit> SaveExpensesLimitAsync(ExpenseLimit limits)
        {

            var existingLimit = await expenseLimitModal.Find(b => b.UserId == limits.UserId).FirstOrDefaultAsync();

            if (existingLimit == null)
            {
                await expenseLimitModal.InsertOneAsync(limits);
            }
            else
            {
                await expenseLimitModal.ReplaceOneAsync(b => b.UserId == limits.UserId, limits);
            }
            return limits;
        }



    }
}
