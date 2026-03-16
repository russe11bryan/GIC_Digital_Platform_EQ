using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, string>
{
    private readonly IAppDbContext _context;

    public CreateEmployeeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        if (request.CafeId.HasValue)
        {
            var cafeExists = await _context.Cafes
                .AnyAsync(c => c.Id == request.CafeId.Value, cancellationToken);

            if (!cafeExists)
            {
                throw new KeyNotFoundException($"Cafe with ID {request.CafeId} not found");
            }
        }

        // Generate employee ID (UIXXXXXXX format)
        var employeeId = await GenerateEmployeeId(cancellationToken);

        var employee = new Employee
        {
            Id = employeeId,
            Name = request.Name,
            EmailAddress = request.EmailAddress,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender
        };

        _context.Employees.Add(employee);

        if (request.CafeId.HasValue)
        {
            var employeeCafe = new EmployeeCafe
            {
                EmployeeId = employeeId,
                CafeId = request.CafeId.Value,
                StartDate = DateTime.UtcNow
            };
            _context.EmployeeCafes.Add(employeeCafe);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return employee.Id;
    }

    private async Task<string> GenerateEmployeeId(CancellationToken cancellationToken)
    {
        var random = new Random();
        string employeeId;
        bool exists;

        do
        {
            var randomNumber = random.Next(1000000, 9999999);
            employeeId = $"UI{randomNumber}";
            exists = await _context.Employees
                .AnyAsync(e => e.Id == employeeId, cancellationToken);
        } while (exists);

        return employeeId;
    }
}
