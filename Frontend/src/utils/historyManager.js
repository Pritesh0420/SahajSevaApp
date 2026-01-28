const HISTORY_KEY = 'sahajseva_history';
const MAX_HISTORY_ITEMS = 50;

export function addSchemeToHistory(scheme) {
  const history = getHistory();
  const item = {
    id: `scheme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'scheme',
    schemeName: scheme.name,
    timestamp: Date.now(),
  };
  
  history.unshift(item);
  
  // Keep only the most recent items
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }
  
  saveHistory(history);
  return item;
}

export function addFormToHistory(formName, fileName) {
  const history = getHistory();
  const item = {
    id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'form',
    formName,
    fileName,
    timestamp: Date.now(),
  };
  
  history.unshift(item);
  
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }
  
  saveHistory(history);
  return item;
}

export function getHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
}
