using CafeEmployeeManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Cafes.Commands.DeleteCafe;

public class DeleteCafeCommandHandler : IRequestHandler<DeleteCafeCommand, Unit>
{
    private readonly IAppDbContext _context;

    public DeleteCafeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCafeCommand request, CancellationToken cancellationToken)
    {
        var cafe = await _context.Cafes
            .Include(c => c.EmployeeCafes)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (cafe == null)
        {
            throw new KeyNotFoundException($"Cafe with ID {request.Id} not found");
        }

        // Cascade delete will handle EmployeeCafes automatically
        _context.Cafes.Remove(cafe);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
