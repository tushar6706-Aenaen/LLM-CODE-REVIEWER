interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeInput({ value, onChange }: CodeInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste your Node.js/Express code here..."
      className="w-full h-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      spellCheck={false}
    />
  );
}

