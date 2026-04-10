FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
WORKDIR /src/EventFinder.API
RUN dotnet restore
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

RUN apt-get update && apt-get install -y openssl

RUN mkdir -p /root/.aspnet/https \
    && openssl req -x509 -nodes -days 365 \
       -newkey rsa:2048 \
       -keyout /root/.aspnet/https/EventFinder.key \
       -out /root/.aspnet/https/EventFinder.crt \
       -subj "/CN=localhost" \
    && openssl pkcs12 -export \
       -out /root/.aspnet/https/EventFinder.pfx \
       -inkey /root/.aspnet/https/EventFinder.key \
       -in /root/.aspnet/https/EventFinder.crt \
       -passout pass:password

ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/EventFinder.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password
ENV ASPNETCORE_URLS=https://+:8443;http://+:8080

ENTRYPOINT ["dotnet", "EventFinder.API.dll"]