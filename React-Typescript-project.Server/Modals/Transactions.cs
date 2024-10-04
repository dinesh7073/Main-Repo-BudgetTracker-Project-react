using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Budget_Tracker_Bend.Types;

namespace Budget_Tracker_Bend.Modals
{
    public class Transactions
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("_id")]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId),BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("TType")]
        public  TransactionType TransactionType { get; set; }   

        [BsonElement("accountType")]
        public AccountType AccountType { get; set; }

        [BsonElement("category")]
        public CategoryType CategoryType { get; set; } 

        [BsonElement("label")]
        public string Label { get; set; }

        [BsonElement("amount")]
        public decimal Amount { get; set; }

        [BsonElement("date")]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [BsonElement("time")]
        public DateTime Time { get; set; } = DateTime.UtcNow;



    }
   


}
