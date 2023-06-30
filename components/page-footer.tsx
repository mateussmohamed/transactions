import { cn } from '@/lib/utils'
import { Github, Linkedin, Twitter } from 'lucide-react'

type PageFooterLinkProps = {
  className?: string
  href: string
  children: React.ReactNode
}

function PageFooterLink({ href, children, className }: PageFooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn('text-secondary-foreground transition-colors duration-200', className)}
    >
      {children}
    </a>
  )
}

export function PageFooter() {
  return (
    <footer className="w-full bg-secondary">
      <div className="mx-auto max-w-screen-xl p-4">
        <div className="mx-auto flex max-w-xs items-center justify-center gap-4 py-4">
          <PageFooterLink href="https://twitter.com/mateussmohamed">
            <Twitter />
          </PageFooterLink>
          <PageFooterLink href="https://github.com/mateussmohamed">
            <Github />
          </PageFooterLink>
          <PageFooterLink href="https://www.linkedin.com/in/mateussantana">
            <Linkedin />
          </PageFooterLink>
        </div>

        <div className="flex items-center justify-center text-center font-light text-secondary-foreground/90">
          Created with&nbsp;<span aria-label="hear">❤️</span>&nbsp;by&nbsp;
          <PageFooterLink
            className="font-medium underline underline-offset-4"
            href="https://www.linkedin.com/in/mateussantana"
          >
            @mateussmohamed
          </PageFooterLink>
          &nbsp; | Hosted on&nbsp;
          <PageFooterLink
            href="https://vercel.com"
            className="font-medium underline underline-offset-4"
          >
            Vercel
          </PageFooterLink>
        </div>
      </div>
    </footer>
  )
}
