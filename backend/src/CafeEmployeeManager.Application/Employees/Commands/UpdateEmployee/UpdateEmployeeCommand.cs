using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CafeEmployeeManager.Application.Employees.Commands.UpdateEmployee;

public record UpdateEmployeeCommand(
    string Id,
    [StringLength(10, MinimumLength = 6, ErrorMessage = "Employee name must be between 6 and 10 characters")]
    string Name,
    string EmailAddress,
    string PhoneNumber,
    string Gender,
    Guid? CafeId
) : IRequest<Unit>;
