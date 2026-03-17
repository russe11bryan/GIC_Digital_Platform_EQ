using System.ComponentModel.DataAnnotations;

namespace CafeEmployeeManager.Domain.Entities;

public class Employee
{
    public string Id { get; set; } = default!; // UIXXXXXXX
    [StringLength(10, MinimumLength = 6, ErrorMessage = "Employee name must be between 6 and 10 characters")]
    public string Name { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Gender { get; set; } = default!;

    public EmployeeCafe? EmployeeCafe { get; set; }
}
