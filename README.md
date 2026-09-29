# Django Menu

Each branch contains a different menu design, while the runtime structure is shared.

## Local development

```sh
cp .env.example .env
docker compose up --build
```

The application listens on the host port configured by `HOST_PORT`.

When running multiple branch copies on one machine, use a different `HOST_PORT`
and `SQLITE_VOLUME` for each copy. The Compose service binds to `127.0.0.1`,
which keeps it behind a reverse proxy on a server.

## Server deployment

Terminate HTTPS at the server's reverse proxy and set these values in `.env`:

```dotenv
DJANGO_SECRET_KEY=<random value with at least 50 characters>
DJANGO_ALLOWED_HOSTS=menu.example.com
DJANGO_SECURE_SSL_REDIRECT=1
DJANGO_SESSION_COOKIE_SECURE=1
DJANGO_CSRF_COOKIE_SECURE=1
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=1
DJANGO_SECURE_HSTS_PRELOAD=1
DJANGO_BEHIND_PROXY=1
```

Keep `.env` private and use a unique `SQLITE_VOLUME` per deployment. Static
files are collected at container startup and served by WhiteNoise.

## GitHub Actions deployment

The `third-idea` branch deploys through `.github/workflows/deploy.yml` after
each push. The server must already have Docker, Docker Compose, Git, and a
checkout of this repository at the path stored in `DEPLOY_PATH`. Keep the
server's production `.env` in that checkout; it is intentionally ignored by
Git.

Create a GitHub Environment named `third-idea` and add all of these as
Environment secrets:

```text
SERVER_HOST       Server hostname or IP address
SERVER_USER       SSH login username
SERVER_PORT       Optional SSH port; defaults to 22
DEPLOY_PATH       Absolute path to the server checkout
```

The server checkout must have `origin` pointing to this repository and the
deploy user must be allowed to run Docker without interactive prompts.

## Tests

```sh
docker compose run --rm web python manage.py test
```

Generated `staticfiles/`, SQLite databases, virtual environments, and `.env` files are deployment-only and must not be committed.

## Component design demos

The root page is composed from reusable Django template components. The
production composition at `/` uses each component's `default` variant; the
gallery at `/demos/` lists saved concepts. **Demo 01 · Orange Fresh** is at
`/demos/demo-01/` and changes only the hero. Header, menu/prices, visit/QR,
and footer continue using their defaults.

Component templates live under `templates/components/<component>/`, with
variants as separate files. Demo 01 selects
`components/hero/demo_01_fresh.html` and keeps the other four components on
their defaults. Its CSS, JavaScript, and artwork are isolated under
`menu/static/menu/demos/demo-01/`.

To add a concept, create a component variant, add a composition route that
selects it alongside defaults, add a gallery card and a test. Keep previous
variants and demos; promoting a design to `/` is a separate, explicit change.
