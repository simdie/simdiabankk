import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/personal/",
          "/business/",
          "/international/",
          "/interest-rates/",
          "/about/",
          "/security/",
          "/contact/",
          "/news/",
          "/tools/",
          "/terms/",
          "/privacy/",
        ],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/login",
          "/register",
          "/maintenance/",
        ],
      },
    ],
    sitemap: "https://www.bankofasia.com/sitemap.xml",
  };
}
