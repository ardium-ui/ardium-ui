class Queue<T = unknown> {
    private readonly elements: T[] = [];

    push(item: T): void {
        this.elements.push(item);
    }
    pushFront(item: T): void {
        this.elements.unshift(item);
    }
    next(): T | undefined {
        return this.elements.splice(0, 1)[0];
    }
    clear(): void {
        this.elements.length = 0;
    }
    isEmpty(): boolean {
        return this.elements.length === 0;
    }
}
