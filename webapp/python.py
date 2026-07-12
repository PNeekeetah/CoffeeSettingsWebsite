import http.server

server = http.server.HTTPServer(("0.0.0.0", 8000), http.server.SimpleHTTPRequestHandler)
print("Server started at http://0.0.0.0:8000")
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    server.server_close()         
