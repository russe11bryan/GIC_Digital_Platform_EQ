using MediatR;

namespace CafeEmployeeManager.Application.Employees.Commands.DeleteEmployee;

public record DeleteEmployeeCommand(string Id) : IRequest<Unit>;
