export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
      <div className="w-full max-w-md px-[var(--space-4)]">
        {children}
      </div>
    </div>
  );
}
