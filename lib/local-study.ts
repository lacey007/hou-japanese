export type LocalProgress = { lessonId: string; position: number; percent: number; completed: boolean; updatedAt: string };
export type LocalWord = { id: number; lessonId: string; surface: string; reading: string; meaning: string; createdAt: string };

const PROGRESS_KEY = "hibiki-progress-v1";
const WORDS_KEY = "hibiki-words-v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

export const getProgress = () => read<LocalProgress[]>(PROGRESS_KEY, []).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
export const getLessonProgress = (lessonId: string) => getProgress().find(item => item.lessonId === lessonId) ?? null;
export function saveProgress(item: Omit<LocalProgress, "updatedAt">) {
  const current = getProgress();
  const previous = current.find(value => value.lessonId === item.lessonId);
  const next = { ...item, percent: Math.max(previous?.percent ?? 0, item.percent), updatedAt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([next, ...current.filter(value => value.lessonId !== item.lessonId)]));
}

export const getWords = () => read<LocalWord[]>(WORDS_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export function saveWord(word: Omit<LocalWord, "id" | "createdAt">) {
  const current = getWords();
  if (current.some(item => item.lessonId === word.lessonId && item.surface === word.surface)) return;
  localStorage.setItem(WORDS_KEY, JSON.stringify([{ ...word, id: Date.now(), createdAt: new Date().toISOString() }, ...current]));
}
export function removeWord(id: number) { localStorage.setItem(WORDS_KEY, JSON.stringify(getWords().filter(word => word.id !== id))); }
