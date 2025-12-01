export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}
