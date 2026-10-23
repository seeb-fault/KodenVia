import { SITE } from "./seo/site";

export const COMPANY_SOCIAL_LINKS = [
  { platform: "email", url: `mailto:${SITE.email}`, username: SITE.email, order: 0 },
  {
    platform: "github",
    url: "https://github.com/santiago-noe",
    username: "santiago-noe",
    order: 1,
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/santiago-noe/",
    username: "santiago-noe",
    order: 2,
  },
  {
    platform: "telegram",
    url: "https://t.me/+51945984518",
    username: SITE.phone,
    order: 3,
  },
  {
    platform: "instagram",
    url: "https://www.instagram.com/santiago_nys/",
    username: "santiago_nys",
    order: 4,
  },
] as const;
