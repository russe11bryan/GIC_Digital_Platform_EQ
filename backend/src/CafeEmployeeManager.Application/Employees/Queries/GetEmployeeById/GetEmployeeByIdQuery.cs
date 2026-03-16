using CafeEmployeeManager.Application.Employees.Queries.GetEmployees;
using MediatR;

namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployeeById;

public record GetEmployeeByIdQuery(string Id) : IRequest<EmployeeDto?>;
