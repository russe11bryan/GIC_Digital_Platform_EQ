using CafeEmployeeManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployees;

public class GetEmployeesQueryHandler : IRequestHandler<GetEmployeesQuery, List<EmployeeDto>>
{
    private readonly IAppDbContext _context;

    public GetEmployeesQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Employees
            .Include(e => e.EmployeeCafe)
                .ThenInclude(ec => ec!.Cafe)
            .AsQueryable();

        // Filter by cafe name if provided
        if (!string.IsNullOrWhiteSpace(request.Cafe))
        {
            query = query.Where(e => e.EmployeeCafe != null && 
                                    e.EmployeeCafe.Cafe.Name.ToLower() == request.Cafe.ToLower());
        }

        var employees = await query
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                EmailAddress = e.EmailAddress,
                PhoneNumber = e.PhoneNumber,
                Gender = e.Gender,
                DaysWorked = e.EmployeeCafe != null 
                    ? (int)(DateTime.UtcNow - e.EmployeeCafe.StartDate).TotalDays 
                    : 0,
                Cafe = e.EmployeeCafe != null ? e.EmployeeCafe.Cafe.Name : null,
                CafeId = e.EmployeeCafe != null ? e.EmployeeCafe.CafeId : null
            })
            .OrderByDescending(e => e.DaysWorked)
            .ToListAsync(cancellationToken);

        return employees;
    }
}
