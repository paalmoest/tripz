using System;
using System.Collections.Generic;
using System.Linq;
using Google.Apis.QPXExpress.v1;
using Google.Apis.QPXExpress.v1.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Controllers
{
    public class TripController : Controller
    {
        private readonly Apikeys _options;

        public TripController(IOptions<Apikeys> options)
        {
            _options = options.Value;
        }
        [HttpGet("api/trip")]
        public Trip Get(string origin, string destination, int adultCount, DateTime startDate, DateTime endDate)
        {

            var service = new QPXExpressService(new BaseClientService.Initializer()
            {
                ApiKey = _options.ApiKey,
                ApplicationName = "trips",
            });


            var x = new TripsSearchRequest
            {
                Request = new TripOptionsRequest
                {
                    Passengers = new PassengerCounts {AdultCount = adultCount},
                    Slice = new List<SliceInput>
                    {
                        new SliceInput() {Origin = origin, Destination = destination, Date = startDate.ToString("yyyy-MM-dd")}
                    },
                    Solutions = 1
                }
            };
            var result = service.Trips.Search(x).Execute();

            var trip = new Trip
            {
                Price = result.Trips.TripOption[0].SaleTotal,
                DepartrueTime = result.Trips.TripOption[0].Slice[0].Segment[0].Leg[0].DepartureTime
            };
            return trip;
        }
        
        [HttpGet("api/trips")]
        public IEnumerable<Trip> GetTrips(string origin, string destination, int adultCount, DateTime startDate, DateTime endDate)
        {

            var service = new QPXExpressService(new BaseClientService.Initializer()
            {
                ApiKey = _options.ApiKey,
                ApplicationName = "trips",
            });


            var x = new TripsSearchRequest
            {
                Request = new TripOptionsRequest
                {
                    Passengers = new PassengerCounts {AdultCount = adultCount},
                    Slice = new List<SliceInput>
                    {
                        new SliceInput()
                        {
                            Origin = origin, 
                            Destination = destination, 
                            Date = startDate.ToString("yyyy-MM-dd"),
                            MaxStops = 0,
                        }
                    },
                    Solutions = 5
                }
            };
            var result = service.Trips.Search(x).Execute();

            var trips = new List<Trip>();
            foreach (var tripOption in result.Trips.TripOption)
            {
                trips.Add(new Trip
                {
                    Price = tripOption.SaleTotal,
                    Duration = tripOption.Slice[0].Segment[0].Duration.Value,
                    Carrier = result.Trips.Data.Carrier.Single(carrier => carrier.Code == tripOption.Slice[0].Segment[0].Flight.Carrier).Name,
                    Airports = result.Trips.Data.Airport.Select(airport => new Airport{Code = airport.Code, Name = airport.Name}),
                    DepartrueTime = tripOption.Slice[0].Segment[0].Leg[0].DepartureTime,
                    ArrivalTime = tripOption.Slice[0].Segment[0].Leg[0].ArrivalTime,
                    FlightNumber = $"{tripOption.Slice[0].Segment[0].Flight.Carrier}{tripOption.Slice[0].Segment[0].Flight.Number}"
                });
            }
            return trips;
        }
    }

    public class Trip
    {
        public string Carrier { get; set; }
        public string Price { get; set; }
        public IEnumerable<Airport> Airports { get; set; }
        public string DepartrueTime { get; set; }
        public string ArrivalTime { get; set; }
        public int Duration { get; set; }
        public string FlightNumber { get; set; }
    }

    public class Airport
    {
          public string Name { get; set; }
          public string Code { get; set; }
            
    }
    
}