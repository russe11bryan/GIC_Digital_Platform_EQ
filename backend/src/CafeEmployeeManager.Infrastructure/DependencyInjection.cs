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
        var connectionString = !string.IsNullOrEmpty(databaseUrl)
            ? databaseUrl
            : configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

        return services;
    }
}