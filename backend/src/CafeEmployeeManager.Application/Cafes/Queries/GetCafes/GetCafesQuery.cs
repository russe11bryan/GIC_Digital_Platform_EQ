using MediatR;

namespace CafeEmployeeManager.Application.Cafes.Queries.GetCafes;

public record GetCafesQuery(string? Location) : IRequest<List<CafeDto>>;
