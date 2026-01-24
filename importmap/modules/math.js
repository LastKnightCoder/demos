/**
 * 数学工具模块
 */

export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
}

export function sum(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}

export function average(...numbers) {
    if (numbers.length === 0) return 0;
    return sum(...numbers) / numbers.length;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}
