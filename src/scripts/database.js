const dbName = 'storyAppDB';
const dbVersion = 1;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stories store
      if (!db.objectStoreNames.contains('stories')) {
        const storiesStore = db.createObjectStore('stories', { keyPath: 'id' });
        storiesStore.createIndex('title', 'title', { unique: false });
        storiesStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

const addStory = async (story) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readwrite');
    const store = transaction.objectStore('stories');
    const request = store.add(story);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const updateStory = async (story) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readwrite');
    const store = transaction.objectStore('stories');
    const request = store.put(story);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAllStories = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readonly');
    const store = transaction.objectStore('stories');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteStory = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readwrite');
    const store = transaction.objectStore('stories');
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export { initDB, addStory, updateStory, getAllStories, deleteStory }; 