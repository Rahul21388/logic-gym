// app/slitherlink/slitherlinkLogic.ts

export const SIZE = 5;

export type EdgeKey = string;

export const CLUES: (number | null)[][] = [
  [null, 3, null, 2, null],
  [2, null, null, null, 2],
  [null, null, 3, null, null],
  [2, null, null, null, 2],
  [null, 2, null, 3, null],
];

export function edgeKey(r: number, c: number, dir: 'h' | 'v') {
  return `${r},${c},${dir}`;
}

export function toggleEdge(
  edges: Set<EdgeKey>,
  key: EdgeKey
): Set<EdgeKey> {
  const next = new Set(edges);
  next.has(key) ? next.delete(key) : next.add(key);
  return next;
}

export function countEdgesAroundCell(
  edges: Set<EdgeKey>,
  r: number,
  c: number
) {
  let count = 0;
  if (edges.has(edgeKey(r, c, 'h'))) count++;
  if (edges.has(edgeKey(r + 1, c, 'h'))) count++;
  if (edges.has(edgeKey(r, c, 'v'))) count++;
  if (edges.has(edgeKey(r, c + 1, 'v'))) count++;
  return count;
}

export function isSolved(edges: Set<EdgeKey>) {
  // 1️⃣ All clues satisfied
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const clue = CLUES[r][c];
      if (clue === null) continue;
      if (countEdgesAroundCell(edges, r, c) !== clue) {
        return false;
      }
    }
  }

  // 2️⃣ Each vertex has degree 2
  const degree = new Map<string, number>();

  edges.forEach((key) => {
    const [r, c, dir] = key.split(',');
    const r0 = Number(r);
    const c0 = Number(c);

    const v1 = `${r0},${c0}`;
    const v2 =
      dir === 'h'
        ? `${r0},${c0 + 1}`
        : `${r0 + 1},${c0}`;

    degree.set(v1, (degree.get(v1) ?? 0) + 1);
    degree.set(v2, (degree.get(v2) ?? 0) + 1);
  });

  for (const d of degree.values()) {
    if (d !== 2) return false;
  }

  return edges.size > 0;
}