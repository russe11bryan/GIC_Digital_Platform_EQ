FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY CafeEmployeeManager.slnx ./
COPY src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj src/CafeEmployeeManager.Api/
COPY src/CafeEmployeeManager.Application/CafeEmployeeManager.Application.csproj src/CafeEmployeeManager.Application/
COPY src/CafeEmployeeManager.Domain/CafeEmployeeManager.Domain.csproj src/CafeEmployeeManager.Domain/
COPY src/CafeEmployeeManager.Infrastructure/CafeEmployeeManager.Infrastructure.csproj src/CafeEmployeeManager.Infrastructure/

RUN dotnet restore CafeEmployeeManager.slnx

COPY src ./src
RUN dotnet publish src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CafeEmployeeManager.Api.dll"]
