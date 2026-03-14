using CafeEmployeeManager.Application.Common.Interfaces;
using CafeEmployeeManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployeeManager.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Cafe> Cafes => Set<Cafe>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<EmployeeCafe> EmployeeCafes => Set<EmployeeCafe>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Cafe>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Description).IsRequired().HasMaxLength(256);
            entity.Property(x => x.Location).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Logo).HasMaxLength(500);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).IsRequired().HasMaxLength(9);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(50);
            entity.Property(x => x.EmailAddress).IsRequired().HasMaxLength(100);
            entity.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(8);
            entity.Property(x => x.Gender).IsRequired().HasMaxLength(10);
        });

        modelBuilder.Entity<EmployeeCafe>(entity =>
        {
            entity.HasKey(x => x.EmployeeId);

            entity.HasOne(x => x.Employee)
                .WithOne(x => x.EmployeeCafe)
                .HasForeignKey<EmployeeCafe>(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Cafe)
                .WithMany(x => x.EmployeeCafes)
                .HasForeignKey(x => x.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(x => x.StartDate).IsRequired();
        });
    }
}