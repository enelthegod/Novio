FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Novio.Domain/*.csproj Novio.Domain/
COPY Novio.Application/*.csproj Novio.Application/
COPY Novio.Infrastructure/*.csproj Novio.Infrastructure/
COPY Novio.API/*.csproj Novio.API/

RUN dotnet restore Novio.API/Novio.API.csproj

COPY . .
RUN dotnet publish Novio.API/Novio.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Novio.API.dll"]