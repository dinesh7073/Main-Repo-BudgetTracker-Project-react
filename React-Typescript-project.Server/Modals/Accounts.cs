using Budget_Tracker_Bend.Types;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace React_Typescript_project.Server.Modals
{
    public class Accounts
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("id")]

        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId), BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("bankName")]
        public string BankName { get; set; }

        [BsonElement("accountType")]
        public AccountType AccountType { get; set; }

        [BsonElement("amount")]
        public double Amount { get; set; }


    }
}
