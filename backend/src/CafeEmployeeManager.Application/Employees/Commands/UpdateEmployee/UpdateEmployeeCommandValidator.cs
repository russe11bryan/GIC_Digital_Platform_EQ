using FluentValidation;

namespace CafeEmployeeManager.Application.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Employee ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Length(6, 50).WithMessage("Name must be between 6 and 50 characters");

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

        RuleFor(x => x.CafeId)
            .NotEmpty().WithMessage("Cafe selection is required");

        RuleFor(x => x.Avatar)
            .MaximumLength(5242880).WithMessage("Avatar must not exceed 5MB")
            .When(x => !string.IsNullOrEmpty(x.Avatar));
    }
}
