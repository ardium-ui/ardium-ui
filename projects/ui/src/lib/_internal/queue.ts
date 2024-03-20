


interface IQueue {
    readonly length: number;
}

export class Queue<T = unknown> implements IQueue {
    private head?: QueueItem<T>;
    private tail?: QueueItem<T>;

    push(item: T): void {
        if (!this.tail) this.pushFront(item);
        this.tail!.next = new QueueItem(item);
        this.tail = this.tail!.next!;
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
    peek(): T | undefined {
        return this.head?.value;
    }
    clear(): void {
        this.head = undefined;
        this.tail = undefined;
    }
    get length(): number {
        let length = 0;
        let currentNode = this.head;
        while (currentNode) {
            length++;
            currentNode = currentNode.next;
        }
        return length;
    }
    isEmpty(): boolean {
        return !this.head;
    }
}

export class QueueItem<T> {
    constructor(public value: T, public next?: QueueItem<T>) {  }
}