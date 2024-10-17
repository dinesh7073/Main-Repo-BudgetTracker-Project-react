using Budget_Tracker_Bend.Types;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace React_Typescript_project.Server.Modals
{
    public class Categories
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("id")]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId), BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("categoryName")]
        public string CategoryName { get; set; }

        [BsonElement("categoryType")]
        public TransactionType CategoryType { get; set; }

        [BsonElement("categoryNumber")]
        public  decimal CategoryNumber { get; set; }


    }
}
