export interface IReleaseDto {
    releaseId: number;
    title: string;
    imageUrl: string;
    catalogNumber: string;
    formats: Array<{
        formatName: string;
        quantity: number;
        notes: string;
    }>
}
