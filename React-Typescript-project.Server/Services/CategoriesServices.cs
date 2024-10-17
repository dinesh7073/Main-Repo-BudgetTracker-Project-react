using Budget_Tracker_Bend;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using React_Typescript_project.Server.Modals;

namespace React_Typescript_project.Server.Services
{
    public class CategoriesServices
    {

        private readonly IMongoCollection<Categories> categoryModal;
        public CategoriesServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);
            categoryModal = database.GetCollection<Categories>(settings.Value.CategoriesCollection);
        }

        public async Task<List<Categories>> GetCategoriesByUserId(string userId) =>
            await categoryModal.Find(category => category.UserId == userId).ToListAsync();

        public async Task<Categories> SaveCategoriesByUserId(Categories category)
        {
            var exisitingCategory = await categoryModal.Find(a => a.Id == category.Id).FirstOrDefaultAsync();
            if (exisitingCategory == null)
            {
                await categoryModal.InsertOneAsync(category);
            }
            else
            {
                await categoryModal.ReplaceOneAsync(a => a.Id == category.Id, category);
            }
            return category;
        }
        public async Task<DeleteResult> DeleteCategory(string id)
        {
            return await categoryModal.DeleteOneAsync(category => category.Id == id);
        }
    }
}