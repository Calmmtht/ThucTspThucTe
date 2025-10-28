using Bot.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace Bot.Data
{
    public class MessageHub : Hub
    {
        private readonly UserConnectionManager _connectionManager;
        public MessageHub(UserConnectionManager connectionManager) => _connectionManager = connectionManager;
        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            Task.Run(async () =>
            {
                if (_connectionManager.TryGetConnection(userId, out string oldConnectionId))
                {
                    await Clients.Client(oldConnectionId).SendAsync("ServerMessage", "LOGOUT");

                    await Task.Delay(2000);
                    _connectionManager.TryRemoveConnection(userId, out _);
                    _connectionManager.TryAddConnection(userId, Context.ConnectionId);
                }
                else
                {
                    _connectionManager.TryAddConnection(userId, Context.ConnectionId);
                }
            }).GetAwaiter().GetResult();

            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
            _connectionManager.TryRemoveConnection(userId, out _);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
