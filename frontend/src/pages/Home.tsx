import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeCode } from '../services/api';
import CodeInput from '../components/CodeInput';
import ResultsDisplay from '../components/ResultsDisplay';

export default function Home() {
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('code.js');

  const mutation = useMutation({
    mutationFn: () => analyzeCode(code, fileName),
    onError: (error: Error) => {
      console.error('Analysis error:', error);
    },
  });

  const handleAnalyze = () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">LLM Code Reviewer</h1>
          <p className="text-gray-400">Analyze your Node.js/Express backend code for security and architecture issues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Code Input</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">File Name (optional)</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="code.js"
              />
            </div>
            <CodeInput value={code} onChange={setCode} />
            <button
              onClick={handleAnalyze}
              disabled={mutation.isPending || !code.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {mutation.isPending ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            {mutation.isError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                Error: {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
              </div>
            )}
            {mutation.isPending && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-400">Analyzing your code...</p>
              </div>
            )}
            {mutation.isSuccess && <ResultsDisplay data={mutation.data.data} />}
            {!mutation.isPending && !mutation.isSuccess && !mutation.isError && (
              <div className="text-center py-8 text-gray-400">
                Enter code and click "Analyze Code" to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

