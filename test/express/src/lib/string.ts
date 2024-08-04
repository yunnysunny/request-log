declare global {
    interface String {
        firstUpperCase(): string;
    }
}

String.prototype.firstUpperCase = function () {
    return this[0].toUpperCase() + this.slice(1);
}