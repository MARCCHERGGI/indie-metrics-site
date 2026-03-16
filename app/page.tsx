const tools = [
  {
    name: "get_revenue_summary",
    desc: "MRR, ARR, total revenue, growth rate, avg transaction value",
    ask: '"What\'s my MRR this month?"',
  },
  {
    name: "get_customer_metrics",
    desc: "Total customers, new customers, LTV, top spenders",
    ask: '"Who are my top 5 customers by spend?"',
  },
  {
    name: "get_product_performance",
    desc: "Revenue by product, units sold, revenue share",
    ask: '"Which product is my best seller?"',
  },
  {
    name: "get_subscription_health",
    desc: "Active subs, churn rate, MRR, ARPU, plan breakdown",
    ask: '"What\'s my churn rate?"',
  },
  {
    name: "get_recent_transactions",
    desc: "Latest charges with amount, status, customer, timestamp",
    ask: '"Show me today\'s sales"',
  },
  {
    name: "get_refund_analysis",
    desc: "Refund count, rate, amounts, reasons",
    ask: '"How many refunds this quarter?"',
  },
  {
    name: "get_revenue_forecast",
    desc: "Projected revenue, trend direction, confidence level",
    ask: '"Forecast my revenue for next month"',
  },
];

const s = {
  hero: {
    textAlign: "center" as const,
    padding: "80px 24px 60px",
    maxWidth: 800,
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    background: "#1a1a2e",
    border: "1px solid #333",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    color: "#a78bfa",
    marginBottom: 24,
  },
  h1: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1.1,
    margin: "0 0 20px",
    color: "#fff",
  },
  gradient: {
    background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties,
  sub: {
    fontSize: 18,
    color: "#999",
    lineHeight: 1.6,
    maxWidth: 600,
    margin: "0 auto 40px",
  },
  cta: {
    display: "inline-block",
    background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  ctaSecondary: {
    display: "inline-block",
    background: "transparent",
    color: "#a78bfa",
    padding: "14px 32px",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid #333",
    marginLeft: 12,
  },
  section: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "60px 24px",
  },
  h2: {
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center" as const,
  },
  sectionSub: {
    fontSize: 16,
    color: "#888",
    textAlign: "center" as const,
    marginBottom: 40,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 12,
    padding: 24,
  },
  toolName: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#6366f1",
    marginBottom: 8,
  },
  toolDesc: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  toolAsk: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic" as const,
  },
  codeBlock: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 12,
    padding: 24,
    fontFamily: "monospace",
    fontSize: 14,
    color: "#a78bfa",
    overflow: "auto" as const,
    maxWidth: 700,
    margin: "0 auto",
    lineHeight: 1.8,
  },
  footer: {
    textAlign: "center" as const,
    padding: "40px 24px",
    borderTop: "1px solid #1a1a1a",
    color: "#555",
    fontSize: 14,
  },
  conversation: {
    maxWidth: 700,
    margin: "0 auto 60px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  msgUser: {
    background: "#1a1a2e",
    border: "1px solid #2a2a4e",
    borderRadius: "12px 12px 4px 12px",
    padding: "12px 18px",
    alignSelf: "flex-end" as const,
    maxWidth: "80%",
    fontSize: 15,
    color: "#ddd",
  },
  msgAI: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "12px 12px 12px 4px",
    padding: "12px 18px",
    alignSelf: "flex-start" as const,
    maxWidth: "80%",
    fontSize: 15,
    color: "#ccc",
    lineHeight: 1.6,
  },
  trust: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
    flexWrap: "wrap" as const,
    marginTop: 40,
  },
  trustItem: {
    textAlign: "center" as const,
  },
  trustNum: {
    fontSize: 32,
    fontWeight: 800,
    color: "#fff",
  },
  trustLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
};

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section style={s.hero}>
        <span style={s.badge}>MCP Server for Stripe</span>
        <h1 style={s.h1}>
          Ask your AI about your{" "}
          <span style={s.gradient}>revenue</span>
        </h1>
        <p style={s.sub}>
          Indie Metrics connects Stripe to Claude (or any MCP-compatible AI).
          Query MRR, churn, customers, and forecasts in natural language.
        </p>
        <div>
          <a
            href="https://github.com/MARCCHERGGI/indie-metrics-mcp"
            style={s.cta}
          >
            Get Started Free
          </a>
          <a
            href="https://github.com/MARCCHERGGI/indie-metrics-mcp#tools"
            style={s.ctaSecondary}
          >
            View Tools
          </a>
        </div>
      </section>

      {/* Demo Conversation */}
      <section style={s.section}>
        <h2 style={s.h2}>Like talking to your Stripe dashboard</h2>
        <p style={s.sectionSub}>Just ask. Your AI handles the rest.</p>
        <div style={s.conversation}>
          <div style={s.msgUser}>What&apos;s my MRR and how is it trending?</div>
          <div style={s.msgAI}>
            Your MRR is <strong style={{ color: "#6366f1" }}>$4,230</strong>{" "}
            — up <strong style={{ color: "#22c55e" }}>12.3%</strong> from last
            month. You had 47 successful transactions averaging $89.36 each.
            ARR projects to $50,760. Growth trend: <strong>growing</strong>.
          </div>
          <div style={s.msgUser}>Who are my top 3 customers?</div>
          <div style={s.msgAI}>
            1. sarah@startup.io — <strong>$1,247</strong> (14 transactions)
            <br />
            2. alex@devshop.com — <strong>$890</strong> (9 transactions)
            <br />
            3. team@enterprise.co — <strong>$670</strong> (7 transactions)
          </div>
          <div style={s.msgUser}>Forecast next month&apos;s revenue</div>
          <div style={s.msgAI}>
            Based on 3-month trend analysis: projected{" "}
            <strong style={{ color: "#6366f1" }}>$4,750/mo</strong> (
            <strong style={{ color: "#22c55e" }}>+$520</strong>). Confidence:{" "}
            <strong>high</strong>. Annual projection: $57,000.
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={s.section}>
        <h2 style={s.h2}>7 business intelligence tools</h2>
        <p style={s.sectionSub}>
          Everything you need to understand your Stripe business
        </p>
        <div style={s.grid}>
          {tools.map((t) => (
            <div key={t.name} style={s.card}>
              <div style={s.toolName}>{t.name}</div>
              <div style={s.toolDesc}>{t.desc}</div>
              <div style={s.toolAsk}>{t.ask}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section style={s.section}>
        <h2 style={s.h2}>Install in 30 seconds</h2>
        <p style={s.sectionSub}>Works with Claude Desktop, Claude Code, and any MCP client</p>
        <pre style={s.codeBlock}>
{`npm install -g indie-metrics-mcp

# Add to Claude Desktop config:
{
  "mcpServers": {
    "indie-metrics": {
      "command": "indie-metrics-mcp",
      "env": {
        "STRIPE_API_KEY": "sk_live_..."
      }
    }
  }
}`}
        </pre>
      </section>

      {/* Trust */}
      <section style={s.section}>
        <h2 style={s.h2}>Built for indie founders</h2>
        <p style={s.sectionSub}>
          Your Stripe key stays local. Read-only access. No data leaves your machine.
        </p>
        <div style={s.trust}>
          <div style={s.trustItem}>
            <div style={s.trustNum}>7</div>
            <div style={s.trustLabel}>Analytics Tools</div>
          </div>
          <div style={s.trustItem}>
            <div style={s.trustNum}>0</div>
            <div style={s.trustLabel}>Data Sent to Third Parties</div>
          </div>
          <div style={s.trustItem}>
            <div style={s.trustNum}>&lt;1min</div>
            <div style={s.trustLabel}>Setup Time</div>
          </div>
          <div style={s.trustItem}>
            <div style={s.trustNum}>MIT</div>
            <div style={s.trustLabel}>Open Source</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...s.section, textAlign: "center" }}>
        <h2 style={s.h2}>Stop switching tabs to check Stripe</h2>
        <p style={{ ...s.sectionSub, marginBottom: 32 }}>
          Your AI already knows your code. Now it knows your revenue too.
        </p>
        <a
          href="https://github.com/MARCCHERGGI/indie-metrics-mcp"
          style={s.cta}
        >
          Get Indie Metrics
        </a>
      </section>

      <footer style={s.footer}>
        Built by{" "}
        <a
          href="https://github.com/MARCCHERGGI"
          style={{ color: "#6366f1", textDecoration: "none" }}
        >
          OpenClaw
        </a>{" "}
        &middot; Open source &middot; MIT License
      </footer>
    </main>
  );
}
