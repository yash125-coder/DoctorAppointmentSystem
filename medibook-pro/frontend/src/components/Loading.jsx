export function Spinner({ className = "" }) {
  return <span className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="text-center">
        <Spinner className="text-teal-600" />
        <p className="mt-3 text-sm text-slate-500">Preparing your MediBook experience…</p>
      </div>
    </div>
  );
}
