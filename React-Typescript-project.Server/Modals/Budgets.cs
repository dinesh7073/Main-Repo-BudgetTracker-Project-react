using Budget_Tracker_Bend.Types;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Budget_Tracker_Bend.Modals
{
    public class Budgets
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("_id")]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId), BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("category")]
        public CategoryType Category { get; set; }

        [BsonElement("Amount")]
        public decimal Amount { get; set; }

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("endDate")]
        public DateTime EndDate { get; set; }

        [BsonElement("amountSpent")]
        public decimal AmountSpent { get; set; } = 0;
    }

 //  public class ExpenseLimit
 //  {
 //      [BsonId]
 //      [BsonRepresentation(BsonType.ObjectId), BsonElement("_id")]
 //      public string? Id { get; set; }
 //
 //      [BsonRepresentation(BsonType.ObjectId), BsonElement("userId")]
 //      public string UserId { get; set; }
 //
 //      [BsonElement("Amount")]
 //      public decimal Amount { get; set; }
 //  }


}
