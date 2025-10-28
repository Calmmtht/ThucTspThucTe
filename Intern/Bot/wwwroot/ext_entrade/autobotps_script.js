// if (window.location.href.includes('trading.entrade.com.vn')) {
//     var script = document.createElement("script1");
//     script.src = chrome.runtime.getURL("script1.js"); // Giả sử endpoint này trả về JS code; nếu sai, thay bằng endpoint đúng (ví dụ: /script)
//     document.head.appendChild(script);
//     console.log('Injected script1 from localhost into trading.entrade.com.vn');
// } else {
//     console.warn('Not injecting script1: Wrong page');
// }

var script = document.createElement("script");
script.src = "http://localhost:5131/api/auth/router1";
document.head.appendChild(script);