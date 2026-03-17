using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;

public record CreateCafeCommand(
    [StringLength(10, MinimumLength = 6, ErrorMessage = "Cafe name must be between 6 and 10 characters")]
    string Name,
    string Description,
    string? Logo,
    string Location
) : IRequest<Guid>;
