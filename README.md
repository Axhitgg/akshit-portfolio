# Akshit Singh - AI Automation Portfolio

A static portfolio site presenting automation projects through plain-language explanations, interactive walkthroughs and links to source code. Built with HTML, CSS and JavaScript.

[View the portfolio](https://akshit-portfolio-jlzx.onrender.com/) · [LinkedIn](https://www.linkedin.com/in/akshit-singh-outlook/) · [GitHub](https://github.com/Axhitgg)

## Purpose

Give a recruiter or collaborator a quick way to understand the problem behind a project, explore an example workflow and then inspect its implementation. The website is a presentation layer, not the backend for every featured project.

## Files

- `index.html`: page content and structure.
- `styles.css`: visual styling and responsive layout.
- `app.js`: client-side interactions and walkthrough behaviour.
- `favicon.svg`: site icon.
- `Akshit_Singh_AI_Automation_CV.pdf`: approved A4 CV offered from the public portfolio.

## Preview locally

No dependency installation or build step is required. From the repository folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Opening index.html directly can also work, but a local server is preferable for consistent asset paths.

## Static hosting

Publish the repository root (`.`) on a static host. For Render Static Site, this plain HTML/CSS/JavaScript repository needs no build command; the publish directory is `.`. The existing public portfolio is separate from each Flask/Node backend and its database.

A repository update may trigger a connected host to redeploy. Review the resulting site after changes; a successful Git commit is not proof that a deployment is healthy.

## Walkthroughs versus live systems

Interactive scenarios illustrate how a workflow is intended to behave. They should not be mistaken for a live API response, proof of a customer deployment or measured business savings. Inspect the linked repository for implemented behaviour, tests and limitations. Backend availability and free-tier database lifetimes are independent of the static site.

## Maintenance checklist

- Keep project explanations and source/demo links accurate.
- Keep contact details and LinkedIn targets current.
- Verify that the downloadable CV is the approved A4 version and that its links work.
- Use a deliberately chosen public CV copy if personal contact details should remain private.
- Check mobile layouts, keyboard access and reduced-motion behaviour before publishing visual changes.
- Never put API keys, database URLs or confidential client data in frontend code.

The 23 October 2026 refresh updated the public contact email and LinkedIn URL, replaced the old DOCX download with the approved A4 PDF, and linked the Control Tower case study, demo script, synthetic evaluation and sanitised workflow. It does not claim customer deployment or measured business savings.

## Author

[Akshit Singh](https://www.linkedin.com/in/akshit-singh-outlook/) - AI automation portfolio project.
