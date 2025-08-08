import http.server
import socketserver
import webbrowser
import socket
from urllib.parse import urlparse

def get_local_ip():
    try:
        # Create a socket to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    local_ip = get_local_ip()
    localhost_url = f"http://localhost:{PORT}/index.html"
    network_url = f"http://{local_ip}:{PORT}/index.html"
    
    print(f"\nNeural Network Visualization is running at:")
    print(f"Local: \033[34m{localhost_url}\033[0m")
    print(f"Network: \033[34m{network_url}\033[0m")
    print("\nClick either link to open in your browser")
    print("Press Ctrl+C to stop the server\n")
    
    webbrowser.open(localhost_url)
    httpd.serve_forever()