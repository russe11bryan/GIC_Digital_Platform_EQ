using Autofac.Extensions.DependencyInjection;
using CafeEmployeeManager.Api.Middleware;
using CafeEmployeeManager.Application;
using CafeEmployeeManager.Infrastructure;
using CafeEmployeeManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    var allowedOrigins = new List<string>
    {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
    };

    // Add Vercel frontend URL if it exists in environment
    var vercelUrl = Environment.GetEnvironmentVariable("VERCEL_URL");
    if (!string.IsNullOrEmpty(vercelUrl))
    {
        allowedOrigins.Add($"https://{vercelUrl}");
    }

    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(allowedOrigins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Initialize database with seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        Console.WriteLine("Starting database migration...");
        await dbContext.Database.MigrateAsync();
        Console.WriteLine("Database migration completed.");
        
        Console.WriteLine("Starting database initialization...");
        
        // Seed initial data if needed
        Console.WriteLine("Starting database seeding...");
        SeedData.InitializeAsync(dbContext).GetAwaiter().GetResult();
        Console.WriteLine("Database initialization completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during database initialization: {ex}");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(FrontendCorsPolicy);

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();