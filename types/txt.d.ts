/**
 * types/txt.d.ts
 * Type declaration agar TypeScript mengenali import file .txt sebagai string
 */
declare module "*.txt" {
  const content: string;
  export default content;
}
