import { GitHubIcon, LinkedInIcon, EmailIcon } from '../../components/icons';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(191,167,106,0.35)] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm">
        <div className="text-center md:text-left text-foreground/70">
          <p className="m-0 font-semibold tracking-wide text-[var(--color-gold)]">Middle-earth Leitmotifs</p>
          <p className="m-0 mt-1">&copy; {new Date().getFullYear()} – Fan, non-commercial project.</p>
        </div>
        <nav aria-label="Contact" className="flex justify-center md:justify-end">
          <ul className="flex items-center gap-5 m-0 p-0 list-none">
            <li>
              <a
                href="https://github.com/AlexFJ498"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)] transition-colors underline underline-offset-4"
              >
                <GitHubIcon size={20} className="opacity-90 group-hover:opacity-100" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/alejandro-fuerte-jurado/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)] transition-colors underline underline-offset-4"
              >
                <LinkedInIcon size={20} className="opacity-90 group-hover:opacity-100" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:alejfuejur@gmail.com"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)] transition-colors underline underline-offset-4"
              >
                <EmailIcon size={20} className="opacity-90 group-hover:opacity-100" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
