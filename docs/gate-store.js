// FlipBridge gate log — localStorage backed (Pages demo)
const FB_GATE_KEY = 'flipbridge.gate.v1';

function fbLoad() {
  try {
    return JSON.parse(localStorage.getItem(FB_GATE_KEY)) || { asin_gates: {}, brand_gates: {}, category_gates: {}, gate_events: [] };
  } catch {
    return { asin_gates: {}, brand_gates: {}, category_gates: {}, gate_events: [] };
  }
}

function fbSave(db) {
  localStorage.setItem(FB_GATE_KEY, JSON.stringify(db));
}

function fbNormBrand(b) {
  return (b || '').trim().toLowerCase();
}

function fbNormCat(c) {
  return (c || '').trim().toLowerCase();
}

function fbPushEvent(db, event) {
  db.gate_events.unshift({ ...event, at: new Date().toISOString() });
  db.gate_events = db.gate_events.slice(0, 500);
}

/** Live/manual ASIN check — updates brand/category memory */
function fbRecordAsin({ asin, brand, category, status, source = 'manual' }) {
  const db = fbLoad();
  const a = (asin || '').trim().toUpperCase();
  if (!a) throw new Error('ASIN required');
  const brandKey = fbNormBrand(brand);
  const catKey = fbNormCat(category);
  const now = new Date().toISOString();

  db.asin_gates[a] = {
    asin: a,
    brand: brand || '',
    category: category || '',
    status, // ungated | gated | approval_needed | unknown
    source, // live_check | manual
    confidence: 'verified',
    checkedAt: now,
  };

  fbPushEvent(db, { type: 'asin_check', asin: a, brand: brand || '', category: category || '', status, source });

  if (brandKey) {
    const bg = db.brand_gates[brandKey] || { brand: brand || brandKey, status: 'unknown', evidence: [], checkedAt: now };
    bg.evidence = Array.from(new Set([...(bg.evidence || []), a])).slice(-20);
    bg.checkedAt = now;
    if (status === 'gated') {
      bg.status = 'gated';
      bg.mixed = true;
    } else if (status === 'ungated') {
      if (bg.status !== 'gated') bg.status = 'ungated';
    } else if (status === 'approval_needed') {
      if (bg.status === 'unknown') bg.status = 'approval_needed';
    }
    db.brand_gates[brandKey] = bg;
    fbPushEvent(db, { type: 'brand_update', brand: brand || brandKey, status: bg.status, evidence: bg.evidence });
  }

  if (catKey && status === 'ungated') {
    const cg = db.category_gates[catKey] || { category: category || catKey, status: 'unknown', evidence: [], checkedAt: now };
    cg.evidence = Array.from(new Set([...(cg.evidence || []), a])).slice(-20);
    if (cg.status !== 'gated') cg.status = 'ungated';
    cg.checkedAt = now;
    db.category_gates[catKey] = cg;
  }

  fbSave(db);
  return db;
}

/** Resolve display status for an ASIN (verified wins; else brand/category inference) */
function fbResolve({ asin, brand, category }) {
  const db = fbLoad();
  const a = (asin || '').trim().toUpperCase();
  if (a && db.asin_gates[a]) {
    return { ...db.asin_gates[a], confidence: 'verified', inferredFrom: null };
  }
  const brandKey = fbNormBrand(brand);
  if (brandKey && db.brand_gates[brandKey] && db.brand_gates[brandKey].status === 'ungated') {
    return {
      asin: a,
      brand: brand || '',
      category: category || '',
      status: 'ungated',
      confidence: 'inferred',
      inferredFrom: 'brand',
      source: 'inferred',
      checkedAt: db.brand_gates[brandKey].checkedAt,
    };
  }
  const catKey = fbNormCat(category);
  if (catKey && db.category_gates[catKey] && db.category_gates[catKey].status === 'ungated') {
    return {
      asin: a,
      brand: brand || '',
      category: category || '',
      status: 'ungated',
      confidence: 'inferred',
      inferredFrom: 'category',
      source: 'inferred',
      checkedAt: db.category_gates[catKey].checkedAt,
    };
  }
  return { asin: a, brand: brand || '', category: category || '', status: 'unknown', confidence: 'none', source: null, checkedAt: null };
}

function fbClearAll() {
  localStorage.removeItem(FB_GATE_KEY);
}
