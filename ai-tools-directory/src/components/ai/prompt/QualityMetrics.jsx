import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const QualityMetrics = ({ metrics }) => {
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderMetricBar = (score) => {
    return (
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div
          className={`h-full rounded-full ${
            score >= 0.8
              ? 'bg-green-400'
              : score >= 0.6
              ? 'bg-yellow-400'
              : 'bg-red-400'
          }`}
          style={{ width: `${score * 100}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-white mb-4">Quality Analysis</h4>

      <div className="space-y-4">
        {/* Overall Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Overall Quality</span>
            <span className={getScoreColor(metrics.score)}>
              {(metrics.score * 100).toFixed(0)}%
            </span>
          </div>
          {renderMetricBar(metrics.score)}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Clarity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Clarity</span>
              <span className={`text-sm ${getScoreColor(metrics.clarity)}`}>
                {(metrics.clarity * 100).toFixed(0)}%
              </span>
            </div>
            {renderMetricBar(metrics.clarity)}
          </div>

          {/* Specificity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Specificity</span>
              <span className={`text-sm ${getScoreColor(metrics.specificity)}`}>
                {(metrics.specificity * 100).toFixed(0)}%
              </span>
            </div>
            {renderMetricBar(metrics.specificity)}
          </div>

          {/* Coherence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Coherence</span>
              <span className={`text-sm ${getScoreColor(metrics.coherence)}`}>
                {(metrics.coherence * 100).toFixed(0)}%
              </span>
            </div>
            {renderMetricBar(metrics.coherence)}
          </div>

          {/* Relevance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Relevance</span>
              <span className={`text-sm ${getScoreColor(metrics.relevance)}`}>
                {(metrics.relevance * 100).toFixed(0)}%
              </span>
            </div>
            {renderMetricBar(metrics.relevance)}
          </div>
        </div>

        {/* Suggestions */}
        {metrics.suggestions && metrics.suggestions.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-white mb-2">Improvement Suggestions</h5>
            <ul className="space-y-2">
              {metrics.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm"
                >
                  {suggestion.type === 'improvement' ? (
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-gray-300">{suggestion.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detected Patterns */}
        {metrics.patterns && (
          <div className="mt-4 p-3 bg-gray-600 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2">Detected Patterns</h5>
            <div className="flex flex-wrap gap-2">
              {metrics.patterns.map((pattern, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityMetrics;
