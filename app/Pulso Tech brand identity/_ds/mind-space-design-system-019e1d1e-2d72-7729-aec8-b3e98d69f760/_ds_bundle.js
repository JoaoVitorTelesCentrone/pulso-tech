/* @ds-bundle: {"format":3,"namespace":"MindSpaceDesignSystem_019e1d","components":[],"sourceHashes":{"ui_kits/mind-space/App.jsx":"161c16b7c331","ui_kits/mind-space/CanvasMode.jsx":"44da1ff04ec2","ui_kits/mind-space/CategoryIcons.jsx":"8df446456dc9","ui_kits/mind-space/CategoryListWidget.jsx":"f6ddb36c15d1","ui_kits/mind-space/CategoryPage.jsx":"5b5cf77a2ad2","ui_kits/mind-space/FullMonthHeatmap.jsx":"1b557a164fac","ui_kits/mind-space/Header.jsx":"dbbff5d8e3fb","ui_kits/mind-space/HeroComposer.jsx":"65e28d0173d4","ui_kits/mind-space/Home.jsx":"cc69db593e00","ui_kits/mind-space/MiniHeatmap.jsx":"799e452e101a","ui_kits/mind-space/PerguntasPanel.jsx":"396a75c7f41e","ui_kits/mind-space/PerguntasSection.jsx":"c5a4451e2387","ui_kits/mind-space/QuestionsPage.jsx":"9ee4f7d75205","ui_kits/mind-space/QuickActionsCard.jsx":"0023db922a56","ui_kits/mind-space/QuickAdd.jsx":"02d709b96e1f","ui_kits/mind-space/ReflexoesPanel.jsx":"bd46f989c51a","ui_kits/mind-space/ReflexoesSection.jsx":"7e7fd0f54fc2","ui_kits/mind-space/ShareModal.jsx":"bf3b7509d17f","ui_kits/mind-space/SidebarWidgets.jsx":"7de96f63ea2d","ui_kits/mind-space/Timeline.jsx":"21f5a816ee20","ui_kits/mind-space/TodayPrompt.jsx":"607381969580","ui_kits/mind-space/UnifiedTimeline.jsx":"fe2e90ad70b6","ui_kits/mind-space/data.jsx":"918d2b7b28d4","ui_kits/mind-space/primitives.jsx":"f9347ff0834b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MindSpaceDesignSystem_019e1d = window.MindSpaceDesignSystem_019e1d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/mind-space/App.jsx
try { (() => {
// App — top-level router. Owns shared state for the prototype.
function App() {
  const [tab, setTab] = React.useState('home');
  const [entries, setEntries] = React.useState([...SEED_ENTRIES]);
  const [principles, setPrinciples] = React.useState([...SEED_PRINCIPLES]);
  const [questions, setQuestions] = React.useState([...SEED_QUESTIONS]);
  const [sharing, setSharing] = React.useState(null);

  // Find a "random old" entry (>5 days). Used by Revisitar.
  const findOldEntry = React.useCallback(() => {
    const cutoff = Date.now() - 5 * 86400000;
    const old = entries.filter(e => new Date(e.createdAt).getTime() < cutoff);
    if (old.length === 0) return null;
    return old[Math.floor(Math.random() * old.length)];
  }, [entries]);
  const [oldEntry, setOldEntry] = React.useState(() => {
    const cutoff = Date.now() - 5 * 86400000;
    const old = SEED_ENTRIES.filter(e => new Date(e.createdAt).getTime() < cutoff);
    return old[0] || null;
  });

  // --- mutations ---
  const addEntry = (content, categoryId) => {
    const e = {
      id: `e-${Date.now()}`,
      content,
      categoryId,
      createdAt: new Date().toISOString()
    };
    setEntries(prev => [e, ...prev]);
  };
  const deleteEntry = id => setEntries(prev => prev.filter(e => e.id !== id));
  const addPrinciple = content => {
    const p = {
      id: `p-${Date.now()}`,
      content,
      categoryId: 'cat-1',
      createdAt: new Date().toISOString()
    };
    setPrinciples(prev => [...prev, p]);
  };
  const deletePrinciple = id => setPrinciples(prev => prev.filter(p => p.id !== id));
  const addQuestion = text => {
    const q = {
      id: `q-${Date.now()}`,
      text: text.trim(),
      answer: ''
    };
    setQuestions(prev => [...prev, q]);
  };
  const answerQuestion = (id, answer) => setQuestions(prev => prev.map(q => q.id === id ? {
    ...q,
    answer
  } : q));
  const deleteQuestion = id => setQuestions(prev => prev.filter(q => q.id !== id));

  // --- view ---
  const renderTab = () => {
    if (tab === 'home') {
      // Pass both filtered entries (no Princípios) and all entries (for heatmap density)
      return /*#__PURE__*/React.createElement(Home, {
        entries: entries,
        allEntries: [...entries, ...principles],
        principles: principles,
        onAddEntry: addEntry,
        onDeleteEntry: deleteEntry,
        onShare: setSharing,
        onAddPrinciple: addPrinciple,
        onDeletePrinciple: deletePrinciple,
        onGoToQuestions: () => setTab('questions')
      });
    }
    if (tab === 'questions') {
      return /*#__PURE__*/React.createElement(QuestionsPage, {
        questions: questions,
        onAdd: addQuestion,
        onAnswer: answerQuestion,
        onDelete: deleteQuestion
      });
    }
    if (tab === 'canvas') {
      return /*#__PURE__*/React.createElement(CanvasMode, null);
    }
    // categories: reflections/fears/goals/ideas all use CategoryPage
    const tabConfig = TAB_CONFIG.find(t => t.id === tab);
    if (tabConfig?.catId) {
      const category = CATEGORIES.find(c => c.id === tabConfig.catId);
      const catEntries = entries.filter(e => e.categoryId === tabConfig.catId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return /*#__PURE__*/React.createElement(CategoryPage, {
        category: category,
        entries: catEntries,
        onAdd: addEntry,
        onDelete: deleteEntry,
        onShare: setSharing
      });
    }
    return null;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    tab: tab,
    onTabChange: setTab
  }), /*#__PURE__*/React.createElement("main", {
    key: tab,
    className: "tab-content",
    style: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative'
    }
  }, renderTab()), sharing && /*#__PURE__*/React.createElement(ShareModal, {
    entry: sharing,
    onClose: () => setSharing(null)
  }));
}
window.App = App;

// Boot
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/CanvasMode.jsx
try { (() => {
// CanvasMode — out-of-scope placeholder
function CanvasMode() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 420,
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 60,
      marginBottom: 12,
      opacity: 0.18,
      color: 'var(--text)',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(TabIcon, {
    id: "canvas",
    size: 64,
    strokeWidth: 1.4
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      margin: '0 0 8px 0',
      color: 'var(--text)',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic'
    }
  }, "Canvas livre"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '0 0 24px 0'
    }
  }, "A vers\xE3o real usa tldraw para um quadro infinito com texto e imagens. N\xE3o est\xE1 incluso nesta recrea\xE7\xE3o.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: 5,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement(FauxTool, {
    name: "hand",
    label: "Navegar",
    active: true
  }), /*#__PURE__*/React.createElement(FauxTool, {
    name: "type",
    label: "Texto"
  }), /*#__PURE__*/React.createElement(FauxTool, {
    name: "image",
    label: "Imagem"
  })));
}
function FauxTool({
  name,
  label,
  active
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 14px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
      boxShadow: active ? '0 2px 8px rgba(86,71,194,0.3)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: 15
  }), " ", label);
}
window.CanvasMode = CanvasMode;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/CanvasMode.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/CategoryIcons.jsx
try { (() => {
// CategoryIcons — line-art glyph system. Single source of truth for
// every category + nav icon used throughout the kit.
//
// Glyphs are stroke-only on a 24×24 viewBox at stroke 1.7, rounded caps.
// They take `currentColor` so callers control color via wrapping element.

const __CATEGORY_PATHS = {
  // Princípios — flag on a pole (commitment / north)
  'cat-1': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 6.5 21 V 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 6.5 4 L 17.5 6.2 L 6.5 9.8"
  })),
  // Ideias — 4-point diamond star (spark / glint)
  'cat-2': /*#__PURE__*/React.createElement("path", {
    d: "M 12 2.5 L 14 10.3 L 21.5 12 L 14 13.7 L 12 21.5 L 10 13.7 L 2.5 12 L 10 10.3 Z"
  }),
  // Reflexões — sprout (stem + two leaves)
  'cat-3': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 12 21 V 11"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 12 13 C 8 13, 5 10, 4.5 5.5 C 9 6, 12 8, 12 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 12 13 C 16 13, 19 10, 19.5 5.5 C 15 6, 12 8, 12 12"
  })),
  // Medos — cloud
  'cat-4': /*#__PURE__*/React.createElement("path", {
    d: "M 6 18 C 3 18, 2.5 14.5, 5 13.5 C 5 10, 9 8.5, 11.5 11 C 13 8, 18 8.5, 18 13 C 21 13, 21.5 17, 19 18 Z"
  }),
  // Objetivos — two-peak mountain with a summit dot
  'cat-5': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 2.5 19 L 9 8 L 13 14 L 17 6.5 L 21.5 19 Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "6.5",
    r: "0.4",
    fill: "currentColor",
    stroke: "none"
  })),
  // Problemas — knot / coiled tangle (a thing to work through)
  'cat-6': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 5 12 C 5 8, 9 8, 9 12 C 9 16, 15 16, 15 12 C 15 8, 19 8, 19 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 5 12 C 5 16, 9 16, 9 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 15 12 C 15 8, 19 8, 19 12 C 19 16, 15 16, 15 12"
  }))
};
const __TAB_PATHS = {
  // Home — house outline
  home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 3 11.5 L 12 4 L 21 11.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 5 11 V 20 H 19 V 11"
  })),
  // Meu Mundo — stacked layers (multiple things together)
  mundo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 12 3 L 21 8 L 12 13 L 3 8 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 3 13 L 12 18 L 21 13"
  })),
  // Reflexões — open book / journal
  reflexoes: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M 3 5 L 12 7 V 20 L 3 18 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 21 5 L 12 7 V 20 L 21 18 Z"
  })),
  // Perfil — single user silhouette
  perfil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "3.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 4 21 C 4 16, 8 14, 12 14 C 16 14, 20 16, 20 21"
  })),
  // Questions — concentric ring + center dot (kept for embedded use)
  questions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.7",
    fill: "currentColor",
    stroke: "none"
  })),
  // Canvas — kept for completeness
  canvas: /*#__PURE__*/React.createElement("path", {
    d: "M 4.5 8.5 C 7.5 4.5, 14.5 5.5, 15 11 C 15.3 14, 9.5 14, 9.5 17 C 9.5 20, 15.5 20.5, 19.5 16.5"
  })
};
function CatIcon({
  id,
  size = 14,
  strokeWidth = 1.7,
  style = {}
}) {
  const paths = __CATEGORY_PATHS[id];
  if (!paths) return null;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    }
  }, paths);
}
function TabIcon({
  id,
  size = 14,
  strokeWidth = 1.7,
  style = {}
}) {
  // Direct tab paths win
  const direct = __TAB_PATHS[id];
  if (direct) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        display: 'block',
        flexShrink: 0,
        ...style
      }
    }, direct);
  }
  // Fall back to category mapping
  const tab = TAB_CONFIG.find(t => t.id === id);
  if (tab?.catId) return /*#__PURE__*/React.createElement(CatIcon, {
    id: tab.catId,
    size: size,
    strokeWidth: strokeWidth,
    style: style
  });
  return null;
}
Object.assign(window, {
  CatIcon,
  TabIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/CategoryIcons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/CategoryListWidget.jsx
try { (() => {
// CategoryListWidget — generalized sidebar widget for short-list categories.
// Replaces PrincipiosWidget; works for Princípios, Medos, etc.
//
// Visual = "SEUS X" small uppercase label + italic-serif title + accent
// "+ Novo X" CTA button at bottom.

function CategoryListWidget({
  categoryId,
  label,
  // "SEUS" or "SUAS"
  title,
  // "Princípios", "Medos"
  newLabel,
  // "Novo princípio", "Novo medo"
  entries,
  // entries with this categoryId
  onAdd,
  onDelete,
  emptyText = 'Nada por aqui ainda.'
}) {
  const [adding, setAdding] = React.useState(false);
  const [text, setText] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);
  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
    inputRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: categoryId,
    size: 15,
    style: {
      color: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, label), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '1px 0 0 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text)',
      lineHeight: 1.1
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginBottom: 12
    }
  }, entries.length === 0 && !adding && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      fontStyle: 'italic',
      margin: '4px 0'
    }
  }, emptyText), entries.map(e => /*#__PURE__*/React.createElement(ListItem, {
    key: e.id,
    entry: e,
    onDelete: onDelete
  })), adding && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg)',
      border: '1.5px solid var(--accent)',
      borderRadius: 12,
      padding: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
      if (e.key === 'Escape') {
        setAdding(false);
        setText('');
      }
    },
    placeholder: `Adicionar ${title.toLowerCase()}…`,
    style: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: 13,
      color: 'var(--text)',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setAdding(false);
      setText('');
    },
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-faint)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  })), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled: !text.trim(),
    style: {
      background: text.trim() ? 'var(--accent)' : 'var(--border)',
      color: text.trim() ? '#fff' : 'var(--text-faint)',
      border: 'none',
      borderRadius: 8,
      padding: '4px 8px',
      fontSize: 11,
      fontWeight: 600
    }
  }, "Salvar"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdding(true),
    disabled: adding,
    style: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 14px',
      borderRadius: 12,
      background: adding ? 'var(--accent-light)' : 'var(--accent)',
      color: adding ? 'var(--accent)' : '#fff',
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      boxShadow: adding ? 'none' : '0 2px 12px rgba(232,75,42,0.28)',
      cursor: adding ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s'
    },
    onMouseEnter: e => {
      if (!adding) e.currentTarget.style.background = 'var(--accent-hover)';
    },
    onMouseLeave: e => {
      if (!adding) e.currentTarget.style.background = 'var(--accent)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), newLabel));
}
function ListItem({
  entry,
  onDelete
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '6px 10px',
      borderRadius: 10,
      background: hover ? 'var(--surface-hover)' : 'transparent',
      transition: 'background 0.12s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 7,
      width: 5,
      height: 5,
      borderRadius: 999,
      background: 'var(--accent)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 13,
      lineHeight: 1.45,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, entry.content), onDelete && /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(entry.id),
    style: {
      background: 'none',
      border: 'none',
      padding: 2,
      color: 'var(--text-faint)',
      cursor: 'pointer',
      opacity: hover ? 1 : 0,
      transition: 'all 0.15s',
      display: 'inline-flex'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--red)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-faint)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 11
  })));
}
Object.assign(window, {
  CategoryListWidget
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/CategoryListWidget.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/CategoryPage.jsx
try { (() => {
// CategoryPage — focused stream w/ page header + add card + entries

function CategoryPage({
  category,
  entries,
  onAdd,
  onDelete,
  onShare
}) {
  const [content, setContent] = React.useState('');
  const taRef = React.useRef(null);
  const handleAdd = () => {
    if (!content.trim()) return;
    onAdd(content.trim(), category.id);
    setContent('');
    taRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      overflow: 'auto',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 20,
      background: 'var(--surface-2)',
      color: 'var(--text)',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: category.id,
    size: 28,
    strokeWidth: 1.6
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 500,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, category.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0 0',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, entries.length === 0 ? 'Nenhum pensamento ainda' : `${entries.length} ${entries.length === 1 ? 'pensamento' : 'pensamentos'}`))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-md)',
      padding: 20,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: content,
    onChange: e => setContent(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleAdd();
      }
    },
    placeholder: `Adicionar um ${category.name.toLowerCase()}...`,
    rows: 3,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 15,
      lineHeight: 1.55,
      borderRadius: 14,
      padding: 12,
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      margin: 0
    }
  }, "Ctrl+Enter para salvar"), /*#__PURE__*/React.createElement(Button, {
    icon: "send",
    onClick: handleAdd,
    disabled: !content.trim()
  }, "Adicionar"))), entries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 50,
      marginBottom: 16,
      opacity: 0.18,
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: category.id,
    size: 56,
    strokeWidth: 1.4,
    style: {
      margin: '0 auto'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      margin: '0 0 4px 0',
      color: 'var(--text)'
    }
  }, "Nenhum pensamento aqui ainda"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Este \xE9 um espa\xE7o s\xF3 seu. \u2728")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, entries.map(e => /*#__PURE__*/React.createElement(EntryCard, {
    key: e.id,
    entry: e,
    onDelete: onDelete,
    onShare: onShare
  })))));
}
function EntryCard({
  entry,
  onDelete,
  onShare
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 20,
      padding: 16,
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.15s'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px 0',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, entry.content), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      margin: 0
    }
  }, getRelativeDate(entry.createdAt)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onShare(entry),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 10px',
      borderRadius: 10,
      fontSize: 11,
      fontWeight: 500,
      opacity: hover ? 1 : 0,
      transition: 'all 0.15s',
      color: 'var(--accent)',
      background: 'var(--accent-light)',
      border: 'none'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--accent)';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--accent-light)';
      e.currentTarget.style.color = 'var(--accent)';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 11
  }), " Compartilhar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(entry.id),
    hover: "var(--red)",
    iconSize: 12,
    size: 28
  })))));
}
Object.assign(window, {
  CategoryPage,
  EntryCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/CategoryPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/FullMonthHeatmap.jsx
try { (() => {
// FullMonthHeatmap — full month calendar grid as activity heatmap.
// Shows the current month, day cells colored by entry density.

const PT_MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
function FullMonthHeatmap({
  entries
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const today = new Date(year, month, now.getDate());

  // First day of month + how many days
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a 6×7 grid; entries are either day numbers or nulls (padding)
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 35) cells.push(null);

  // Count entries per day-of-month
  const dayCounts = new Array(daysInMonth + 1).fill(0);
  for (const e of entries) {
    const d = new Date(e.createdAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      dayCounts[d.getDate()] += 1;
    }
  }
  const totalEntries = dayCounts.reduce((a, b) => a + b, 0);
  const activeDays = dayCounts.filter(c => c > 0).length;
  const cellColor = count => {
    if (count === 0) return 'var(--surface-2)';
    if (count === 1) return '#FFDDCD';
    if (count === 2) return '#FFB89A';
    return 'var(--accent)';
  };
  const cellTextColor = count => {
    if (count === 0) return 'var(--text-faint)';
    if (count <= 1) return 'var(--accent)';
    return '#fff';
  };
  const dowLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 24,
      boxShadow: 'var(--shadow-sm)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Atividade"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '4px 0 0 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text)'
    }
  }, PT_MONTHS[month], " ", year)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-headline)',
      fontSize: 32,
      lineHeight: 1,
      color: 'var(--accent)'
    }
  }, totalEntries), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, "registros \xB7 ", activeDays, "d ativos"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 6,
      marginBottom: 6
    }
  }, dowLabels.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      textAlign: 'center',
      fontWeight: 700,
      padding: '4px 0'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 6
    }
  }, cells.map((day, i) => {
    if (day === null) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          aspectRatio: '1.6',
          borderRadius: 6,
          opacity: 0
        }
      });
    }
    const count = dayCounts[day];
    const isToday = day === today.getDate();
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: `${day}/${month + 1} · ${count} registros`,
      style: {
        aspectRatio: '1.6',
        borderRadius: 6,
        background: cellColor(count),
        color: cellTextColor(count),
        border: isToday ? '1.5px solid var(--text)' : '1px solid transparent',
        display: 'grid',
        placeItems: 'center',
        fontSize: 11,
        fontWeight: 600,
        transition: 'transform 0.15s',
        cursor: count > 0 ? 'pointer' : 'default'
      }
    }, day);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
      fontSize: 10,
      color: 'var(--text-faint)',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", null, "menos"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: 'var(--surface-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: '#FFDDCD'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: '#FFB89A'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "mais")));
}
window.FullMonthHeatmap = FullMonthHeatmap;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/FullMonthHeatmap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/Header.jsx
try { (() => {
// Header — sticky desktop top bar w/ logo, segmented 7-tab nav, avatar
function Header({
  tab,
  onTabChange
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      gap: 16,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: "36",
    height: "36",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "13",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "33",
    cy: "18",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "67",
    cy: "18",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "30",
    r: "13"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "30",
    r: "13"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "48",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "86",
    cy: "48",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "62",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "78",
    cy: "62",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "34",
    cy: "74",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "66",
    cy: "74",
    r: "10"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "44",
    rx: "24",
    ry: "34"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 44 78 Q 44 86 50 90 Q 56 86 56 78 Z"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: '0.01em',
      color: 'var(--text)',
      whiteSpace: 'nowrap',
      lineHeight: 1
    }
  }, "Mimente")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      padding: 4,
      borderRadius: 16,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      flex: 1,
      overflowX: 'auto',
      maxWidth: 720
    }
  }, TAB_CONFIG.map(t => {
    const active = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onTabChange(t.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 12,
        fontSize: 12,
        whiteSpace: 'nowrap',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#fff' : 'var(--text-muted)',
        fontWeight: active ? 700 : 500,
        boxShadow: active ? '0 2px 8px rgba(232,75,42,0.28)' : 'none',
        border: 'none',
        transition: 'all 0.2s'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = 'var(--text)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, /*#__PURE__*/React.createElement(TabIcon, {
      id: t.id,
      size: 14,
      strokeWidth: active ? 1.9 : 1.7
    }), t.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 12,
      fontWeight: 600,
      flexShrink: 0
    }
  }, "S"));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/HeroComposer.jsx
try { (() => {
// HeroComposer — single quick-capture with category chips.
// Replaces the three separate composers (Reflexões/Perguntas/Registrar) with one.

const CAPTURE_TYPES = [{
  id: 'cat-3',
  name: 'Reflexão',
  emoji: '🌱'
}, {
  id: 'cat-2',
  name: 'Ideia',
  emoji: '💡'
}, {
  id: 'cat-5',
  name: 'Objetivo',
  emoji: '🏔️'
}, {
  id: 'cat-4',
  name: 'Medo',
  emoji: '😰'
}, {
  id: 'cat-1',
  name: 'Princípio',
  emoji: '🎯'
}];
function HeroComposer({
  onAdd
}) {
  const [content, setContent] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('cat-3');
  const taRef = React.useRef(null);
  const submit = () => {
    if (!content.trim()) return;
    onAdd(content.trim(), categoryId);
    setContent('');
    setCategoryId('cat-3');
    taRef.current?.focus();
  };
  const canSubmit = content.trim().length > 0;
  const active = CAPTURE_TYPES.find(t => t.id === categoryId) || CAPTURE_TYPES[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-md)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 16,
      padding: 4,
      borderRadius: 12,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      width: 'fit-content'
    }
  }, CAPTURE_TYPES.map(t => {
    const isActive = t.id === categoryId;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setCategoryId(t.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: isActive ? 600 : 500,
        background: isActive ? 'var(--surface)' : 'transparent',
        color: isActive ? 'var(--text)' : 'var(--text-muted)',
        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
        border: 'none',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap'
      },
      onMouseEnter: e => {
        if (!isActive) e.currentTarget.style.color = 'var(--text)';
      },
      onMouseLeave: e => {
        if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14
      }
    }, /*#__PURE__*/React.createElement(CatIcon, {
      id: t.id,
      size: 13,
      strokeWidth: isActive ? 1.9 : 1.7
    })), t.name);
  })), /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: content,
    onChange: e => setContent(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      }
    },
    placeholder: `Escreva ${active.name === 'Objetivo' ? 'seu objetivo' : `sua ${active.name.toLowerCase()}`}... sem julgamentos.`,
    rows: 3,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 16,
      lineHeight: 1.5,
      borderRadius: 14,
      padding: 14,
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      margin: 0
    }
  }, content.length > 0 ? `${content.length} caracteres · Ctrl+Enter para salvar` : 'Ctrl+Enter para salvar'), /*#__PURE__*/React.createElement(Button, {
    icon: "send",
    onClick: submit,
    disabled: !canSubmit
  }, "Registrar ", active.name.toLowerCase())));
}
window.HeroComposer = HeroComposer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/HeroComposer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/Home.jsx
try { (() => {
// Home — redesigned for harmony and a single primary action.
// Structure:
//   1. Greeting strip (compact)
//   2. Hero composer (THE primary action, with type chips)
//   3. Two-column area:
//      LEFT  → unified recent-thoughts timeline
//      RIGHT → mini activity heatmap + Princípios + Today prompt
//
// Removed from Home: Perguntas composer (lives on its own page),
// duplicate Registrar widget, oversized monthly calendar.

function Home({
  entries,
  principles,
  allEntries,
  onAddEntry,
  onDeleteEntry,
  onShare,
  onAddPrinciple,
  onDeletePrinciple,
  onGoToQuestions
}) {
  // Unified recent stream: everything except Princípios (those live in sidebar)
  const recent = React.useMemo(() => entries.filter(e => e.categoryId !== 'cat-1').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20), [entries]);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      overflow: 'auto',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '32px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 24,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 32,
      fontWeight: 500,
      color: 'var(--text)',
      letterSpacing: '-0.01em',
      lineHeight: 1.1
    }
  }, greeting, ", joao."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0 0',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Este \xE9 o seu espa\xE7o. Sem pressa, sem cobran\xE7as.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 999,
      border: '1px solid var(--border)',
      fontSize: 10,
      fontFamily: 'var(--font-headline)',
      letterSpacing: '0.1em',
      color: 'var(--text-muted)',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--accent)'
    }
  }), "CVV 188 \xB7 estou aqui pra ouvir")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(HeroComposer, {
    onAdd: onAddEntry
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 540px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    style: {
      marginBottom: 14
    }
  }, "\xDAltimos pensamentos"), /*#__PURE__*/React.createElement(UnifiedTimeline, {
    entries: recent,
    onDelete: onDeleteEntry,
    onShare: onShare
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(MiniHeatmap, {
    entries: allEntries
  }), /*#__PURE__*/React.createElement(PrincipiosWidget, {
    principles: principles,
    onAdd: onAddPrinciple,
    onDelete: onDeletePrinciple
  }), /*#__PURE__*/React.createElement(TodayPrompt, {
    onGo: onGoToQuestions
  })))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/MiniHeatmap.jsx
try { (() => {
// MiniHeatmap — compact 4-week activity grid. Uses coral intensity for density.

function MiniHeatmap({
  entries
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build 28 days (4 weeks), oldest first, ending today
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Count entries per day
  const dayCounts = days.map(d => {
    const start = d.getTime();
    const end = start + 86400000;
    return entries.filter(e => {
      const t = new Date(e.createdAt).getTime();
      return t >= start && t < end;
    }).length;
  });

  // Group into rows of 7 (weeks)
  const weeks = [];
  for (let i = 0; i < 4; i++) weeks.push(days.slice(i * 7, i * 7 + 7));
  const cellColor = (count, isToday) => {
    if (count === 0) return {
      bg: 'var(--surface-2)',
      text: 'var(--text-faint)'
    };
    if (count === 1) return {
      bg: '#FFDDCD',
      text: 'var(--accent)'
    };
    if (count === 2) return {
      bg: '#FFB89A',
      text: '#fff'
    };
    return {
      bg: 'var(--accent)',
      text: '#fff'
    };
  };
  const totalEntries = dayCounts.reduce((a, b) => a + b, 0);
  const activeDays = dayCounts.filter(c => c > 0).length;
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Atividade"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '2px 0 0 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 18,
      fontWeight: 500,
      color: 'var(--text)'
    }
  }, "\xDAltimas 4 semanas")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-headline)',
      fontSize: 26,
      lineHeight: 1,
      color: 'var(--accent)'
    }
  }, totalEntries), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, "registros \xB7 ", activeDays, "d ativos"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4,
      marginBottom: 4
    }
  }, dayLabels.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 9,
      color: 'var(--text-faint)',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 600
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, weeks.map((week, wi) => /*#__PURE__*/React.createElement("div", {
    key: wi,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4
    }
  }, week.map((d, di) => {
    const idx = wi * 7 + di;
    const count = dayCounts[idx];
    const isToday = d.getTime() === today.getTime();
    const {
      bg,
      text
    } = cellColor(count, isToday);
    return /*#__PURE__*/React.createElement("div", {
      key: di,
      title: d.toLocaleDateString('pt-BR') + ' · ' + count + ' registros',
      style: {
        aspectRatio: '1',
        borderRadius: 6,
        background: bg,
        color: text,
        border: isToday ? '1.5px solid var(--text)' : '1px solid transparent',
        display: 'grid',
        placeItems: 'center',
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'var(--font-body)'
      }
    }, d.getDate());
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      fontSize: 10,
      color: 'var(--text-faint)',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", null, "menos"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: 'var(--surface-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: '#FFDDCD'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: '#FFB89A'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "mais")));
}
window.MiniHeatmap = MiniHeatmap;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/MiniHeatmap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/PerguntasPanel.jsx
try { (() => {
// PerguntasPanel — embedded on Home. Composer + Q&A cards.

const PERGUNTA_SUGGESTIONS = ['O que aprendi com meu maior erro?', 'Que tipo de pessoa quero ser daqui a 5 anos?', 'O que me dá mais energia no dia a dia?', 'Como eu quero ser lembrado(a)?', 'O que me traz paz genuína?'];
function PerguntasPanel({
  questions,
  onAdd,
  onAnswer,
  onDelete
}) {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef(null);
  const answered = questions.filter(q => q.answer.trim()).length;
  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText('');
    inputRef.current?.focus();
  };
  const handleSuggest = () => {
    const unused = PERGUNTA_SUGGESTIONS.filter(s => !questions.some(q => q.text === s));
    const pool = unused.length ? unused : PERGUNTA_SUGGESTIONS;
    setText(pool[Math.floor(Math.random() * pool.length)]);
    inputRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Suas"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '1px 0 0 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text)',
      lineHeight: 1.1
    }
  }, "Perguntas")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, answered, "/", questions.length, " respondidas")), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleAdd();
    },
    placeholder: "Escreva uma pergunta para voc\xEA\u2026",
    style: {
      width: '100%',
      outline: 'none',
      fontSize: 13,
      borderRadius: 12,
      padding: '10px 12px',
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSuggest,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '9px 12px',
      borderRadius: 11,
      background: 'var(--surface-2)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 11
  }), " Sugerir"), /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    disabled: !text.trim(),
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '9px 12px',
      borderRadius: 11,
      background: text.trim() ? 'var(--accent)' : 'var(--surface-2)',
      color: text.trim() ? '#fff' : 'var(--text-faint)',
      border: 'none',
      fontSize: 12,
      fontWeight: 600,
      boxShadow: text.trim() ? '0 2px 12px rgba(232,75,42,0.28)' : 'none',
      cursor: text.trim() ? 'pointer' : 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 11
  }), " Adicionar")), questions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 14
    }
  }, questions.slice(0, 5).map(q => /*#__PURE__*/React.createElement(PerguntaCard, {
    key: q.id,
    question: q,
    onAnswer: onAnswer,
    onDelete: onDelete
  }))));
}
function PerguntaCard({
  question,
  onAnswer,
  onDelete
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(question.answer);
  const [hover, setHover] = React.useState(false);
  const answered = question.answer.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      width: 8,
      height: 8,
      borderRadius: 999,
      flexShrink: 0,
      background: answered ? 'var(--accent)' : 'transparent',
      border: answered ? 'none' : '1.5px solid var(--border-strong)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 13,
      lineHeight: 1.3,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, question.text), onDelete && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(question.id),
    hover: "var(--red)",
    iconSize: 11,
    size: 22
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 12px 12px 28px'
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    value: draft,
    onChange: e => setDraft(e.target.value),
    rows: 3,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 12,
      padding: 8,
      borderRadius: 10,
      border: '1.5px solid var(--accent)',
      background: 'var(--surface)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 6,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(question.answer);
      setEditing(false);
    },
    style: {
      background: 'transparent',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '4px 8px',
      fontSize: 11,
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onAnswer(question.id, draft.trim());
      setEditing(false);
    },
    style: {
      background: 'var(--accent)',
      border: 'none',
      borderRadius: 8,
      padding: '4px 8px',
      fontSize: 11,
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Salvar"))) : answered ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, question.answer, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(question.answer);
      setEditing(true);
    },
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--accent)',
      cursor: 'pointer',
      fontSize: 10,
      marginLeft: 6,
      padding: 0,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, "\xB7 Editar")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft('');
      setEditing(true);
    },
    style: {
      background: 'transparent',
      border: 'none',
      padding: 0,
      color: 'var(--text-faint)',
      fontSize: 12,
      fontStyle: 'italic',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, "Clique para responder\u2026")));
}
window.PerguntasPanel = PerguntasPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/PerguntasPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/PerguntasSection.jsx
try { (() => {
// PerguntasSection — embedded Perguntas widget (composer + Q&A cards).

const PERG_SUGGESTIONS = ['O que aprendi com meu maior erro?', 'Que tipo de pessoa quero ser daqui a 5 anos?', 'O que me dá mais energia no dia a dia?', 'Quem me inspira e por quê?', 'O que eu postergo que sei que deveria enfrentar?'];
function PerguntasSection({
  questions,
  onAdd,
  onAnswer,
  onDelete
}) {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef(null);
  const answered = questions.filter(q => q.answer.trim()).length;
  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText('');
    inputRef.current?.focus();
  };
  const handleSuggest = () => {
    const unused = PERG_SUGGESTIONS.filter(s => !questions.some(q => q.text === s));
    const pool = unused.length > 0 ? unused : PERG_SUGGESTIONS;
    setText(pool[Math.floor(Math.random() * pool.length)]);
    inputRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    label: "Suas",
    title: "Perguntas",
    size: "md"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      fontWeight: 500
    }
  }, answered, "/", questions.length, " respondidas")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 18,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleAdd();
    },
    placeholder: "Escreva uma pergunta para voc\xEA...",
    style: {
      width: '100%',
      outline: 'none',
      fontSize: 14,
      borderRadius: 14,
      padding: '10px 14px',
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSuggest,
    style: {
      padding: '10px 14px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 600,
      background: 'var(--surface-2)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      transition: 'color 0.15s'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--accent)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-muted)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 12
  }), " Sugerir"), /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    disabled: !text.trim(),
    style: {
      padding: '10px 14px',
      borderRadius: 12,
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      background: text.trim() ? 'var(--accent)' : 'var(--surface-2)',
      color: text.trim() ? '#fff' : 'var(--text-faint)',
      boxShadow: text.trim() ? '0 2px 12px rgba(232,75,42,0.28)' : 'none',
      cursor: text.trim() ? 'pointer' : 'not-allowed',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), " Adicionar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, questions.map(q => /*#__PURE__*/React.createElement(PerguntaCard, {
    key: q.id,
    question: q,
    onAnswer: onAnswer,
    onDelete: onDelete
  }))));
}
function PerguntaCard({
  question,
  onAnswer,
  onDelete
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(question.answer);
  const [hover, setHover] = React.useState(false);
  const answered = question.answer.trim().length > 0;
  const save = () => {
    onAnswer(question.id, draft.trim());
    setEditing(false);
  };
  const cancel = () => {
    setDraft(question.answer);
    setEditing(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 10px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      width: 9,
      height: 9,
      borderRadius: 999,
      flexShrink: 0,
      background: answered ? 'var(--accent)' : 'transparent',
      border: answered ? 'none' : '1.5px solid var(--border-strong)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 14,
      lineHeight: 1.3,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, question.text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(question.id),
    hover: "var(--red)",
    iconSize: 11,
    size: 22
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 14px'
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Escape') cancel();
    },
    rows: 3,
    placeholder: "Escreva sua resposta...",
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 13,
      lineHeight: 1.55,
      padding: 10,
      borderRadius: 10,
      background: 'var(--bg)',
      border: '1.5px solid var(--accent)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 8,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: cancel
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: save,
    icon: "check"
  }, "Salvar"))) : answered ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      lineHeight: 1.55,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, question.answer), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(question.answer);
      setEditing(true);
    },
    style: {
      marginTop: 6,
      fontSize: 11,
      padding: 0,
      background: 'none',
      border: 'none',
      color: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 10
  }), " Editar")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft('');
      setEditing(true);
    },
    style: {
      width: '100%',
      textAlign: 'left',
      fontSize: 13,
      padding: '4px 0',
      background: 'none',
      border: 'none',
      color: 'var(--text-faint)',
      fontStyle: 'italic',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, "Clique para responder...")));
}
Object.assign(window, {
  PerguntasSection,
  PerguntaCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/PerguntasSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/QuestionsPage.jsx
try { (() => {
// QuestionsPage — self-prompt cards with answered/unanswered state

const SUGGESTIONS = ['O que me dá mais energia no dia a dia?', 'Qual é minha maior conquista até hoje?', 'O que eu faria se não tivesse medo de errar?', 'Que tipo de pessoa quero ser daqui a 5 anos?', 'O que me traz paz genuína?', 'Como eu quero ser lembrado(a)?', 'O que aprendi com meu maior erro?', 'Quem me inspira e por quê?'];
function QuestionCard({
  question,
  onAnswer,
  onDelete
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(question.answer);
  const [hover, setHover] = React.useState(false);
  const answered = question.answer.trim().length > 0;
  const save = () => {
    onAnswer(question.id, draft.trim());
    setEditing(false);
  };
  const cancel = () => {
    setDraft(question.answer);
    setEditing(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      opacity: answered ? 1 : 0.92,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 12px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      width: 10,
      height: 10,
      borderRadius: 999,
      flexShrink: 0,
      background: answered ? 'var(--accent)' : 'transparent',
      border: answered ? 'none' : '1.5px solid var(--border-strong)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 16,
      lineHeight: 1.3,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, question.text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(question.id),
    hover: "var(--red)",
    iconSize: 12,
    size: 28
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px'
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
    autoFocus: true,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Escape') cancel();
    },
    placeholder: "Escreva sua resposta...",
    rows: 4,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 14,
      lineHeight: 1.55,
      padding: 12,
      borderRadius: 14,
      background: 'var(--bg)',
      border: '1.5px solid var(--accent)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: cancel,
    icon: "x"
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: save,
    icon: "check"
  }, "Salvar resposta"))) : answered ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, question.answer), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(question.answer);
      setEditing(true);
    },
    style: {
      marginTop: 8,
      fontSize: 11,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s',
      background: 'none',
      border: 'none',
      color: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 10
  }), " Editar resposta")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft('');
      setEditing(true);
    },
    style: {
      width: '100%',
      textAlign: 'left',
      fontSize: 14,
      padding: '8px 0',
      background: 'none',
      border: 'none',
      color: 'var(--text-faint)',
      fontStyle: 'italic',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-muted)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-faint)'
  }, "Clique para escrever sua resposta\u2026")));
}
function QuestionsPage({
  questions,
  onAdd,
  onAnswer,
  onDelete
}) {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef(null);
  const answered = questions.filter(q => q.answer.trim()).length;
  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText('');
    inputRef.current?.focus();
  };
  const handleSuggest = () => {
    const unused = SUGGESTIONS.filter(s => !questions.some(q => q.text === s));
    const pool = unused.length > 0 ? unused : SUGGESTIONS;
    setText(pool[Math.floor(Math.random() * pool.length)]);
    inputRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      overflow: 'auto',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 20,
      background: 'var(--surface-2)',
      color: 'var(--text)',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(TabIcon, {
    id: "questions",
    size: 28,
    strokeWidth: 1.6
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 500,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, "Perguntas"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0 0',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, questions.length === 0 ? 'Perguntas pra se conhecer melhor' : `${answered} de ${questions.length} respondidas`))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-md)',
      padding: 20,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleAdd();
    },
    placeholder: "Escreva uma pergunta pra voc\xEA mesmo...",
    style: {
      width: '100%',
      outline: 'none',
      fontSize: 15,
      borderRadius: 14,
      padding: '10px 12px',
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "sparkles",
    onClick: handleSuggest
  }, "Sugerir"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "md",
    icon: "send",
    onClick: handleAdd,
    disabled: !text.trim()
  }, "Adicionar"))), questions.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 50,
      marginBottom: 16,
      opacity: 0.2,
      color: 'var(--text)',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(TabIcon, {
    id: "questions",
    size: 56,
    strokeWidth: 1.4
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      margin: '0 0 4px 0',
      color: 'var(--text)'
    }
  }, "Nenhuma pergunta ainda"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Escreva a sua ou clique em \"Sugerir\" pra come\xE7ar. \u2728")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, questions.map(q => /*#__PURE__*/React.createElement(QuestionCard, {
    key: q.id,
    question: q,
    onAnswer: onAnswer,
    onDelete: onDelete
  })))));
}
Object.assign(window, {
  QuestionsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/QuestionsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/QuickActionsCard.jsx
try { (() => {
// QuickActionsCard — 4 chips that open the composer pre-filled.
// Each chip = one category (Problema/Objetivo/Ideia/Reflexão).
// Used in the Home sidebar.

const QUICK_TYPES = [{
  id: 'cat-6',
  name: 'Problema',
  short: 'Problemas'
}, {
  id: 'cat-5',
  name: 'Objetivo',
  short: 'Objetivos'
}, {
  id: 'cat-2',
  name: 'Ideia',
  short: 'Ideias'
}, {
  id: 'cat-3',
  name: 'Reflexão',
  short: 'Reflexões'
}];
function QuickActionsCard({
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Registrar"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '1px 0 4px 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text)',
      lineHeight: 1.1
    }
  }, "O que capturar agora?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px 0',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Comece um registro pelo tipo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, QUICK_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => onPick(t.id),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      textAlign: 'left'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--accent-light)';
      e.currentTarget.style.borderColor = 'var(--accent-dim)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--surface-2)';
      e.currentTarget.style.borderColor = 'var(--border)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 8,
      background: 'var(--surface)',
      display: 'inline-grid',
      placeItems: 'center',
      color: 'var(--accent)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: t.id,
    size: 13
  })), t.name))));
}
window.QuickActionsCard = QuickActionsCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/QuickActionsCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/QuickAdd.jsx
try { (() => {
// QuickAdd — the marquee composer on Home
function QuickAdd({
  onAdd
}) {
  const [content, setContent] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const submit = () => {
    if (!content.trim()) return;
    onAdd(content.trim(), categoryId || null);
    setContent('');
    setCategoryId('');
  };
  const canSubmit = content.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-md)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 16px 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 20,
      color: 'var(--text)'
    }
  }, "O que est\xE1 na sua mente?"), /*#__PURE__*/React.createElement("textarea", {
    value: content,
    onChange: e => setContent(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      }
    },
    placeholder: "Escreva livremente... sem julgamentos.",
    rows: 4,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 16,
      lineHeight: 1.55,
      borderRadius: 14,
      padding: 14,
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: categoryId,
    onChange: e => setCategoryId(e.target.value),
    style: {
      flex: 1,
      fontSize: 13,
      borderRadius: 14,
      padding: '10px 36px 10px 12px',
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: categoryId ? 'var(--text)' : 'var(--text-faint)',
      fontFamily: 'var(--font-body)',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237068A0' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Sem categoria"), CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.emoji, " ", c.name))), /*#__PURE__*/React.createElement(Button, {
    icon: "send",
    onClick: submit,
    disabled: !canSubmit
  }, "Registrar")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      marginTop: 8,
      color: 'var(--text-faint)'
    }
  }, "Ctrl+Enter para salvar"));
}
window.QuickAdd = QuickAdd;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/QuickAdd.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/ReflexoesPanel.jsx
try { (() => {
// ReflexoesPanel — composer + entry list, embedded on Home.
// Mirrors the "Suas Reflexões" block in the product.

function ReflexoesPanel({
  entries,
  onAdd,
  onDelete
}) {
  const [content, setContent] = React.useState('');
  const taRef = React.useRef(null);
  const submit = () => {
    if (!content.trim()) return;
    onAdd(content.trim(), 'cat-3');
    setContent('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Suas"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '1px 0 0 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text)',
      lineHeight: 1.1
    }
  }, "Reflex\xF5es")), /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: content,
    onChange: e => setContent(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      }
    },
    placeholder: "Escreva livremente, sem julgamentos\u2026",
    rows: 3,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 14,
      lineHeight: 1.55,
      borderRadius: 14,
      padding: 12,
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled: !content.trim(),
    style: {
      width: '100%',
      marginTop: 8,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '12px 16px',
      borderRadius: 12,
      background: content.trim() ? 'var(--accent)' : 'var(--surface-2)',
      color: content.trim() ? '#fff' : 'var(--text-faint)',
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      boxShadow: content.trim() ? '0 2px 12px rgba(232,75,42,0.28)' : 'none',
      cursor: content.trim() ? 'pointer' : 'not-allowed',
      transition: 'all 0.15s'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 12
  }), " Registrar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      margin: '6px 0 0 0',
      color: 'var(--text-faint)'
    }
  }, "Ctrl+Enter para salvar"), entries.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 16
    }
  }, entries.slice(0, 4).map(e => /*#__PURE__*/React.createElement(ReflexaoRow, {
    key: e.id,
    entry: e,
    onDelete: onDelete
  }))));
}
function ReflexaoRow({
  entry,
  onDelete
}) {
  const [hover, setHover] = React.useState(false);
  const time = (() => {
    const d = new Date(entry.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const e = new Date(d);
    e.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - e.getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias atrás`;
  })();
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '10px 12px',
      position: 'relative',
      transition: 'border-color 0.15s',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--text)',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic'
    }
  }, entry.content), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)'
    }
  }, time), onDelete && /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(entry.id),
    style: {
      background: 'none',
      border: 'none',
      padding: 2,
      color: 'var(--text-faint)',
      cursor: 'pointer',
      opacity: hover ? 1 : 0,
      transition: 'all 0.15s',
      display: 'inline-flex'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--red)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-faint)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 11
  }))));
}
window.ReflexoesPanel = ReflexoesPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/ReflexoesPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/ReflexoesSection.jsx
try { (() => {
// ReflexoesSection — composer + entries list. Used inside Home and standalone.

function ReflexoesSection({
  entries,
  onAdd,
  onDelete,
  showHeader = true
}) {
  const [content, setContent] = React.useState('');
  const taRef = React.useRef(null);
  const submit = () => {
    if (!content.trim()) return;
    onAdd(content.trim(), 'cat-3');
    setContent('');
    taRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", null, showHeader && /*#__PURE__*/React.createElement(SectionTitle, {
    label: "Suas",
    title: "Reflex\xF5es",
    size: "md",
    style: {
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 18,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: content,
    onChange: e => setContent(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      }
    },
    placeholder: "Escreva livremente, sem julgamentos...",
    rows: 3,
    style: {
      width: '100%',
      resize: 'none',
      outline: 'none',
      fontSize: 15,
      lineHeight: 1.55,
      borderRadius: 14,
      padding: 14,
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      transition: 'border-color 0.15s'
    },
    onFocus: e => e.target.style.borderColor = 'var(--accent)',
    onBlur: e => e.target.style.borderColor = 'var(--border)'
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled: !content.trim(),
    style: {
      width: '100%',
      marginTop: 12,
      padding: '12px 18px',
      borderRadius: 14,
      border: 'none',
      background: content.trim() ? 'var(--accent)' : 'var(--surface-2)',
      color: content.trim() ? '#fff' : 'var(--text-faint)',
      fontSize: 13,
      fontWeight: 600,
      boxShadow: content.trim() ? '0 2px 12px rgba(232,75,42,0.28)' : 'none',
      cursor: content.trim() ? 'pointer' : 'not-allowed',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      transition: 'all 0.15s'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 13
  }), " Registrar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      margin: '8px 0 0 0'
    }
  }, "Ctrl+Enter para salvar")), entries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontStyle: 'italic',
      fontFamily: 'var(--font-display)'
    }
  }, "Nenhuma reflex\xE3o ainda.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, entries.map(e => /*#__PURE__*/React.createElement(ReflexaoCard, {
    key: e.id,
    entry: e,
    onDelete: onDelete
  }))));
}
function ReflexaoCard({
  entry,
  onDelete
}) {
  const [hover, setHover] = React.useState(false);
  const date = (() => {
    const d = new Date(entry.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - dd.getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return `${diff} dias atrás`;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  })();
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.15s'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, entry.content), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, date), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(entry.id),
    hover: "var(--red)",
    iconSize: 11,
    size: 22
  }))));
}
Object.assign(window, {
  ReflexoesSection,
  ReflexaoCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/ReflexoesSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/ShareModal.jsx
try { (() => {
// ShareModal — dark backdrop + 9:16 sheet with generated preview

function ShareModal({
  entry,
  onClose
}) {
  const cat = entry.categoryId ? CATEGORIES.find(c => c.id === entry.categoryId) : null;
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [entry]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'rgba(14,11,32,0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 360,
      background: 'var(--surface)',
      borderRadius: 24,
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 14,
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text)'
    }
  }, "Compartilhar")), /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    onClick: onClose,
    iconSize: 14,
    size: 28,
    hover: "var(--text)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 8px'
    }
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '9/16',
      maxHeight: 320,
      background: 'var(--surface-2)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "loader",
    size: 22,
    color: "var(--accent)",
    spin: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      margin: 0
    }
  }, "Gerando imagem\u2026")) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '9/16',
      maxHeight: 320,
      background: '#fff',
      borderRadius: 16,
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 28,
      margin: '0 auto',
      boxShadow: '0 4px 24px rgba(86,71,194,0.10)'
    }
  }, cat && /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      padding: '4px 10px 4px 8px',
      borderRadius: 999,
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: cat.id,
    size: 11
  }), " ", cat.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 18,
      lineHeight: 1.4,
      color: 'var(--text)',
      textAlign: 'left'
    }
  }, "\"", entry.content, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      color: 'var(--text-faint)',
      fontSize: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      color: 'var(--accent)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: "16",
    height: "16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "13",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "33",
    cy: "18",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "67",
    cy: "18",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "30",
    r: "13"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "30",
    r: "13"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "48",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "86",
    cy: "48",
    r: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "62",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "78",
    cy: "62",
    r: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "34",
    cy: "74",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "66",
    cy: "74",
    r: "10"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "44",
    rx: "24",
    ry: "34"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 44 78 Q 44 86 50 90 Q 56 86 56 78 Z"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-brand)',
      fontWeight: 400,
      color: 'var(--text-muted)',
      fontSize: 11,
      letterSpacing: '0.02em'
    }
  }, "Mimente")))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 11,
      padding: '0 20px 8px',
      color: 'var(--text-faint)',
      margin: 0
    }
  }, "9:16 \xB7 pronto pra stories"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: loading,
    style: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 14,
      fontSize: 14,
      fontWeight: 600,
      border: 'none',
      background: loading ? 'var(--border)' : 'var(--accent)',
      color: loading ? 'var(--text-faint)' : '#fff',
      boxShadow: loading ? 'none' : '0 2px 12px rgba(86,71,194,0.3)',
      cursor: loading ? 'not-allowed' : 'pointer'
    }
  }, "\uD83D\uDCE4 Compartilhar nos Stories"), /*#__PURE__*/React.createElement("button", {
    disabled: loading,
    style: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      background: 'var(--surface-2)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
      cursor: loading ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 14
  }), " Salvar imagem"))));
}
window.ShareModal = ShareModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/ShareModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/SidebarWidgets.jsx
try { (() => {
// Sidebar widgets: Princípios (editable list) + Revisitar (random old entry)

function PrincipiosWidget({
  principles,
  onAdd,
  onDelete
}) {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef(null);
  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
    inputRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(CatIcon, {
    id: "cat-1",
    size: 15,
    style: {
      color: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      color: 'var(--text)'
    }
  }, "Princ\xEDpios"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, principles.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px'
    }
  }, principles.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      padding: '10px 0',
      textAlign: 'center',
      color: 'var(--text-faint)',
      fontStyle: 'italic',
      margin: 0
    }
  }, "Sem princ\xEDpios ainda"), principles.map(p => /*#__PURE__*/React.createElement(PrincipleRow, {
    key: p.id,
    principle: p,
    onDelete: () => onDelete(p.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleAdd();
    },
    placeholder: "Adicionar princ\xEDpio...",
    style: {
      flex: 1,
      fontSize: 13,
      border: 'none',
      background: 'transparent',
      color: 'var(--text)',
      outline: 'none',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    disabled: !text.trim(),
    style: {
      width: 24,
      height: 24,
      borderRadius: 10,
      border: 'none',
      display: 'grid',
      placeItems: 'center',
      background: text.trim() ? 'var(--accent)' : 'var(--border)',
      color: text.trim() ? '#fff' : 'var(--text-faint)',
      cursor: text.trim() ? 'pointer' : 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }))));
}
function PrincipleRow({
  principle,
  onDelete
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6,
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--accent)',
      opacity: 0.7,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      fontSize: 13,
      lineHeight: 1.45,
      color: 'var(--text)',
      margin: 0
    }
  }, principle.content), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    onClick: onDelete,
    hover: "var(--red)",
    iconSize: 10,
    size: 20
  })));
}

// Revisitar — random old entry, with the decorative accent-light blob
function RevisitarWidget({
  entry,
  onRefresh
}) {
  const [spinning, setSpinning] = React.useState(false);
  if (!entry) return null;
  const cat = entry.categoryId ? CATEGORIES.find(c => c.id === entry.categoryId) : null;
  const date = new Date(entry.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const refresh = () => {
    setSpinning(true);
    setTimeout(() => {
      onRefresh();
      setSpinning(false);
    }, 300);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface)',
      border: '1px solid var(--border-strong)',
      borderRadius: 20,
      padding: 20,
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -32,
      right: -32,
      width: 128,
      height: 128,
      borderRadius: '50%',
      background: 'var(--accent-light)',
      opacity: 0.5,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    emoji: "\uD83D\uDD2E"
  }, "Do passado"), /*#__PURE__*/React.createElement("button", {
    onClick: refresh,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      padding: '6px 10px',
      borderRadius: 10,
      color: 'var(--text-muted)',
      background: 'var(--surface-2)',
      border: 'none',
      transition: 'color 0.15s'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--accent)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-muted)'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 11,
    spin: spinning
  }), "Outro")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, date), cat && /*#__PURE__*/React.createElement(Tag, null, cat.emoji, " ", cat.name)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--text)',
      fontFamily: 'var(--font-display)',
      margin: 0
    }
  }, "\"", entry.content, "\"")));
}
Object.assign(window, {
  PrincipiosWidget,
  RevisitarWidget
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/SidebarWidgets.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/Timeline.jsx
try { (() => {
// Timeline + relative-date helpers (lifted from product)

function getRelativeLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const entryDay = new Date(date);
  entryDay.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - entryDay.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `${diff} dias atrás`;
}
function getRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `Hoje às ${h}h${m}`;
  }
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}
function groupByDate(entries) {
  const map = new Map();
  for (const e of entries) {
    const label = getRelativeLabel(e.createdAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(e);
  }
  return Array.from(map.entries()).map(([label, entries]) => ({
    label,
    entries
  }));
}
function TimelineEntry({
  entry,
  onDelete,
  onShare
}) {
  const [hover, setHover] = React.useState(false);
  const cat = entry.categoryId ? CATEGORIES.find(c => c.id === entry.categoryId) : null;
  const time = new Date(entry.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.15s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, time), cat && /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(CatIcon, {
    id: cat.id,
    size: 11
  }), " ", cat.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 4,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "share",
    onClick: () => onShare(entry),
    title: "Compartilhar",
    iconSize: 11,
    size: 22
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(entry.id),
    hover: "var(--red)",
    title: "Deletar",
    iconSize: 12,
    size: 22
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text)'
    }
  }, entry.content));
}
function Timeline({
  entries,
  onDelete,
  onShare
}) {
  if (entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 32,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        marginBottom: 12
      }
    }, "\uD83C\uDF3F"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        margin: '0 0 4px 0',
        color: 'var(--text)'
      }
    }, "Ainda n\xE3o h\xE1 reflex\xF5es recentes"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--text-muted)',
        margin: 0
      }
    }, "Que tal come\xE7ar agora? O espa\xE7o acima est\xE1 esperando."));
  }
  const groups = groupByDate(entries);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, groups.map(({
    label,
    entries
  }) => /*#__PURE__*/React.createElement("div", {
    key: label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 999,
      background: label === 'Hoje' ? 'var(--accent)' : 'var(--surface-2)',
      color: label === 'Hoje' ? '#fff' : 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, entries.length, " ", entries.length === 1 ? 'pensamento' : 'pensamentos')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, entries.map(e => /*#__PURE__*/React.createElement(TimelineEntry, {
    key: e.id,
    entry: e,
    onDelete: onDelete,
    onShare: onShare
  }))))));
}
Object.assign(window, {
  Timeline,
  TimelineEntry,
  getRelativeDate,
  getRelativeLabel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/Timeline.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/TodayPrompt.jsx
try { (() => {
// TodayPrompt — a single self-prompt question, nudges user to Perguntas page.

const DAILY_PROMPTS = ['O que me deu mais energia hoje?', 'Que tipo de pessoa quero ser daqui a 5 anos?', 'O que aprendi com meu maior erro?', 'O que me traz paz genuína?', 'Como eu quero ser lembrado(a)?', 'O que eu postergo que sei que deveria enfrentar?'];
function TodayPrompt({
  onGo
}) {
  // pick a stable-per-day prompt
  const idx = React.useMemo(() => {
    const today = new Date();
    return (today.getFullYear() * 372 + (today.getMonth() + 1) * 31 + today.getDate()) % DAILY_PROMPTS.length;
  }, []);
  const prompt = DAILY_PROMPTS[idx];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: 'var(--shadow-sm)',
      padding: 18,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      fontSize: 9,
      fontFamily: 'var(--font-headline)',
      letterSpacing: '0.1em',
      color: 'var(--text-faint)'
    }
  }, "nr. 0399 / pergunta do dia"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Para hoje"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 14px 0',
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 19,
      lineHeight: 1.3,
      color: 'var(--text)'
    }
  }, prompt), /*#__PURE__*/React.createElement("button", {
    onClick: onGo,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-dim)',
      fontFamily: 'var(--font-body)',
      cursor: 'pointer',
      transition: 'all 0.15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--accent)';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--accent-light)';
      e.currentTarget.style.color = 'var(--accent)';
    }
  }, "Responder", /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 11
  })));
}
window.TodayPrompt = TodayPrompt;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/TodayPrompt.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/UnifiedTimeline.jsx
try { (() => {
// UnifiedTimeline — single recent-entries stream across all categories.

function UnifiedTimeline({
  entries,
  onDelete,
  onShare
}) {
  if (entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 40,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 36,
        marginBottom: 12,
        opacity: 0.5
      }
    }, "\uD83C\uDF3F"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        fontWeight: 500,
        margin: '0 0 4px 0',
        color: 'var(--text)',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic'
      }
    }, "Ainda n\xE3o h\xE1 pensamentos"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        margin: 0
      }
    }, "Use o espa\xE7o acima pra registrar o primeiro."));
  }

  // Group by relative day (Hoje, Ontem, etc.)
  const groups = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const map = new Map();
    for (const e of entries) {
      const d = new Date(e.createdAt);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
      let label;
      if (diff === 0) label = 'Hoje';else if (diff === 1) label = 'Ontem';else if (diff < 7) label = `${diff} dias atrás`;else label = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(e);
    }
    return Array.from(map.entries());
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, groups.map(([label, entries]) => /*#__PURE__*/React.createElement("div", {
    key: label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      padding: '4px 12px',
      borderRadius: 999,
      background: label === 'Hoje' ? 'var(--accent)' : 'var(--surface-2)',
      color: label === 'Hoje' ? '#fff' : 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, entries.length, " ", entries.length === 1 ? 'pensamento' : 'pensamentos')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, entries.map(e => /*#__PURE__*/React.createElement(UnifiedEntry, {
    key: e.id,
    entry: e,
    onDelete: onDelete,
    onShare: onShare
  }))))));
}
function UnifiedEntry({
  entry,
  onDelete,
  onShare
}) {
  const [hover, setHover] = React.useState(false);
  const cat = entry.categoryId ? CATEGORIES.find(c => c.id === entry.categoryId) : null;
  const time = new Date(entry.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.15s',
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexShrink: 0,
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 9,
      background: 'var(--surface-2)',
      color: 'var(--text)',
      display: 'grid',
      placeItems: 'center'
    }
  }, cat ? /*#__PURE__*/React.createElement(CatIcon, {
    id: cat.id,
    size: 14
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, "\xB7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, cat?.name || 'Pensamento'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, time), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 2,
      opacity: hover ? 1 : 0,
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "share",
    onClick: () => onShare(entry),
    iconSize: 11,
    size: 22,
    title: "Compartilhar"
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    onClick: () => onDelete(entry.id),
    hover: "var(--red)",
    iconSize: 11,
    size: 22,
    title: "Deletar"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--text)',
      whiteSpace: 'pre-wrap'
    }
  }, entry.content)));
}
window.UnifiedTimeline = UnifiedTimeline;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/UnifiedTimeline.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/data.jsx
try { (() => {
// Seed data — mirrors Mimente product (4 tabs, 6 categories).

const CATEGORIES = [{
  id: 'cat-1',
  name: 'Princípios',
  emoji: '🎯',
  kind: 'list'
}, {
  id: 'cat-2',
  name: 'Ideias',
  emoji: '💡',
  kind: 'mundo'
}, {
  id: 'cat-3',
  name: 'Reflexões',
  emoji: '🌱',
  kind: 'journal'
}, {
  id: 'cat-4',
  name: 'Medos',
  emoji: '😰',
  kind: 'list'
}, {
  id: 'cat-5',
  name: 'Objetivos',
  emoji: '🏔️',
  kind: 'mundo'
}, {
  id: 'cat-6',
  name: 'Problemas',
  emoji: '🔥',
  kind: 'mundo'
}];
const TAB_CONFIG = [{
  id: 'home',
  label: 'Home',
  short: 'Home'
}, {
  id: 'mundo',
  label: 'Meu Mundo',
  short: 'Mundo'
}, {
  id: 'reflexoes',
  label: 'Reflexões',
  short: 'Reflex'
}, {
  id: 'perfil',
  label: 'Perfil',
  short: 'Perfil'
}];

// helper to make a "hours ago" date
const ago = hours => new Date(Date.now() - hours * 3600 * 1000).toISOString();
const SEED_ENTRIES = [
// Today
{
  id: 'e-1',
  content: 'Talvez o que eu chamo de cansaço seja só o peso de coisas que ainda não disse.',
  categoryId: 'cat-3',
  createdAt: ago(2)
}, {
  id: 'e-2',
  content: 'Lembrar de ligar pra minha mãe — não porque preciso, porque quero.',
  categoryId: 'cat-3',
  createdAt: ago(6)
},
// Yesterday
{
  id: 'e-3',
  content: 'Uma horta no canto da janela. Manjericão, hortelã, e talvez um tomate cereja por teimosia.',
  categoryId: 'cat-2',
  createdAt: ago(28)
}, {
  id: 'e-4',
  content: 'Procrastinar conversas difíceis está custando mais do que ter elas.',
  categoryId: 'cat-6',
  createdAt: ago(36)
},
// 2-3 days ago
{
  id: 'e-5',
  content: 'Aprender a dizer "não" sem precisar de uma desculpa.',
  categoryId: 'cat-1',
  createdAt: ago(50)
}, {
  id: 'e-6',
  content: 'Viajar sozinho por uma semana este ano.',
  categoryId: 'cat-5',
  createdAt: ago(56)
}, {
  id: 'e-7',
  content: 'Tenho dormido tarde demais e isso já não é mais uma fase.',
  categoryId: 'cat-6',
  createdAt: ago(72)
},
// This week
{
  id: 'e-8',
  content: 'Silêncio também é resposta.',
  categoryId: 'cat-3',
  createdAt: ago(96)
}, {
  id: 'e-9',
  content: 'Comprar um caderno físico. Voltar a escrever à mão.',
  categoryId: 'cat-2',
  createdAt: ago(120)
},
// Earlier
{
  id: 'e-10',
  content: 'Acordar 15 minutos mais cedo, só pra olhar o nada.',
  categoryId: 'cat-5',
  createdAt: ago(216)
}, {
  id: 'e-11',
  content: 'O cansaço também ensina alguma coisa, se eu deixar.',
  categoryId: 'cat-3',
  createdAt: ago(288)
}, {
  id: 'e-12',
  content: 'Aprender o nome das árvores da minha rua.',
  categoryId: 'cat-2',
  createdAt: ago(360)
}, {
  id: 'e-13',
  content: 'Terminar um livro este mês. Qualquer livro.',
  categoryId: 'cat-5',
  createdAt: ago(576)
}];
const SEED_PRINCIPLES = [{
  id: 'p-1',
  content: 'Devagar é uma forma de respeito.',
  categoryId: 'cat-1',
  createdAt: ago(72)
}, {
  id: 'p-2',
  content: 'Nem todo silêncio precisa ser preenchido.',
  categoryId: 'cat-1',
  createdAt: ago(120)
}, {
  id: 'p-3',
  content: 'O cansaço também ensina.',
  categoryId: 'cat-1',
  createdAt: ago(200)
}];
const SEED_FEARS = [{
  id: 'f-1',
  content: 'Chegar aos 40 e perceber que estava só esperando.',
  categoryId: 'cat-4',
  createdAt: ago(160)
}, {
  id: 'f-2',
  content: 'Ser substituído antes de ser visto.',
  categoryId: 'cat-4',
  createdAt: ago(220)
}];
const SEED_QUESTIONS = [{
  id: 'q-1',
  text: 'O que aprendi com meu maior erro?',
  answer: 'Não acreditar em mim e não confiar em mim e não ir atrás dos meus sonhos.'
}, {
  id: 'q-2',
  text: 'Que tipo de pessoa quero ser daqui a 5 anos?',
  answer: ''
}, {
  id: 'q-3',
  text: 'O que me dá mais energia no dia a dia?',
  answer: ''
}];
const USER_PROFILE = {
  name: 'Você',
  email: 'joaovtcentrone@gmail.com',
  initial: 'V',
  bio: '',
  joinedAt: ago(24)
};
Object.assign(window, {
  CATEGORIES,
  TAB_CONFIG,
  SEED_ENTRIES,
  SEED_PRINCIPLES,
  SEED_FEARS,
  SEED_QUESTIONS,
  USER_PROFILE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mind-space/primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Mind Space UI Kit — primitives + Lucide-shaped Icons
// Style-faithful to mind-space/frontend (Tailwind 4 + inline styles).

/* eslint-disable react/no-unknown-property */

// ---------- Icon ------------------------------------------------------
// Hand-extracted Lucide path data — we ship only what the kit needs so
// the file is dependency-free.
const LUCIDE = {
  send: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "22",
    y1: "2",
    x2: "11",
    y2: "13"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "22 2 15 22 11 13 2 9 22 2"
  })),
  pencil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m15 5 4 4"
  })),
  trash: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  })),
  check: /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  share: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "5",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "19",
    r: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8.59",
    y1: "13.51",
    x2: "15.42",
    y2: "17.49"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15.41",
    y1: "6.51",
    x2: "8.59",
    y2: "10.49"
  })),
  sparkles: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  })),
  refresh: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "23 4 23 10 17 10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20.49 15A9 9 0 1 1 18 5.5l5 4.5"
  })),
  chevronDown: /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }),
  chevronUp: /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  }),
  download: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  })),
  loader: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "18",
    x2: "12",
    y2: "22"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.93",
    y1: "4.93",
    x2: "7.76",
    y2: "7.76"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.24",
    y1: "16.24",
    x2: "19.07",
    y2: "19.07"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "12",
    x2: "6",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "12",
    x2: "22",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.93",
    y1: "19.07",
    x2: "7.76",
    y2: "16.24"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.24",
    y1: "7.76",
    x2: "19.07",
    y2: "4.93"
  })),
  hand: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 11V6a2 2 0 0 0-4 0v5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 10V4a2 2 0 0 0-4 0v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 10.5V6a2 2 0 0 0-4 0v8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
  })),
  type: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "4 7 4 4 20 4 20 7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "20",
    x2: "15",
    y2: "20"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "4",
    x2: "12",
    y2: "20"
  })),
  image: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "8.5",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "21 15 16 10 5 21"
  })),
  palette: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "13.5",
    cy: "6.5",
    r: ".5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "10.5",
    r: ".5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "7.5",
    r: ".5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "12.5",
    r: ".5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
  }))
};
function Icon({
  name,
  size = 14,
  color = 'currentColor',
  spin = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      animation: spin ? 'msSpin 1s linear infinite' : undefined,
      ...style
    }
  }, rest), LUCIDE[name] || null);
}

// keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('ms-spin-kf')) {
  const s = document.createElement('style');
  s.id = 'ms-spin-kf';
  s.textContent = '@keyframes msSpin { to { transform: rotate(360deg) } }';
  document.head.appendChild(s);
}

// ---------- Buttons ---------------------------------------------------
function Button({
  children,
  icon,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style = {}
}) {
  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: 12,
      gap: 5,
      radius: 10
    },
    md: {
      padding: '10px 18px',
      fontSize: 14,
      gap: 8,
      radius: 14
    },
    lg: {
      padding: '12px 22px',
      fontSize: 15,
      gap: 8,
      radius: 14
    }
  }[size];
  const variants = {
    primary: {
      background: disabled ? 'var(--border)' : 'var(--accent)',
      color: disabled ? 'var(--text-faint)' : '#fff',
      boxShadow: disabled ? 'none' : '0 2px 12px rgba(86,71,194,0.30)',
      border: 'none'
    },
    soft: {
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-dim)'
    },
    ghost: {
      background: 'var(--surface-2)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sizes.gap,
      padding: sizes.padding,
      borderRadius: sizes.radius,
      fontSize: sizes.fontSize,
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s',
      ...variants,
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-hover)';
      if (variant === 'soft') {
        e.currentTarget.style.background = 'var(--accent)';
        e.currentTarget.style.color = '#fff';
      }
    },
    onMouseLeave: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = 'var(--accent)';
      if (variant === 'soft') {
        e.currentTarget.style.background = 'var(--accent-light)';
        e.currentTarget.style.color = 'var(--accent)';
      }
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: sizes.fontSize
  }), children);
}

// ---------- IconButton (square, hover→accent) -------------------------
function IconButton({
  name,
  size = 24,
  iconSize = 12,
  color = 'var(--text-faint)',
  hover = 'var(--accent)',
  onClick,
  title
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    style: {
      width: size,
      height: size,
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      transition: 'color 0.15s',
      padding: 0
    },
    onMouseEnter: e => e.currentTarget.style.color = hover,
    onMouseLeave: e => e.currentTarget.style.color = color
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: iconSize
  }));
}

// ---------- Tag chip --------------------------------------------------
function Tag({
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      padding: '2px 8px',
      borderRadius: 999,
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      fontWeight: 500,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, children);
}

// ---------- Section heading (italic-serif w/ optional emoji) ----------
function SectionHeading({
  emoji,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, emoji && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, emoji), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--text)'
    }
  }, children));
}

// ---------- Surface card ----------------------------------------------
function Card({
  children,
  elevation = 'sm',
  style = {}
}) {
  const shadow = {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  }[elevation];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      boxShadow: shadow,
      ...style
    }
  }, children);
}

// ---------- Section title (label + italic-serif heading) -------------
// Used everywhere in the new screens: "SUAS / Reflexões",
// "SEUS / Princípios", "ATIVIDADE / Maio 2026", etc.
function SectionTitle({
  label,
  title,
  size = 'md',
  accent = false,
  style = {}
}) {
  const sizes = {
    xs: {
      label: 9,
      title: 14,
      gap: 1
    },
    sm: {
      label: 10,
      title: 18,
      gap: 2
    },
    md: {
      label: 10,
      title: 24,
      gap: 2
    },
    lg: {
      label: 11,
      title: 30,
      gap: 3
    }
  }[size];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: sizes.label,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: accent ? 'var(--text-muted)' : 'var(--accent)',
      fontFamily: 'var(--font-body)'
    }
  }, label), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: `${sizes.gap}px 0 0 0`,
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: sizes.title,
      letterSpacing: '-0.01em',
      lineHeight: 1.1,
      color: 'var(--text)'
    }
  }, title));
}

// Export to window for cross-file babel sharing
Object.assign(window, {
  Icon,
  Button,
  IconButton,
  Tag,
  SectionHeading,
  SectionTitle,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mind-space/primitives.jsx", error: String((e && e.message) || e) }); }

})();
