export function Preview({
  srcDoc,
  iframeStyle,
}: {
  srcDoc: string;
  iframeStyle: React.CSSProperties;
}) {
  return (
    <div className="flex-1 rounded-md border-2 p-2">
      <iframe
        srcDoc={srcDoc}
        title="Preview"
        sandbox="allow-scripts"
        className="h-[400px] w-full transition-all duration-300 ease-in-out"
        style={iframeStyle}
      />
    </div>
  );
}
