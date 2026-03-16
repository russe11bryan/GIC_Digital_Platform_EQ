using System.Text.Json.Serialization;

namespace CafeEmployeeManager.Application.Employees.Queries.GetEmployees;

public class EmployeeDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("emailAddress")]
    public string EmailAddress { get; set; } = default!;

    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; } = default!;

    [JsonPropertyName("gender")]
    public string Gender { get; set; } = default!;

    [JsonPropertyName("daysWorked")]
    public int DaysWorked { get; set; }

    [JsonPropertyName("cafe")]
    public string? Cafe { get; set; }

    [JsonPropertyName("cafeId")]
    public Guid? CafeId { get; set; }
}
