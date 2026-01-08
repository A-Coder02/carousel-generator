export function JsonExporter({
  values,
  filename,
  children,
}: {
  values: unknown;
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(values, null, 4)
      )}`}
      download={filename}
    >
      {children}
    </a>
  );
}
