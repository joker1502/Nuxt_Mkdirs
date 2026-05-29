import type { FooterConfig } from '~/types';

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Explore",
      items: [
        { title: "Skills", href: "/skills" },
        { title: "Tutorials", href: "/tutorials" },
        { title: "Tags", href: "/tags" },
      ],
    },
    {
      title: "About",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  ],
};
