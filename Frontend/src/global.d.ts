// src/global.d.ts

export {}; // Dòng này quan trọng để biến file thành module

declare global {
  interface Window {
    electronAPI: {
      // Nhóm File System
      readDirectory: (dirPath: string) => Promise<{
        success: boolean;
        data?: unknown;
        error?: string;
      }>;
      createFolder: (fullPath: string) => Promise<unknown>;
      createFile: (fullPath: string, content: string) => Promise<unknown>;
      deleteItem: (fullPath: string) => Promise<unknown>;
      readFile: (fullPath: string) => Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;
      selectFolder: () => Promise<{ canceled: boolean; path?: string }>;

      // Nhóm Window Control & IPC
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (channel: string, data: any) => void;
      // Nếu bạn có dùng ping hay receive thì thêm vào đây luôn
      ping?: () => Promise<string>;
      receive?: (channel: string, func: (...args: unknown[]) => void) => void;
    };
  }
}
