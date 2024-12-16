'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Head from 'next/head'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { ArrowDownAZ, ArrowUpAZ, Download, HelpCircle, Home, Moon, Plus, Share, Sun, Trash, Upload, Info } from "lucide-react"
import Link from 'next/link'
import { useTheme } from 'next-themes'
import Papa from 'papaparse'
import { usePathname } from "next/navigation"
import ShareButton from '../components/share-button'
import { useTranslations } from 'next-intl'

type ColumnType = 'text' | 'number' | 'date'

interface Column {
  id: string
  name: string
  type: ColumnType
}

interface Row {
  id: string
  [key: string]: string | number | Date
}

const sampleColumns: Column[] = [
  { id: 'name', name: 'Name', type: 'text' },
  { id: 'age', name: 'Age', type: 'number' },
  { id: 'city', name: 'City', type: 'text' },
  { id: 'joinDate', name: 'Join Date', type: 'date' },
]

const sampleRows: Row[] = [
  { id: '1', name: 'John Doe', age: 30, city: 'New York', joinDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', age: 28, city: 'Los Angeles', joinDate: '2023-02-20' },
  { id: '3', name: 'Bob Johnson', age: 35, city: 'Chicago', joinDate: '2023-03-10' },
]

export default function DataTableGenerator() {
  const pathname = usePathname();
  const t = useTranslations('DataTableGenerator');

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/data-table-generator`;

  const [columns, setColumns] = useState<Column[]>(sampleColumns)
  const [rows, setRows] = useState<Row[]>(sampleRows)
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [previewData, setPreviewData] = useState<Row[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('table')
  const tableRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const addColumn = () => {
    if (newColumnName) {
      const newColumn: Column = {
        id: Date.now().toString(),
        name: newColumnName,
        type: newColumnType,
      }
      setColumns([...columns, newColumn])
      setRows(rows.map(row => ({ ...row, [newColumn.id]: '' })))
      setNewColumnName('')
      setNewColumnType('text')
    }
  }

  const formatCellValue = (value: string | number | Date): string => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]
    }
    return String(value)
  }

  const removeColumn = (id: string) => {
    setColumns(columns.filter(column => column.id !== id));
    setRows(rows.map(row => {
      const { [id]: removed, ...rest } = row;
      return rest as Row;
    }));
  };

  const addRow = () => {
    const newRow: Row = {
      id: Date.now().toString(),
      ...Object.fromEntries(columns.map(column => [column.id, '']))
    }
    setRows([...rows, newRow])
  }

  const updateCell = (rowId: string, columnId: string, value: string) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return { ...row, [columnId]: value }
      }
      return row
    }))
  }

  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id))
  }

  const sortData = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  useEffect(() => {
    if (sortColumn) {
      const sortedRows = [...rows].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
      setRows(sortedRows)
    }
  }, [sortColumn, sortDirection])

  const exportCSV = () => {
    const csvContent = Papa.unparse(rows)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'data_table.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportJSON = () => {
    const jsonContent = JSON.stringify(rows, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'data_table.json')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('fileTooLarge'),
          description: t('fileSizeLimit'),
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let importedData: any[];

          if (file.name.toLowerCase().endsWith('.csv')) {
            const results = Papa.parse(content, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true
            });

            if (results.errors.length > 0) {
              throw new Error('CSV parsing errors detected');
            }

            importedData = results.data as any[];
          } else if (file.name.toLowerCase().endsWith('.json')) {
            importedData = JSON.parse(content);
            if (!Array.isArray(importedData)) {
              throw new Error('JSON must contain an array of objects');
            }
          } else {
            throw new Error('Unsupported file format');
          }

          if (importedData.length > 4000) {
            toast({
              title: t('tooManyRows'),
              description: t('rowLimitExceeded'),
              variant: "destructive",
            });
            return;
          }

          importedData = importedData.filter(item =>
            item && typeof item === 'object' && Object.keys(item).length > 0
          );

          if (importedData.length === 0) {
            throw new Error('No valid data found in file');
          }

          const firstRow = importedData[0];
          const newColumns: Column[] = Object.keys(firstRow)
            .filter(key => key !== 'id')
            .map(key => ({
              id: key,
              name: key,
              type: typeof firstRow[key] === 'number' ? 'number' : 'text'
            }));

          const newRows = importedData.map((row, index) => {
            const newRow: Row = {
              id: `imported-${Date.now()}-${index}`,
              ...Object.fromEntries(
                newColumns.map(col => [col.id, row[col.id] ?? ''])
              )
            };
            return newRow;
          });

          setPreviewData(newRows);
          setColumns(newColumns);
          setShowPreview(true);

          toast({
            title: t('dataPreviewReady'),
            description: t('previewRows', { count: newRows.length }),
          });
        } catch (error) {
          console.error("Import error:", error);
          toast({
            title: t('importFailed'),
            description: error instanceof Error ? error.message : t('invalidFileFormat'),
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: t('importFailed'),
          description: t('errorReadingFile'),
          variant: "destructive",
        });
      };

      reader.readAsText(file);
    }
  };

  const confirmImport = () => {
    setRows(previewData);
    setShowPreview(false);
    toast({
      title: t('dataImportedSuccessfully'),
      description: t('importedRows', { count: previewData.length }),
    });
  };

  const calculateSum = (columnId: string) => {
    const sum = rows.reduce((acc, row) => {
      const value = parseFloat(row[columnId] as string)
      return isNaN(value) ? acc : acc + value
    }, 0)
    return sum.toFixed(2)
  }

  const calculateAverage = (columnId: string) => {
    const sum = parseFloat(calculateSum(columnId))
    return (sum / rows.length).toFixed(2)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.pageX - (tableRef.current?.offsetLeft || 0))
    setScrollLeft(tableRef.current?.scrollLeft || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (tableRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (tableRef.current) {
      tableRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/data-table-generator" },
    { locale: 'es', href: "https://fastfreetools.com/es/data-table-generator" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/data-table-generator" },
    { locale: 'de', href: "https://fastfreetools.com/de/data-table-generator" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/data-table-generator" },
  ];
  

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
        <meta property="og:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/opengraph-image.png" />
        <meta charSet="UTF-8" />
      </Head>


    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
      <main className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{t('title')}</h1>
            <nav className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
                      <HelpCircle className="h-5 w-5" />
                      <span className="sr-only">{t('help')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('helpTooltip')}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                      <Link href="/">
                        <Home className="h-5 w-5" />
                        <span className="sr-only">{t('home')}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('home')}</p>
                  </TooltipContent>
                </Tooltip>

                <ShareButton shareUrl={shareUrl} shareTitle={t('shareTitle')} tooltipText={t('shareTool')} />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">{t('toggleTheme')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('toggleTheme')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-300 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">{t('welcomeMessage')}</h2>
              <p className="text-blue-600 dark:text-blue-300 mt-1">
                {t('welcomeDescription')}
              </p>
            </div>
          </div>

          <div className="sm:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectTab')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">{t('tableTab')}</SelectItem>
                <SelectItem value="columns">{t('columnsTab')}</SelectItem>
                <SelectItem value="import-export">{t('importExportTab')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:block">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="table">{t('tableTab')}</TabsTrigger>
                <TabsTrigger value="columns">{t('columnsTab')}</TabsTrigger>
                <TabsTrigger value="import-export">{t('importExportTab')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {activeTab === 'table' && (
              <>
                <div className="overflow-x-auto border rounded-lg cursor-grab active:cursor-grabbing" ref={tableRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        {columns.map(column => (
                          <TableHead key={column.id} className="min-w-[150px] whitespace-nowrap" onClick={() => sortData(column.id)}>
                            {column.name}
                            {sortColumn === column.id && (
                              sortDirection === 'asc' ? <ArrowUpAZ className="inline ml-1" /> : <ArrowDownAZ className="inline ml-1" />
                            )}
                          </TableHead>
                        ))}
                        <TableHead className="min-w-[150px] whitespace-nowrap">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow key={row.id}>
                          {columns.map(column => (
                            <TableCell key={`${row.id}-${column.id}`} className="min-w-[150px] whitespace-nowrap">
                              <Input
                                type={column.type === 'number' ? 'number' : 'text'}
                                value={formatCellValue(row[column.id])}
                                onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                              />
                            </TableCell>
                          ))}
                          <TableCell className="min-w-[150px] whitespace-nowrap">
                            <Button variant="destructive" size="sm" onClick={() => removeRow(row.id)} aria-label={t('deleteRow')}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button onClick={addRow} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> {t('addRow')}
                </Button>
              </>
            )}

            {activeTab === 'columns' && (
              <>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    placeholder={t('columnNamePlaceholder')}
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="flex-grow"
                  />
                  <Select value={newColumnType} onValueChange={(value: ColumnType) => setNewColumnType(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('columnTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t('textType')}</SelectItem>
                      <SelectItem value="number">{t('numberType')}</SelectItem>
                      <SelectItem value="date">{t('dateType')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addColumn} className="w-full sm:w-auto">{t('addColumn')}</Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('type')}</TableHead>
                        <TableHead>{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columns.map(column => (
                        <TableRow key={column.id}>
                          <TableCell>{column.name}</TableCell>
                          <TableCell>{t(`${column.type}Type`)}</TableCell>
                          <TableCell>
                            <Button variant="destructive" size="sm" onClick={() => removeColumn(column.id)} aria-label={t('deleteColumn')}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {activeTab === 'import-export' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button onClick={exportCSV} className="w-full">
                    <Download className="mr-2 h-4 w-4" /> {t('exportCSV')}
                  </Button>
                  <Button onClick={exportJSON} className="w-full">
                    <Download className="mr-2 h-4 w-4" /> {t('exportJSON')}
                  </Button>
                  <div className="relative">
                    <Input
                      id="import-file"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={importData}
                      accept=".json,.csv"
                      aria-label={t('importData')}
                    />
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" /> {t('importData')}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{t('importInstructions')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>{t('supportedFormats')}</li>
                    <li>{t('csvFirstRow')}</li>
                    <li>{t('jsonArray')}</li>
                    <li>{t('importReplacesData')}</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {showPreview && (
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{t('dataPreview')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map(column => (
                          <TableHead key={column.id}>{column.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <TableRow key={index}>
                          {columns.map(column => (
                            <TableCell key={column.id}>
                              {formatCellValue(row[column.id])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-sm text-gray-500">
                    {t('previewLimit')}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowPreview(false)}>
                      {t('cancel')}
                    </Button>
                    <Button onClick={confirmImport}>
                      {t('confirmImport')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {columns.some(column => column.type === 'number') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">{t('viewCalculations')}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('calculations')}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('column')}</TableHead>
                        <TableHead>{t('sum')}</TableHead>
                        <TableHead>{t('average')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columns.filter(column => column.type === 'number').map(column => (
                        <TableRow key={column.id}>
                          <TableCell>{column.name}</TableCell>
                          <TableCell>{calculateSum(column.id)}</TableCell>
                          <TableCell>{calculateAverage(column.id)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  </>
  )
}
