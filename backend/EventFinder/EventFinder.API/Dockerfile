FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
RUN ls -la
COPY . .
RUN ls -la
WORKDIR /src/EventFinder.API
RUN ls -la
RUN dotnet restore
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EventFinder.API.dll"]