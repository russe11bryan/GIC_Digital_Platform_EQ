namespace CafeEmployeeManager.Application.Cafes.Queries.GetCafes;

public class CafeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int Employees { get; set; }
    public string? Logo { get; set; }
    public string Location { get; set; } = default!;
}
