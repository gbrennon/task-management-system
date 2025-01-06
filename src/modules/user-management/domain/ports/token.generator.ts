export interface TokenGenerator {
  generate(id: string, companyId: string): string;
}
