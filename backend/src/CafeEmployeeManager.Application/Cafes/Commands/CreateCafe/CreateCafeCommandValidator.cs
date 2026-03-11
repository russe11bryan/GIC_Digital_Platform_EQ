using FluentValidation;

namespace CafeEmployeeManager.Application.Cafes.Commands.CreateCafe;

public class CreateCafeCommandValidator : AbstractValidator<CreateCafeCommand>
{
    public CreateCafeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Length(6, 10).WithMessage("Name must be between 6 and 10 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(256).WithMessage("Description must not exceed 256 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required");

        RuleFor(x => x.Logo)
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Logo));
    }
}
