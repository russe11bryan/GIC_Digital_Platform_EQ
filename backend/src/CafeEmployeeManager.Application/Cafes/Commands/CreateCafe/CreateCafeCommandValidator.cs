using FluentValidation;

namespace CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;

public class CreateCafeCommandValidator : AbstractValidator<CreateCafeCommand>
{
    public CreateCafeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Length(1, 100).WithMessage("Name must be between 1 and 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(256).WithMessage("Description must not exceed 256 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required");

        RuleFor(x => x.Logo)
            .MaximumLength(5242880).WithMessage("Logo must not exceed 5MB")
            .When(x => !string.IsNullOrEmpty(x.Logo));
    }
}
