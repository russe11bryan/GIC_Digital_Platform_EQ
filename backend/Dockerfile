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

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

# Health check with longer timeout for migrations
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "CafeEmployeeManager.Api.dll"]
