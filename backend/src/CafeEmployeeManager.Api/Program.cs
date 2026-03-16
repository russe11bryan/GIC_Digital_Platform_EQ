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
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Console.WriteLine("Starting database initialization...");
        
        // Create database and schema from DbContext model
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Database schema ensured.");
        
        // Seed initial data
        Console.WriteLine("Starting database seeding...");
        SeedData.InitializeAsync(dbContext).GetAwaiter().GetResult();
        Console.WriteLine("Database initialization completed successfully.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error during database initialization: {ex}");
    // Don't throw - allow app to start even if seeding fails
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