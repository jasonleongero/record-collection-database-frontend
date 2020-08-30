import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from '@angular/router';

import * as sprintf from "sprintf";
import * as moment from "moment";

import {ArtistService} from "../services/ArtistService";
import {ReleaseService} from "../services/ReleaseService";
import {IReleaseDetailDto} from "../services/interfaces/IReleaseDetailDto";
import {CommonFormatters} from "./lib/CommonFormatters";

@Component({
    template: require("./templates/release-detail-component.html"),
    styles: [require("./styles/release-detail-component.scss")]
})
export class ReleaseDetailComponent implements OnInit {
    public loading: boolean = true;
    public error: boolean = false;
    
    private static readonly DURATION_FORMAT = "%s'%s\"";
    private static readonly DATE_YEAR_ONLY_FORMAT = "YYYY";
    private static readonly DATE_YEAR_AND_MONTH_FORMAT = "MMMM YYYY";
    private static readonly FULL_DATE_FORMAT = "MMMM Do, YYYY";
    
    public releaseDetail: IReleaseDetailDto = {} as any;
    public artistName: string;
    public formats: string;

    public countryName: string;
    public catalogNumber: string;
    public recordLabelName: string;
    
    public formattedTracklisting: FormattedTrack[];
    public formattedReleaseDate: string;
    
    public constructor(
        @Inject(ActivatedRoute) private route: ActivatedRoute,
        @Inject(ArtistService) private artistService: ArtistService,
        @Inject(ReleaseService) private releaseService: ReleaseService
    ) {}
    
    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            const artistId: number = params.artistId;
            const masterReleaseId: number = params.masterReleaseId;
            const releaseId: number = params.releaseId;
            
            Promise.all([
                this.artistService.getArtist(artistId),
                this.releaseService.getRelease(releaseId)
            ]).then(([artistDetailDto, releaseDetailDto]) => {
                this.artistName = artistDetailDto.name;
                
                this.releaseDetail = releaseDetailDto;
                
                this.countryName = releaseDetailDto.countryName || CommonFormatters.MISSING_DATA_INDICATOR;
                this.catalogNumber = releaseDetailDto.catalogNumber || CommonFormatters.MISSING_DATA_INDICATOR;
                this.recordLabelName = releaseDetailDto.recordLabelName || CommonFormatters.MISSING_DATA_INDICATOR;
                
                this.formats = CommonFormatters.getFormattedFormatList(releaseDetailDto);
                this.formattedTracklisting = ReleaseDetailComponent.getFormattedTracklisting(releaseDetailDto);
                this.formattedReleaseDate = ReleaseDetailComponent.getFormattedReleaseDate(releaseDetailDto);
                
                this.loading = false;
            }).catch(() => {                
                this.error = true;
            });
        });
    }
    
    private static getFormattedTracklisting(releaseDetailDto: IReleaseDetailDto): FormattedTrack[] {
        return releaseDetailDto.tracks.map((track: {title: string, trackNumber: string, duration: number}) => {
            const minutes = Math.floor(track.duration / 60);
            const seconds = sprintf("%02s", track.duration % 60);
            const formattedDuration = sprintf(ReleaseDetailComponent.DURATION_FORMAT, minutes, seconds);
            
            return {
                title: track.title,
                trackNumber: track.trackNumber,
                duration: formattedDuration
            };
        });
    }
    
    private static getFormattedReleaseDate(releaseDetailDto: IReleaseDetailDto): string {
        const releaseYear: number = releaseDetailDto.releaseYear;
        const releaseMonth: number = releaseDetailDto.releaseMonth;
        const releaseDay: number = releaseDetailDto.releaseDay;
            
        if (releaseYear !== null && releaseMonth === null && releaseDay === null) {
            return moment(releaseYear.toString()).utc().format(ReleaseDetailComponent.DATE_YEAR_ONLY_FORMAT);
        } else if (releaseYear !== null && releaseMonth !== null && releaseDay === null) {
            return moment(`${releaseYear}-${releaseMonth}-01`).utc().format(ReleaseDetailComponent.DATE_YEAR_AND_MONTH_FORMAT);
        } else if (releaseYear !== null && releaseMonth !== null && releaseDay !== null) {
            return moment(`${releaseYear}-${releaseMonth}-${releaseDay}`).utc().format(ReleaseDetailComponent.FULL_DATE_FORMAT);
        }
        
        return CommonFormatters.MISSING_DATA_INDICATOR;
    }
}

interface FormattedTrack {
    title: string;
    duration: string;
}