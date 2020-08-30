export interface IReleaseDetailDto {
    title: string;
    releaseId: number;
    imageUrl: string;
    catalogNumber: string;
    formats: Array<{
        formatName: string;
        quantity: number;
        notes: string;
    }>;
    tracks: Array<{
        title: string;
        duration: number;
    }>;
    releaseMonth: number;
    releaseDay: number;
    releaseYear: number;
    recordLabelName: string;
    countryName: string;
}