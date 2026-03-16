import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Indie Metrics — Stripe Analytics for Your AI Assistant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "#fff",
              marginRight: 16,
            }}
          >
            iM
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>
            Indie Metrics
          </div>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          Ask your AI about your{" "}
          <span style={{ color: "#a78bfa" }}>revenue</span>
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#888",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          MCP server that connects Stripe to Claude. MRR, churn, customers,
          forecasts — in natural language.
        </div>
      </div>
    ),
    { ...size }
  );
}
