export class Queue<T = unknown> {
    private head?: QueueItem<T>;
    private tail?: QueueItem<T>;

    push(item: T): void {
        if (!this.tail) this.pushFront(item);
        this.tail!.next = new QueueItem(item);
    }
    pushFront(item: T): void {
        this.head = new QueueItem(item, this.head);
        if (!this.tail) this.tail = this.head;
    }
    pop(): T | undefined {
        const head = this.head;
        if (!head) return;
        this.head = head.next;
        return head.value;
    }
    clear(): void {
        this.head = undefined;
        this.tail = undefined;
    }
    isEmpty(): boolean {
        return !this.head;
    }
}

export class QueueItem<T> {
    constructor(public value: T, public next?: QueueItem<T>) {  }
}