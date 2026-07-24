// Minimal Firestore shim (in-memory) for demo mode
// Supports doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query, where, orderBy, getDocs, writeBatch

type DocRef = { collection: string; id: string };

interface Snapshot {
  id: string;
  _data: any;
  exists(): boolean;
  data(): any;
}

const dbStore: Record<string, Record<string, any>> = {}; // collection -> id -> doc

export function doc(_db: unknown, collectionName: string, id: string): DocRef {
  return { collection: collectionName, id };
}

export async function setDoc(ref: DocRef, data: any) {
  if (!dbStore[ref.collection]) dbStore[ref.collection] = {};
  dbStore[ref.collection][ref.id] = data;
}

export async function getDoc(ref: DocRef): Promise<Snapshot> {
  const col = dbStore[ref.collection] || {};
  const exists = ref.id in col;
  const d = exists ? col[ref.id] : null;
  return {
    id: ref.id,
    _data: d,
    exists: () => exists,
    data: () => d,
  } as Snapshot;
}

export async function updateDoc(ref: DocRef, updates: any) {
  if (!dbStore[ref.collection]) dbStore[ref.collection] = {};
  const current = dbStore[ref.collection][ref.id] || {};
  dbStore[ref.collection][ref.id] = { ...current, ...updates };
}

// onSnapshot: for demo simply invoke callback immediately and return noop unsubscribe
export function onSnapshot(refOrQuery: any, cb: (snap: any) => void, errCb?: (err: any) => void) {
  try {
    if (refOrQuery && refOrQuery.collection && refOrQuery.id) {
      // doc ref
      const col = dbStore[refOrQuery.collection] || {};
      const d = col[refOrQuery.id] || null;
      const snap = {
        id: refOrQuery.id,
        exists: () => d !== null,
        data: () => d,
      };
      cb(snap);
    } else if (refOrQuery && refOrQuery._isQuery) {
      const results = runQuery(refOrQuery);
      const querySnapshot = {
        forEach: (fn: (doc: any) => void) => { results.forEach((r: any) => fn(r)); },
      };
      cb(querySnapshot);
    } else {
      cb({});
    }
  } catch (e) {
    errCb?.(e);
  }
  return () => {};
}

export function serverTimestamp() {
  return { toDate: () => new Date() };
}

export function collection(_db: unknown, collectionName: string) {
  return { _collection: collectionName };
}

export function where(field: string, op: string, value: any) {
  return { _where: { field, op, value } };
}

export function orderBy(field: string, dir?: string) {
  return { _orderBy: { field, dir } };
}

export function query(colRef: any, ...constraints: any[]) {
  return { _isQuery: true, collection: colRef._collection, constraints };
}

function runQuery(q: any) {
  const col = dbStore[q.collection] || {};
  const docs = Object.keys(col).map((id) => ({ id, data: () => col[id], ref: { collection: q.collection, id } }));
  // Apply constraints simply (only supports where equality and orderBy)
  let res = docs;
  for (const c of q.constraints) {
    if (c._where) {
      const { field, op, value } = c._where;
      if (op === '==') {
        res = res.filter((d) => d.data()[field] === value);
      }
    }
    if (c._orderBy) {
      const { field, dir } = c._orderBy;
      res = res.sort((a, b) => {
        const va = a.data()[field];
        const vb = b.data()[field];
        if (va === vb) return 0;
        return (va > vb ? 1 : -1) * (dir === 'desc' ? -1 : 1);
      });
    }
  }
  return res;
}

export async function getDocs(q: any) {
  const results = runQuery(q);
  return {
    forEach: (fn: (doc: any) => void) => results.forEach((r: any) => fn({ id: r.id, data: () => r.data(), ref: r.ref })),
  };
}

export function writeBatch(_db: unknown) {
  const ops: Array<() => void> = [];
  return {
    update: (ref: DocRef, data: any) => { ops.push(() => updateDoc(ref, data)); },
    commit: async () => { for (const op of ops) await op(); },
  };
}

// Utility to clear DB (useful for tests)
export function __clearDemoDB() {
  for (const k of Object.keys(dbStore)) delete dbStore[k];
}

export default { doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp, collection, where, orderBy, query, getDocs, writeBatch, __clearDemoDB };
