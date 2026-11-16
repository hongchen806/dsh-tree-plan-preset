// Pure parser for committed assistant messages. Kept separate from the Host
// projection so its behavior can be tested without loading the Harness runtime.
function assistantText(event) {
  if (event?.type !== 'assistant/message') return undefined;
  const content = event.data?.message?.content;
  if (!Array.isArray(content)) return undefined;
  return content
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
    .join('\n');
}

function field(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\*\\*${escaped}\\*\\*[：:]\\s*([^\\r\\n]+)`).exec(text)?.[1]?.trim();
}

export function goalTreeMessageId(event) {
  if (event?.type !== 'assistant/message') return undefined;
  const messageId = event.data?.message?.id;
  return typeof messageId === 'string' && messageId !== ''
    ? messageId
    : `goal-tree-${event.seq}`;
}

export function parseGoalTreeEvent(event) {
  const text = assistantText(event);
  if (text === undefined) return undefined;
  const fence = /```(goal-tree|text)\s*\r?\n([\s\S]*?)```/i.exec(text);
  if (fence === null) return undefined;
  // The text-fence fallback keeps trees emitted by preset 1.0/1.1 readable,
  // but requires the explicit heading to avoid claiming ordinary code blocks.
  if (fence[1].toLowerCase() === 'text' && !/##\s*需求[—-]目标树/.test(text)) return undefined;
  const lines = fence[2].split(/\r?\n/);
  const root = { id: 'G', text: '', children: [] };
  const stack = [];
  let foundRoot = false;
  for (const line of lines) {
    const match = /^([│\s]*)(?:[├└]─\s*)?([GDSCPVQ](?:\d+)?)\s+(.+?)\s*$/.exec(line);
    if (match === null) continue;
    const [, prefix, id, label] = match;
    if (id === 'G') {
      if (foundRoot) return undefined;
      foundRoot = true;
      root.text = label.replace(/^目标\s*[：:]\s*/, '').trim();
      stack[0] = root;
      continue;
    }
    if (!foundRoot) continue;
    const depth = 1 + Math.floor(prefix.length / 3);
    const parent = stack[depth - 1];
    if (parent === undefined) continue;
    const node = { id, text: label.trim(), children: [] };
    parent.children.push(node);
    stack.length = depth;
    stack[depth] = node;
  }
  if (!foundRoot || root.text === '' || root.children.length === 0) return undefined;
  return {
    id: goalTreeMessageId(event),
    turn: Number.isSafeInteger(event.data?.turn) ? event.data.turn : 0,
    step: Number.isSafeInteger(event.data?.step) ? event.data.step : 0,
    seq: Number.isSafeInteger(event.seq) ? event.seq : 0,
    workItem: field(text, '工作项') ?? field(text, 'Work item') ?? '',
    goal: field(text, '目标') ?? field(text, 'Goal') ?? root.text,
    status: field(text, '状态') ?? field(text, 'Status') ?? '',
    root,
    raw: fence[2].trim(),
  };
}
