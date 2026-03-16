import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indie Metrics — Stripe Analytics for Your AI Assistant",
  description:
    "Ask Claude about your MRR, churn rate, top customers, and revenue forecast. " +
    "The MCP server that turns Stripe data into conversational business intelligence.",
  openGraph: {
    title: "Indie Metrics — Stripe Analytics for Your AI Assistant",
    description:
      "Ask Claude about your MRR, churn, customers & revenue. MCP server for Stripe.",
    type: "website",
    url: "https://indie-metrics.vercel.app",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indie Metrics — Stripe Analytics for AI",
    description: "Query your Stripe revenue via Claude. MCP server with 7 business intelligence tools.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
