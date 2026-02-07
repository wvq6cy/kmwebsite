# Kyah Morris Portfolio (Static GitHub Pages Site)

A single-page, recruiter-ready educator portfolio built with plain HTML, CSS, and JavaScript.

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
└── assets/
    ├── portrait.jpg
    ├── project1.jpg
    ├── project2.jpg
    ├── og-image.jpg
    └── favicon.ico
```

## 1. How to Upload to GitHub

1. Create a new GitHub repository.
2. Add all files (`index.html`, `style.css`, `script.js`, and `assets/`).
3. Commit and push:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

## 2. How to Enable GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Save and wait for deployment.
5. Your site URL will be:
   - `https://<your-username>.github.io/<your-repo-name>/`

## 3. Where to Replace Portrait Image

Replace this file:

- `assets/portrait.jpg`

If your portrait uses a different file name, update the image `src` in `index.html`.

## 4. How to Modify Colors

Open `style.css` and edit CSS variables at the top:

- Light theme: `:root`
- Dark theme: `html[data-theme="dark"]`

Primary variables to adjust:

- `--primary` (deep ink navy)
- `--accent` (muted sage)
- `--highlight` (warm muted gold)
- `--bg` / `--surface` / `--text`

## 5. How to Add Sections

1. Add a new `<section>` block in `index.html`.
2. Add a matching nav link in the header with an anchor (example: `href="#new-section"`).
3. Add styling in `style.css`.
4. Add class `reveal` if you want scroll-in animation.

## 6. How to Customize Content

- Update text content directly in `index.html` for role, experience, education, and projects.
- Update skill category items in `script.js` inside `skillMap`.
- Update contact links:
  - `mailto:kmorris21487@gmail.com`
  - `tel:+15402238396`
  - LinkedIn URL
- Update Open Graph URL in `index.html`:
  - `meta property="og:url"`
- Replace:
  - `assets/project1.jpg`
  - `assets/project2.jpg`
  - `assets/og-image.jpg`
  - `assets/favicon.ico`

## Notes

- This is a static site only (no backend).
- The contact form is front-end UI only and does not submit to a server.
- Smooth inertial scrolling uses Lenis from CDN and gracefully falls back if unavailable.
