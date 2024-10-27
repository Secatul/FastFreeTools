'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTools } from '../app/features/toolsSlice';
import { Button } from "@/components/ui/button";
import { supabase } from '../lib/supabase';
import { Header } from './components/ui/header';
import { Search } from './components/ui/search';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Star, Moon, Sun, Share2  } from 'lucide-react';
import { useTheme } from 'next-themes';
import Footer from './components/ui/footer';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Importação dos componentes de paginação
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Page() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { tools, loading } = useSelector((state) => state.tools);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [ratingData, setRatingData] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const toolsPerPage = 12; // Quantidade de ferramentas por página
  const { theme, setTheme } = useTheme();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const categories = ['All', 'Programming', 'Data Conversion', 'Text Tools', 'Security', 'Design', 'Utility'];

  const ShareDialog = () => {
    const shareUrl = 'https://fastfreetools.com';
    const title = 'Check out Fast Free Tools!';

    return (
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative inline-flex items-center justify-center p-2 rounded-full bg-gray-700 dark:bg-gray-800 focus:outline-none transition-colors duration-300
            border-2 border-transparent hover:border-blue-500 dark:hover:border-yellow-500 transition-all ml-2"
          >
            <Share2 className="w-6 h-6 dark:text-blue-400 text-yellow-400" />
            <span className="sr-only">Share</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Fast Free Tools</DialogTitle>
            <DialogDescription>
              Share our website with your friends and colleagues!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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

  const isPopular = (toolName) => {
    const votes = ratingData[toolName]?.votes || 0;
    return votes > 3;
  };

  const handleSearchChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setSearchQuery(sanitizedQuery);
  };

  const filteredTools = tools
    .filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.categories.includes(selectedCategory);
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  // Calcular o total de páginas
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

  // Determinar as ferramentas que serão exibidas na página atual
  const startIndex = (currentPage - 1) * toolsPerPage;
  const currentTools = filteredTools.slice(startIndex, startIndex + toolsPerPage);

  const handleVote = async (toolName, newRating) => {
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
      setRatingData((prevData) => ({
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

  const renderStars = (rating, toolName, hoveredStars, setHoveredStars) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 cursor-pointer transition-all ${i <= (hoveredStars || rating) ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400 opacity-100' : 'text-gray-400 dark:text-gray-300 opacity-50'}`}
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

  const ToolCard = ({ tool }) => {
    const [hoveredStars, setHoveredStars] = useState(null);
    const dynamicRating = ratingData[tool.name]?.rating || 0;

    return (
      <Card className={`group bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${dynamicRating >= 4.5 ? 'border-primary/50' : ''}`}>
        <CardContent className="p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{tool.icon}</span>
              <div className="space-y-1 text-lg font-medium group-hover:text-blue-600 dark:group-hover:text-primary transition-colors duration-300 mb-2">
                {isPopular(tool.name) && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 mr-2 rounded-lg font-semibold">
                    Popular
                  </Badge>
                )}
                {dynamicRating >= 4.5 && (
                  <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 px- py-1 rounded-lg font-semibold">
                    Top Rated
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium group-hover:text-primary transition-colors duration-300 mb-2">
              {tool.name}
            </h3>

            <p className="dark:text-gray-400 text-gray-700 mb-4">{tool.description}</p>

            <div className="flex gap-2 flex-wrap">
              {tool.categories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex sm:items-center flex-col sm:flex-row items-start gap-2">
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(dynamicRating, tool.name, hoveredStars, setHoveredStars)}
                </div>
                <span className="text-sm font-medium text-primary">
                  {dynamicRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({(ratingData[tool.name]?.votes || 0).toLocaleString()} votes)
              </span>
            </div>
            <div>
              <Link href={tool.route}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Try Now
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-white py-12 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative inline-flex items-center justify-center p-2 rounded-full bg-gray-700 dark:bg-gray-800 focus:outline-none transition-colors duration-300
border-2 border-transparent hover:border-blue-500 dark:hover:border-yellow-500 transition-all"
              >
                <span className="absolute transform transition-all duration-500 dark:rotate-180 dark:opacity-0 opacity-100">
                  <Sun className="w-6 h-6 text-yellow-400" />
                </span>
                <span className="absolute transform transition-all duration-500 rotate-180 dark:rotate-0 opacity-0 dark:opacity-100">
                  <Moon className="w-6 h-6 text-blue-400" />
                </span>
                <span className="sr-only">Toggle theme</span>
              </Button>
              <ShareDialog />
            </div>
          </div>

          <Header title="Fast Free Tools" description="Empowering Your Tasks, Free and Fast!" />

          <main className="mt-12 space-y-16">
            <section>
              <div className='flex items-center justify-center'>
                <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
              </div>

              {/* Botões de Categoria */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1); // Reseta para a primeira página quando a categoria é alterada
                    }}
                    className={`px-4 py-2 rounded-lg ${selectedCategory === category 
                      ? 'bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold">Tools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentTools.length > 0 ? (
                  currentTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} index={index} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center text-lg">
                    No tools found for your search.
                  </p>
                )}
              </div>

              {/* Componente de Paginação */}
              {totalPages > 1 && (
                <Pagination className="flex justify-center mt-6">
                <PaginationContent className="flex space-x-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Previous
                    </PaginationPrevious>
                  </PaginationItem>
              
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
              
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Next
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              )}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
