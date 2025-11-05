import { ArrowLeft, Shield, Star, Users, Flag, Award } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DiscordRedirect } from './DiscordRedirect';
import { motion } from 'motion/react';

interface Game {
  id: string;
  name: string;
  developer: string;
  thumbnail: string;
  safetyScore: number;
  ageRating: string;
  ratings: {
    honesty: number;
    safety: number;
    fairness: number;
    ageAppropriate: number;
  };
  totalRatings: number | 'Staff';
  verified: boolean;
  description: string;
  category: string;
}

interface GameDetailsProps {
  game: Game;
  onBack: () => void;
}

export function GameDetails({ game, onBack }: GameDetailsProps) {
  const [showRatingDiscord, setShowRatingDiscord] = useState(false);
  const [showReportRedirect, setShowReportRedirect] = useState(false);

  const isStaffRated = game.totalRatings === 'Staff';

  const averageRating = (
    (game.ratings.honesty + game.ratings.safety + game.ratings.fairness + game.ratings.ageAppropriate) / 4
  ).toFixed(1);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 80) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-orange-600 bg-orange-100 border-orange-300';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-8 px-4 min-h-screen"
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header Image */}
          <div className="relative">
            <ImageWithFallback
              src={game.thumbnail}
              alt={game.name}
              className="w-full h-80 object-cover"
            />
            {game.verified && (
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Rotection Verified</span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Game Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-purple-600 mb-2">{game.name}</h1>
                <p className="text-gray-600 mb-4">
                  Created by <span className="text-purple-600">{game.developer}</span>
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg">{averageRating}</span>
                    {isStaffRated ? (
                      <span className="text-gray-500">(Staff Rating)</span>
                    ) : (
                      <span className="text-gray-500">({typeof game.totalRatings === 'number' ? game.totalRatings.toLocaleString() : game.totalRatings} ratings)</span>
                    )}
                  </div>
                  <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded">
                    {game.category}
                  </div>
                  <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded">
                    Age {game.ageRating}
                  </div>
                </div>
              </div>

              <div className={`border-2 rounded-lg p-6 text-center ${getScoreColor(game.safetyScore)}`}>
                <Shield className="w-12 h-12 mx-auto mb-2" />
                <div className="text-3xl mb-1">{game.safetyScore}%</div>
                <div className="text-sm">Safety Score</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-purple-600 mb-3">About This Game</h2>
              <p className="text-gray-700">{game.description}</p>
            </div>

            {/* Rating Breakdown or Staff Rating Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              {isStaffRated ? (
                // Staff Rating Notice
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 p-3 rounded-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-purple-600 mb-2">Staff Verified Rating</h2>
                      <p className="text-gray-700 mb-4">
                        This game has been carefully reviewed and rated by our Rotection moderation team. 
                        Staff ratings ensure the highest quality verification for new games on the platform.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-purple-600 mb-1">{game.ratings.honesty.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Honesty</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-purple-600 mb-1">{game.ratings.safety.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Safety</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-purple-600 mb-1">{game.ratings.fairness.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Fairness</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-purple-600 mb-1">{game.ratings.ageAppropriate.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">Age-Appropriate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Community Rating Breakdown
                <>
                  <h2 className="text-purple-600 mb-4">Safety Ratings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Honesty</span>
                        <span className="text-purple-600">{game.ratings.honesty.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="bg-white rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(game.ratings.honesty / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Game is honest about content and gameplay</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Safety</span>
                        <span className="text-purple-600">{game.ratings.safety.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="bg-white rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(game.ratings.safety / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Game is safe and appropriate for players</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Fairness</span>
                        <span className="text-purple-600">{game.ratings.fairness.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="bg-white rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(game.ratings.fairness / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Game treats all players fairly</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Age-Appropriate</span>
                        <span className="text-purple-600">{game.ratings.ageAppropriate.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="bg-white rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(game.ratings.ageAppropriate / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Content is appropriate for the age rating</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowRatingDiscord(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Rate This Game
              </button>
              <button 
                onClick={() => setShowReportRedirect(true)}
                className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Report Issue
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Rating Discord Redirect */}
        {showRatingDiscord && (
          <DiscordRedirect
            action="rate this game"
            onBack={() => setShowRatingDiscord(false)}
          />
        )}

        {/* Report Redirect */}
        {showReportRedirect && (
          <DiscordRedirect
            action="report an issue"
            onBack={() => setShowReportRedirect(false)}
          />
        )}
      </div>
    </motion.div>
  );
}
