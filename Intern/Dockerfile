# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Cài biến môi trường để tránh lỗi fallback trên Linux
ENV DOTNET_NOLOGO=true
ENV NUGET_PACKAGES=/root/.nuget/packages
ENV NUGET_FALLBACK_PACKAGES=""

# Copy toàn bộ project
COPY Bot/. ./Bot/
WORKDIR /src/Bot

# Restore đầy đủ sau khi đã có source code
RUN dotnet restore

# Publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "Bot.dll"]
