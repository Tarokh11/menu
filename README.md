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

Create a GitHub Environment named `third-idea` and add these values there:

Environment variables:

```text
SERVER_HOST       Server hostname or IP address
SERVER_USER       SSH login username
SERVER_PORT       Optional SSH port; defaults to 22
DEPLOY_PATH       Absolute path to the server checkout
```

Add `SERVER_SSH_KEY` as an Environment secret, not as a plain variable.

The server checkout must have `origin` pointing to this repository and the
deploy user must be allowed to run Docker without interactive prompts.

## Tests

```sh
docker compose run --rm web python manage.py test
```

Generated `staticfiles/`, SQLite databases, virtual environments, and `.env` files are deployment-only and must not be committed.
