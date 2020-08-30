import {IReleaseDetailDto} from "../../services/interfaces/IReleaseDetailDto";
import {IReleaseDto} from "../../services/interfaces/IReleaseDto";

export class CommonFormatters {
    public static readonly MISSING_DATA_INDICATOR = "\u2014";
    
    public static getFormattedFormatList(release: IReleaseDto|IReleaseDetailDto): string {
        if (release.formats.length === 0) {
            return CommonFormatters.MISSING_DATA_INDICATOR;
        }
        
        return release.formats.filter((format) => {
            return format.quantity > 0;
        }).map((format) => {
            return format.quantity === 1 ? format.formatName : `${format.quantity} x ${format.formatName}`;
        }).join(", ");
    }
}