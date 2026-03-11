using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Commands.DeleteCafe;

public record DeleteCafeCommand(Guid Id) : IRequest<Unit>;
