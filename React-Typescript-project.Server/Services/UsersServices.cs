using Budget_Tracker_Bend.Modals;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Budget_Tracker_Bend.Services
{
    public class UsersServices
    {
        private readonly IMongoCollection<Users> usersModal;

        public UsersServices(IOptions<BudgetTrackerSettings> settings)
        {
            var MongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = MongoClient.GetDatabase(settings.Value.DataBaseName);
            usersModal = database.GetCollection<Users>(settings.Value.UsersCollection);

        }

        public async Task<List<Users>> GetUsersAsync() =>
           await usersModal.Find(_ => true).ToListAsync();
        public async Task<Users> GetUserAsync(string userName) =>
            await usersModal.Find(u => u.Email == userName).FirstOrDefaultAsync();

        public async Task<Users> GetUserByIdAsync(string id) =>
            await usersModal.Find(user => user.Id == id).FirstOrDefaultAsync();

        public async Task<Users> GetUserByEmailAsync(string email)
        {
            var filter = Builders<Users>.Filter.Eq(user => user.Email, email);
            return await usersModal.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<Users> SaveUserAsync(Users users)
        {
            var existingUser = await usersModal.Find(u => u.Id == users.Id).FirstOrDefaultAsync();

            if (existingUser == null)
            {
                await usersModal.InsertOneAsync(users);
            }
            else
            {
                await usersModal.ReplaceOneAsync(u => u.Id == users.Id, users);
            }
            return users;
        }
        public async Task DeleteUserAsync(string id) =>

               await usersModal.DeleteOneAsync(user => user.Id == id);


    }
}
