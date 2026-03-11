using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Unit>
{
    private readonly IAppDbContext _context;

    public UpdateEmployeeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.EmployeeCafe)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (employee == null)
        {
            throw new KeyNotFoundException($"Employee with ID {request.Id} not found");
        }

        // Verify cafe exists
        var cafeExists = await _context.Cafes
            .AnyAsync(c => c.Id == request.CafeId, cancellationToken);

        if (!cafeExists)
        {
            throw new KeyNotFoundException($"Cafe with ID {request.CafeId} not found");
        }

        // Update employee details
        employee.Name = request.Name;
        employee.EmailAddress = request.EmailAddress;
        employee.PhoneNumber = request.PhoneNumber;
        employee.Gender = request.Gender;

        // Update cafe assignment
        if (employee.EmployeeCafe != null)
        {
            if (employee.EmployeeCafe.CafeId != request.CafeId)
            {
                // Change cafe - update existing assignment
                employee.EmployeeCafe.CafeId = request.CafeId;
                employee.EmployeeCafe.StartDate = DateTime.UtcNow;
            }
        }
        else
        {
            // Create new assignment if none exists
            var employeeCafe = new EmployeeCafe
            {
                EmployeeId = request.Id,
                CafeId = request.CafeId,
                StartDate = DateTime.UtcNow
            };
            _context.EmployeeCafes.Add(employeeCafe);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
