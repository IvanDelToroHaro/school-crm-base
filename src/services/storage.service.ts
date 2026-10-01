export class StorageService<T> {
  constructor(private readonly key: string) {}

  public async getAll(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(this.key);
        resolve(data ? (JSON.parse(data) as T[]) : []);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async saveAll(items: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(this.key, JSON.stringify(items));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public async add(item: T): Promise<void> {
    const items = await this.getAll();
    items.push(item);
    await this.saveAll(items);
  }
}