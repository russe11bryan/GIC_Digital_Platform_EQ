using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.UpdateCafe;

public record UpdateCafeCommand(
    Guid Id,
    [StringLength(10, MinimumLength = 6, ErrorMessage = "Cafe name must be between 6 and 10 characters")]
    string Name,
    string Description,
    string? Logo,
    string Location
) : IRequest<Unit>;
