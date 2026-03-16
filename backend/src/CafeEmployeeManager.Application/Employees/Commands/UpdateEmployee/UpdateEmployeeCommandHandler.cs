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

        // Update employee details
        employee.Name = request.Name;
        employee.EmailAddress = request.EmailAddress;
        employee.PhoneNumber = request.PhoneNumber;
        employee.Gender = request.Gender;

        // Update cafe assignment
        if (!request.CafeId.HasValue)
        {
            if (employee.EmployeeCafe != null)
            {
                _context.EmployeeCafes.Remove(employee.EmployeeCafe);
            }
        }
        else
        {
            var cafeExists = await _context.Cafes
                .AnyAsync(c => c.Id == request.CafeId.Value, cancellationToken);

            if (!cafeExists)
            {
                throw new KeyNotFoundException($"Cafe with ID {request.CafeId} not found");
            }

            if (employee.EmployeeCafe != null)
            {
                if (employee.EmployeeCafe.CafeId != request.CafeId.Value)
                {
                    employee.EmployeeCafe.CafeId = request.CafeId.Value;
                    employee.EmployeeCafe.StartDate = DateTime.UtcNow;
                }
            }
            else
            {
                var employeeCafe = new EmployeeCafe
                {
                    EmployeeId = request.Id,
                    CafeId = request.CafeId.Value,
                    StartDate = DateTime.UtcNow
                };
                _context.EmployeeCafes.Add(employeeCafe);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
