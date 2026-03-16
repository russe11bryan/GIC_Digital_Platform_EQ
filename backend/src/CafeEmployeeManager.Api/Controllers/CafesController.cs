using CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;
using CafeEmployeeManager.Application.Cafes.Commands.DeleteCafe;
using CafeEmployeeManager.Application.Cafes.Commands.UpdateCafe;
using CafeEmployeeManager.Application.Cafes.Queries.GetCafes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployeeManager.Api.Controllers;

[ApiController]
[Route("cafes")]
[Route("api/cafes")]
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

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateCafe([FromBody] CreateCafeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCafes), new { id }, id);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateCafe([FromBody] UpdateCafeCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCafe(Guid id, [FromBody] UpdateCafeCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteCafe([FromQuery] Guid id)
    {
        await _mediator.Send(new DeleteCafeCommand(id));
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCafe(Guid id)
    {
        await _mediator.Send(new DeleteCafeCommand(id));
        return NoContent();
    }
}
