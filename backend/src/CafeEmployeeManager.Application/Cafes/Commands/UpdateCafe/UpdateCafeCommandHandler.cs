using CafeEmployeeManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Cafes.Commands.UpdateCafe;

public class UpdateCafeCommandHandler : IRequestHandler<UpdateCafeCommand, Unit>
{
    private readonly IAppDbContext _context;

    public UpdateCafeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateCafeCommand request, CancellationToken cancellationToken)
    {
        var cafe = await _context.Cafes
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (cafe == null)
        {
            throw new KeyNotFoundException($"Cafe with ID {request.Id} not found");
        }

        cafe.Name = request.Name;
        cafe.Description = request.Description;
        cafe.Logo = request.Logo;
        cafe.Location = request.Location;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
