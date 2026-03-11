using CafeEmployeeManager.Application.Cafes.Queries.GetCafes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployeeManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CafesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CafesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<CafeDto>>> GetCafes([FromQuery] string? location)
    {
        var query = new GetCafesQuery(location);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
