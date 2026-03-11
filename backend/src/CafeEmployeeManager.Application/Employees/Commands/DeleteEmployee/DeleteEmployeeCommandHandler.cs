using CafeEmployeeManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Employees.Commands.DeleteEmployee;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, Unit>
{
    private readonly IAppDbContext _context;

    public DeleteEmployeeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.EmployeeCafe)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (employee == null)
        {
            throw new KeyNotFoundException($"Employee with ID {request.Id} not found");
        }

        // Cascade delete will handle EmployeeCafe automatically
        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
