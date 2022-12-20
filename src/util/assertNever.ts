export default function assertNever(value: never, message: string): never {
    throw new Error(message);
}
