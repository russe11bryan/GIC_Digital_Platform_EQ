using MediatR;

namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployees;

public record GetEmployeesQuery(string? Cafe) : IRequest<List<EmployeeDto>>;
