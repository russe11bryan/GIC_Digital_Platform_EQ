using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Domain.Entities;
using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;

public class CreateCafeCommandHandler : IRequestHandler<CreateCafeCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateCafeCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCafeCommand request, CancellationToken cancellationToken)
    {
        var cafe = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Logo = request.Logo,
            Location = request.Location
        };

        _context.Cafes.Add(cafe);
        await _context.SaveChangesAsync(cancellationToken);

        return cafe.Id;
    }
}
