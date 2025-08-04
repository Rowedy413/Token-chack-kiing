# api/validate.py
import re
from http.server import BaseHTTPRequestHandler
import json

def is_jwt(token):
    return re.match(r'^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$', token)

def is_discord(token):
    return re.match(r'^[A-Za-z0-9_\-]{20,70}$', token)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = json.loads(body)

        tokens = data.get("tokens", [])
        results = []

        for token in tokens:
            if is_jwt(token):
                results.append({"token": token, "type": "JWT", "valid": True})
            elif is_discord(token):
                results.append({"token": token, "type": "Discord", "valid": True})
            else:
                results.append({"token": token, "type": "Unknown", "valid": False})

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = json.dumps({"results": results})
        self.wfile.write(response.encode())
