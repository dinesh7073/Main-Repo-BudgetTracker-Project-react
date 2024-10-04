using MongoDB.Bson.Serialization.Attributes;

namespace Budget_Tracker_Bend
{
    [BsonIgnoreExtraElements]
    public class BudgetTrackerSettings
    {
         
        public string ConnectionString { get; set; }
        public string DataBaseName { get; set; }
        public string UsersCollection { get; set; }
        public string TransactionsCollection { get; set; }
        public string ExpensesLimitCollection {  get; set; }
        public string BudgetsCollection { get; set; }
        public string SavingsCollection { get; set; }
        public string ReportsCollection { get; set; }


    }
}
