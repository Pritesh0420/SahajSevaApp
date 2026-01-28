import json
import socket
from urllib.parse import urlparse
from pathlib import Path

SCHEMES_PATH = Path(__file__).resolve().parents[1] / "schemes.json"


def dns_ok(host: str) -> bool:
    try:
        socket.getaddrinfo(host, 443)
        return True
    except Exception:
        return False


def main() -> int:
    data = json.loads(SCHEMES_PATH.read_text(encoding="utf-8"))
    urls = [(s.get("name", "(unknown)"), (s.get("portal_url") or "").strip()) for s in data]
    urls = [(n, u) for n, u in urls if u]

    bad = []
    for name, url in urls:
        p = urlparse(url)
        host = p.hostname
        if not host:
            bad.append((name, url, "invalid-url"))
            continue
        if not dns_ok(host):
            bad.append((name, url, f"dns-fail:{host}"))

    print(f"Checked {len(urls)} portal_url values")
    if bad:
        print("Potentially broken:")
        for name, url, reason in bad:
            print(f"- {name}: {url} ({reason})")
        return 1

    print("All portal_url hostnames resolved via DNS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
