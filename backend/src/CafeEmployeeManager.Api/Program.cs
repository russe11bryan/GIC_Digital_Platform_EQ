using Autofac.Extensions.DependencyInjection;
using CafeEmployeeManager.Api.Middleware;
using CafeEmployeeManager.Application;
using CafeEmployeeManager.Infrastructure;
using CafeEmployeeManager.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

try
{
    await BuildAndRunApp();
}
catch (Exception ex)
{
    Console.WriteLine($"FATAL ERROR: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}

async Task BuildAndRunApp()
{
    var builder = WebApplication.CreateBuilder(args);

    // Handle Railway DATABASE_URL environment variable
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    Console.WriteLine($"DATABASE_URL present: {!string.IsNullOrEmpty(databaseUrl)}");
    
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        try
        {
            // Convert postgres:// or postgresql:// URL to connection string
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo[0];
            var password = userInfo.Length > 1 ? userInfo[1] : "";
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 5432;
            var database = uri.LocalPath.TrimStart('/');
            
            var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
            
            builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
            Console.WriteLine($"Database connection configured: Host={host}, Port={port}, Database={database}");
            Console.WriteLine("CONNECTION STRING SET SUCCESSFULLY");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR parsing DATABASE_URL: {ex.Message}");
            throw;
        }
    }
    else
    {
        Console.WriteLine("WARNING: DATABASE_URL not set - database features may not work");
    }

    const string FrontendCorsPolicy = "FrontendCorsPolicy";

    builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

    builder.Services.AddControllers()
        .ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(e => e.Value?.Errors.Count > 0)
                    .SelectMany(e => e.Value!.Errors.Select(err => new { field = e.Key, message = err.ErrorMessage }))
                    .ToList();
                
                return new BadRequestObjectResult(new
                {
                    message = "Validation failed",
                    errors = errors
                });
            };
        });
    
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
            "http://localhost:80",
            "https://gicdigitalplatformeq-production.up.railway.app"
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

    // Initialize database with migrations and seed data in the background
    // Don't block startup if database initialization fails
    _ = Task.Run(async () =>
    {
        try
        {
            if (!string.IsNullOrEmpty(databaseUrl))
            {
                using (var scope = app.Services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    Console.WriteLine("Starting database initialization...");
                    Console.WriteLine($"Database connection string configured: {(databaseUrl != null ? "Yes" : "No")}");
                    
                    try
                    {
                        // Test connection
                        var canConnect = await dbContext.Database.CanConnectAsync();
                        Console.WriteLine($"Database connection test: {(canConnect ? "SUCCESS" : "FAILED")}");
                        
                        if (canConnect)
                        {
                            // Apply migrations
                            Console.WriteLine("Applying database migrations...");
                            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
                            Console.WriteLine($"Pending migrations: {string.Join(", ", pendingMigrations) ?? "None"}");
                            
                            await dbContext.Database.MigrateAsync();
                            Console.WriteLine("Database migrations applied successfully.");
                            
                            // Seed initial data
                            Console.WriteLine("Starting database seeding...");
                            await SeedData.InitializeAsync(dbContext);
                            Console.WriteLine("Database initialization completed successfully.");
                        }
                        else
                        {
                            Console.WriteLine("WARNING: Could not connect to database - it may not be ready yet");
                        }
                    }
                    catch (Exception migrationEx)
                    {
                        Console.WriteLine($"Migration error: {migrationEx.Message}");
                        Console.WriteLine($"Stack trace: {migrationEx.StackTrace}");
                        // Don't throw - allow app to start anyway
                    }
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
        }
    });

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