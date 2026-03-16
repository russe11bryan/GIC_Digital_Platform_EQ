using Autofac.Extensions.DependencyInjection;
using CafeEmployeeManager.Api.Middleware;
using CafeEmployeeManager.Application;
using CafeEmployeeManager.Infrastructure;
using CafeEmployeeManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

await BuildAndRunApp();

async Task BuildAndRunApp()
{
    var builder = WebApplication.CreateBuilder(args);

    // Handle Railway DATABASE_URL environment variable
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Convert postgres:// URL to connection string
        var uri = new Uri(databaseUrl);
        var connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.LocalPath.TrimStart('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};SSL Mode=Require;Trust Server Certificate=true;";
        builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
        Console.WriteLine("Database connection configured from DATABASE_URL");
    }

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
            "http://127.0.0.1:4173",
            "http://localhost:3000",
            "http://localhost:80"
        };

        // Add Vercel frontend URL if it exists in environment
        var vercelUrl = Environment.GetEnvironmentVariable("VERCEL_URL");
        if (!string.IsNullOrEmpty(vercelUrl))
        {
            allowedOrigins.Add($"https://{vercelUrl}");
        }

        // Add Railway frontend URL if it exists
        var railwayUrl = Environment.GetEnvironmentVariable("RAILWAY_FRONTEND_URL");
        if (!string.IsNullOrEmpty(railwayUrl))
        {
            allowedOrigins.Add(railwayUrl);
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

    // Initialize database with migrations and seed data
    try
    {
        if (!string.IsNullOrEmpty(databaseUrl))
        {
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Console.WriteLine("Starting database initialization...");
                
                // Apply migrations
                Console.WriteLine("Applying database migrations...");
                await dbContext.Database.MigrateAsync();
                Console.WriteLine("Database migrations applied successfully.");
                
                // Seed initial data
                Console.WriteLine("Starting database seeding...");
                await SeedData.InitializeAsync(dbContext);
                Console.WriteLine("Database initialization completed successfully.");
            }
        }
        else
        {
            Console.WriteLine("DATABASE_URL not set - skipping database initialization");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during database initialization: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        // Don't throw - allow app to start even if seeding fails
    }

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors(FrontendCorsPolicy);

    app.UseMiddleware<ExceptionHandlingMiddleware>();

    // Add health check endpoint
    app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
    app.MapGet("/", () => Results.Ok(new { message = "API is running", endpoints = new { health = "/health", cafes = "/api/cafes" } }));

    app.UseHttpsRedirection();
    app.MapControllers();

    await app.RunAsync();
}