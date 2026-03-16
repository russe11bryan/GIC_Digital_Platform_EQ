using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Application.Employees.Queries.GetEmployees;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployeeById;

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto?>
{
    private readonly IAppDbContext _context;

    public GetEmployeeByIdQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<EmployeeDto?> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Include(e => e.EmployeeCafe)
                .ThenInclude(ec => ec!.Cafe)
            .Where(e => e.Id == request.Id)
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
            .SingleOrDefaultAsync(cancellationToken);
    }
}
