import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAI } from '../../contexts/AIContext';
import { FiInfo, FiTool, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendations() {
  const { recommendations, fetchRecommendations, isLoading, error } = useAI();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Error loading recommendations: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FiTool className="mr-2" />
        Tools You Might Like
      </h2>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/tool/${tool.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                  
                  {/* Recommendation Reason */}
                  <div className="mt-2 flex items-start space-x-2">
                    <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-blue-600">
                      {tool.recommendationReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-blue-500 hover:text-blue-600">
                  <span className="mr-1">View</span>
                  <FiArrowRight />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
