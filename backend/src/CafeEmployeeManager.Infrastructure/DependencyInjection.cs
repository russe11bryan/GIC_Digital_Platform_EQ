using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

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
            // Convert postgresql:// URL to Npgsql connection string
            // Format: postgresql://user:password@host:port/database
            var uri = new Uri(databaseUrl);
            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port == -1 ? 5432 : uri.Port,
                Database = uri.AbsolutePath.TrimStart('/'),
                Username = uri.UserInfo?.Split(':')[0] ?? "postgres",
                Password = uri.UserInfo?.Split(':')[1] ?? "",
                TrustServerCertificate = true,
                SslMode = SslMode.Require
            };
            connectionString = builder.ConnectionString;
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
}