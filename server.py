import argparse
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


def get_dist_path():
    if getattr(sys, "frozen", False):
        return Path(sys._MEIPASS) / "dist"
    return Path(__file__).resolve().parent / "dist"


class SpaHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        self.web_root = Path(directory).resolve()
        super().__init__(*args, directory=str(self.web_root), **kwargs)

    def _requested_file_exists(self):
        path = unquote(urlsplit(self.path).path).lstrip("/")
        candidate = (self.web_root / path).resolve()
        try:
            candidate.relative_to(self.web_root)
        except ValueError:
            return False
        return candidate.exists()

    def do_GET(self):
        request_path = urlsplit(self.path).path
        if not self._requested_file_exists() and Path(request_path).suffix == "":
            self.path = "/index.html"
        super().do_GET()

    def do_HEAD(self):
        request_path = urlsplit(self.path).path
        if not self._requested_file_exists() and Path(request_path).suffix == "":
            self.path = "/index.html"
        super().do_HEAD()


def create_handler(web_root):
    def handler(*args, **kwargs):
        return SpaHandler(*args, directory=web_root, **kwargs)

    return handler


def main():
    parser = argparse.ArgumentParser(description="Servidor LAN para Spice Controller")
    parser.add_argument("--host", default="0.0.0.0", help="Interfaz de escucha (por defecto: todas)")
    parser.add_argument("--port", type=int, default=80, help="Puerto HTTP (por defecto: 80)")
    parser.add_argument("--no-browser", action="store_true", help="No abrir el navegador automáticamente")
    args = parser.parse_args()

    web_root = get_dist_path()
    if not (web_root / "index.html").is_file():
        print(f"No se encontró el build en: {web_root}", file=sys.stderr)
        print("Ejecuta primero: npm run build", file=sys.stderr)
        return 1

    server = ThreadingHTTPServer((args.host, args.port), create_handler(web_root))
    local_url = f"http://127.0.0.1:{args.port}"
    print(f"Spice Controller disponible en {local_url}")
    print("Para otros equipos, usa la IP de este computador en la red local.")
    print("Presiona Ctrl+C para detener el servidor.")

    if not args.no_browser:
        webbrowser.open(local_url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())