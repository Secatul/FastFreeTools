'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTools } from '../app/features/toolsSlice';
import { Button } from "@/components/ui/button"
import { supabase } from '../lib/supabase';
import { Header } from './components/ui/header';
import { Search } from './components/ui/search';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Star, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Page() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { tools, loading } = useSelector((state) => state.tools);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingData, setRatingData] = useState({});
  const { theme, setTheme } = useTheme();

  const fetchRatings = async () => {
    const { data, error } = await supabase.from('ratings').select('name, rating, votes');
    if (error) {
      console.error('Erro ao buscar ratings:', error);
    } else {
      const ratingsMap = data.reduce((acc, curr) => {
        acc[curr.name] = { rating: curr.rating, votes: curr.votes };
        return acc;
      }, {});
      setRatingData(ratingsMap);
    }
  };

  useEffect(() => {
    dispatch(fetchTools());  
    fetchRatings(); 
  }, [dispatch]);

  // Função para determinar se uma ferramenta é popular com base no número de votos do Supabase
  const isPopular = (toolName) => {
    const votes = ratingData[toolName]?.votes || 0;
    return votes > 3;
  };

  const handleSearchChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setSearchQuery(sanitizedQuery);
  };

  const sortedTools = tools
    .map((tool) => ({
      ...tool,
      votes: ratingData[tool.name]?.votes || 0,
      rating: ratingData[tool.name]?.rating || 0,
    }))
    .sort((a, b) => b.votes - a.votes || new Date(b.createdAt) - new Date(a.createdAt));

  const popularTools = sortedTools.slice(0, 3);  
  const remainingTools = sortedTools.slice(3).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredTools = [...popularTools, ...remainingTools].filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVote = async (toolName, newRating) => {
    const voteKey = `voted_${toolName}`;
    if (localStorage.getItem(voteKey)) {
      toast({
        variant: "destructive",
        title: "Voto já registrado",
        description: "Você já votou nesta ferramenta.",
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
      setRatingData((prevData) => ({
        ...prevData,
        [toolName]: { rating: updatedRating, votes: updatedVotes },
      }));
      localStorage.setItem(voteKey, 'true');

      toast({
        title: "Voto registrado com sucesso!",
        description: `Você deu uma avaliação de ${newRating} estrelas para "${toolName}".`,
        status: "success",
        duration: 3000,
      });
    }
  };

  const renderStars = (rating, toolName, hoveredStars, setHoveredStars) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 cursor-pointer transition-all ${i <= (hoveredStars || rating) ? 'fill-yellow-400 text-yellow-400 opacity-100' : 'text-gray-300 opacity-50'
            }`}
          onMouseEnter={() => setHoveredStars(i)}
          onMouseLeave={() => setHoveredStars(null)}
          onClick={(e) => {
            e.stopPropagation();
            handleVote(toolName, i);
          }}
        />
      );
    }
    return stars;
  };

  const ToolCard = ({ tool, index }) => {
    const [hoveredStars, setHoveredStars] = useState(null);

    const dynamicRating = ratingData[tool.name]?.rating || 0;

    return (
      <Card
        className={`group hover:shadow-md transition-all duration-300 ${dynamicRating >= 4.5 ? 'border-primary/50' : ''
          }`}
      >
        <CardContent className="p-6">
          <Link href={tool.route} className="block">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{tool.icon}</span>
              <div className="space-y-1">
                {isPopular(tool.name) && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Popular
                  </Badge>
                )}
                {dynamicRating >= 4.5 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Top Rated
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium group-hover:text-primary transition-colors duration-300 mb-2">
              {tool.name}
            </h3>
          </Link>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(dynamicRating, tool.name, hoveredStars, setHoveredStars)}
                </div>
                <span className="text-sm font-medium text-primary">
                  {dynamicRating.toFixed(1)} {/* Display rating from Supabase */}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(ratingData[tool.name]?.votes || 0).toLocaleString()} votos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        <Header title="Fast Task" description="Your Quick Tools for Every Task" />

        <main className="mt-12 space-y-16">
          <section className="flex flex-col items-center gap-8">
            <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <h2 className="text-3xl font-bold flex self-start">Tools</h2>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <ToolCard key={index} tool={tool} index={index} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center text-lg">
                  No tools found for your search.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
