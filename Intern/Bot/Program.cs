// using Bot.Data;
// using Bot.Middleware;
// using Bot.Models;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.AspNetCore.HttpOverrides;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using System.Security.Claims;
// using System.Text;
// using Bot.Services.MiniServiceExpense;
// using Bot.Services.MiniServiceBotTrading;
// using Bot.Services.MiniServiceSalary;
// using Bot.Services.MiniServiceAuth;
// using Bot.Services.MiniServiceBotSignal;
// using Bot.Services.MiniServiceCaching;
// using Bot.Services.MiniServiceLogHistory;
// using Bot.Services.MiniServicePriceBot;
// using Bot.Services.MiniServiceProfitLoss;
// using Bot.Services.MiniServicePurchaseHistory;
// using Bot.Services.MiniServiceSendMail;
// using Bot.Services.MiniServiceUserBot;
// using Bot.Services.MiniServiceUser;
// using Bot.Services.MiniServiceStatistics;
// using Bot.Services.MiniServiceRole;
// using Bot.Services.MiniServicePayment;
// using Bot.DbContext;
// using System.IO;
// using Bot.Services.MiniServiceFile;
// using Bot.Services.MiniServiceContents;

// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.

// builder.Services.AddControllers();
// // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// builder.Services.AddDbContext<MyDbContext>(opt =>
// {
//     //opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
//     opt.UseMySQL(builder.Configuration.GetConnectionString("MysqlConnection") ?? "");
//     //opt.UseMySQL(builder.Configuration.GetConnectionString("MysqlCloudConnection") ?? "");
// });
// builder.Services.AddIdentity<User, IdentityRole>(opt => { 
//     opt.Password.RequireNonAlphanumeric = false;
//     opt.User.RequireUniqueEmail = true;
// })
//     .AddEntityFrameworkStores<MyDbContext>()
//     .AddTokenProvider("Ext", typeof(DataProtectorTokenProvider<User>))
//     .AddDefaultTokenProviders();

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
// }).AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters()
//     {
//         ValidateAudience = true,
//         ValidateIssuer = true,
//         ValidateLifetime = true,
//         ValidAudience = builder.Configuration.GetSection("JWT:Audience").Value,
//         ValidIssuer = builder.Configuration.GetSection("JWT:Issuer").Value,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JWT:Key").Value ?? "")),
//         ClockSkew = TimeSpan.Zero,
//     };

//     options.Events = new JwtBearerEvents()
//     {
//         OnMessageReceived = context =>
//         {
//             var accessToken = context.Request.Query["access_token"];

//             var path = context.HttpContext.Request.Path;
//             if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/realtimeSignal"))
//             {
//                 context.Token = accessToken;
//             }
//             return Task.CompletedTask;
//         },
//         OnTokenValidated = context =>
//         {
//             var versionClaim = context.Principal?.FindFirstValue(ClaimTypes.Version);
//             if (versionClaim != null && versionClaim == "Refresh_Token")
//             {
//                 context.Fail("Requests with refresh tokens are not allowed.");
//             }
//             return Task.CompletedTask;
//         }
//     };
// });
// builder.Services.AddCors(opt =>
// {
//     opt.AddPolicy("MyCors", opt =>
//     {
//         opt.WithOrigins("https://smartpro.vps.com.vn", 
//             "https://smarteasy.vps.com.vn",
//             "https://www.smartpro.vps.com.vn",
//             "https://www.smarteasy.vps.com.vn",
//             "http://42.96.5.76",
//             "http://thtcalmm.id.vn",
//             "https://thtcalmm.id.vn",
//             "http://www.thtcalmm.id.vn",
//             "https://www.thtcalmm.id.vn",
//             "http://admin.thtcalmm.id.vn",
//             "https://admin.thtcalmm.id.vn",
//             "http://www.admin.thtcalmm.id.vn",
//             "https://www.admin.thtcalmm.id.vn",
//             "http://localhost:3000",
//             "http://localhost:3001")
//             .AllowAnyMethod()
//             .AllowAnyHeader()
//             .AllowCredentials();
//     });
// });
// builder.Services.AddSignalR();
// builder.Services.AddSingleton<UserConnectionManager>();

// builder.Services.AddMemoryCache();
// builder.Services.AddSingleton<ICachingService, CachingService>();

// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<IRoleService,RoleService>();
// builder.Services.AddScoped<IBotSignalService, BotSignalService>();

// builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
// builder.Services.AddSingleton<ISendMailService, SendMailService>();

// builder.Services.AddScoped<IExpenseService, ExpenseService>();
// builder.Services.AddScoped<ILogHistoryService, LogHistoryService>();
// builder.Services.AddScoped<IPriceBotService, PriceBotService>();
// builder.Services.AddScoped<IBotTradingService, BotTradingService>();
// builder.Services.AddScoped<IProfitLossService, ProfitLossService>();
// builder.Services.AddScoped<IPurchaseHistoryService, PurchaseHistoryService>();
// builder.Services.AddScoped<ISalaryService, SalaryService>();
// builder.Services.AddScoped<IUserBotService, UserBotService>();
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<IStatisticsService, StatisticsService>();
// builder.Services.AddScoped<IPaymentService, PaymentService>();
// builder.Services.AddScoped<IFileService, FileService>();
// builder.Services.AddScoped<IContentsService, ContentsService>();
// builder.Services.AddHttpContextAccessor();

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// DataSeeding.Initialize(app.Services).Wait();

// app.UseForwardedHeaders(new ForwardedHeadersOptions
// {
//     ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
// });

// app.UseDefaultFiles();
// app.UseStaticFiles();

// app.UseHttpsRedirection();

// app.UseCors("MyCors");
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();
// app.MapHub<MessageHub>("/realtimeSignal");

// app.MapGet("/", () => "Hello World!");

// app.Run();

using Bot.Data;
using Bot.Middleware;
using Bot.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Bot.Services.MiniServiceExpense;
using Bot.Services.MiniServiceBotTrading;
using Bot.Services.MiniServiceSalary;
using Bot.Services.MiniServiceAuth;
using Bot.Services.MiniServiceBotSignal;
using Bot.Services.MiniServiceCaching;
using Bot.Services.MiniServiceLogHistory;
using Bot.Services.MiniServicePriceBot;
using Bot.Services.MiniServiceProfitLoss;
using Bot.Services.MiniServicePurchaseHistory;
using Bot.Services.MiniServiceSendMail;
using Bot.Services.MiniServiceUserBot;
using Bot.Services.MiniServiceUser;
using Bot.Services.MiniServiceStatistics;
using Bot.Services.MiniServiceRole;
using Bot.Services.MiniServicePayment;
using Bot.DbContext;
using Bot.Services.MiniServiceFile;
using Bot.Services.MiniServiceContents;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<MyDbContext>(opt =>
{
    opt.UseMySQL(builder.Configuration.GetConnectionString("MysqlConnection") ?? "");
});

// Identity
builder.Services.AddIdentity<User, IdentityRole>(opt =>
{
    opt.Password.RequireNonAlphanumeric = false;
    opt.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<MyDbContext>()
.AddTokenProvider("Ext", typeof(DataProtectorTokenProvider<User>))
.AddDefaultTokenProviders();

// Authentication (JWT)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["JWT:Key"] ?? "")),
        ClockSkew = TimeSpan.Zero,
    };

    options.Events = new JwtBearerEvents()
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/realtimeSignal"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var versionClaim = context.Principal?.FindFirstValue(ClaimTypes.Version);
            if (versionClaim != null && versionClaim == "Refresh_Token")
            {
                context.Fail("Requests with refresh tokens are not allowed.");
            }
            return Task.CompletedTask;
        }
    };
});

// CORS
builder.Services.AddCors(options =>
{
    // Production: chi allow cac domain nay
    options.AddPolicy("MyCors", policy =>
    {
        policy.WithOrigins(
            "https://smartpro.vps.com.vn",
            "https://smarteasy.vps.com.vn",
            "https://www.smartpro.vps.com.vn",
            "https://www.smarteasy.vps.com.vn",
            "https://trading.entrade.com.vn",
            "https://www.trading.entrade.com.vn",
            "http://42.96.5.76",
            "http://thtcalmm.id.vn",
            "https://thtcalmm.id.vn",
            "http://www.thtcalmm.id.vn",
            "https://www.thtcalmm.id.vn",
            "http://admin.thtcalmm.id.vn",
            "https://admin.thtcalmm.id.vn",
            "http://www.admin.thtcalmm.id.vn",
            "https://www.admin.thtcalmm.id.vn",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3052"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });

    // Dev: cho phep tat ca origin (chi dung khi test local)
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// SignalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<UserConnectionManager>();

// Memory cache
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ICachingService, CachingService>();

// DI services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IBotSignalService, BotSignalService>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddSingleton<ISendMailService, SendMailService>();
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<ILogHistoryService, LogHistoryService>();
builder.Services.AddScoped<IPriceBotService, PriceBotService>();
builder.Services.AddScoped<IBotTradingService, BotTradingService>();
builder.Services.AddScoped<IProfitLossService, ProfitLossService>();
builder.Services.AddScoped<IPurchaseHistoryService, PurchaseHistoryService>();
builder.Services.AddScoped<ISalaryService, SalaryService>();
builder.Services.AddScoped<IUserBotService, UserBotService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStatisticsService, StatisticsService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IContentsService, ContentsService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Khi dev: cho phep tat ca origin
    app.UseCors("DevCors");
}
else
{
    // Production: chi allow domain hop le
    app.UseCors("MyCors");
}

DataSeeding.Initialize(app.Services).Wait();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<MessageHub>("/realtimeSignal");

app.MapGet("/", () => "Hello World!");

app.Run();
