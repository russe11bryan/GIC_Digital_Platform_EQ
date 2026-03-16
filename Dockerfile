# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY backend/CafeEmployeeManager.slnx ./
COPY backend/src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj backend/src/CafeEmployeeManager.Api/
COPY backend/src/CafeEmployeeManager.Application/CafeEmployeeManager.Application.csproj backend/src/CafeEmployeeManager.Application/
COPY backend/src/CafeEmployeeManager.Domain/CafeEmployeeManager.Domain.csproj backend/src/CafeEmployeeManager.Domain/
COPY backend/src/CafeEmployeeManager.Infrastructure/CafeEmployeeManager.Infrastructure.csproj backend/src/CafeEmployeeManager.Infrastructure/

RUN dotnet restore CafeEmployeeManager.slnx

COPY backend/src ./backend/src
RUN dotnet publish backend/src/CafeEmployeeManager.Api/CafeEmployeeManager.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CafeEmployeeManager.Api.dll"]
