interface ResultsDisplayProps {
  data: {
    analysis?: string;
    recommendations?: string[];
    securityIssues?: string[];
    architecturalIssues?: string[];
    performanceIssues?: string[];
    score?: number;
    response?: string;
  };
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const score = data.score || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {data.score !== undefined && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Security Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
        </div>
      )}

      {data.analysis && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Analysis</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{data.analysis}</p>
        </div>
      )}

      {data.securityIssues && data.securityIssues.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-red-700/50">
          <h3 className="text-lg font-semibold mb-3 text-red-400">Security Issues</h3>
          <ul className="space-y-2">
            {data.securityIssues.map((issue, index) => (
              <li key={index} className="text-gray-300 flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.architecturalIssues && data.architecturalIssues.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-yellow-700/50">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Architectural Issues</h3>
          <ul className="space-y-2">
            {data.architecturalIssues.map((issue, index) => (
              <li key={index} className="text-gray-300 flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.performanceIssues && data.performanceIssues.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-blue-700/50">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Performance Issues</h3>
          <ul className="space-y-2">
            {data.performanceIssues.map((issue, index) => (
              <li key={index} className="text-gray-300 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-green-700/50">
          <h3 className="text-lg font-semibold mb-3 text-green-400">Recommendations</h3>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-300 flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.response && !data.analysis && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Response</h3>
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{data.response}</pre>
        </div>
      )}

      {!data.analysis && !data.securityIssues && !data.architecturalIssues && !data.recommendations && !data.response && (
        <div className="text-center py-8 text-gray-400">
          No analysis data available
        </div>
      )}
    </div>
  );
}

