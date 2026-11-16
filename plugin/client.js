window.__ModuleLoader__.load({
  id: '@local/dsh-tree-plan-preset',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'tree-plan';

    const zh = {
      title: '需求 · 目标树',
      untitled: '未命名工作项',
      goal: '目标',
      branches: '{count} 个分支',
      nodes: '{count} 个节点',
      collapse: '收起分支',
      expand: '展开分支',
      edit: '编辑',
      editTitle: '直接编辑此卡片文字，保存后立即生效',
      'edit.save': '保存',
      'edit.cancel': '取消编辑',
      'edit.placeholder': '编辑节点文字（Enter 保存，Shift+Enter 换行）',
      raw: '查看原始文本树',
      note: '卡片编辑保存在本机视图；撤销可回退上一步。Ctrl/Shift 多选后可合并。',
      statusDraft: '待整改 · 未执行',
      'view.tab': '目标树',
      'view.title': '目标树视图',
      version: '2.1-stable',
      'view.version': '树版本',
      'view.turn': '第 {turn} 轮',
      'view.count': '共 {count} 版',
      'empty.title': '还没有目标树',
      'empty.body': '在「树状规划（PTC）」中发送任务后，目标树会显示在这里。',
      'chat.generated': '目标树已生成',
      'chat.updated': '目标树已更新',
      'chat.notice': '请前往「更多会话视图 → 目标树」查看并确认。',
      'chat.badge': '待查看',
      'chat.version': '第 {version} 版',
      'start.run': '开始运行',
      'start.starting': '正在启动…',
      'start.sent': '已开始',
      'start.failed': '启动失败：{message}',
      'start.chatNotice': '已从目标树视图发送「开始运行」，当前编辑后的树已交给 Agent。',
      'status.sent': '已发送启动',
      'status.running': '执行中',
      'status.executed': '已执行',
      undo: '撤销',
      undoTitle: '退回上一步编辑、移动、合并或拆分',
      'zoom.out': '缩小',
      'zoom.in': '放大',
      'zoom.reset': '100%',
      'layout.hint': '拖拽布局 · 拖到可合并卡片上合并 · 双击复位',
      'layout.free': '自由布局',
      'layout.reset': '自动整理',
      'layout.resetTitle': '清除所有手动位置，恢复自动布局',
      'merge.selectHint': 'Ctrl/Shift 多选',
      'merge.selected': '一键合并',
      'merge.selectedTitle': '先按住 Ctrl/Shift 选择至少两个同分支或父子节点',
      'merge.selectedCount': '已选 {count}',
      'merge.splitAll': '一键拆分',
      'merge.splitAllTitle': '拆分当前树的全部合并组',
      'merge.splitGroup': '拆分',
      'merge.splitGroupTitle': '拆开这个合并组，恢复其中的节点',
      'merge.groupTitle': '已合并 {count} 个节点，拆分可恢复',
    };
    const en = {
      title: 'Goal tree',
      untitled: 'Untitled work item',
      goal: 'Goal',
      branches: '{count} branches',
      nodes: '{count} nodes',
      collapse: 'Collapse branch',
      expand: 'Expand branch',
      edit: 'Edit',
      editTitle: 'Edit this card directly; saving takes effect immediately',
      'edit.save': 'Save',
      'edit.cancel': 'Cancel edit',
      'edit.placeholder': 'Edit node text (Enter saves, Shift+Enter adds a line)',
      raw: 'View source tree',
      note: 'Edits are stored in the local view. Undo reverts one edit, move, merge, or split. Use Ctrl/Shift to merge.',
      statusDraft: 'Draft · Not running',
      'view.tab': 'Goal tree',
      'view.title': 'Goal tree view',
      version: '2.1-stable',
      'view.version': 'Tree version',
      'view.turn': 'Turn {turn}',
      'view.count': '{count} versions',
      'empty.title': 'No goal tree yet',
      'empty.body': 'Submit a task with the Tree planning (PTC) preset and its goal tree will appear here.',
      'chat.generated': 'Goal tree generated',
      'chat.updated': 'Goal tree updated',
      'chat.notice': 'Open More conversation views → Goal tree to review and confirm it.',
      'chat.badge': 'Needs review',
      'chat.version': 'Version {version}',
      'start.run': 'Start',
      'start.starting': 'Starting…',
      'start.sent': 'Started',
      'start.failed': 'Start failed: {message}',
      'start.chatNotice': 'Start sent from the goal-tree view. The Agent received the currently edited tree.',
      'status.sent': 'Start sent',
      'status.running': 'Running',
      'status.executed': 'Executed',
      undo: 'Undo',
      undoTitle: 'Revert the last edit, move, merge, or split',
      'zoom.out': 'Zoom out',
      'zoom.in': 'Zoom in',
      'zoom.reset': '100%',
      'layout.hint': 'Drag to arrange · Drop on a compatible card to merge · Double-click to reset',
      'layout.free': 'Free layout',
      'layout.reset': 'Tidy up',
      'layout.resetTitle': 'Clear manual positions and restore the automatic layout',
      'merge.selectHint': 'Ctrl/Shift multi-select',
      'merge.selected': 'Merge selected',
      'merge.selectedTitle': 'Select at least two sibling or parent-child nodes with Ctrl/Shift',
      'merge.selectedCount': '{count} selected',
      'merge.splitAll': 'Split all',
      'merge.splitAllTitle': 'Split every merged group in this tree',
      'merge.splitGroup': 'Split',
      'merge.splitGroupTitle': 'Split this merged group and restore its nodes',
      'merge.groupTitle': '{count} nodes merged. Split to restore them.',
    };

    const START_MARKER = '［目标树开始运行］';

    function userMessageText(event) {
      if (event?.type !== 'user/message') return undefined;
      const content = event.data?.message?.content ?? event.data?.content;
      if (!Array.isArray(content)) return undefined;
      return content
        .filter(block => block?.type === 'text' && typeof block.text === 'string')
        .map(block => block.text)
        .join('\n');
    }

    function goalTreeStartMessage(event) {
      const text = userMessageText(event);
      if (text === undefined || !text.startsWith(START_MARKER)) return undefined;
      return typeof event.data?.message?.id === 'string'
        ? event.data.message.id
        : `goal-tree-start-${event.seq}`;
    }

    function goalTreeChatMessageId(event) {
      if (event?.type !== 'assistant/message') return undefined;
      const content = event.data?.message?.content;
      if (!Array.isArray(content)) return undefined;
      const text = content
        .filter(block => block?.type === 'text' && typeof block.text === 'string')
        .map(block => block.text)
        .join('\n');
      const fence = /```(goal-tree|text)\s*\r?\n([\s\S]*?)```/i.exec(text);
      if (fence === null) return undefined;
      if (fence[1].toLowerCase() === 'text' && !/##\s*需求[—-]目标树/.test(text)) return undefined;
      if (!/(?:^|\r?\n)G\s+目标\s*[：:]/.test(fence[2])) return undefined;
      if (!/[├└]─\s*[DSCPVQ]\s+/.test(fence[2])) return undefined;
      const messageId = event.data?.message?.id;
      return typeof messageId === 'string' && messageId !== ''
        ? messageId
        : `goal-tree-${event.seq}`;
    }

    const chatTreeDefinition = {
      kind: 'goal-tree-notice',
      target: 'chat',
      match(event) {
        const id = goalTreeChatMessageId(event);
        return id === undefined ? null : { id, role: 'start', exclusive: true };
      },
      start: () => ({}),
      update: context => context.state,
      buildViewNode(context) {
        const start = context.start ?? context.matches[0];
        if (start === undefined) return null;
        return {
          key: context.key,
          kind: 'goal-tree-notice',
          id: context.id,
          target: 'chat',
          anchorSeq: start.event.seq,
          location: start.location,
          data: context.state ?? {},
        };
      },
    };

    const chatStartDefinition = {
      kind: 'goal-tree-start',
      target: 'chat',
      match(event) {
        const id = goalTreeStartMessage(event);
        return id === undefined ? null : { id, role: 'start', exclusive: true };
      },
      start: () => ({}),
      update: context => context.state,
      buildViewNode(context) {
        const start = context.start ?? context.matches[0];
        if (start === undefined) return null;
        return {
          key: context.key,
          kind: 'goal-tree-start',
          id: context.id,
          target: 'chat',
          anchorSeq: start.event.seq,
          location: start.location,
          data: context.state ?? {},
        };
      },
    };

    function GoalTreeStartNotice({ t }) {
      return h('div', { className: 'tp-chat-start', 'data-tree-start-notice': true },
        h('style', { dangerouslySetInnerHTML: { __html: styles } }),
        h('span', { className: 'tp-chat-start-icon', 'aria-hidden': true }, '▶'),
        h('span', null, t('start.chatNotice')),
      );
    }

    function GoalTreeChatNotice({ node, useProjection, t }) {
      const projection = typeof useProjection === 'function' ? useProjection('goalTrees') : undefined;
      const trees = Array.isArray(projection?.trees) ? projection.trees : [];
      const index = trees.findIndex(tree => tree.id === node?.id);
      const generated = trees.length <= 1 || index === 0;
      return h('div', {
        className: 'tp-chat-notice', 'data-tree-chat-notice': true,
        role: 'status', 'aria-live': 'polite',
      },
        h('style', { dangerouslySetInnerHTML: { __html: styles } }),
        h('span', { className: 'tp-chat-notice-icon' }, h(TreeIcon, { size: 18 })),
        h('div', { className: 'tp-chat-notice-copy' },
          h('div', { className: 'tp-chat-notice-title' },
            h('strong', null, t(generated ? 'chat.generated' : 'chat.updated')),
            index >= 0 && h('span', { className: 'tp-chat-notice-version' }, t('chat.version', { version: index + 1 })),
            h('span', { className: 'tp-chat-notice-badge' }, t('chat.badge')),
          ),
          h('span', { className: 'tp-chat-notice-detail' }, t('chat.notice')),
        ),
        h('span', { className: 'tp-chat-notice-arrow', 'aria-hidden': true }, '›'),
      );
    }

    function countNodes(node) {
      return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
    }

    function TreeIcon({ size = 20 }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
        h('circle', { cx: 12, cy: 5, r: 2.5 }),
        h('circle', { cx: 6, cy: 18, r: 2.5 }),
        h('circle', { cx: 18, cy: 18, r: 2.5 }),
        h('path', { d: 'M12 7.5V12M12 12H6v3.5M12 12h6v3.5' }),
      );
    }

    function Chevron({ open }) {
      return h('svg', {
        className: `tp-chevron${open ? ' tp-chevron-open' : ''}`,
        width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      }, h('path', { d: 'm5 3 5 5-5 5' }));
    }

    function EditButton({ id, onEdit, t }) {
      return h('button', {
        type: 'button', className: 'tp-edit', title: t('editTitle'),
        'aria-label': `${t('edit')} ${id}`,
        onPointerDown: event => event.stopPropagation(),
        onClick: event => { event.stopPropagation(); onEdit(id); },
      }, t('edit'));
    }

    function accentFor(id) {
      switch (id[0]) {
        case 'S': return 'var(--dsw-alias-state-success-primary)';
        case 'C': return 'var(--dsw-alias-state-warn-primary)';
        case 'P': return 'var(--dsw-alias-label-secondary)';
        case 'V': return 'var(--dsw-alias-state-success-primary)';
        case 'Q': return 'var(--dsw-alias-state-error-primary)';
        default: return 'var(--dsw-alias-brand-primary)';
      }
    }

    function textUnits(text) {
      return Array.from(text).reduce((sum, char) => sum + (char.codePointAt(0) > 255 ? 2 : 1), 0);
    }

    function nodeHeight(node, depth) {
      const capacity = depth === 0 ? 30 : 28;
      const lines = Math.min(6, Math.max(1, Math.ceil(textUnits(node.text) / capacity)));
      return 40 + lines * 20;
    }

    function computeLayout(root, collapsed) {
      const nodes = [];
      const edges = [];
      let cursor = 24;
      function place(node, depth) {
        const width = depth === 0 ? 208 : 190;
        const height = nodeHeight(node, depth);
        const item = {
          node, depth, width, height, x: 24 + depth * 258, y: 0, children: [],
        };
        nodes.push(item);
        const children = collapsed[node.id] ? [] : node.children;
        if (children.length === 0) {
          item.y = cursor;
          cursor += height + 18;
          return item;
        }
        item.children = children.map(child => place(child, depth + 1));
        const first = item.children[0];
        const last = item.children[item.children.length - 1];
        item.y = (first.y + first.height / 2 + last.y + last.height / 2) / 2 - height / 2;
        for (const child of item.children) edges.push({ from: item, to: child });
        return item;
      }
      place(root, 0);
      const minY = nodes.reduce((min, item) => Math.min(min, item.y), 24);
      const shift = 24 - minY;
      if (shift > 0) for (const item of nodes) item.y += shift;
      const right = nodes.reduce((max, item) => Math.max(max, item.x + item.width), 0);
      const bottom = nodes.reduce((max, item) => Math.max(max, item.y + item.height), 0);
      return {
        nodes,
        edges,
        width: right + 28,
        height: Math.max(cursor + shift, bottom) + 24,
      };
    }

    function buildTreeMeta(root) {
      const meta = new Map();
      function walk(node, parentId, depth) {
        meta.set(node.id, { node, parentId, depth });
        for (const child of node.children) walk(child, node.id, depth + 1);
      }
      walk(root, null, 0);
      return meta;
    }

    function isAncestor(ancestorId, nodeId, meta) {
      let cursor = meta.get(nodeId);
      while (cursor?.parentId !== null && cursor?.parentId !== undefined) {
        if (cursor.parentId === ancestorId) return true;
        cursor = meta.get(cursor.parentId);
      }
      return false;
    }

    function expandGroups(ids, groups) {
      const expanded = [];
      const seen = new Set();
      for (const id of ids) {
        const group = groups.find(entry => entry.anchor === id || entry.members.includes(id));
        for (const member of group === undefined ? [id] : group.members) {
          if (!seen.has(member)) {
            seen.add(member);
            expanded.push(member);
          }
        }
      }
      return expanded;
    }

    function canMergeIds(ids, meta, groups) {
      const members = expandGroups(ids, groups);
      if (members.length < 2 || members.some(id => !meta.has(id))) return false;
      const parentId = meta.get(members[0]).parentId;
      const sameParent = members.every(id => meta.get(id).parentId === parentId);
      if (sameParent) return true;
      return members.some(ancestor => members.every(id => id === ancestor || isAncestor(ancestor, id, meta)));
    }

    function chooseAnchor(members, meta, preferred) {
      const minDepth = Math.min(...members.map(id => meta.get(id)?.depth ?? Number.MAX_SAFE_INTEGER));
      if (preferred !== undefined && members.includes(preferred) && meta.get(preferred)?.depth === minDepth) {
        return preferred;
      }
      return members.find(id => meta.get(id)?.depth === minDepth) ?? members[0];
    }

    function normalizeGroups(groups, meta) {
      if (!Array.isArray(groups)) return [];
      const used = new Set();
      const result = [];
      for (const group of groups) {
        if (group === null || typeof group !== 'object' || !Array.isArray(group.members)) continue;
        const members = [...new Set(group.members.filter(id => typeof id === 'string' && meta.has(id)))];
        if (members.length < 2 || members.some(id => used.has(id))) continue;
        const anchor = members.includes(group.anchor) ? group.anchor : chooseAnchor(members, meta);
        members.forEach(id => used.add(id));
        result.push({ anchor, members });
      }
      return result;
    }

    function loadGroups(storageKey, meta) {
      try {
        if (typeof localStorage === 'undefined') return [];
        const parsed = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
        return normalizeGroups(parsed, meta);
      } catch {
        return [];
      }
    }

    function loadViewState(storageKey, legacyGroupsKey, meta) {
      try {
        if (typeof localStorage !== 'undefined') {
          const parsed = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
          if (parsed !== null && typeof parsed === 'object') {
            const edits = {};
            if (parsed.edits !== null && typeof parsed.edits === 'object') {
              for (const [id, text] of Object.entries(parsed.edits)) {
                if (meta.has(id) && typeof text === 'string' && text.trim() !== '') edits[id] = text;
              }
            }
            const positions = {};
            if (parsed.positions !== null && typeof parsed.positions === 'object') {
              for (const [id, point] of Object.entries(parsed.positions)) {
                if (meta.has(id) && Number.isFinite(point?.x) && Number.isFinite(point?.y)) {
                  positions[id] = { x: Math.max(8, point.x), y: Math.max(8, point.y) };
                }
              }
            }
            return {
              edits,
              groups: normalizeGroups(parsed.groups, meta),
              positions,
            };
          }
        }
      } catch { /* fall back to the legacy groups key */ }
      return { edits: {}, groups: loadGroups(legacyGroupsKey, meta), positions: {} };
    }

    const EXECUTION_STORAGE_KEY = 'dsh.tree-plan.execution';

    function loadExecutionMap() {
      try {
        if (typeof localStorage === 'undefined') return {};
        const parsed = JSON.parse(localStorage.getItem(EXECUTION_STORAGE_KEY) ?? '{}');
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        const result = {};
        for (const [treeId, value] of Object.entries(parsed)) {
          if (value === null || typeof value !== 'object') continue;
          if (!['sent', 'running', 'executed'].includes(value.phase)) continue;
          result[treeId] = {
            phase: value.phase,
            seenRunning: value.seenRunning === true,
            updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0,
          };
        }
        return result;
      } catch {
        return {};
      }
    }

    function applyTextEdits(root, edits) {
      const clone = node => ({
        ...node,
        text: typeof edits[node.id] === 'string' ? edits[node.id] : node.text,
        children: node.children.map(clone),
      });
      return clone(root);
    }

    function linkPath(from, to) {
      const sx = from.x + from.width;
      const sy = from.y + from.height / 2;
      const tx = to.x;
      const ty = to.y + to.height / 2;
      const bend = Math.max(36, Math.abs(tx - sx) * 0.46);
      return `M ${sx} ${sy} C ${sx + bend} ${sy}, ${tx - bend} ${ty}, ${tx} ${ty}`;
    }

    function serializeGoalTree(root) {
      const lines = [];
      function walk(node, prefix, last, isRoot) {
        const text = node.text.replace(/\s*\r?\n\s*/g, ' / ').trim();
        if (isRoot) lines.push(`G  目标：${text}`);
        else lines.push(`${prefix}${last ? '└─' : '├─'} ${node.id} ${text}`);
        const childPrefix = isRoot ? '' : `${prefix}${last ? '   ' : '│  '}`;
        node.children.forEach((child, index) => {
          walk(child, childPrefix, index === node.children.length - 1, false);
        });
      }
      walk(root, '', true, true);
      return lines.join('\n');
    }

    function buildStartPrompt(tree, root) {
      const goal = root.text.replace(/\s*\r?\n\s*/g, ' / ').trim();
      return [
        START_MARKER,
        '## 需求—目标树',
        `**工作项**：${tree.workItem || tree.goal || goal}`,
        `**目标**：${goal}`,
        '**状态**：已确认，开始执行',
        '```goal-tree',
        serializeGoalTree(root),
        '```',
        '',
        '用户已通过目标树视图的「开始运行」按钮授权执行，并以当前目标树（含内联编辑）为准。请直接开始，不要重复输出目标树或再次请求确认。',
        '执行要求：保持简洁，直接做事；少复述已有内容，最终只汇报关键改动与验证结果。',
      ].join('\n');
    }

    function newRequestId() {
      try {
        if (globalThis.crypto?.randomUUID !== undefined) return globalThis.crypto.randomUUID();
      } catch { /* fall through */ }
      return `tree-plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }

    function TreeDiagram({ tree, t, onStart }) {
      const sourceMeta = buildTreeMeta(tree.root);
      const storageKey = `dsh.tree-plan.state:${tree.id}`;
      const legacyGroupsKey = `dsh.tree-plan.groups:${tree.id}`;
      const [viewState, setViewState] = React.useState(() => loadViewState(storageKey, legacyGroupsKey, sourceMeta));
      const { edits, groups, positions } = viewState;
      const [history, setHistory] = React.useState([]);
      const [editingId, setEditingId] = React.useState(null);
      const [draftText, setDraftText] = React.useState('');
      const [zoom, setZoom] = React.useState(1);
      const [panning, setPanning] = React.useState(false);
      const [startState, setStartState] = React.useState('idle');
      const [startError, setStartError] = React.useState(null);
      const [collapsed, setCollapsed] = React.useState({});
      const [selectedIds, setSelectedIds] = React.useState(new Set());
      const [draggingId, setDraggingId] = React.useState(null);
      const [hoverId, setHoverId] = React.useState(null);
      const dragRef = React.useRef(null);
      const panRef = React.useRef(null);
      const nodeRefs = React.useRef(new Map());
      const pathRefs = React.useRef(new Map());
      const canvasRef = React.useRef(null);
      const stageRef = React.useRef(null);
      const layoutRef = React.useRef(null);
      const pendingDropRef = React.useRef(null);
      const editedRoot = React.useMemo(
        () => applyTextEdits(tree.root, edits),
        [tree.root, edits],
      );
      const meta = React.useMemo(() => buildTreeMeta(editedRoot), [editedRoot]);
      const activeGroups = React.useMemo(() => normalizeGroups(groups, meta), [groups, meta]);
      const base = React.useMemo(() => computeLayout(editedRoot, collapsed), [editedRoot, collapsed]);
      const graph = React.useMemo(() => {
        const groupByMember = new Map();
        const groupByAnchor = new Map();
        for (const group of activeGroups) {
          groupByAnchor.set(group.anchor, group);
          for (const member of group.members) groupByMember.set(member, group);
        }
        const positioned = new Map();
        for (const item of base.nodes) {
          const override = positions[item.node.id];
          positioned.set(item.node.id, override === undefined ? item : { ...item, x: override.x, y: override.y });
        }
        const nodes = [];
        for (const baseItem of base.nodes) {
          if (groupByMember.has(baseItem.node.id) && !groupByAnchor.has(baseItem.node.id)) continue;
          const item = positioned.get(baseItem.node.id);
          if (item === undefined) continue;
          const group = groupByAnchor.get(item.node.id);
          nodes.push(group === undefined ? item : { ...item, group });
        }
        const resolveGroupId = id => groupByMember.get(id)?.anchor ?? id;
        const edges = [];
        const edgeKeys = new Set();
        for (const edge of base.edges) {
          const from = positioned.get(resolveGroupId(edge.from.node.id));
          const to = positioned.get(resolveGroupId(edge.to.node.id));
          if (from === undefined || to === undefined || from.node.id === to.node.id) continue;
          const key = `${from.node.id}-${to.node.id}`;
          if (edgeKeys.has(key)) continue;
          edgeKeys.add(key);
          edges.push({ from, to });
        }
        const layout = {
          nodes,
          edges,
          width: Math.max(base.width, ...nodes.map(item => item.x + item.width + 28)),
          height: Math.max(base.height, ...nodes.map(item => item.y + item.height + 24)),
        };
        return { groupByMember, groupByAnchor, layout };
      }, [activeGroups, base, positions]);
      const { groupByMember, groupByAnchor, layout } = graph;
      layoutRef.current = {
        byId: new Map(layout.nodes.map(item => [item.node.id, item])),
        nodes: layout.nodes,
        edges: layout.edges,
      };
      const markerId = `tp-arrow-${tree.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
      const movedCount = Object.keys(positions).length;
      const selectedArray = [...selectedIds].filter(id => meta.has(id));
      const canMergeSelected = selectedArray.length >= 2 && canMergeIds(selectedArray, meta, activeGroups);
      const focusIds = new Set();
      if (hoverId !== null) {
        focusIds.add(hoverId);
        for (const { from, to } of layout.edges) {
          if (from.node.id === hoverId || to.node.id === hoverId) {
            focusIds.add(from.node.id);
            focusIds.add(to.node.id);
          }
        }
      }
      const requestFrame = globalThis.requestAnimationFrame ?? (callback => globalThis.setTimeout(callback, 16));
      const cancelFrame = globalThis.cancelAnimationFrame ?? globalThis.clearTimeout;
      React.useEffect(() => () => {
        if (dragRef.current?.raf != null) cancelFrame(dragRef.current.raf);
        dragRef.current = null;
      }, []);
      React.useEffect(() => {
        try {
          if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(viewState));
        } catch { /* storage is optional */ }
      }, [viewState, storageKey]);
      React.useLayoutEffect(() => {
        const id = pendingDropRef.current;
        if (id === null) return;
        pendingDropRef.current = null;
        const node = nodeRefs.current.get(id);
        if (node?.style !== undefined) node.style.translate = '';
      });

      function commitView(next) {
        setHistory(current => [...current.slice(-49), viewState]);
        setViewState(next);
        setStartState('idle');
        setStartError(null);
      }
      async function startRun() {
        if (onStart === undefined || startState !== 'idle') return;
        setStartState('starting');
        setStartError(null);
        try {
          await onStart({ tree, root: editedRoot });
          setStartState('sent');
        } catch (error) {
          setStartState('idle');
          setStartError(error instanceof Error ? error.message : String(error));
        }
      }
      function undo() {
        const previous = history[history.length - 1];
        if (previous === undefined) return;
        setViewState(previous);
        setHistory(current => current.slice(0, -1));
        setEditingId(null);
        setSelectedIds(new Set());
      }
      function mergeNodes(ids, preferred, forcePreferred = false) {
        if (!canMergeIds(ids, meta, activeGroups)) return false;
        const members = expandGroups(ids, activeGroups);
        const remaining = activeGroups.filter(group => !group.members.some(id => members.includes(id)));
        const anchor = forcePreferred && members.includes(preferred)
          ? preferred
          : chooseAnchor(members, meta, preferred);
        commitView({ ...viewState, groups: [...remaining, { anchor, members }] });
        setSelectedIds(new Set());
        return true;
      }
      function mergeSelected() {
        mergeNodes([...selectedIds]);
      }
      function splitGroup(anchor) {
        commitView({
          ...viewState,
          groups: activeGroups.filter(group => !group.members.includes(anchor)),
        });
        setSelectedIds(current => {
          if (!current.has(anchor)) return current;
          const next = new Set(current);
          next.delete(anchor);
          return next;
        });
      }
      function splitAll() {
        if (activeGroups.length === 0) return;
        commitView({ ...viewState, groups: [] });
        setSelectedIds(new Set());
      }
      function beginEdit(id) {
        const node = meta.get(id)?.node;
        if (node === undefined) return;
        setEditingId(id);
        setDraftText(node.text);
        setSelectedIds(new Set([id]));
      }
      function saveEdit() {
        if (editingId === null) return;
        const text = draftText.trim();
        if (text === '') return;
        const currentText = meta.get(editingId)?.node.text ?? '';
        if (text !== currentText) {
          const sourceText = sourceMeta.get(editingId)?.node.text;
          const nextEdits = { ...edits };
          if (text === sourceText) delete nextEdits[editingId];
          else nextEdits[editingId] = text;
          commitView({ ...viewState, edits: nextEdits });
        }
        setEditingId(null);
      }
      function cancelEdit() {
        setEditingId(null);
      }
      function selectNode(id, event) {
        const additive = event.shiftKey === true || event.ctrlKey === true || event.metaKey === true;
        setSelectedIds(current => {
          const next = new Set(additive ? current : []);
          if (additive && next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
      function findMergeTarget(drag) {
        const centerX = drag.latestX + drag.width / 2;
        const centerY = drag.latestY + drag.height / 2;
        for (const item of layoutRef.current.nodes) {
          if (item.node.id === drag.id) continue;
          if (centerX < item.x || centerX > item.x + item.width) continue;
          if (centerY < item.y || centerY > item.y + item.height) continue;
          if (canMergeIds([drag.id, item.node.id], meta, activeGroups)) return item.node.id;
        }
        return null;
      }
      function setMergeTarget(drag, id) {
        if (drag.mergeTargetId === id) return;
        const previous = drag.mergeTargetId === null ? undefined : nodeRefs.current.get(drag.mergeTargetId);
        previous?.classList?.remove('tp-diagram-node-merge-target');
        drag.mergeTargetId = id;
        const next = id === null ? undefined : nodeRefs.current.get(id);
        next?.classList?.add('tp-diagram-node-merge-target');
      }

      function paintDrag(drag) {
        const moved = { ...drag.item, x: drag.latestX, y: drag.latestY };
        const node = nodeRefs.current.get(drag.id);
        if (node?.style !== undefined) {
          node.style.translate = `${drag.latestX - drag.originX}px ${drag.latestY - drag.originY}px`;
        }
        const canvas = canvasRef.current;
        if (canvas?.style !== undefined) {
          const width = Math.ceil(drag.latestX + drag.width + 28);
          const height = Math.ceil(drag.latestY + drag.height + 24);
          if (width > (parseFloat(canvas.style.width) || 0)) {
            canvas.style.width = `${width}px`;
            if (stageRef.current?.style !== undefined) stageRef.current.style.width = `${width * drag.zoom}px`;
          }
          if (height > (parseFloat(canvas.style.height) || 0)) {
            canvas.style.height = `${height}px`;
            if (stageRef.current?.style !== undefined) stageRef.current.style.height = `${height * drag.zoom}px`;
          }
        }
        for (const connection of drag.connections) {
          if (connection.path === undefined) continue;
          const from = connection.fromId === drag.id ? moved : layoutRef.current.byId.get(connection.fromId);
          const to = connection.toId === drag.id ? moved : layoutRef.current.byId.get(connection.toId);
          if (from !== undefined && to !== undefined) connection.path.setAttribute('d', linkPath(from, to));
        }
        setMergeTarget(drag, findMergeTarget(drag));
      }
      function startDrag(item, event) {
        if (event.button !== 0) return;
        if (typeof event.target?.closest === 'function' && event.target.closest('button, textarea, input') !== null) return;
        event.preventDefault();
        const connections = layoutRef.current.edges
          .filter(edge => edge.from.node.id === item.node.id || edge.to.node.id === item.node.id)
          .map(edge => ({
            fromId: edge.from.node.id,
            toId: edge.to.node.id,
            path: pathRefs.current.get(`${edge.from.node.id}-${edge.to.node.id}`),
          }));
        const drag = {
          id: item.node.id,
          item,
          width: item.width,
          height: item.height,
          connections,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: item.x,
          originY: item.y,
          latestX: item.x,
          latestY: item.y,
          moved: false,
          mergeTargetId: null,
          raf: null,
          zoom,
          element: event.currentTarget,
        };
        dragRef.current = drag;
        setHoverId(null);
        setDraggingId(item.node.id);
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* capture is optional */ }
      }
      function moveDrag(event) {
        const drag = dragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId) return;
        event.preventDefault();
        drag.latestX = Math.max(8, drag.originX + (event.clientX - drag.startX) / drag.zoom);
        drag.latestY = Math.max(8, drag.originY + (event.clientY - drag.startY) / drag.zoom);
        if (!drag.moved && (Math.abs(drag.latestX - drag.originX) > 3 || Math.abs(drag.latestY - drag.originY) > 3)) {
          drag.moved = true;
        }
        if (drag.raf !== null) return;
        drag.raf = requestFrame(() => {
          drag.raf = null;
          if (dragRef.current === drag) paintDrag(drag);
        });
      }
      function finishDrag(event) {
        const drag = dragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId) return;
        if (typeof event.clientX === 'number') {
          drag.latestX = Math.max(8, drag.originX + (event.clientX - drag.startX) / drag.zoom);
          drag.latestY = Math.max(8, drag.originY + (event.clientY - drag.startY) / drag.zoom);
        }
        if (!drag.moved && (Math.abs(drag.latestX - drag.originX) > 3 || Math.abs(drag.latestY - drag.originY) > 3)) {
          drag.moved = true;
        }
        if (drag.raf !== null) cancelFrame(drag.raf);
        drag.raf = null;
        const release = () => {
          dragRef.current = null;
          setDraggingId(null);
          try {
            if (drag.element.hasPointerCapture(event.pointerId)) drag.element.releasePointerCapture(event.pointerId);
          } catch { /* capture may already be released */ }
        };
        if (!drag.moved) {
          const node = nodeRefs.current.get(drag.id);
          if (node?.style !== undefined) node.style.translate = '';
          setMergeTarget(drag, null);
          release();
          selectNode(drag.id, event);
          return;
        }
        paintDrag(drag);
        const mergeTarget = drag.mergeTargetId;
        if (mergeTarget !== null && mergeNodes([drag.id, mergeTarget], mergeTarget, true)) {
          setMergeTarget(drag, null);
          const node = nodeRefs.current.get(drag.id);
          if (node?.style !== undefined) node.style.translate = '';
          pendingDropRef.current = null;
          release();
          return;
        }
        setMergeTarget(drag, null);
        pendingDropRef.current = drag.id;
        commitView({
          ...viewState,
          positions: { ...positions, [drag.id]: { x: drag.latestX, y: drag.latestY } },
        });
        release();
      }
      function resetNode(id) {
        if (positions[id] === undefined) return;
        const nextPositions = { ...positions };
        delete nextPositions[id];
        commitView({ ...viewState, positions: nextPositions });
      }
      const toggle = id => setCollapsed(current => ({ ...current, [id]: !current[id] }));
      function startPan(event) {
        if (event.button !== 2) return;
        event.preventDefault();
        const element = event.currentTarget;
        panRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          left: element.scrollLeft,
          top: element.scrollTop,
          element,
        };
        setPanning(true);
        try { element.setPointerCapture(event.pointerId); } catch { /* optional */ }
      }
      function movePan(event) {
        const pan = panRef.current;
        if (pan === null || pan.pointerId !== event.pointerId) return;
        event.preventDefault();
        pan.element.scrollLeft = pan.left - (event.clientX - pan.startX);
        pan.element.scrollTop = pan.top - (event.clientY - pan.startY);
      }
      function finishPan(event) {
        const pan = panRef.current;
        if (pan === null || pan.pointerId !== event.pointerId) return;
        panRef.current = null;
        setPanning(false);
        try {
          if (pan.element.hasPointerCapture(event.pointerId)) pan.element.releasePointerCapture(event.pointerId);
        } catch { /* optional */ }
      }
      return h(React.Fragment, null,
        h('div', { className: 'tp-diagram-toolbar' },
          h('span', { className: 'tp-diagram-hint' },
            t('layout.hint'),
            h('span', { className: 'tp-diagram-select-hint' }, ` · ${t('merge.selectHint')}`),
          ),
          h('div', { className: 'tp-diagram-toolbar-actions' },
            onStart !== undefined && h('button', {
              type: 'button', className: 'tp-start-btn', disabled: startState !== 'idle',
              onClick: startRun,
            }, startState === 'starting' ? t('start.starting') : startState === 'sent' ? t('start.sent') : `▶ ${t('start.run')}`),
            h('button', {
              type: 'button', className: 'tp-undo-btn', disabled: history.length === 0,
              title: t('undoTitle'), onClick: undo,
            }, t('undo')),
            selectedArray.length > 0 && h('span', { className: 'tp-free-layout' }, t('merge.selectedCount', { count: selectedArray.length })),
            h('button', {
              type: 'button', className: 'tp-merge-btn', disabled: !canMergeSelected,
              title: t('merge.selectedTitle'), onClick: mergeSelected,
            }, t('merge.selected')),
            h('button', {
              type: 'button', className: 'tp-merge-btn', disabled: activeGroups.length === 0,
              title: t('merge.splitAllTitle'), onClick: splitAll,
            }, t('merge.splitAll')),
            h('button', {
              type: 'button', className: 'tp-layout-reset', disabled: movedCount === 0,
              title: t('layout.resetTitle'), onClick: () => {
                if (movedCount > 0) commitView({ ...viewState, positions: {} });
              },
            }, t('layout.reset')),
            h('div', { className: 'tp-zoom-controls' },
              h('button', {
                type: 'button', className: 'tp-zoom-btn', disabled: zoom <= 0.5,
                title: t('zoom.out'), 'aria-label': t('zoom.out'),
                onClick: () => setZoom(value => Math.max(0.5, Math.round((value - 0.1) * 10) / 10)),
              }, '−'),
              h('span', { className: 'tp-zoom-label' }, `${Math.round(zoom * 100)}%`),
              h('button', {
                type: 'button', className: 'tp-zoom-btn', disabled: zoom >= 2,
                title: t('zoom.in'), 'aria-label': t('zoom.in'),
                onClick: () => setZoom(value => Math.min(2, Math.round((value + 0.1) * 10) / 10)),
              }, '+'),
              h('button', {
                type: 'button', className: 'tp-zoom-reset', disabled: zoom === 1,
                title: t('zoom.reset'), onClick: () => setZoom(1),
              }, t('zoom.reset')),
            ),
          ),
        ),
        startError !== null && h('div', { className: 'tp-start-error', role: 'alert' },
          t('start.failed', { message: startError }),
        ),
        h('div', {
          className: `tp-diagram-scroll${panning ? ' tp-panning' : ''}`,
          onPointerDown: startPan,
          onPointerMove: movePan,
          onPointerUp: finishPan,
          onPointerCancel: finishPan,
          onContextMenu: event => event.preventDefault(),
        },
          h('div', {
            ref: stageRef, className: 'tp-diagram-stage',
            style: { width: layout.width * zoom, height: layout.height * zoom },
          },
          h('div', {
            ref: canvasRef,
            className: 'tp-diagram-canvas', role: 'tree', 'aria-label': tree.goal,
            style: {
              width: layout.width, height: layout.height,
              transform: `scale(${zoom})`, transformOrigin: '0 0',
            },
            onPointerDown: event => {
              if (event.button === 0 && event.target === event.currentTarget) setSelectedIds(new Set());
            },
          },
            h('svg', {
              className: 'tp-diagram-links', width: layout.width, height: layout.height,
              viewBox: `0 0 ${layout.width} ${layout.height}`, 'aria-hidden': true,
            },
              h('defs', null,
                h('marker', {
                  id: markerId, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4,
                  orient: 'auto', markerUnits: 'strokeWidth',
                }, h('path', { className: 'tp-diagram-arrow', d: 'M0 0 8 4 0 8Z' })),
              ),
              layout.edges.map(({ from, to }) => {
                const active = hoverId !== null && (from.node.id === hoverId || to.node.id === hoverId);
                const dim = hoverId !== null && !active;
                const key = `${from.node.id}-${to.node.id}`;
                return h('path', {
                  key,
                  ref: element => {
                    if (element === null) pathRefs.current.delete(key);
                    else pathRefs.current.set(key, element);
                  },
                  className: `tp-diagram-link${active ? ' tp-diagram-link-active' : ''}${dim ? ' tp-diagram-link-dim' : ''}`,
                  d: linkPath(from, to),
                  markerEnd: `url(#${markerId})`,
                  pathLength: 1,
                  style: {
                    stroke: `color-mix(in srgb, ${accentFor(to.node.id)} 45%, var(--dsw-alias-border-l2))`,
                    '--tp-edge-accent': accentFor(to.node.id),
                  },
                });
              }),
            ),
            layout.nodes.map(item => {
              const { node, depth, group } = item;
              const hasChildren = node.children.length > 0 && group === undefined;
              const hasOutgoing = layout.edges.some(edge => edge.from.node.id === node.id);
              const isCollapsed = collapsed[node.id] === true;
              const isDragging = draggingId === node.id;
              const isEditing = editingId === node.id;
              const isSelected = selectedIds.has(node.id);
              const focused = hoverId !== null && focusIds.has(node.id);
              const dimmed = hoverId !== null && !focusIds.has(node.id);
              const nodeTitle = group === undefined
                ? node.text
                : group.members.map(id => `${id} ${meta.get(id)?.node.text ?? ''}`).join('\n');
              return h('div', {
                key: node.id,
                ref: element => {
                  if (element === null) nodeRefs.current.delete(node.id);
                  else nodeRefs.current.set(node.id, element);
                },
                className: `tp-diagram-node${depth === 0 ? ' tp-diagram-root' : ''}${group !== undefined ? ' tp-diagram-node-merged' : ''}${isEditing ? ' tp-diagram-node-editing' : ''}${isSelected ? ' tp-diagram-node-selected' : ''}${isDragging ? ' tp-diagram-node-dragging' : ''}${positions[node.id] ? ' tp-diagram-node-moved' : ''}${focused ? ' tp-diagram-node-focus' : ''}${dimmed ? ' tp-diagram-node-dim' : ''}`,
                style: {
                  left: item.x, top: item.y, width: item.width, height: item.height,
                  '--tp-accent': accentFor(node.id),
                  animationDelay: `${Math.min(depth, 5) * 42}ms`,
                },
                role: 'treeitem', 'aria-level': depth + 1,
                'aria-expanded': hasChildren ? !isCollapsed : undefined,
                'aria-selected': isSelected,
                'aria-grabbed': isDragging,
                title: nodeTitle,
                'data-node-id': node.id,
                'data-group': group !== undefined ? 'true' : undefined,
                onPointerDown: event => startDrag(item, event),
                onPointerMove: moveDrag,
                onPointerUp: finishDrag,
                onPointerCancel: finishDrag,
                onPointerEnter: () => { if (dragRef.current === null) setHoverId(node.id); },
                onPointerLeave: () => { if (dragRef.current === null) setHoverId(null); },
                onDoubleClick: event => {
                  if (typeof event.target?.closest === 'function' && event.target.closest('button, textarea, input') !== null) return;
                  resetNode(node.id);
                },
              },
                depth > 0 && h('span', { className: 'tp-diagram-port tp-diagram-port-in', 'aria-hidden': true }),
                hasOutgoing && h('span', { className: 'tp-diagram-port tp-diagram-port-out', 'aria-hidden': true }),
                h('div', { className: 'tp-diagram-node-top' },
                  h('span', { className: 'tp-diagram-node-identity' },
                    h('span', { className: 'tp-node-id' }, node.id),
                    group !== undefined
                      ? h('span', {
                          className: 'tp-node-childcount tp-group-count',
                          title: t('merge.groupTitle', { count: group.members.length }),
                        }, `+${group.members.length - 1}`)
                      : hasChildren && h('span', {
                          className: 'tp-node-childcount', title: t('nodes', { count: node.children.length }),
                        }, node.children.length),
                  ),
                  h('span', { className: 'tp-diagram-node-actions' },
                    isEditing ? h(React.Fragment, null,
                      h('button', {
                        type: 'button', className: 'tp-node-save', disabled: draftText.trim() === '',
                        title: t('edit.save'), onPointerDown: event => event.stopPropagation(),
                        onClick: saveEdit,
                      }, t('edit.save')),
                      h('button', {
                        type: 'button', className: 'tp-node-cancel',
                        title: t('edit.cancel'), 'aria-label': t('edit.cancel'),
                        onPointerDown: event => event.stopPropagation(),
                        onClick: cancelEdit,
                      }, '×'),
                    ) : h(React.Fragment, null,
                      group !== undefined && h('button', {
                        type: 'button', className: 'tp-group-split',
                        title: t('merge.splitGroupTitle'), 'aria-label': `${t('merge.splitGroup')} ${node.id}`,
                        onPointerDown: event => event.stopPropagation(),
                        onClick: () => splitGroup(node.id),
                      }, t('merge.splitGroup')),
                      hasChildren && h('button', {
                        type: 'button', className: 'tp-diagram-collapse',
                        'aria-expanded': !isCollapsed, title: t(isCollapsed ? 'expand' : 'collapse'),
                        'aria-label': `${t(isCollapsed ? 'expand' : 'collapse')} ${node.id}`,
                        onPointerDown: event => event.stopPropagation(),
                        onClick: () => toggle(node.id),
                      }, h(Chevron, { open: !isCollapsed })),
                      h(EditButton, { id: node.id, onEdit: beginEdit, t }),
                    ),
                  ),
                ),
                isEditing
                  ? h('textarea', {
                      className: 'tp-node-editor', value: draftText,
                      rows: 2, spellCheck: false, 'aria-label': t('edit.placeholder'),
                      onPointerDown: event => event.stopPropagation(),
                      onChange: event => setDraftText(event.target.value),
                      onKeyDown: event => {
                        if (event.isComposing || event.nativeEvent?.isComposing) return;
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          cancelEdit();
                        } else if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          saveEdit();
                        }
                      },
                    })
                  : h('div', { className: 'tp-diagram-node-text' }, node.text),
              );
            }),
          ),
          ),
        ),
      );
    }

    function TreeCard({ tree, t, onStart, statusOverride }) {
      const total = countNodes(tree.root) - 1;
      const status = statusOverride ?? (tree.status || t('statusDraft'));
      const confirmed = /已确认|已开始|执行中|已执行|confirmed|running|executed/i.test(status);
      return h('article', { className: 'tp-card', 'data-tree-id': tree.id },
        h('header', { className: 'tp-header' },
          h('span', { className: 'tp-header-icon' }, h(TreeIcon)),
          h('div', { className: 'tp-header-copy' },
            h('div', { className: 'tp-title-line' },
              h('h3', { className: 'tp-title' }, t('title')),
              h('span', {
                className: `tp-status${confirmed ? ' tp-status-confirmed' : ''}`,
              }, status),
            ),
            h('p', { className: 'tp-work-item' }, tree.workItem || t('untitled')),
          ),
          h('span', { className: 'tp-header-count' }, `${tree.root.children.length} / ${total}`),
        ),
        h('div', { className: 'tp-body' },
          h('div', { className: 'tp-summary', 'aria-hidden': true },
            h('span', null, t('branches', { count: tree.root.children.length })),
            h('span', { className: 'tp-summary-dot' }, '·'),
            h('span', null, t('nodes', { count: total })),
          ),
          h(TreeDiagram, { tree, t, onStart }),
          h('details', { className: 'tp-raw' },
            h('summary', null, t('raw')),
            h('pre', null, tree.raw),
          ),
          h('p', { className: 'tp-note' }, t('note')),
        ),
      );
    }

    function createGoalTreeView(ctx) {
      return function GoalTreeView({ useProjection, useSession, t, sessionId }) {
        const projection = useProjection('goalTrees');
        const trees = Array.isArray(projection?.trees) ? projection.trees : [];
        const [selectedId, setSelectedId] = React.useState(undefined);
        const [executionByTree, setExecutionByTree] = React.useState(loadExecutionMap);
        const active = trees.find(tree => tree.id === selectedId) ?? trees[trees.length - 1];
        const running = typeof useSession === 'function'
          ? useSession(snapshot => snapshot?.running) === true
          : false;
        const execution = active === undefined ? undefined : executionByTree[active.id];
        React.useEffect(() => {
          if (active === undefined || execution === undefined) return;
          if (running && (!execution.seenRunning || execution.phase !== 'running')) {
            setExecutionByTree(current => ({
              ...current,
              [active.id]: { phase: 'running', seenRunning: true, updatedAt: Date.now() },
            }));
          } else if (!running && execution.phase === 'running') {
            setExecutionByTree(current => ({
              ...current,
              [active.id]: { ...execution, phase: 'executed', seenRunning: true, updatedAt: Date.now() },
            }));
          }
        }, [active?.id, execution?.phase, execution?.seenRunning, running]);
        React.useEffect(() => {
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify(executionByTree));
            }
          } catch { /* storage is optional */ }
        }, [executionByTree]);
        const statusOverride = execution === undefined
          ? undefined
          : running
            ? t('status.running')
            : execution.seenRunning || execution.phase === 'executed'
              ? t('status.executed')
              : t('status.sent');
        async function startRun({ tree, root }) {
          const remote = ctx.remote?.session;
          if (remote === undefined || typeof remote.prompt !== 'function') {
            throw new Error('session.prompt is unavailable');
          }
          if (typeof sessionId !== 'string' || sessionId === '') {
            throw new Error('current session is unavailable');
          }
          let clientTimeZone;
          try { clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* optional */ }
          const result = await remote.prompt({
            requestId: newRequestId(),
            sessionId,
            mode: 'queue',
            content: [{ type: 'text', text: buildStartPrompt(tree, root) }],
            ...clientTimeZone === undefined ? {} : { clientTimeZone },
          });
          if (result?.ok !== true) {
            const code = result?.error?.code ?? 'PROMPT_FAILED';
            const message = result?.error?.message ?? 'unknown error';
            throw new Error(`${code}: ${message}`);
          }
          setExecutionByTree(current => ({
            ...current,
            [tree.id]: {
              phase: running ? 'running' : 'sent',
              seenRunning: running,
              updatedAt: Date.now(),
            },
          }));
        }
        return h('section', {
          className: 'tp-view', 'data-testid': 'goal-tree-view', 'aria-label': t('view.title'),
        },
          h('style', { dangerouslySetInnerHTML: { __html: styles } }),
          h('div', { className: 'tp-view-inner' },
            h('header', { className: 'tp-view-header' },
              h('div', { className: 'tp-view-heading' },
                h('span', { className: 'tp-header-icon' }, h(TreeIcon, { size: 22 })),
                h('div', null,
                  h('div', { className: 'tp-view-title-line' },
                    h('h2', { className: 'tp-view-title' }, t('view.title')),
                    h('span', { className: 'tp-version' }, t('version')),
                  ),
                  h('p', { className: 'tp-view-subtitle' }, t('view.count', { count: trees.length })),
                ),
              ),
              trees.length > 1 && h('label', { className: 'tp-view-picker' },
                h('span', null, t('view.version')),
                h('select', {
                  value: active?.id ?? '', onChange: event => setSelectedId(event.target.value),
                  'aria-label': t('view.version'),
                }, trees.map(tree => h('option', { key: tree.id, value: tree.id },
                  `${t('view.turn', { turn: tree.turn })} · ${tree.workItem || t('untitled')}`,
                ))),
              ),
            ),
            active === undefined
              ? h('div', { className: 'tp-empty' },
                  h('span', { className: 'tp-empty-icon' }, h(TreeIcon, { size: 32 })),
                  h('h3', null, t('empty.title')),
                  h('p', null, t('empty.body')),
                )
              : h('div', { className: 'tp-cards' },
                  h(TreeCard, {
                    key: active.id, tree: active, t, onStart: startRun,
                    statusOverride,
                  }),
                ),
          ),
        );
      };
    }

    const styles = `
.tp-cards{display:flex;flex-direction:column;gap:12px;width:100%;margin:10px 0 6px}
.tp-card{box-sizing:border-box;width:100%;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 8px 24px color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent)}
.tp-header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--dsw-alias-border-l1);background:linear-gradient(120deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,var(--dsw-alias-bg-layer-2)),var(--dsw-alias-bg-layer-2))}
.tp-header-icon{display:grid;place-items:center;flex:none;width:38px;height:38px;border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 30%,var(--dsw-alias-border-l1));border-radius:11px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-brand-primary)}
.tp-header-copy{min-width:0;flex:1}.tp-title-line{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.tp-title{margin:0;font-size:15px;font-weight:650;line-height:22px;letter-spacing:.01em}
.tp-work-item{margin:3px 0 0;overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;text-overflow:ellipsis;white-space:nowrap}
.tp-status{display:inline-flex;align-items:center;min-height:21px;padding:1px 8px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary) 35%,transparent);border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 10%,transparent);color:var(--dsw-alias-state-warn-primary);font-size:11px;font-weight:600;line-height:17px;white-space:nowrap}
.tp-status-confirmed{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 35%,transparent);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 10%,transparent);color:var(--dsw-alias-state-success-primary)}
.tp-header-count{display:grid;place-items:center;flex:none;min-width:42px;height:28px;padding:0 8px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}
.tp-body{padding:16px 18px 14px}
.tp-summary{display:flex;gap:7px;margin:10px 0 8px 5px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}.tp-summary-dot{opacity:.55}
.tp-diagram-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 9px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:18px}
.tp-diagram-hint{min-width:0}.tp-diagram-toolbar-actions{display:flex;align-items:center;gap:8px;flex:none}
.tp-free-layout{padding:1px 7px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);color:var(--dsw-alias-brand-primary);font-size:10px;white-space:nowrap}
.tp-layout-reset{min-height:27px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer}
.tp-layout-reset:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.tp-layout-reset:disabled{cursor:default;opacity:.45}.tp-layout-reset:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.tp-diagram-scroll{position:relative;width:100%;max-height:640px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-base);scrollbar-width:thin}
.tp-diagram-canvas{position:relative;min-width:100%;box-sizing:border-box}
.tp-diagram-links{position:absolute;inset:0;overflow:visible;pointer-events:none}
.tp-diagram-link{fill:none;stroke:var(--dsw-alias-border-l2);stroke-width:1.35;stroke-linecap:round}
.tp-diagram-arrow{fill:var(--dsw-alias-label-secondary);opacity:.55}
.tp-diagram-node{position:absolute;z-index:1;box-sizing:border-box;padding:8px 10px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 2px 5px color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent);cursor:grab;touch-action:none;user-select:none;transition:left .28s cubic-bezier(.22,1,.36,1),top .28s cubic-bezier(.22,1,.36,1),border-color .16s ease,box-shadow .16s ease,transform .16s ease}
.tp-diagram-node-top{display:flex;align-items:center;justify-content:space-between;gap:6px;height:24px}
.tp-diagram-node-actions{display:flex;align-items:center;gap:2px;flex:none}
.tp-diagram-node-actions .tp-edit{padding:2px 4px;font-size:10px;line-height:18px}
.tp-diagram-collapse{display:grid;place-items:center;width:23px;height:23px;margin:0;padding:0;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.tp-diagram-collapse:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
.tp-diagram-collapse:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.tp-diagram-node-text{margin-top:5px;overflow:hidden;font-size:12px;font-weight:550;line-height:20px;overflow-wrap:anywhere}
.tp-diagram-root .tp-diagram-node-text{font-size:13px;font-weight:650}
.tp-diagram-root .tp-node-id{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-layer-1)}
.tp-edit:focus-visible,.tp-raw summary:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.tp-chevron{flex:none;color:var(--dsw-alias-label-secondary);transition:transform .15s ease}.tp-chevron-open{transform:rotate(90deg)}
.tp-edit{flex:none;margin:0;padding:4px 7px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:16px;cursor:pointer;opacity:.72}
.tp-edit:hover{border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary);opacity:1}
.tp-node-id{flex:none;min-width:30px;padding:1px 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:var(--dsw-alias-bg-layer-1);color:var(--tp-accent);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:10px;font-weight:650;line-height:18px;text-align:center}
.tp-raw{margin:12px 0 0 35px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px}
.tp-raw summary{box-sizing:border-box;width:max-content;padding:10px 2px 4px;cursor:pointer}.tp-raw pre{max-height:280px;overflow:auto;margin:7px 0 0;padding:10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:11px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}
.tp-note{margin:10px 0 0 35px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:17px}
.tp-chat-start{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:8px 11px;border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 22%,var(--dsw-alias-border-l1));border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 5%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-label-secondary);font-size:11px;line-height:17px}.tp-chat-start-icon{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:6px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-layer-1);font-size:9px}
.tp-chat-notice{position:relative;display:flex;align-items:center;gap:11px;width:100%;box-sizing:border-box;padding:11px 13px;border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 28%,var(--dsw-alias-border-l1));border-left:3px solid var(--dsw-alias-brand-primary);border-radius:10px;background:linear-gradient(100deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,var(--dsw-alias-bg-layer-1)),var(--dsw-alias-bg-layer-1) 62%);color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px;box-shadow:0 4px 14px color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent);animation:tp-reminder-in .24s ease-out both}
.tp-chat-notice-icon{display:grid;place-items:center;flex:none;width:30px;height:30px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-brand-primary)}
.tp-chat-notice-copy{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.tp-chat-notice-title{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.tp-chat-notice-title strong{font-size:12.5px;font-weight:650}.tp-chat-notice-version{color:var(--dsw-alias-label-secondary);font-size:10px}.tp-chat-notice-badge{padding:0 6px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 12%,transparent);color:var(--dsw-alias-state-warn-primary);font-size:9px;font-weight:600;line-height:17px;animation:tp-reminder-pulse 1.8s ease-in-out infinite}.tp-chat-notice-detail{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:17px}.tp-chat-notice-arrow{flex:none;color:var(--dsw-alias-brand-primary);font-size:20px;line-height:20px}
@keyframes tp-reminder-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
@keyframes tp-reminder-pulse{0%,100%{opacity:1}50%{opacity:.55}}
.tp-view{display:flex;flex:1 1 auto;flex-direction:column;min-height:0;width:100%;overflow-x:hidden;overflow-y:auto;color:var(--dsw-alias-label-primary)}
.tp-view-inner{box-sizing:border-box;width:100%;max-width:1040px;margin:0 auto;padding:22px 28px 48px}
.tp-view-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:16px}
.tp-view-heading{display:flex;align-items:center;gap:12px;min-width:0}.tp-view-title{margin:0;font-size:20px;font-weight:650;line-height:28px}.tp-view-subtitle{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.tp-view-picker{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px}.tp-view-picker select{box-sizing:border-box;max-width:320px;min-height:34px;padding:4px 30px 4px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}
.tp-view-picker select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.tp-empty{display:flex;align-items:center;flex-direction:column;justify-content:center;min-height:320px;padding:32px;border:1px dashed var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);text-align:center}.tp-empty-icon{display:grid;place-items:center;width:58px;height:58px;margin-bottom:14px;border-radius:16px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-brand-primary)}.tp-empty h3{margin:0 0 7px;font-size:16px;line-height:24px}.tp-empty p{max-width:460px;margin:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:21px}
.tp-view .tp-cards{margin:0}
.tp-view-inner{max-width:1180px}
.tp-card{border-radius:18px;box-shadow:0 12px 34px color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent)}
.tp-header{position:relative;gap:14px;padding:18px 20px;background:linear-gradient(120deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 11%,var(--dsw-alias-bg-layer-2)),var(--dsw-alias-bg-layer-2) 58%)}
.tp-header::after{position:absolute;right:0;bottom:0;left:0;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--dsw-alias-brand-primary) 28%,transparent),transparent);content:''}
.tp-header-count{min-width:48px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,var(--dsw-alias-bg-layer-1));border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,var(--dsw-alias-border-l1))}
.tp-summary{display:inline-flex;align-items:center;width:max-content;margin:2px 0 10px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}
.tp-diagram-toolbar{margin-bottom:10px;padding:0 2px}
.tp-diagram-scroll{max-height:680px;border-radius:14px;background-color:var(--dsw-alias-bg-base);background-image:radial-gradient(circle at 1px 1px,color-mix(in srgb,var(--dsw-alias-border-l2) 42%,transparent) 1px,transparent 0);background-size:18px 18px;box-shadow:inset 0 1px 3px color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent)}
.tp-diagram-node{overflow:visible;border-radius:10px;background:linear-gradient(180deg,color-mix(in srgb,var(--tp-accent) 4%,var(--dsw-alias-bg-layer-1)),var(--dsw-alias-bg-layer-1) 54%);box-shadow:0 1px 2px color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent),0 5px 14px color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent);animation:tp-node-fade .3s ease-out backwards;transition:left .28s cubic-bezier(.22,1,.36,1),top .28s cubic-bezier(.22,1,.36,1),border-color .16s ease,box-shadow .16s ease,opacity .16s ease}
.tp-diagram-node::before{position:absolute;top:12px;bottom:12px;left:0;width:2px;border-radius:0 2px 2px 0;background:var(--tp-accent);opacity:.34;content:'';pointer-events:none}
.tp-diagram-root{background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 11%,var(--dsw-alias-bg-layer-1)),color-mix(in srgb,var(--dsw-alias-brand-primary) 3%,var(--dsw-alias-bg-layer-1)) 68%)}
.tp-diagram-root::before{top:9px;bottom:9px;width:3px;opacity:.9}
.tp-diagram-node:hover,.tp-diagram-node-focus{z-index:3;border-color:color-mix(in srgb,var(--tp-accent) 48%,var(--dsw-alias-border-l2));box-shadow:0 3px 6px color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent),0 12px 26px color-mix(in srgb,var(--dsw-alias-label-primary) 10%,transparent)}
.tp-diagram-node-dim{opacity:.5}
.tp-diagram-node-dragging{z-index:6;transform:none;will-change:translate;box-shadow:0 4px 8px color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent),0 18px 40px color-mix(in srgb,var(--dsw-alias-label-primary) 18%,transparent);transition:box-shadow .14s ease}
.tp-diagram-node-moved{transition:border-color .16s ease,box-shadow .16s ease,opacity .16s ease}
.tp-diagram-node-identity{display:flex;align-items:center;gap:5px;min-width:0}
.tp-node-childcount{display:grid;place-items:center;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:9px;font-weight:600;font-variant-numeric:tabular-nums}
.tp-diagram-port{position:absolute;top:50%;z-index:2;width:8px;height:8px;border:1.5px solid var(--dsw-alias-bg-layer-1);border-radius:50%;background:var(--tp-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--tp-accent) 38%,transparent);opacity:.72;transform:translateY(-50%);pointer-events:none}
.tp-diagram-port-in{left:-4px}.tp-diagram-port-out{right:-4px}
.tp-diagram-node-text{margin-top:6px;letter-spacing:.005em}
.tp-diagram-link{stroke-width:1.5;stroke-dasharray:1;stroke-dashoffset:1;animation:tp-link-draw .48s cubic-bezier(.22,1,.36,1) .06s forwards;transition:opacity .16s ease,stroke-width .16s ease}
.tp-diagram-link-active{opacity:1;stroke-width:2.05}
.tp-diagram-link-dim{opacity:.24}
.tp-diagram-arrow{opacity:.68}
.tp-diagram-toolbar-actions{flex-wrap:wrap;justify-content:flex-end}
.tp-start-btn{min-height:29px;padding:4px 12px;border:1px solid var(--dsw-alias-brand-primary);border-radius:7px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-layer-1);font:inherit;font-size:11px;font-weight:650;cursor:pointer;box-shadow:0 3px 10px color-mix(in srgb,var(--dsw-alias-brand-primary) 22%,transparent)}
.tp-start-btn:hover:not(:disabled){filter:brightness(1.06)}.tp-start-btn:disabled{cursor:default;opacity:.62}.tp-start-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.tp-start-error{margin:0 0 9px;padding:7px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 34%,var(--dsw-alias-border-l1));border-radius:7px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 7%,transparent);color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:17px}
.tp-undo-btn{min-height:27px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer}
.tp-undo-btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}.tp-undo-btn:disabled{cursor:default;opacity:.42}
.tp-zoom-controls{display:flex;align-items:center;gap:2px;padding:1px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1)}
.tp-zoom-btn,.tp-zoom-reset{display:grid;place-items:center;min-width:24px;height:23px;margin:0;padding:0 5px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}
.tp-zoom-btn:hover:not(:disabled),.tp-zoom-reset:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.tp-zoom-btn:disabled,.tp-zoom-reset:disabled{cursor:default;opacity:.4}
.tp-zoom-reset{font-size:9px;min-width:34px}.tp-zoom-label{min-width:32px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:10px;font-variant-numeric:tabular-nums}
.tp-diagram-stage{position:relative;min-width:100%;min-height:100%}
.tp-diagram-scroll.tp-panning{cursor:grabbing;user-select:none}.tp-diagram-scroll.tp-panning .tp-diagram-node{cursor:grabbing}
.tp-diagram-node-editing{z-index:9}
.tp-node-editor{position:absolute;z-index:20;top:36px;right:8px;left:8px;box-sizing:border-box;width:auto;height:78px;min-height:54px;padding:5px 7px;border:1px solid var(--dsw-alias-brand-primary);border-radius:7px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12px;line-height:18px;resize:none;outline:none;user-select:text;overflow:auto;box-shadow:0 8px 24px color-mix(in srgb,var(--dsw-alias-label-primary) 16%,transparent)}
.tp-node-editor:focus{box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 20%,transparent)}
.tp-node-save,.tp-node-cancel{min-height:20px;margin:0;padding:1px 5px;border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 32%,var(--dsw-alias-border-l1));border-radius:5px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);color:var(--dsw-alias-brand-primary);font:inherit;font-size:9px;line-height:16px;cursor:pointer}
.tp-node-cancel{min-width:21px;padding:1px 4px;border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}
.tp-node-save:disabled{cursor:default;opacity:.42}
.tp-view-title-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tp-version{padding:1px 7px;border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 25%,var(--dsw-alias-border-l1));border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,transparent);color:var(--dsw-alias-brand-primary);font-size:10px;line-height:17px;letter-spacing:.02em}
.tp-diagram-select-hint{opacity:.82}
.tp-merge-btn{min-height:27px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer}
.tp-merge-btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-brand-primary)}
.tp-merge-btn:disabled{cursor:default;opacity:.42}.tp-merge-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.tp-diagram-node-selected{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 35%,transparent),0 5px 14px color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.tp-diagram-node-merge-target{z-index:4;border-color:var(--dsw-alias-state-success-primary);box-shadow:0 0 0 2px var(--dsw-alias-state-success-primary),0 0 0 6px color-mix(in srgb,var(--dsw-alias-state-success-primary) 16%,transparent),0 10px 24px color-mix(in srgb,var(--dsw-alias-state-success-primary) 18%,transparent)}
.tp-diagram-node-merged{border-color:color-mix(in srgb,var(--tp-accent) 48%,var(--dsw-alias-border-l2));box-shadow:4px 4px 0 -1px var(--dsw-alias-bg-layer-2),4px 4px 0 0 var(--dsw-alias-border-l2),0 5px 14px color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent)}
.tp-group-count{border:1px solid color-mix(in srgb,var(--tp-accent) 34%,transparent);background:color-mix(in srgb,var(--tp-accent) 12%,var(--dsw-alias-bg-layer-2));color:var(--tp-accent)}
.tp-group-split{min-height:21px;margin:0;padding:1px 5px;border:1px solid color-mix(in srgb,var(--tp-accent) 28%,var(--dsw-alias-border-l1));border-radius:5px;background:color-mix(in srgb,var(--tp-accent) 7%,transparent);color:var(--tp-accent);font:inherit;font-size:9px;line-height:16px;cursor:pointer}
.tp-group-split:hover{background:color-mix(in srgb,var(--tp-accent) 15%,transparent)}
.tp-group-split:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
@keyframes tp-node-fade{from{opacity:0}to{opacity:1}}
@keyframes tp-link-draw{to{stroke-dashoffset:0}}
@media(max-width:640px){.tp-header{align-items:flex-start;padding:13px}.tp-header-count{display:none}.tp-body{padding:12px}.tp-header-icon{width:34px;height:34px}.tp-edit{padding:4px;opacity:1}.tp-raw,.tp-note{margin-left:21px}.tp-view-inner{padding:16px 14px 36px}.tp-view-picker{width:100%}.tp-view-picker select{min-width:0;flex:1;max-width:none}.tp-zoom-reset{display:none}}
@media(prefers-reduced-motion:reduce){.tp-chevron{transition:none}.tp-diagram-node,.tp-diagram-node-dragging{transition:none;animation:none}.tp-diagram-link{animation:none;stroke-dasharray:none;stroke-dashoffset:0;transition:none}.tp-chat-notice,.tp-chat-notice-badge{animation:none}}
@media(max-width:640px){.tp-diagram-hint{max-width:230px}.tp-diagram-toolbar{align-items:flex-start}.tp-free-layout{display:none}.tp-diagram-select-hint{display:none}.tp-merge-btn{font-size:10px;padding:3px 6px}}
`;

    return {
      inject: ['slots', 'locale', 'uiConversation', 'remote', 'remote.session'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'tree-plan: dictionaries');
        ctx.effect(() => ctx.uiConversation.events.register(chatTreeDefinition), 'tree-plan: hide Chat tree source');
        ctx.effect(() => ctx.uiConversation.events.register(chatStartDefinition), 'tree-plan: fold start prompt');
        const t = ctx.locale.bind(NS);
        ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
          name: 'conversation.chat.node',
          key: 'goal-tree-notice',
          locale: NS,
        }, GoalTreeChatNotice));
        ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
          name: 'conversation.chat.node',
          key: 'goal-tree-start',
          locale: NS,
        }, GoalTreeStartNotice));
        ctx.slots.inject('conversation.view', () => ctx.slots.register({
          name: 'conversation.view',
          id: 'goal-tree',
          order: 30,
          locale: NS,
          label: () => t('view.tab'),
        }, createGoalTreeView(ctx)));
      },
    };
  },
});
