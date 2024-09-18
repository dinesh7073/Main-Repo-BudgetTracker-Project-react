using Budget_Tracker_Bend;
using Budget_Tracker_Bend.Services;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.Configure<BudgetTrackerSettings>(
builder.Configuration.GetSection("BudgetTrackerConfig"));

builder.Services.AddSingleton<BudgetsServices>();
builder.Services.AddSingleton<SavingsServices>();
builder.Services.AddSingleton<UsersServices>();
builder.Services.AddSingleton<TransactionsServices>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(opt => opt.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
