namespace CafeEmployeeManager.Domain.Entities;

public class Cafe
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? Logo { get; set; }
    public string Location { get; set; } = default!;

    public ICollection<EmployeeCafe> EmployeeCafes { get; set; } = new List<EmployeeCafe>();
}