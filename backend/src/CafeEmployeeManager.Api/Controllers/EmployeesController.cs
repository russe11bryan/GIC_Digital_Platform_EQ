using CafeEmployeeManager.Application.Employees.Commands.CreateEmployee;
using CafeEmployeeManager.Application.Employees.Commands.DeleteEmployee;
using CafeEmployeeManager.Application.Employees.Commands.UpdateEmployee;
using CafeEmployeeManager.Application.Employees.Queries.GetEmployees;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployeeManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDto>>> GetEmployees([FromQuery] string? cafe)
    {
        var query = new GetEmployeesQuery(cafe);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateEmployee([FromBody] CreateEmployeeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetEmployees), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateEmployee(string id, [FromBody] UpdateEmployeeCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEmployee(string id)
    {
        await _mediator.Send(new DeleteEmployeeCommand(id));
        return NoContent();
    }
}
