using MediatR;

namespace CafeEmployeeManager.Application.Employees.Commands.UpdateEmployee;

public record UpdateEmployeeCommand(
    string Id,
    string Name,
    string EmailAddress,
    string PhoneNumber,
    string Gender,
    Guid CafeId,
    string? Avatar = null
) : IRequest<Unit>;
