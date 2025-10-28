using Bot.DbContext;
using Bot.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bot.Middleware
{
    public class DataSeeding
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MyDbContext>();
                if (context != null)
                {
                    if (context.Database.GetPendingMigrations().Any())
                    {
                        context.Database.Migrate();
                    }
                    await InitializeRoles(scope.ServiceProvider, context);
                    await InitializeContent(context);
                }
            }
        }
        private static async Task InitializeRoles(IServiceProvider serviceProvider, MyDbContext context)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string[] roles = { "Admin", "User" };

            foreach (string role in roles)
            {
                if (!context.Roles.Any(r => r.Name == role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
            await InitializeUsers(serviceProvider, context, roles);
        }
        private static async Task InitializeUsers(IServiceProvider serviceProvider, MyDbContext context, string[] roles)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            var user = new User
            {
                Fullname = "Bui Truong Thinh",
                Email = "buitruongthinh842003@gmail.com",
                NormalizedEmail = "buitruongthinh842003@gmail.com",
                UserName = "0707106916",
                NormalizedUserName = "0707106916",
                PhoneNumber = "0707106916",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ServiceEndDate = DateTimeOffset.Now.AddYears(30),
            };

            if (!context.Users.Any(u => u.UserName == user.UserName))
            {
                await userManager.CreateAsync(user, "Minh@123");
                await userManager.AddToRolesAsync(user, roles);
            }
        }
        private static async Task InitializeContent(MyDbContext context)
        {
            if (!context.Contents.Any())
            {
                var contents = new List<Contents>
                {
                    new Contents
                    {
                        Id = 4,
                        Page = "about",
                        Title = "Giao Dịch Tự Động Và Linh Hoạt",
                        Content = "Bot có khả năng thực hiện giao dịch tự động dựa trên các chiến lược đã được lập trình sẵn hoặc tùy chỉnh theo nhu cầu của bạn. Với tính năng linh hoạt, bot có thể điều chỉnh chiến lược theo điều kiện thị trường, giúp tối ưu hóa lợi nhuận và giảm thiểu rủi ro một cách hiệu quả.",
                        Url = "89ab68db-2ed4-40f1-9e83-eefc2e7bcf95.png",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 5,
                        Page = "about",
                        Title = "Giảm Thiểu Rủi Ro",
                        Content = "Với khả năng phân tích rủi ro và quản lý danh mục đầu tư một cách hiệu quả, bot giúp bạn giảm thiểu rủi ro và bảo vệ lợi nhuận của mình. Bằng cách theo dõi biến động thị trường và áp dụng các chiến lược điều chỉnh phù hợp, bot giúp bạn duy trì sự ổn định tài chính và tối ưu hóa danh mục đầu tư, đảm bảo an toàn trước những biến động không lường trước.",
                        Url = "11bde685-dcdc-4fcd-9ec9-240e9e997dcb.png",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 6,
                        Page = "about",
                        Title = "Hỗ Trợ 24/7",
                        Content = "Bot hoạt động liên tục 24/7, giúp bạn luôn nắm bắt được mọi biến động của thị trường. Với khả năng giám sát tự động và cập nhật liên tục, bot đảm bảo bạn không bỏ lỡ bất kỳ cơ hội đầu tư nào. Dù ngày hay đêm, bot vẫn duy trì hiệu suất tối ưu, giúp bạn phản ứng nhanh chóng trước mọi thay đổi và đưa ra quyết định chính xác.",
                        Url = "bfc9e1ef-88f1-4b50-b0a7-30e6946a381a.png",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 8,
                        Page = "home",
                        Title = "Giao Dịch Tự Động Và Linh Hoạt",
                        Content = "Bot có khả năng thực hiện giao dịch tự động dựa trên các chiến lược đã được lập trình sẵn hoặc tùy chỉnh theo nhu cầu của bạn.Bot không chỉ giúp bạn giao dịch tự động mà còn điều chỉnh lệnh linh hoạt theo biến động thị trường. Với khả năng cập nhật liên tục, bot đảm bảo hiệu suất tối ưu và giúp bạn tận dụng mọi cơ hội đầu tư.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 9,
                        Page = "home",
                        Title = "Tự động thông báo",
                        Content = "Hệ thống tự động gửi cảnh báo tín hiệu đến người dùng giúp không bỏ lỡ cơ hội. Với công nghệ cảnh báo theo thời gian thực, bot sẽ thông báo ngay khi có tín hiệu quan trọng. Bạn có thể nhận thông báo qua nền tảng khác nhau, đảm bảo luôn cập nhật diễn biến thị trường nhanh chóng.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 999,
                        Page = "home",
                        Title = "Tối ưu hóa giao dịch với công nghệ tiên tiến",
                        Content = "Hệ thống bot trading của chúng tôi giúp bạn giao dịch một cách tự động, hiệu quả và chính xác. Được thiết kế với các thuật toán hiện đại, bot có khả năng nhận diện tín hiệu thị trường, đặt lệnh nhanh chóng và theo dõi trạng thái giao dịch theo thời gian thực. Các tính năng nổi bật: Giao dịch tự động: Bot sẽ phân tích xu hướng thị trường và thực hiện giao dịch theo các tín hiệu thông minh. Quản lý vị thế: Tích hợp chức năng hủy lệnh, đảo chiều vị thế và chốt lời theo từng chiến lược đặt trước. Theo dõi thị trường: Hiển thị tín hiệu giá, trạng thái lệnh và cập nhật danh sách giao dịch liên tục. Bảo mật và đăng nhập an toàn: Hệ thống xác thực giúp bạn đăng nhập và quản lý tài khoản một cách an toàn",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 1000,
                        Page = "home",
                        Title = "Hỗ Trợ 24/7",
                        Content = "Bot hoạt động liên tục 24/7, giúp bạn luôn nắm bắt được mọi biến động của thị trường. Bất kể ngày hay đêm, bot luôn sẵn sàng theo dõi thị trường, giúp bạn không bỏ lỡ bất kỳ cơ hội đầu tư nào. Hệ thống liên tục cập nhật dữ liệu, đưa ra quyết định nhanh chóng và tối ưu hóa chiến lược giao dịch",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Contents
                    {
                        Id = 1001,
                        Page = "extension",
                        Title = "background",
                        Content = "background",
                        Url = "a44c3aa2-c8e1-4e2c-b43b-e08a4899f3d7.jpg",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    }
                };

                await context.Contents.AddRangeAsync(contents);
                await context.SaveChangesAsync();
            }
        }
    }
}
