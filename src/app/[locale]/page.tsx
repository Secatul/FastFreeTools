'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../redux/store";
import { fetchTools } from '../features/toolSlice';
import { Button } from "@/components/ui/button";
import { supabase } from '../../../lib/supabase';
import { Search } from "../[locale]/components/search";
import LangSwitcher from "./components/LangSwitcher";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Star, Moon, Sun } from 'lucide-react';
import { Header } from "./components/header";
import { useTheme } from "next-themes";
import Footer from "../[locale]/components/footer";
import { usePathname } from 'next/navigation';
import Head from 'next/head';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface RootState {
  tools: {
    tools: Tool[];
    loading: boolean;
  };
}

interface Tool {
  name: string;
  icon: string;
  description: string;
  categories: string[];
  route: string;
}

interface RatingData {
  [key: string]: {
    rating: number;
    votes: number;
  };
}

interface Category {
  id: string;
  label: string;
}

export default function Page() {
  const { toast } = useToast();
  const t = useTranslations('Page');
  const dispatch = useDispatch<AppDispatch>();
  const { tools: apiTools, loading } = useSelector((state: RootState) => state.tools);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [ratingData, setRatingData] = useState<RatingData>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const toolsPerPage = 12;
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}`;

  const staticTools: Tool[] = [
    {
      name: t("Base64Encoder.name"),
      route: `/${locale}/base64encoder`,
      icon: "🔐",
      description: t("Base64Encoder.description"),
      categories: ["Data_Conversion", "Security"],
    },
    {
      name: t("WordCounter.name"),
      route: `/${locale}/word-counter`,
      icon: "✏️",
      description: t("WordCounter.description"),
      categories: ["Text_Tools"],
    },
    {
      name: t("DataTableGenerator.name"),
      route: `/${locale}/data-table-generator`,
      icon: "📊",
      description: t("DataTableGenerator.description"),
      categories: ["Utility", "Text_Tools"],
    },
    {
      name: t("UserAgentAnalyzer.name"),
      route: `/${locale}/user-agent`,
      icon: "🌐",
      description: t("UserAgentAnalyzer.description"),
      categories: ["Utility"],
    },
    {
      name: t("SEOMetaTagAnalyzer.name"),
      route: `/${locale}/seo-meta-tag-analyzer`,
      icon: "🔍",
      description: t("SEOMetaTagAnalyzer.description"),
      categories: ["Text_Tools", "Utility"],
    },

    // {
    //   name: t("ColorPicker.name"),
    //   route: `/${locale}/color-picker`,
    //   icon: "🎨",
    //   description: t("ColorPicker.description"),
    //   categories: ["Design", "Utility"],
    // },
    {
      name: t("LoremIpsumGenerator.name"),
      route: `/${locale}/lorem-ipsum`,
      icon: "📜",
      description: t("LoremIpsumGenerator.description"),
      categories: ["Text_Tools", "Programming"],
    },
    {
      name: t("CaseConverter.name"),
      route: `/${locale}/case-converter`,
      icon: "Aa",
      description: t("CaseConverter.description"),
      categories: ["Text_Tools"],
    },
    {
      name: t("TextTransformer.name"),
      route: `/${locale}/text-transformer`,
      icon: "🔀",
      description: t("TextTransformer.description"),
      categories: ["Text_Tools"],
    },
    {
      name: t("HtmlToMarkdown.name"),
      route: `/${locale}/html-markdown-converter`,
      icon: "📄",
      description: t("HtmlToMarkdown.description"),
      categories: ["Programming", "Data_Conversion"],
    },
    {
      name: t("BinaryToText.name"),
      route: `/${locale}/binary-to-text`,
      icon: "🔢",
      description: t("BinaryToText.description"),
      categories: ["Data_Conversion"],
    },
    {
      name: t("MorseCodeTranslator.name"),
      route: `/${locale}/morse-code-translator`,
      icon: "📡",
      description: t("MorseCodeTranslator.description"),
      categories: ["Data_Conversion"],
    },
    {
      name: t("UUIDGenerator.name"),
      route: `/${locale}/uuid-generator`,
      icon: "🆔",
      description: t("UUIDGenerator.description"),
      categories: ["Data_Conversion", "Utility"],
    },
    {
      name: t("MarkdownEditor.name"),
      route: `/${locale}/markdown-editor`,
      icon: "📘",
      description: t("MarkdownEditor.description"),
      categories: ["Programming", "Text_Tools"],
    },
    {
      name: t("HTMLGenerator.name"),
      route: `/${locale}/html-generator`,
      icon: "📑",
      description: t("HTMLGenerator.description"),
      categories: ["Programming"],
    },
  ];

  const categories: Category[] = [
    { id: "All", label: t("Categories.All") },
    { id: "Programming", label: t("Categories.Programming") },
    { id: "Data_Conversion", label: t("Categories.Data_Conversion") },
    { id: "Text_Tools", label: t("Categories.Text_Tools") },
    { id: "Security", label: t("Categories.Security") },
    { id: "Design", label: t("Categories.Design") },
    { id: "Utility", label: t("Categories.Utility") },
  ];

  const fetchRatings = async () => {
    const { data, error } = await supabase.from('ratings').select('name, rating, votes');
    if (error) {
      console.error('Error fetching ratings:', error);
    } else {
      const ratingsMap: RatingData = data.reduce((acc: RatingData, curr: { name: string; rating: number; votes: number }) => {
        acc[curr.name] = { rating: curr.rating, votes: curr.votes };
        return acc;
      }, {});
      setRatingData(ratingsMap);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTools());
      fetchRatings();
    };
    fetchData();
  }, [dispatch]);

  const isPopular = (toolName: string) => {
    const votes = ratingData[toolName]?.votes || 0;
    return votes > 3;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setSearchQuery(sanitizedQuery);
  };

  const allTools = [...staticTools, ...apiTools];

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' ||
      tool.categories.some(category => category === selectedCategory);
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const currentTools = filteredTools.slice(startIndex, startIndex + toolsPerPage);

  const handleVote = async (toolName: string, newRating: number) => {
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
      console.error('Error submitting rating:', error);
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

  const renderStars = (rating: number, toolName: string, hoveredStars: number | null, setHoveredStars: React.Dispatch<React.SetStateAction<number | null>>) => {
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

  const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
    const [hoveredStars, setHoveredStars] = useState<number | null>(null);
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
                    {t("Top_Rated")}
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium group-hover:text-primary transition-colors duration-300 mb-2">
              {tool.name}
            </h3>

            <p className="dark:text-gray-400 text-gray-700 mb-4">{tool.description}</p>

            <div className="flex gap-2 flex-wrap">
              {tool.categories.map((categoryId, index) => (
                <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                  {t(`Categories.${categoryId}`)}
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
                  {t('Try_Now')}
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
      <Head>
        <title>{t('Page_Title')}</title>
        <meta name="description" content={t('Header_Description')} />
        <meta name="keywords" content="Fast Free Tools, Online Tools, Web Tools, Utilities" />
        <meta property="og:title" content={t('Page_Title')} />
        <meta property="og:description" content={t('Header_Description')} />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta name="twitter:description" content={t('Header_Description')} />
        <meta name="twitter:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta charSet="UTF-8" />


        {[
          { locale: 'en', href: "https://fastfreetools.com/en" },
          { locale: 'es', href: "https://fastfreetools.com/es" },
          { locale: 'pt-br', href: "https://fastfreetools.com/pt-br" },
          { locale: 'de', href: "https://fastfreetools.com/de" },
          { locale: 'fr', href: "https://fastfreetools.com/fr" },
          { locale: 'x-default', href: "https://fastfreetools.com/en" },
        ].map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

      </Head>
      <div className="min-h-screen bg-white py-12 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <LangSwitcher />
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
                  <Moon className="w-5 h-5 text-blue-400" />
                </span>
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          <Header />

          <main className="mt-12 space-y-16">
            <section>
              <div className='flex items-center justify-center'>
                <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {categories.map((category: Category) => (
                  <Button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg ${selectedCategory === category.id
                      ? 'bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold">{t('Tools')}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentTools.length > 0 ? (
                  currentTools.map((tool, index) => {
                    return <ToolCard key={index} tool={tool} />;
                  })
                ) : (
                  <p className="text-muted-foreground col-span-full text-center text-lg">
                    {t('No_Tools_Found')}
                  </p>
                )}
              </div>

              {/* Pagination Component */}
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
                        {t('Previous')}
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
                          className={`px-3 py-1.5 rounded-lg transition-colors ${currentPage === index + 1
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
                        {t('Next')}
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
