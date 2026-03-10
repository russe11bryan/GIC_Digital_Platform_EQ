using CafeEmployeeManager.Domain.Entities;

namespace CafeEmployeeManager.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (context.Cafes.Any() || context.Employees.Any())
            return;

        var cafe1 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "CafeOne",
            Description = "Cozy cafe",
            Location = "Orchard",
            Logo = null
        };

        var cafe2 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "BrewHub",
            Description = "Modern cafe",
            Location = "Tampines",
            Logo = null
        };

        var employee1 = new Employee
        {
            Id = "UIA123456",
            Name = "Daniel",
            EmailAddress = "daniel@example.com",
            PhoneNumber = "91234567",
            Gender = "Male"
        };

        var employee2 = new Employee
        {
            Id = "UIB234567",
            Name = "Rachel",
            EmailAddress = "rachel@example.com",
            PhoneNumber = "81234567",
            Gender = "Female"
        };

        context.Cafes.AddRange(cafe1, cafe2);
        context.Employees.AddRange(employee1, employee2);

        context.EmployeeCafes.AddRange(
            new EmployeeCafe
            {
                EmployeeId = employee1.Id,
                CafeId = cafe1.Id,
                StartDate = DateTime.UtcNow.AddDays(-30)
            },
            new EmployeeCafe
            {
                EmployeeId = employee2.Id,
                CafeId = cafe2.Id,
                StartDate = DateTime.UtcNow.AddDays(-12)
            }
        );

        await context.SaveChangesAsync();
    }
}