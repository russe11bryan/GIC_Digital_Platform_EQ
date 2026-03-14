using CafeEmployeeManager.Domain.Entities;

namespace CafeEmployeeManager.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (context.Cafes.Any() || context.Employees.Any())
            return;

        // Create cafes
        var cafe1 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "The Daily Grind",
            Description = "Cozy neighborhood cafe with artisan coffee",
            Location = "Orchard",
            Logo = null
        };

        var cafe2 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "BrewHub",
            Description = "Modern cafe with specialty beverages",
            Location = "Tampines",
            Logo = null
        };

        var cafe3 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "Espresso Express",
            Description = "Quick service cafe for on-the-go",
            Location = "Jurong",
            Logo = null
        };

        var cafe4 = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = "Bean Scene",
            Description = "Premium cafe with roasted beans",
            Location = "Marina Bay",
            Logo = null
        };

        // Create employees
        var employee1 = new Employee
        {
            Id = "UIA123456",
            Name = "Daniel Lee",
            EmailAddress = "daniel.lee@example.com",
            PhoneNumber = "91234567",
            Gender = "Male"
        };

        var employee2 = new Employee
        {
            Id = "UIB234567",
            Name = "Rachel Wong",
            EmailAddress = "rachel.wong@example.com",
            PhoneNumber = "81234567",
            Gender = "Female"
        };

        var employee3 = new Employee
        {
            Id = "UIC345678",
            Name = "Michael Tan",
            EmailAddress = "michael.tan@example.com",
            PhoneNumber = "92345678",
            Gender = "Male"
        };

        var employee4 = new Employee
        {
            Id = "UID456789",
            Name = "Sophie Chen",
            EmailAddress = "sophie.chen@example.com",
            PhoneNumber = "83456789",
            Gender = "Female"
        };

        var employee5 = new Employee
        {
            Id = "UIE567890",
            Name = "James Kumar",
            EmailAddress = "james.kumar@example.com",
            PhoneNumber = "94567890",
            Gender = "Male"
        };

        var employee6 = new Employee
        {
            Id = "UIF678901",
            Name = "Lisa Ng",
            EmailAddress = "lisa.ng@example.com",
            PhoneNumber = "85678901",
            Gender = "Female"
        };

        var employee7 = new Employee
        {
            Id = "UIG789012",
            Name = "Unassigned Staff",
            EmailAddress = "unassigned@example.com",
            PhoneNumber = "80001111",
            Gender = "Male"
        };

        context.Cafes.AddRange(cafe1, cafe2, cafe3, cafe4);
        context.Employees.AddRange(employee1, employee2, employee3, employee4, employee5, employee6, employee7);

        context.EmployeeCafes.AddRange(
            // Cafe 1 assignments
            new EmployeeCafe
            {
                EmployeeId = employee1.Id,
                CafeId = cafe1.Id,
                StartDate = DateTime.UtcNow.AddDays(-90)
            },
            new EmployeeCafe
            {
                EmployeeId = employee3.Id,
                CafeId = cafe1.Id,
                StartDate = DateTime.UtcNow.AddDays(-45)
            },
            // Cafe 2 assignments
            new EmployeeCafe
            {
                EmployeeId = employee2.Id,
                CafeId = cafe2.Id,
                StartDate = DateTime.UtcNow.AddDays(-60)
            },
            new EmployeeCafe
            {
                EmployeeId = employee4.Id,
                CafeId = cafe2.Id,
                StartDate = DateTime.UtcNow.AddDays(-30)
            },
            // Cafe 3 assignments
            new EmployeeCafe
            {
                EmployeeId = employee5.Id,
                CafeId = cafe3.Id,
                StartDate = DateTime.UtcNow.AddDays(-15)
            },
            // Cafe 4 assignments
            new EmployeeCafe
            {
                EmployeeId = employee6.Id,
                CafeId = cafe4.Id,
                StartDate = DateTime.UtcNow.AddDays(-7)
            }
            // Note: employee7 (Unassigned Staff) has no cafe assignment for testing
        );

        await context.SaveChangesAsync();
    }
}