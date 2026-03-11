using CafeEmployeeManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Cafes.Queries.GetCafes;

public class GetCafesQueryHandler : IRequestHandler<GetCafesQuery, List<CafeDto>>
{
    private readonly IAppDbContext _context;

    public GetCafesQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CafeDto>> Handle(GetCafesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Cafes
            .Include(c => c.EmployeeCafes)
            .AsQueryable();

        // Filter by location if provided
        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            query = query.Where(c => c.Location.ToLower() == request.Location.ToLower());
        }

        var cafes = await query
            .Select(c => new CafeDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Employees = c.EmployeeCafes.Count,
                Logo = c.Logo,
                Location = c.Location
            })
            .OrderByDescending(c => c.Employees)
            .ToListAsync(cancellationToken);

        return cafes;
    }
}
