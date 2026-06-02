"""绝区零驱动盘分析器 — 桌面应用启动器

使用 pywebview 创建原生窗口，内嵌 Web UI。
打包后为单个 exe，用户无需安装浏览器或任何依赖。
"""

import http.server
import socketserver
import os
import sys
import socket
import threading
from typing import Any

import webview


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def get_web_ui_path():
    if getattr(sys, "frozen", False):
        base_path: Any = sys._MEIPASS  # type: ignore[attr-defined]
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, "web-ui")


def get_base_path():
    if getattr(sys, "frozen", False):
        return sys._MEIPASS  # type: ignore[attr-defined]
    return os.path.dirname(os.path.abspath(__file__))


def main():
    base_path = get_base_path()
    web_ui_path = get_web_ui_path()
    index_path = os.path.join(web_ui_path, "index.html")

    if not os.path.isfile(index_path):
        sys.exit(f"错误: 找不到 {index_path}")

    port = find_free_port()
    # 将工作目录设置为base_path，这样可以访问到CSV文件
    os.chdir(base_path)

    # 启动内置 HTTP 服务器（WebView2 需要 HTTP 才能加载 ES Modules）
    # 禁用目录列表，只允许访问特定文件
    class RestrictedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def list_directory(self, path):
            # 禁用目录列表功能
            self.send_error(403, "Directory listing not allowed")

        def do_GET(self):
            # 将根路径重定向到index.html
            if self.path == '/':
                self.send_response(301)
                self.send_header('Location', '/web-ui/index.html')
                self.end_headers()
                return
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    httpd = ReusableTCPServer(
        ("127.0.0.1", port), RestrictedHTTPRequestHandler
    )
    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    url = f"http://127.0.0.1:{port}/web-ui/index.html"

    # 创建原生窗口
    webview.create_window(
        title="绝区零驱动盘分析器",
        url=url,
        width=1400,
        height=900,
        min_size=(800, 600),
    )
    webview.start()

    # 用户关闭窗口后退出
    httpd.shutdown()


if __name__ == "__main__":
    main()
