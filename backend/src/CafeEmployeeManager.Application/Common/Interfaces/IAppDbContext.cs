using CafeEmployeeManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Cafe> Cafes { get; }
    DbSet<Employee> Employees { get; }
    DbSet<EmployeeCafe> EmployeeCafes { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
