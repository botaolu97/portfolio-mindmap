import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Background, BackgroundVariant, Handle, Position, ReactFlow, applyNodeChanges, getNodesBounds, getViewportForBounds,
  useReactFlow, useViewport, type Node, type NodeProps, type NodeChange, type CoordinateExtent,
} from '@xyflow/react';
import { pages, navigationPages, pageById, initialCollapsed, descendants, isHidden, expandAncestors, pageFromHash, type Page } from './graph';

type PortfolioNode = Node<{
  page: Page;
  active: boolean;
  collapsed: boolean;
  count: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}, 'portfolio'>;

const contentFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const Markdown = lazy(() => import('react-markdown'));
const extent: CoordinateExtent = [[-1300, -800], [2700, 2200]];
const minZoom = 0.25;
const maxZoom = 1.8;
const initialId = pageFromHash(window.location.hash);

function MindMapNode({ data }: NodeProps<PortfolioNode>) {
  const { page, active, collapsed, count, onSelect, onToggle } = data;
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const component = page.kind === 'email' || page.kind === 'music';
  const selectable = page.selectable !== false;
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(page.email!);
      setCopyState('copied');
    } catch { setCopyState('error'); }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState('idle'), 2500);
  };
  return (
    <div className={`map-card ${page.kind ?? ''} ${component ? 'component-card' : ''} ${selectable ? 'page-card' : 'static-card'} ${active && selectable ? 'active' : ''}`}>
      <Handle type="target" position={page.side === 'left' ? Position.Right : Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
      {page.kind === 'root' && <Handle type="source" position={Position.Left} id="left" />}
      {page.kind === 'email' ? <>
        <button className="node-body" onClick={copyEmail} aria-label={`Copy email address ${page.email}`} title={page.email}>
          <img className="component-icon" src="/icons/copy.svg" alt="" /><span>{copyState === 'copied' ? 'Copied!' : 'Email'}</span>
        </button>
        <span className="sr-only" role="status">{copyState === 'copied' ? 'Email address copied' : copyState === 'error' ? `Unable to copy. Email: ${page.email}` : ''}</span>
        {copyState === 'error' && <span className="copy-error nodrag">{page.email}</span>}
      </> : page.kind === 'music' ? <div className="node-body" aria-label="Music — no track added" title="No track added"><img className="component-icon" src="/icons/music.svg" alt="" /><span>Music</span></div> : !selectable ? (
        page.href ? <a className="node-body" href={page.href} target="_blank" rel="noreferrer" aria-label={`Visit ${page.label} (opens in a new tab)`}>{page.label}</a> : count > 0 ? <button className="node-body" onClick={() => onToggle(page.id)} aria-expanded={!collapsed} aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${page.label} branch`}>{page.label}</button> : <div className="node-body">{page.label}</div>
      ) : <button className="node-body" onClick={() => onSelect(page.id)} aria-label={`Open ${page.label}`} aria-current={active ? 'page' : undefined}>
        {page.thumbnail && <img className="thumbnail" src={page.thumbnail} alt="" draggable={false} />}
        <span>{page.label}</span>
      </button>}
      {selectable && <span className="selection-corners" aria-hidden="true"><i /><i /><i /><i /></span>}
      {count > 0 && <button className="branch-toggle nodrag nopan" aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${page.label}${collapsed ? `, ${count} hidden pages` : ''}`} aria-expanded={!collapsed} onClick={() => onToggle(page.id)}>
        <span className="branch-badge">{collapsed ? count : <img src="/icons/chevron.svg" alt="" />}</span>
      </button>}
    </div>
  );
}

const nodeTypes = { portfolio: MindMapNode };

function CanvasControls({ onFit }: { onFit: () => void }) {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();
  return <div className="canvas-controls" aria-label="Canvas controls">
    <button className="canvas-button" onClick={onFit} aria-label="Fit map to view" title="Fit map to view"><img src="/icons/fit-view.svg" alt="" /></button>
    <button className="canvas-button zoom-symbol" onClick={() => zoomIn()} disabled={zoom >= maxZoom - 0.01} aria-label="Zoom in" title="Zoom in">+</button>
    <button className="canvas-button zoom-symbol" onClick={() => zoomOut()} disabled={zoom <= minZoom + 0.01} aria-label="Zoom out" title="Zoom out">−</button>
    <output className="zoom-value" aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
  </div>;
}

export default function App() {
  const [selected, setSelected] = useState(initialId);
  const [collapsed, setCollapsed] = useState(() => expandAncestors(initialId, initialCollapsed));
  const [nodes, setNodes] = useState<PortfolioNode[]>(() => pages.map((page) => ({
    id: page.id, type: 'portfolio', position: page.position,
    deletable: false, connectable: false,
    data: { page, active: false, collapsed: false, count: descendants(page.id).length, onSelect: () => {}, onToggle: () => {} },
  })));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [accent, setAccent] = useState('#ff2700');
  const [accentOpen, setAccentOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const { getNodes, getNode, setViewport } = useReactFlow<PortfolioNode>();
  const mapRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readButtonRef = useRef<HTMLButtonElement>(null);
  const selectedPage = pageById.get(selected)!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectPage = useCallback((id: string) => {
    if (!navigationPages.some((page) => page.id === id)) return;
    setCollapsed((current) => expandAncestors(id, current));
    setSelected(id);
    if (window.location.hash !== `#${id}`) window.location.hash = id;
  }, []);

  useEffect(() => {
    const update = () => {
      const id = pageFromHash(window.location.hash);
      setCollapsed((current) => expandAncestors(id, current));
      setSelected(id);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    document.title = selected === 'about' ? 'Botao Lu — Portfolio' : `${selectedPage.title} — Botao Lu`;
    articleRef.current?.scrollTo({ top: 0 });
  }, [selectedPage, selected]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => { setCompact(media.matches); setSheetOpen(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (sheetOpen && dialog && !dialog.open) dialog.showModal();
    else if (dialog?.open) dialog.close();
  }, [sheetOpen, compact]);

  const toggleBranch = useCallback((id: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, [collapsed, selected, selectPage]);

  const visibleNodes = useMemo(() => nodes.map((node) => ({
    ...node, hidden: isHidden(node.id, collapsed),
    data: { ...node.data, active: selected === node.id, collapsed: collapsed.has(node.id), onSelect: selectPage, onToggle: toggleBranch },
  })), [nodes, collapsed, selected, selectPage, toggleBranch]);

  const edges = useMemo(() => pages.filter((page) => page.parent).map((page) => ({
    id: `${page.parent}-${page.id}`, source: page.parent!, target: page.id,
    sourceHandle: page.side === 'left' ? 'left' : 'out', targetHandle: 'in',
    hidden: isHidden(page.id, collapsed), selectable: false, deletable: false, focusable: false,
    style: { stroke: 'var(--edge)', strokeWidth: 2 },
  })), [collapsed]);

  const onNodesChange = useCallback((changes: NodeChange<PortfolioNode>[]) => {
    // Visitors can move nodes; the authored graph cannot be deleted or replaced.
    setNodes((current) => applyNodeChanges(changes.filter((change) => change.type === 'position' || change.type === 'dimensions'), current));
  }, []);

  const fit = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const panel = document.querySelector<HTMLElement>('.content-panel:not(.mobile-sheet)');
    const width = compact ? map.clientWidth : (panel?.offsetLeft ?? map.clientWidth) - 24;
    const bounds = getNodesBounds(getNodes().filter((node) => !node.hidden));
    const viewport = getViewportForBounds(bounds, Math.max(width, 240), map.clientHeight, minZoom, 1, 0.12);
    void setViewport(viewport, { duration: reducedMotion ? 0 : 220 });
  }, [getNodes, setViewport, compact, reducedMotion]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(fit, 100);
    });
    observer.observe(mapRef.current);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [ready, fit]);

  const navigateFromPanel = (id: string) => {
    selectPage(id);
    const node = getNode(id);
    if (node && mapRef.current) {
      const panel = document.querySelector<HTMLElement>('.content-panel:not(.mobile-sheet)');
      const width = compact ? mapRef.current.clientWidth : (panel?.offsetLeft ?? mapRef.current.clientWidth) - 24;
      const zoom = compact ? 0.75 : 0.9;
      void setViewport({ x: width / 2 - (node.position.x + (node.measured?.width ?? 162) / 2) * zoom, y: mapRef.current.clientHeight / 2 - (node.position.y + (node.measured?.height ?? 75) / 2) * zoom, zoom }, { duration: reducedMotion ? 0 : 220 });
    }
  };

  const content = contentFiles[`../content/${selected}.md`] ?? `# ${selectedPage.title}\n`;
  const closeSheet = () => { setSheetOpen(false); readButtonRef.current?.focus(); };
  const panelContent = <>
    <div className="panel-toolbar">
      <label className="page-selector">
        <span className="sr-only">Choose a page</span>
        <select value={selected} onChange={(event) => navigateFromPanel(event.target.value)}>
          {navigationPages.map((page) => <option key={page.id} value={page.id}>{page.parent && page.parent !== 'about' ? '　' : ''}{page.label}</option>)}
        </select>
        <img src="/icons/chevron.svg" alt="" />
      </label>
      {compact && <button className="close-sheet" onClick={closeSheet} aria-label="Close page and return to map">×</button>}
    </div>
    <article ref={articleRef} className={`page-content ${selected === 'about' ? 'about-content' : ''}`} tabIndex={-1} aria-label={selectedPage.title}>
      <Suspense fallback={<h1>{selectedPage.title}</h1>}><Markdown>{content}</Markdown></Suspense>
    </article>
  </>;

  return <main className="portfolio" style={{ '--accent': accent } as React.CSSProperties}>
    {!compact && <button className="skip-to-content" onClick={() => articleRef.current?.focus()}>Read selected content</button>}
    <div className="canvas-background" />
    <section className="map-region" ref={mapRef} aria-label="Portfolio mind map">
      <ReactFlow<PortfolioNode>
        nodes={visibleNodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange}
        onInit={() => setReady(true)}
        minZoom={minZoom} maxZoom={maxZoom} nodeExtent={extent} translateExtent={extent}
        nodesConnectable={false} edgesReconnectable={false} deleteKeyCode={null}
        elementsSelectable={false} nodesFocusable={false} edgesFocusable={false}
        selectionOnDrag={false} selectNodesOnDrag={false} nodeDragThreshold={5}
        noDragClassName="nodrag" zoomOnDoubleClick={false} panOnDrag
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.25} color="#555650" />
      </ReactFlow>
    </section>
    <div className="accent-area">
      <button className="accent-control" aria-expanded={accentOpen} onClick={() => setAccentOpen(!accentOpen)}><span className="accent-dot" />Accent</button>
      {accentOpen && <div className="accent-popover" aria-label="Accent color">
        {[['Orange', '#ff2700'], ['Blue', '#83a8ff'], ['Lime', '#c9e86c']].map(([name, color]) => <button key={color} title={name} aria-label={`${name} accent`} aria-pressed={accent === color} style={{ backgroundColor: color }} onClick={() => { setAccent(color); setAccentOpen(false); }} />)}
      </div>}
    </div>
    <CanvasControls onFit={fit} />
    <p className="canvas-hint">Drag to explore <span>·</span> Click to read</p>
    {!compact && <aside className="content-panel" aria-label="Selected page">{panelContent}</aside>}
    {compact && <>
      <button ref={readButtonRef} className="read-page" onClick={() => setSheetOpen(true)}>Read <span>{selectedPage.label}</span><span aria-hidden="true">↗</span></button>
      <dialog ref={dialogRef} className="content-panel mobile-sheet" onCancel={() => setSheetOpen(false)} onClose={() => setSheetOpen(false)} aria-label="Selected page">{panelContent}</dialog>
    </>}
    <span className="sr-only" role="status">Selected page: {selectedPage.label}</span>
  </main>;
}
