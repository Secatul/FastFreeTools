import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../../../../lib/supabase';

interface RatingData {
  [key: string]: {
    rating: number;
    votes: number;
  };
}

interface RatingStarsProps {
  toolName: string;
  currentRating: number;
  ratingData: RatingData;
  setRatingData: React.Dispatch<React.SetStateAction<RatingData>>; // Aqui é importante definir que setRatingData é do tipo Dispatch
}

const RatingStars: React.FC<RatingStarsProps> = ({ toolName, currentRating, ratingData, setRatingData }) => {
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const { toast } = useToast();

  const handleVote = async (newRating: number) => {
    const voteKey = `voted_${toolName}`;

    if (localStorage.getItem(voteKey)) {
      toast({
        variant: "destructive",
        title: "Vote already registered",
        description: "You have already voted for this tool.",
        status: "info",
        duration: 3000,
      });
      return;
    }

    const existingRating = ratingData[toolName] || { rating: 0, votes: 0 };
    const updatedRating = (existingRating.rating * existingRating.votes + newRating) / (existingRating.votes + 1);
    const updatedVotes = existingRating.votes + 1;

    const { error } = await supabase
      .from('ratings')
      .upsert({ name: toolName, rating: updatedRating, votes: updatedVotes });

    if (error) {
      console.error('Erro ao enviar avaliação:', error);
    } else {
      setRatingData((prevData: RatingData): RatingData => ({
        ...prevData,
        [toolName]: { rating: updatedRating, votes: updatedVotes },
      }));
      
      localStorage.setItem(voteKey, 'true');

      toast({
        title: "Vote successfully registered!",
        description: `You rated "${toolName}" with ${newRating} stars.`,
        status: "success",
        duration: 3000,
      });
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 cursor-pointer transition-all ${
            i <= (hoveredStars || currentRating)
              ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400 opacity-100'
              : 'text-gray-400 dark:text-gray-300 opacity-50'
          }`}
          onMouseEnter={() => setHoveredStars(i)}
          onMouseLeave={() => setHoveredStars(null)}
          onClick={() => handleVote(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center">
      {renderStars()}
      <span className="ml-2 text-sm font-medium text-primary">
        {currentRating.toFixed(1)}
      </span>
      <span className="ml-2 text-sm text-muted-foreground">
        ({(ratingData[toolName]?.votes || 0).toLocaleString()} votes)
      </span>
    </div>
  );
};

export default RatingStars;
