export const metadata = {
  title: "Agentic FX Bot",
  description: "Autonomous AI FX trading dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', color: '#0f172a' }}>
        {children}
      </body>
    </html>
  );
}
