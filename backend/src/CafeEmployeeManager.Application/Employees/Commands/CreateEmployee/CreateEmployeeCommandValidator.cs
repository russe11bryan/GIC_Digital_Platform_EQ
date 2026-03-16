using FluentValidation;

namespace CafeEmployeeManager.Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Length(1, 100).WithMessage("Name must be between 1 and 100 characters");

        RuleFor(x => x.EmailAddress)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Length(8).WithMessage("Phone number must be exactly 8 digits")
            .Matches(@"^[89]\d{7}$").WithMessage("Phone number must start with 8 or 9");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender is required")
            .Must(g => g == "Male" || g == "Female").WithMessage("Gender must be Male or Female");

    }
}
