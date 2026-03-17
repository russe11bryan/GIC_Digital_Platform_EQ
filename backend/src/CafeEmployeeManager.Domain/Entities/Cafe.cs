using System.ComponentModel.DataAnnotations;

namespace CafeEmployeeManager.Domain.Entities;

public class Cafe
{
    public Guid Id { get; set; }
    [StringLength(10, MinimumLength = 6, ErrorMessage = "Cafe name must be between 6 and 10 characters")]
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? Logo { get; set; }
    public string Location { get; set; } = default!;

    public ICollection<EmployeeCafe> EmployeeCafes { get; set; } = new List<EmployeeCafe>();
}