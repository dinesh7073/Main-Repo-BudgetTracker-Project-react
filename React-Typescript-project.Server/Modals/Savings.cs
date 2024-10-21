using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Budget_Tracker_Bend.Modals
{
    public class Savings
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("_id")]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId), BsonElement("userId")]
        public string UserId { get; set; }


        [BsonElement("goal")]
        public string Goal { get; set; }

        [BsonElement("currentAmount")]
        public decimal TargetAmount { get; set; }

        [BsonElement("savedAmount")]
        public decimal SavedAmount { get; set; }

        //[BsonElement("targetDate")]
        //public DateTime TargetDate { get; set; }


    }
}
