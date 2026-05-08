import type { FooterConfig } from '~/types';

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Explore",
      items: [
        { title: "Home", href: "/" },
        { title: "Skills", href: "/category" },
        { title: "Blog", href: "/blog" },
        { title: "Search", href: "/search" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  ],
};
