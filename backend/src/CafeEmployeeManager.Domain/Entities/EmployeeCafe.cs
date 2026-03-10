namespace CafeEmployeeManager.Domain.Entities;

public class EmployeeCafe
{
    public string EmployeeId { get; set; } = default!;
    public Employee Employee { get; set; } = default!;

    public Guid CafeId { get; set; }
    public Cafe Cafe { get; set; } = default!;

    public DateTime StartDate { get; set; }
}