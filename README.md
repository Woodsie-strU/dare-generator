# Go On Then

A small, client-side dare generator for parties, sleepovers, first dates, and brave Tuesdays.

## Run locally

From this folder, start any static web server:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Publish it

This is a dependency-free static site, so it can be hosted on any static host.

### GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings -> Pages**.
3. Set the source to **Deploy from a branch**, choose `main`, and choose `/ (root)`.
4. GitHub will provide the public URL after the deployment finishes.

### Netlify or Cloudflare Pages

Create a new site from this repository. Use the repository root as the publish directory and leave the build command empty.

The app stores recent dares in each visitor's browser and needs no server-side database.
