namespace CafeEmployeeManager.Domain.Entities;

public class Employee
{
    public string Id { get; set; } = default!; // UIXXXXXXX
    public string Name { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Gender { get; set; } = default!;

    public EmployeeCafe? EmployeeCafe { get; set; }
}