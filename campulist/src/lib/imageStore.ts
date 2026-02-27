// IndexedDB 기반 이미지 저장소
// localStorage 5MB 한계를 넘어 수백 MB까지 저장 가능

const DB_NAME = 'campulist_images';
const DB_VERSION = 1;
const STORE_NAME = 'post_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePostImages(postId: string, images: string[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(images, postId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadPostImages(postId: string): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(postId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePostImages(postId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(postId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// localStorage → IndexedDB 마이그레이션 (1회 실행)
export async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return;
  const MIGRATED_KEY = 'campulist_images_migrated';
  if (localStorage.getItem(MIGRATED_KEY)) return;

  try {
    const saved = localStorage.getItem('campulist_post_images');
    if (saved) {
      const allImages: Record<string, string[]> = JSON.parse(saved);
      const entries = Object.entries(allImages);
      if (entries.length > 0) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        for (const [postId, images] of entries) {
          store.put(images, postId);
        }
        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
        localStorage.removeItem('campulist_post_images');
      }
    }
  } catch { /* 마이그레이션 실패는 무시 */ }

  localStorage.setItem(MIGRATED_KEY, '1');
}
