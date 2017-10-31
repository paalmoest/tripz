FROM microsoft/dotnet:2.0-sdk
COPY . /dotnetapp/
WORKDIR /dotnetapp/
ENV ASPNETCORE_URLS=http://+:80
RUN dotnet restore
RUN dotnet build -c release
ENTRYPOINT ["dotnet", "bin/Release/netcoreapp2.0/Api.dll"]