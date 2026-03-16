using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CafeEmployeeManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        string connectionString;

        if (!string.IsNullOrEmpty(databaseUrl))
        {
            // Use the DATABASE_URL directly - convert postgresql:// to Server= format
            // Railway format: postgresql://user:password@host:port/database
            connectionString = ConvertPostgresUrlToConnectionString(databaseUrl);
        }
        else
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

        return services;
    }

    private static string ConvertPostgresUrlToConnectionString(string postgresUrl)
    {
        // postgresql://user:password@host:port/database -> 
        // Server=host;Port=port;Database=database;Username=user;Password=password;SSL Mode=Require;Trust Server Certificate=true;
        var uri = new Uri(postgresUrl);
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        var database = uri.AbsolutePath.TrimStart('/');
        var host = uri.Host;
        var port = uri.Port == -1 ? 5432 : uri.Port;

        return $"Server={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;";
    }
}