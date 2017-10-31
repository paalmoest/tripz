using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Flurl.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Api.Controllers
{
    public class EventController : Controller
    {
        
        private readonly Apikeys _options;

        public EventController(IOptions<Apikeys> options)
        {
            _options = options.Value;
        }
        
        [HttpGet("fbevents")]
        public async Task<IEnumerable<FacebookEvent>> Get(DateTime startDate, DateTime endDate)
        {
            var url = $"https://graph.facebook.com/v2.10/search?type=place&center=59.911491,10.757933&distance=200&limit=50&fields=id,name&access_token={_options.FacebookApikey}";
            var response = await url.GetStringAsync();
            var data = JsonConvert.DeserializeObject<FacebookData>(response);
            var idsString1 = string.Join(",", data.Data.Select(x => x.Id).Take(50));
            var idsString2 = string.Join(",", data.Data.Select(x => x.Id).Skip(50).Take(50));
            var url2 = $"https://graph.facebook.com/v2.10/?ids={idsString1}&fields=name,events.fields(id,name,start_time,attending_count,ticket_uri,cover).since({startDate:yyyy-MM-dd}).until({endDate:yyyy-MM-dd})&access_token={_options.FacebookApikey}";
            var repsonseEvents = await url2.GetStringAsync();
            var data2 = JsonConvert.DeserializeObject<Dictionary<string,FacebookObj>>(repsonseEvents);
            var result = data2.Where(x => x.Value.Events != null).SelectMany(x => x.Value.Events.Data);
            return result.OrderByDescending(x => x.AttendingCount);
        }
    }

    public class Cover
    {
        public string Source { get; set; }
    }

    public class FacebookObj
    {
        public string Name { get; set; }
        
        public FacebookEvents Events { get; set; }
        
    }

    public class FacebookEventPlace
    {
        public string Id { get; set; }
        public IEnumerable<FacebookEvent> Events { get; set; }
    }
    public class FacebookEvent
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonProperty(PropertyName = "attending_count")]
        public int AttendingCount { get; set; }
        [JsonProperty(PropertyName = "start_time")]
        public DateTime StartTime { get; set; }
        [JsonProperty(PropertyName = "ticket_uri")]
        public string TicketUri { get; set; }
        public Cover Cover { get; set; }
        public string EventUrl => $"https://facebook.com/events/{Id}";

    }
    public class FacebookEvents
    {
        public List<FacebookEvent> Data { get; set; }
    }
    
    public class FacebookData
    {
        public List<FacebookPlace> Data { get; set; }
    }

    public class FacebookPlace
    {
        public string Id { get; set; }
        public float overall_rating { get; set; }
    }
}