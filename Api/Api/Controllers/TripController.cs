using System;
using System.Collections.Generic;
using Google.Apis.QPXExpress.v1;
using Google.Apis.QPXExpress.v1.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Controllers
{
    public class TripController : Controller
    {
        private readonly GoogleApiOptions _options;

        public TripController(IOptions<GoogleApiOptions> options)
        {
            _options = options.Value;
        }
        [HttpGet("api/trip")]
        public Trip Get(string origin, string destination, int adultCount, DateTime departureDate)
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
                        new SliceInput() {Origin = origin, Destination = destination, Date = departureDate.ToString("yyyy-MM-dd")}
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
    }

    public class Trip
    {
        public string Price { get; set; }
        public string DepartrueTime { get; set; }
    }
    
}