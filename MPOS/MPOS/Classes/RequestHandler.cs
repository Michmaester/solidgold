using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using Newtonsoft.Json;

namespace MPOS.Classes
{
    public class RequestHandler
    {
        private readonly string _jwtToken = Properties.Settings.Default.JWT;
        string baseurl = SystemApp.Instance.API_BASE;

       /* public RequestHandler(string jwtToken)
        {
            _jwtToken = jwtToken;
        }*/
        public async Task<TResponse> SendPOSTRequest<TResponse>(string url, object payload)
        {
            //try
            //{
                //var payloadJson = JsonConvert.SerializeObject(payload);
                var response = await baseurl
                    .AppendPathSegment(url)
                    .WithOAuthBearerToken(_jwtToken)
                    .PostJsonAsync(payload)
                    .ReceiveJson<TResponse>();

                return response;
            //}
            //catch (FlurlHttpException ex)
            //{
            //    throw new Exception($"Error sending POST request to {url}: {ex.Message}", ex);
            //}
        }
        public async Task SendPOSTRequest(string url, object payload)
        {
            //try
            //{
                var response = await baseurl
                    .AppendPathSegment(url)
                    .WithOAuthBearerToken(_jwtToken)
                    .PostJsonAsync(payload);

                if (response.StatusCode < 300)
                {
                    // handle successful response
                }
            //}
            //catch (FlurlHttpException ex)
            //{
            //    throw new Exception($"Error sending POST request to {url}: {ex.Message}", ex);
            //}
        }

        public async Task<TResponse> SendGETRequest<TResponse>(string url, object queryParams)
        {
            try
            {
                var response = await baseurl
                    .AppendPathSegment(url)
                    .SetQueryParams(queryParams)
                    .WithOAuthBearerToken(_jwtToken)
                    .GetJsonAsync<TResponse>();

                return response;
            }
            catch (FlurlHttpException ex)
            {
                throw new Exception($"Error sending GET request to {url}: {ex.Message}", ex);
            }
        }
        public async Task SendPUTRequest(string url, object payload)
        {
            try
            {
                var response = await baseurl
                    .AppendPathSegment(url)
                    .WithOAuthBearerToken(_jwtToken)
                    .PatchJsonAsync(payload);

                if (response.StatusCode < 300)
                {
                    // handle successful response
                }
            }
            catch (FlurlHttpException ex)
            {
                throw new Exception($"Error sending POST request to {url}: {ex.Message}", ex);
            }
        }
    }
}
