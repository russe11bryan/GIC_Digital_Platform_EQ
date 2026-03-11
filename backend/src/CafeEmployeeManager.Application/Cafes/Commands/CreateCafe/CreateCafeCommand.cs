using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;

public record CreateCafeCommand(
    string Name,
    string Description,
    string? Logo,
    string Location
) : IRequest<Guid>;
