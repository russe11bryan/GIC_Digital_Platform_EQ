using MediatR;

namespace CafeEmployeeManager.Application.Employees.Commands.CreateEmployee;

public record CreateEmployeeCommand(
    string Name,
    string EmailAddress,
    string PhoneNumber,
    string Gender,
    Guid CafeId
) : IRequest<string>;
