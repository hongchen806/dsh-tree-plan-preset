import { goalTreeMessageId, parseGoalTreeEvent } from './tree-parser.js';

function record(value, path) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  return value;
}
function string(value, path) {
  if (typeof value !== 'string') throw new TypeError(`${path} must be a string`);
}
function number(value, path) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${path} must be a finite number`);
}
function validateNode(node, path, depth = 0) {
  if (depth > 64) throw new TypeError(`${path} exceeds the maximum tree depth`);
  record(node, path);
  string(node.id, `${path}.id`);
  string(node.text, `${path}.text`);
  if (!Array.isArray(node.children)) throw new TypeError(`${path}.children must be an array`);
  node.children.forEach((child, index) => validateNode(child, `${path}.children[${index}]`, depth + 1));
}
function validateTree(tree, path) {
  record(tree, path);
  for (const key of ['id', 'workItem', 'goal', 'status', 'raw']) string(tree[key], `${path}.${key}`);
  for (const key of ['turn', 'step', 'seq']) number(tree[key], `${path}.${key}`);
  validateNode(tree.root, `${path}.root`);
}

// The projection registry consumes the Standard Schema parse contract. Keeping
// this small validator in-package avoids resolving a runtime package through
// the real path of a locally linked bundle.
const projectionSchema = {
  parse(value) {
    record(value, 'goalTrees');
    if (!Array.isArray(value.trees)) throw new TypeError('goalTrees.trees must be an array');
    value.trees.forEach((tree, index) => validateTree(tree, `goalTrees.trees[${index}]`));
    return value;
  },
};

export const inject = ['sessionProjections'];

export async function apply(ctx) {
  await ctx.sessionProjections.register({
    key: 'goalTrees',
    stateSchema: projectionSchema,
    stateVersion: 1,
    init: () => ({ trees: [] }),
    apply(state, event) {
      if (event?.type !== 'assistant/message') return state;
      const id = goalTreeMessageId(event);
      if (id === undefined) return state;
      const tree = parseGoalTreeEvent(event);
      const index = state.trees.findIndex(item => item.id === id);
      if (tree === undefined && index < 0) return state;
      const trees = state.trees.slice();
      if (tree === undefined) {
        trees.splice(index, 1);
      } else if (index < 0) {
        trees.push(tree);
        trees.sort((left, right) => left.seq - right.seq);
      } else {
        trees[index] = tree;
      }
      return { trees };
    },
    wire: {
      viewSchema: projectionSchema,
      view: state => state,
      summary: false,
    },
  });
}
