namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployees;

public class EmployeeDto
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Gender { get; set; } = default!;
    public int DaysWorked { get; set; }
    public string? Cafe { get; set; }
    public Guid? CafeId { get; set; }
}
