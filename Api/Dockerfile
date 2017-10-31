FROM microsoft/dotnet:2.0-sdk
COPY . /dotnetapp/
WORKDIR /dotnetapp/api
ENV ASPNETCORE_URLS=http://+:80
RUN dotnet restore
RUN dotnet build -c release build/
WORKDIR /dotnetapp/build/
ENTRYPOINT ["dotnet", "bin/release/netcoreapp1.1/CalendarSvc.dll"]