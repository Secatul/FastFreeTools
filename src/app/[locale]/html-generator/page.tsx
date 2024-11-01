"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import Head from 'next/head';
import ShareButton from '../components/share-button';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, ChevronUp, ChevronDown, Edit, Trash2, RefreshCw } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';

interface HtmlElement {
  id: string;
  tag: string;
  content: string;
  children: HtmlElement[];
}

const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input);
};

const HTMLGenerator: React.FC = () => {
  const [elements, setElements] = useState<HtmlElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [elementContent, setElementContent] = useState<string>('');
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const t = useTranslations('HTMLGenerator');

  const pathname = usePathname();

  const locale = pathname ? pathname.split("/")[1] : "en"; 
  const shareUrl = `https://fastfreetools.com/${locale}/html-generator`;
  const shareTitle = t('Share_Title');

  useEffect(() => {
    Prism.highlightAll();
  }, [elements]);

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/html-generator" },
    { locale: 'es', href: "https://fastfreetools.com/es/html-generator" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/html-generator" },
    { locale: 'de', href: "https://fastfreetools.com/de/html-generator" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/html-generator" },
  ];

  const addHtmlElement = (parentId: string | null = null) => {
    if (selectedElement && elementContent) {
      const newElement: HtmlElement = {
        id: Date.now().toString(),
        tag: selectedElement,
        content: sanitizeInput(elementContent),
        children: [],
      };

      if (parentId) {
        setElements(prevElements => {
          const updateChildren = (elements: HtmlElement[]): HtmlElement[] => {
            return elements.map(el => {
              if (el.id === parentId) {
                return { ...el, children: [...el.children, newElement] };
              } else if (el.children.length > 0) {
                return { ...el, children: updateChildren(el.children) };
              }
              return el;
            });
          };
          return updateChildren(prevElements);
        });
      } else {
        setElements(prev => [...prev, newElement]);
      }

      setElementContent('');
    }
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    setElements(prevElements => {
      const moveInTree = (elements: HtmlElement[]): HtmlElement[] => {
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1) {
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex >= 0 && newIndex < elements.length) {
            const temp = elements[newIndex];
            elements[newIndex] = elements[index];
            elements[index] = temp;
          }
          return elements;
        } else {
          return elements.map(el => {
            if (el.children.length > 0) {
              return { ...el, children: moveInTree(el.children) };
            }
            return el;
          });
        }
      };

      return moveInTree([...prevElements]);
    });
  };

  const editElement = (id: string) => {
    const element = findElement(id, elements);
    if (element) {
      setEditingElement(id);
      setSelectedElement(element.tag);
      setElementContent(element.content);
    }
  };

  const updateElement = () => {
    if (editingElement) {
      setElements(prevElements => {
        const updateEl = (elements: HtmlElement[]): HtmlElement[] => {
          return elements.map(el => {
            if (el.id === editingElement) {
              return { ...el, tag: selectedElement, content: sanitizeInput(elementContent) };
            } else if (el.children.length > 0) {
              return { ...el, children: updateEl(el.children) };
            }
            return el;
          });
        };
        return updateEl(prevElements);
      });
      setEditingElement(null);
      setElementContent('');
    }
  };

  const deleteElement = (id: string) => {
    setElements(prevElements => {
      const deleteEl = (elements: HtmlElement[]): HtmlElement[] => {
        return elements.filter(el => {
          if (el.id === id) return false;
          if (el.children.length > 0) {
            el.children = deleteEl(el.children);
          }
          return true;
        });
      };
      return deleteEl(prevElements);
    });
  };

  const findElement = (id: string, elements: HtmlElement[]): HtmlElement | null => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children.length > 0) {
        const found = findElement(id, el.children);
        if (found) return found;
      }
    }
    return null;
  };

  const renderElement = (element: HtmlElement, depth = 0) => {
    return (
      <div key={element.id} className={`ml-${depth * 4} mb-2`}>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{`<${element.tag}>`}</span>
          <span>{element.content}</span>
          <Button size="sm" variant="outline" onClick={() => moveElement(element.id, 'up')} aria-label={t('Move_Up_Aria')} title={t('Move_Up')}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => moveElement(element.id, 'down')} aria-label={t('Move_Down_Aria')} title={t('Move_Down')}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editElement(element.id)} aria-label={t('Edit_Aria')} title={t('Edit')}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => deleteElement(element.id)} aria-label={t('Delete_Aria')} title={t('Delete')}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {element.children.map(child => renderElement(child, depth + 1))}
      </div>
    );
  };

  const generateHtml = (elements: HtmlElement[]): string => {
    return elements.map(el => {
      const childrenHtml = el.children.length > 0 ? generateHtml(el.children) : '';
      return `<${el.tag}>${el.content}${childrenHtml}</${el.tag}>`;
    }).join('\n');
  };

  const handleCopy = async () => {
    const htmlOutput = generateHtml(elements);
    try {
      await navigator.clipboard.writeText(htmlOutput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: t('Copy_Success_Title'),
        description: t('Copy_Success_Description'),
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: t('Copy_Error_Title'),
        description: t('Copy_Error_Description'),
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const htmlOutput = generateHtml(elements);
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_html.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t('Download_Success_Title'),
      description: t('Download_Success_Description'),
    });
  };

  const resetElements = () => {
    setElements([]);
    setIsResetDialogOpen(false);
    toast({
      title: t('Reset_Title'),
      description: t('Reset_Description'),
    });
  };

  const addPrebuiltComponent = (component: string) => {
    if (component === 'navbar') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'nav',
          content: '',
          children: [
            {
              id: (Date.now() + 1).toString(),
              tag: 'ul',
              content: '',
              children: [
                { id: (Date.now() + 2).toString(), tag: 'li', content: '<a href="#">Home</a>', children: [] },
                { id: (Date.now() + 3).toString(), tag: 'li', content: '<a href="#">About</a>', children: [] },
                { id: (Date.now() + 4).toString(), tag: 'li', content: '<a href="#">Contact</a>', children: [] },
              ]
            }
          ]
        }
      ]);
    } else if (component === 'footer') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'footer',
          content: '© 2023 Your Company Name',
          children: []
        }
      ]);
    } else if (component === 'header') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'header',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'h1', content: 'Welcome to My Website', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'p', content: 'This is a sample header', children: [] },
          ]
        }
      ]);
    } else if (component === 'main') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'main',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'h2', content: 'Main Content', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'p', content: 'This is the main content area of the page.', children: [] },
          ]
        }
      ]);
    } else if (component === 'aside') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'aside',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'h3', content: 'Sidebar', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'p', content: 'This is a sidebar with additional information.', children: [] },
          ]
        }
      ]);
    } else if (component === 'article') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'article',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'h2', content: 'Article Title', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'p', content: 'This is the content of the article.', children: [] },
          ]
        }
      ]);
    } else if (component === 'section') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'section',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'h2', content: 'Section Title', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'p', content: 'This is a section of the page.', children: [] },
          ]
        }
      ]);
    } else if (component === 'form') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'form',
          content: '',
          children: [
            { id: (Date.now() + 1).toString(), tag: 'label', content: 'Name:', children: [] },
            { id: (Date.now() + 2).toString(), tag: 'input', content: '', children: [] },
            { id: (Date.now() + 3).toString(), tag: 'label', content: 'Email:', children: [] },
            { id: (Date.now() + 4).toString(), tag: 'input', content: '', children: [] },
            { id: (Date.now() + 5).toString(), tag: 'button', content: 'Submit', children: [] },
          ]
        }
      ]);
    } else if (component === 'table') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'table',
          content: '',
          children: [
            {
              id: (Date.now() + 1).toString(),
              tag: 'thead',
              content: '',
              children: [
                {
                  id: (Date.now() + 2).toString(),
                  tag: 'tr',
                  content: '',
                  children: [
                    { id: (Date.now() + 3).toString(), tag: 'th', content: 'Header 1', children: [] },
                    { id: (Date.now() + 4).toString(), tag: 'th', content: 'Header 2', children: [] },
                  ]
                }
              ]
            },
            {
              id: (Date.now() + 5).toString(),
              tag: 'tbody',
              content: '',
              children: [
                {
                  id: (Date.now() + 6).toString(),
                  tag: 'tr',
                  content: '',
                  children: [
                    { id: (Date.now() + 7).toString(), tag: 'td', content: 'Row 1, Cell 1', children: [] },
                    { id: (Date.now() + 8).toString(), tag: 'td', content: 'Row 1, Cell 2', children: [] },
                  ]
                },
                {
                  id: (Date.now() + 9).toString(),
                  tag: 'tr',
                  content: '',
                  children: [
                    { id: (Date.now() + 10).toString(), tag: 'td', content: 'Row 2, Cell 1', children: [] },
                    { id: (Date.now() + 11).toString(), tag: 'td', content: 'Row 2, Cell 2', children: [] },
                  ]
                }
              ]
            }
          ]
        }
      ]);
    }
  };




  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta name="description" content={t('Page_Description')} />
        <meta name="keywords" content={t('Page_Keywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />
        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
        <meta property="og:title" content={t('Page_Title')} />
        <meta property="og:description" content={t('Page_Description')} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta name="twitter:description" content={t('Page_Description')} />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta charSet="UTF-8" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('Header_Title')}</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    {t('Header_Subtitle')}
                  </p>
                </div>
                <nav className="flex flex-wrap items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('Help_Aria')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">{t('Help')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('Help_Title')}</DialogTitle>
                            <DialogDescription>
                              <p>{t('Help_Introduction')}</p>
                              <p>{t('Help_Benefits')}</p>
                              <ul className="list-disc pl-5">
                                <li>{t('Help_Feature1')}</li>
                                <li>{t('Help_Feature2')}</li>
                                <li>{t('Help_Feature3')}</li>
                                <li>{t('Help_Feature4')}</li>
                                <li>{t('Help_Feature5')}</li>
                              </ul>
                              <p>{t('Help_PrivacyNote')}</p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>

                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Help_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/${locale}`} aria-label={t('Home_Aria')}>
                          <Home className="h-4 w-4" />
                          <span className="sr-only">{t('Home')}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Share_Tooltip')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={t('Theme_Toggle_Aria')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">{t('Theme_Toggle')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Theme_Toggle_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>


            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="html-element">{t('HTML_Element_Label')}</Label>
                    <Select value={selectedElement} onValueChange={setSelectedElement}>
                      <SelectTrigger id="html-element" className="w-full">
                        <SelectValue placeholder={t('Select_Element_Placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h1">{t('Heading_1')}</SelectItem>
                        <SelectItem value="h2">{t('Heading_2')}</SelectItem>
                        <SelectItem value="h3">{t('Heading_3')}</SelectItem>
                        <SelectItem value="p">{t('Paragraph')}</SelectItem>
                        <SelectItem value="a">{t('Link')}</SelectItem>
                        <SelectItem value="ul">{t('Unordered_List')}</SelectItem>
                        <SelectItem value="ol">{t('Ordered_List')}</SelectItem>
                        <SelectItem value="li">{t('List_Item')}</SelectItem>
                        <SelectItem value="div">{t('Div')}</SelectItem>
                        <SelectItem value="span">{t('Span')}</SelectItem>
                        <SelectItem value="header">{t('Header')}</SelectItem>
                        <SelectItem value="nav">{t('Navigation')}</SelectItem>
                        <SelectItem value="main">{t('Main')}</SelectItem>
                        <SelectItem value="article">{t('Article')}</SelectItem>
                        <SelectItem value="section">{t('Section')}</SelectItem>
                        <SelectItem value="aside">{t('Aside')}</SelectItem>
                        <SelectItem value="footer">{t('Footer')}</SelectItem>
                        <SelectItem value="form">{t('Form')}</SelectItem>
                        <SelectItem value="input">{t('Input')}</SelectItem>
                        <SelectItem value="button">{t('Button')}</SelectItem>
                        <SelectItem value="table">{t('Table')}</SelectItem>
                        <SelectItem value="tr">{t('Table_Row')}</SelectItem>
                        <SelectItem value="td">{t('Table_Cell')}</SelectItem>
                        <SelectItem value="th">{t('Table_Header')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="element-content">{t('Element_Content_Label')}</Label>
                    <Input
                      id="element-content"
                      value={elementContent}
                      onChange={(e) => setElementContent(e.target.value)}
                      placeholder={t('Element_Content_Placeholder')}
                    />
                  </div>
                </div>
                <Button onClick={() => editingElement ? updateElement() : addHtmlElement()} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {editingElement ? t('Update_Element') : t('Add_Element')}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>{t('Prebuilt_Components_Label')}</Label>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => addPrebuiltComponent('header')} variant="outline">{t('Add_Header')}</Button>
                  <Button onClick={() => addPrebuiltComponent('navbar')} variant="outline">{t('Add_Navbar')}</Button>
                  <Button onClick={() => addPrebuiltComponent('main')} variant="outline">{t('Add_Main')}</Button>
                  <Button onClick={() => addPrebuiltComponent('aside')} variant="outline">{t('Add_Aside')}</Button>
                  <Button onClick={() => addPrebuiltComponent('footer')} variant="outline">{t('Add_Footer')}</Button>
                  <Button onClick={() => addPrebuiltComponent('article')} variant="outline">{t('Add_Article')}</Button>
                  <Button onClick={() => addPrebuiltComponent('section')} variant="outline">{t('Add_Section')}</Button>
                  <Button onClick={() => addPrebuiltComponent('form')} variant="outline">{t('Add_Form')}</Button>
                  <Button onClick={() => addPrebuiltComponent('table')} variant="outline">{t('Add_Table')}</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{t('HTML_Structure_Label')}</Label>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t('Reset_Button')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('Reset_Confirmation_Title')}</DialogTitle>
                        <DialogDescription>
                          {t('Reset_Confirmation_Description')}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>{t('Cancel_Button')}</Button>
                        <Button variant="destructive" onClick={resetElements}>{t('Confirm_Reset_Button')}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700 min-h-[200px]">
                  {elements.map(el => renderElement(el))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="generated-html">{t('Generated_HTML_Label')}</Label>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={elements.length === 0}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {isCopied ? t('Copied_Button') : t('Copy_Button')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      disabled={elements.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('Download_Button')}
                    </Button>
                  </div>
                </div>
                <pre className="language-markup p-4 rounded-md bg-gray-100 dark:bg-gray-800 overflow-x-auto">
                  <code>{generateHtml(elements)}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <Label>{t('Live_Preview_Label')}</Label>
                <div className="border p-4 rounded-md bg-white dark:bg-gray-900 min-h-[200px]">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateHtml(elements)) }} />
                </div>
              </div>
            </main>

          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default HTMLGenerator;
