using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.UpdateCafe;

public record UpdateCafeCommand(
    Guid Id,
    string Name,
    string Description,
    string? Logo,
    string Location
) : IRequest<Unit>;
