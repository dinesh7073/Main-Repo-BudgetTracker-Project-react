using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Budget_Tracker_Bend.Modals
{
    public class Users
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId), BsonElement("_id")]

        public string? Id { get; set; }

        [BsonElement("firstName")]
        public string FirstName {  get; set; }

        [BsonElement("lastName")]
        public string LastName { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }

    public class LoginDetails
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

}
