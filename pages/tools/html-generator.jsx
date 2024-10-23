'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism.css'

export default function HTMLGenerator() {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState('')
  const [elementContent, setElementContent] = useState('')
  const [editingElement, setEditingElement] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    Prism.highlightAll()
  }, [elements])

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input)
  }

  const addHtmlElement = (parentId = null) => {
    if (selectedElement && elementContent) {
      const newElement = {
        id: Date.now().toString(),
        tag: selectedElement,
        content: sanitizeInput(elementContent),
        children: [],
      }

      if (parentId) {
        setElements(prevElements => {
          const updateChildren = (elements) => {
            return elements.map(el => {
              if (el.id === parentId) {
                return { ...el, children: [...el.children, newElement] }
              } else if (el.children.length > 0) {
                return { ...el, children: updateChildren(el.children) }
              }
              return el
            })
          }
          return updateChildren(prevElements)
        })
      } else {
        setElements(prev => [...prev, newElement])
      }

      setElementContent('')
    }
  }

  const moveElement = (id, direction) => {
    setElements(prevElements => {
      const moveInTree = (elements) => {
        const index = elements.findIndex(el => el.id === id)
        if (index !== -1) {
          const newIndex = direction === 'up' ? index - 1 : index + 1
          if (newIndex >= 0 && newIndex < elements.length) {
            const temp = elements[newIndex]
            elements[newIndex] = elements[index]
            elements[index] = temp
          }
          return elements
        } else {
          return elements.map(el => {
            if (el.children.length > 0) {
              return { ...el, children: moveInTree(el.children) }
            }
            return el
          })
        }
      }

      return moveInTree([...prevElements])
    })
  }

  const editElement = (id) => {
    const element = findElement(id, elements)
    if (element) {
      setEditingElement(id)
      setSelectedElement(element.tag)
      setElementContent(element.content)
    }
  }

  const updateElement = () => {
    if (editingElement) {
      setElements(prevElements => {
        const updateEl = (elements) => {
          return elements.map(el => {
            if (el.id === editingElement) {
              return { ...el, tag: selectedElement, content: sanitizeInput(elementContent) }
            } else if (el.children.length > 0) {
              return { ...el, children: updateEl(el.children) }
            }
            return el
          })
        }
        return updateEl(prevElements)
      })
      setEditingElement(null)
      setElementContent('')
    }
  }

  const deleteElement = (id) => {
    setElements(prevElements => {
      const deleteEl = (elements) => {
        return elements.filter(el => {
          if (el.id === id) return false
          if (el.children.length > 0) {
            el.children = deleteEl(el.children)
          }
          return true
        })
      }
      return deleteEl(prevElements)
    })
  }

  const findElement = (id, elements) => {
    for (const el of elements) {
      if (el.id === id) return el
      if (el.children.length > 0) {
        const found = findElement(id, el.children)
        if (found) return found
      }
    }
    return null
  }

  const renderElement = (element, depth = 0) => {
    return (
      <div key={element.id} className={`ml-${depth * 4} mb-2`}>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{`<${element.tag}>`}</span>
          <span>{element.content}</span>
          <Button size="sm" variant="outline" onClick={() => moveElement(element.id, 'up')} aria-label="Move element up" title="Move element up">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => moveElement(element.id, 'down')} aria-label="Move element down" title="Move element down">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editElement(element.id)} aria-label="Edit element" title="Edit element">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => deleteElement(element.id)} aria-label="Delete element" title="Delete element">
            <Trash2 className="h-4 w-4" />
          </Button>

        </div>
        {element.children.map(child => renderElement(child, depth + 1))}
      </div>
    )
  }

  const generateHtml = (elements) => {
    return elements.map(el => {
      const childrenHtml = el.children.length > 0 ? generateHtml(el.children) : ''
      return `<${el.tag}>${el.content}${childrenHtml}</${el.tag}>`
    }).join('\n')
  }

  const handleCopy = async () => {
    const htmlOutput = generateHtml(elements)
    try {
      await navigator.clipboard.writeText(htmlOutput)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDownload = () => {
    const htmlOutput = generateHtml(elements)
    const blob = new Blob([htmlOutput], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated_html.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetElements = () => {
    setElements([])
    setIsResetDialogOpen(false)
    toast({
      title: "HTML Reset",
      description: "Your canvas has been cleared and reset.",
    })
  }

  const addPrebuiltComponent = (component) => {
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
      ])
    } else if (component === 'footer') {
      setElements(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          tag: 'footer',
          content: '© 2023 Your Company Name',
          children: []
        }
      ])
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
      ])
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
      ])
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
      ])
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
      ])
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
      ])
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
      ])
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
      ])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">HTML Generator</h1>
        <nav className="space-x-2 flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About HTML Generator</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">
                    <strong>Why:</strong> This tool helps you generate HTML code by adding and organizing elements visually.
                  </p>
                  <p className="mt-2">
                    <strong>What:</strong> You can add HTML elements, nest them, reorder them, and even use pre-built components.
                  </p>
                  <p className="mt-2">
                    <strong>How:</strong> Select an element type, enter content, and click "Add Element". Use the buttons to reorder, edit, or delete elements. The generated HTML will be displayed with a live preview.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" asChild>
            <a href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </header>

      <main className="space-y-4">
        <section className="flex flex-col md:flex-row items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="html-element">HTML Element</Label>
            <Select value={selectedElement} onValueChange={setSelectedElement}>
              <SelectTrigger id="html-element">
                <SelectValue placeholder="Select element" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="p">Paragraph</SelectItem>
                <SelectItem value="a">Link</SelectItem>
                <SelectItem value="ul">Unordered List</SelectItem>
                <SelectItem value="ol">Ordered List</SelectItem>
                <SelectItem value="li">List Item</SelectItem>
                <SelectItem value="div">Div</SelectItem>
                <SelectItem value="span">Span</SelectItem>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="nav">Navigation</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="section">Section</SelectItem>
                <SelectItem value="aside">Aside</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="tr">Table Row</SelectItem>
                <SelectItem value="td">Table Cell</SelectItem>
                <SelectItem value="th">Table Header</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="element-content">Element Content</Label>
            <Input
              id="element-content"
              value={elementContent}
              onChange={(e) => setElementContent(e.target.value)}
              placeholder="Enter element content"
            />
          </div>
          <Button onClick={() => editingElement ? updateElement() : addHtmlElement()}>
            {editingElement ? 'Update Element' : 'Add Element'}
          </Button>
        </section>

        <section className="flex flex-wrap gap-2">
          <Button onClick={() => addPrebuiltComponent('header')}>Add Header</Button>
          <Button onClick={() => addPrebuiltComponent('navbar')}>Add Navbar</Button>
          <Button onClick={() => addPrebuiltComponent('main')}>Add Main</Button>
          <Button onClick={() => addPrebuiltComponent('aside')}>Add Aside</Button>
          <Button onClick={() => addPrebuiltComponent('footer')}>Add Footer</Button>
          <Button onClick={() => addPrebuiltComponent('article')}>Add Article</Button>
          <Button onClick={() => addPrebuiltComponent('section')}>Add Section</Button>
          <Button onClick={() => addPrebuiltComponent('form')}>Add Form</Button>
          <Button onClick={() => addPrebuiltComponent('table')}>Add Table</Button>
        </section>

        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Reset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will reset your entire canvas and remove all the elements. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={resetElements}>Confirm Reset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <section className="border p-4 rounded-md">
          {elements.map(el => renderElement(el))}
        </section>
      </main>

      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="html-output">Generated HTML</Label>
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
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={elements.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        <pre className="language-markup">
          <code>{generateHtml(elements)}</code>
        </pre>
      </section>

      <section className="space-y-2">
        <Label>Live Preview</Label>
        <div className="border p-4 rounded-md">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateHtml(elements)) }} />
        </div>
      </section>
    </div>
  )
}
