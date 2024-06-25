from http.server import SimpleHTTPRequestHandler, HTTPServer
import socketserver
import os

# Define the port you want to use for serving the files
PORT = 8000

# Change the directory to where your files are located
os.chdir('C:/Users/sgm/tic/public')

# Handler to serve files
Handler = SimpleHTTPRequestHandler

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    # Start the server
    httpd.serve_forever()