'use client';

import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  updateEdge,
  NodeResizeControl,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';
import { Home, HelpCircle, Moon, Sun, Download, Plus, Square, Circle, Diamond, Triangle, Edit2, Layout } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ShareButton from '../components/share-button';
import { usePathname } from "next/navigation";
import { toPng, toSvg, toJpeg } from 'html-to-image';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

interface CustomNodeData {
  label: string;
  color?: string;
  shape?: 'circle' | 'square' | 'diamond' | 'triangle';
  onLabelChange?: (id: string, newLabel: string) => void;
  onColorChange?: (id: string, newColor: string) => void;
}

interface CustomEdgeData {
  label?: string;
  color?: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  onLabelChange?: (id: string, newLabel: string) => void;
  onColorChange?: (id: string, newColor: string) => void;
  onStyleChange?: (id: string, newStyle: string) => void;
  onWidthChange?: (id: string, newWidth: number) => void;
}

type CustomNode = Node<CustomNodeData>;
type CustomEdge = Edge<CustomEdgeData>;

// Custom Node component with editable label, color picker, and resizing functionality
const CustomNodeComponent: React.FC<NodeProps<CustomNodeData>> = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!data) {
    return null;
  }

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (data.onLabelChange && inputRef.current) {
      data.onLabelChange(id, inputRef.current.value);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-center text-white ${data.shape === 'circle' ? 'rounded-full' : data.shape === 'diamond' ? '' : 'rounded'
          }`}
        style={{
          backgroundColor: data.color || '#3B82F6',
          width: '100%',
          height: '100%',
          minWidth: '100px',
          minHeight: '100px',
          borderRadius: data.shape === 'circle' ? '50%' : data.shape === 'diamond' ? '0' : '4px',
          transform: data.shape === 'diamond' ? 'rotate(45deg)' : 'none',
        }}
        onDoubleClick={startEditing}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            defaultValue={data.label}
            onBlur={finishEditing}
            onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
            className="w-full text-center bg-transparent text-white"
          />
        ) : (
          <div className="text-center">{data.label}</div>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-white">
            <Edit2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <Label htmlFor={`node-color-${id}`}>Color</Label>
            <Input
              id={`node-color-${id}`}
              type="color"
              value={data.color || '#3B82F6'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => data.onColorChange && data.onColorChange(id, e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
      {selected && (
        <>
          <NodeResizeControl minWidth={100} minHeight={100} />
        </>
      )}
    </>
  );
};

// Custom Edge component with editable label and style options
const CustomEdgeComponent: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!data) {
    return null;
  }

  const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (data.onLabelChange && inputRef.current) {
      data.onLabelChange(id, inputRef.current.value);
    }
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={data.strokeWidth || 1}
        stroke={data.color || '#b1b1b7'}
        strokeDasharray={data.style === 'dashed' ? '5,5' : undefined}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
          onDoubleClick={startEditing}
        >
          {isEditing ? (
            <foreignObject width={100} height={20} x={-50} y={-10}>
              <input
                ref={inputRef}
                defaultValue={data.label}
                onBlur={finishEditing}
                onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
                className="w-full text-center bg-white border rounded"
              />
            </foreignObject>
          ) : (
            data.label
          )}
        </textPath>
      </text>
      <Popover>
        <PopoverTrigger asChild>
          <circle
            cx={(sourceX + targetX) / 2}
            cy={(sourceY + targetY) / 2}
            r={8}
            fill="#ffffff"
            stroke="#b1b1b7"
            strokeWidth={1}
            className="cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <Label htmlFor={`edge-color-${id}`}>Color</Label>
            <Input
              id={`edge-color-${id}`}
              type="color"
              value={data.color || '#b1b1b7'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => data.onColorChange && data.onColorChange(id, e.target.value)}
            />
            <Label htmlFor={`edge-style-${id}`}>Style</Label>
            <select
              id={`edge-style-${id}`}
              value={data.style || 'solid'}
              onChange={(e) => data.onStyleChange && data.onStyleChange(id, e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
            <Label htmlFor={`edge-width-${id}`}>Width</Label>
            <Input
              id={`edge-width-${id}`}
              type="number"
              min={1}
              max={10}
              value={data.strokeWidth || 1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => data.onWidthChange && data.onWidthChange(id, parseInt(e.target.value))}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNodeComponent,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdgeComponent,
};

// Pre-defined templates
const templates: Record<string, { nodes: CustomNode[]; edges: CustomEdge[] }> = {
  decisionTree: {
    nodes: [
      { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Start', shape: 'circle' } },
      { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Decision 1', shape: 'diamond' } },
      { id: '3', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'Option A', shape: 'square' } },
      { id: '4', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'Option B', shape: 'square' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'custom' },
      { id: 'e2-3', source: '2', target: '3', type: 'custom', data: { label: 'Yes' } },
      { id: 'e2-4', source: '2', target: '4', type: 'custom', data: { label: 'No' } },
    ],
  },
  flowchart: {
    nodes: [
      { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Start', shape: 'circle' } },
      { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Process 1', shape: 'square' } },
      { id: '3', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Process 2', shape: 'square' } },
      { id: '4', type: 'custom', position: { x: 250, y: 300 }, data: { label: 'End', shape: 'circle' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'custom' },
      { id: 'e2-3', source: '2', target: '3', type: 'custom' },
      { id: 'e3-4', source: '3', target: '4', type: 'custom' },
    ],
  },
  mindMap: {
    nodes: [
      { id: '1', type: 'custom', position: { x: 250, y: 150 }, data: { label: 'Central Idea', shape: 'circle' } },
      { id: '2', type: 'custom', position: { x: 100, y: 50 }, data: { label: 'Branch 1', shape: 'square' } },
      { id: '3', type: 'custom', position: { x: 400, y: 50 }, data: { label: 'Branch 2', shape: 'square' } },
      { id: '4', type: 'custom', position: { x: 100, y: 250 }, data: { label: 'Branch 3', shape: 'square' } },
      { id: '5', type: 'custom', position: { x: 400, y: 250 }, data: { label: 'Branch 4', shape: 'square' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'custom' },
      { id: 'e1-3', source: '1', target: '3', type: 'custom' },
      { id: 'e1-4', source: '1', target: '4', type: 'custom' },
      { id: 'e1-5', source: '1', target: '5', type: 'custom' },
    ],
  },
};

export default function OnlineFlowchartMaker() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState<'circle' | 'square' | 'diamond' | 'triangle'>('square');
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const pathname = usePathname();
  const t = useTranslations('OnlineFlowchartMaker');

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/online-flowchart-maker`;

  // Declare functions before using them
  const onNodeLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data!, label: newLabel },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onNodeColorChange = useCallback((nodeId: string, newColor: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data!, color: newColor },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onEdgeLabelChange = useCallback((edgeId: string, newLabel: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data!, label: newLabel },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onEdgeColorChange = useCallback((edgeId: string, newColor: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data!, color: newColor },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onEdgeStyleChange = useCallback((edgeId: string, newStyle: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data!, style: newStyle as 'solid' | 'dashed' },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onEdgeWidthChange = useCallback((edgeId: string, newWidth: number) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data!, strokeWidth: newWidth },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const onConnect = useCallback((params: Edge<CustomEdgeData> | Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'custom',
          data: {
            onLabelChange: onEdgeLabelChange,
            onColorChange: onEdgeColorChange,
            onStyleChange: onEdgeStyleChange,
            onWidthChange: onEdgeWidthChange,
          },
        },
        eds
      )
    );
  }, [setEdges, onEdgeLabelChange, onEdgeColorChange, onEdgeStyleChange, onEdgeWidthChange]);

  const onEdgeUpdate = useCallback((oldEdge: Edge<CustomEdgeData>, newConnection: Connection) => {
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as 'circle' | 'square' | 'diamond' | 'triangle';

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: CustomNode = {
        id: `${type}-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: {
          label: `${type} node`,
          shape: type,
          onLabelChange: onNodeLabelChange,
          onColorChange: onNodeColorChange,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, onNodeLabelChange, onNodeColorChange]
  );

  const addNode = () => {
    const newNode: CustomNode = {
      id: `${nodeType}-${nodes.length + 1}`,
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        label: nodeName || `${nodeType} node`,
        shape: nodeType,
        onLabelChange: onNodeLabelChange,
        onColorChange: onNodeColorChange,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
  };

  const exportFlowchart = async (format: 'png' | 'svg' | 'jpg') => {
    if (reactFlowWrapper.current === null) return;

    try {
      let dataUrl: string = '';
      switch (format) {
        case 'png':
          dataUrl = await toPng(reactFlowWrapper.current, { quality: 0.95 });
          break;
        case 'svg':
          dataUrl = await toSvg(reactFlowWrapper.current);
          break;
        case 'jpg':
          dataUrl = await toJpeg(reactFlowWrapper.current, { quality: 0.95 });
          break;
        default:
          throw new Error('Unsupported format');
      }

      const link = document.createElement('a');
      link.download = `flowchart.${format}`;
      link.href = dataUrl;
      link.click();

      toast({
        title: t('Export_Success'),
        description: t('Export_Description', { format: format.toUpperCase() }),
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: t('Export_Failed'),
        description: t('Export_Failed_Description'),
        variant: "destructive",
      });
    }
  };

  const applyTemplate = (templateName: keyof typeof templates) => {
    const template = templates[templateName];

    setNodes(
      template.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: onNodeLabelChange,
          onColorChange: onNodeColorChange,
        },
      }))
    );

    setEdges(
      template.edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onLabelChange: onEdgeLabelChange,
          onColorChange: onEdgeColorChange,
          onStyleChange: onEdgeStyleChange,
          onWidthChange: onEdgeWidthChange,
        },
      }))
    );

    setIsTemplateModalOpen(false);
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/online-flowchart-maker" },
    { locale: 'es', href: "https://fastfreetools.com/es/online-flowchart-maker" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/online-flowchart-maker" },
    { locale: 'de', href: "https://fastfreetools.com/de/online-flowchart-maker" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/online-flowchart-maker" },
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

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('Title')}</h1>
                <nav className="flex items-center space-x-2">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Help" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('Help_Text')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('About_Tool')}</DialogTitle>
                        <DialogDescription>
                          <p>{t('Why_Text')}</p>
                          <p>{t('What_Text')}</p>
                          <p>{t('How_Text')}</p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label="Home">
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={t('Share_Title')} tooltipText={t('Share_Tool')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={t('Toggle_Theme')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Switch_Mode')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="node-name">{t('Node_Name')}</Label>
                  <Input
                    id="node-name"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    placeholder={t('Enter_Node_Name')}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="node-type">{t('Node_Type')}</Label>
                  <select
                    id="node-type"
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="square">{t('Square')}</option>
                    <option value="circle">{t('Circle')}</option>
                    <option value="diamond">{t('Diamond')}</option>
                    <option value="triangle">{t('Triangle')}</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addNode} className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add_Node')}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <Button onClick={() => exportFlowchart('png')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Export_PNG')}
                </Button>
                <Button onClick={() => exportFlowchart('svg')} className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Export_SVG')}
                </Button>
                <Button onClick={() => exportFlowchart('jpg')} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Export_JPG')}
                </Button>
                <Button onClick={() => setIsTemplateModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Layout className="h-4 w-4 mr-2" />
                  {t('Choose_Template')}
                </Button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="snap-to-grid">{t('Snap_to_Grid')}</Label>
                  <Switch
                    id="snap-to-grid"
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="grid-size">{t('Grid_Size')}</Label>
                  <Input
                    id="grid-size"
                    type="number"
                    min={5}
                    max={100}
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div style={{ width: '100%', height: '600px' }} ref={reactFlowWrapper}>
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeUpdate={onEdgeUpdate}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    snapToGrid={snapToGrid}
                    snapGrid={[gridSize, gridSize]}
                    defaultEdgeOptions={{
                      type: 'custom',
                      data: {
                        onLabelChange: onEdgeLabelChange,
                        onColorChange: onEdgeColorChange,
                        onStyleChange: onEdgeStyleChange,
                        onWidthChange: onEdgeWidthChange,
                      },
                    }}
                  >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={gridSize} size={1} />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">{t('Drag_Drop_Shapes')}</h2>
                <div className="flex flex-wrap gap-4">
                  {['square', 'circle', 'diamond', 'triangle'].map((shape) => (
                    <div
                      key={shape}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('application/reactflow', shape)}
                      className="w-20 h-20 flex items-center justify-center text-white cursor-move"
                      style={{
                        backgroundColor: shape === 'square' ? '#3B82F6' :
                          shape === 'circle' ? '#10B981' :
                            shape === 'diamond' ? '#F59E0B' : '#EF4444',
                        borderRadius: shape === 'circle' ? '50%' :
                          shape === 'diamond' ? '0' : '4px',
                        transform: shape === 'diamond' ? 'rotate(45deg)' : 'none',
                      }}
                    >
                      {shape === 'square' && <Square />}
                      {shape === 'circle' && <Circle />}
                      {shape === 'diamond' && <Diamond style={{ transform: 'rotate(-45deg)' }} />}
                      {shape === 'triangle' && <Triangle />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </TooltipProvider>

      {/* Template Selection Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Choose_Template')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(templates).map((templateName) => (
              <Button
                key={templateName}
                onClick={() => applyTemplate(templateName as keyof typeof templates)}
                className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {templateName}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

