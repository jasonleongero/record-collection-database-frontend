import {Component, OnInit, Inject} from "@angular/core";

import {ArtistService} from "../services/ArtistService";

@Component({
    template: require("./templates/artists-component.html"),
    styles: [require("./styles/artists-component.scss")]
})
export class ArtistsComponent implements OnInit {
    public loading: boolean = true;
    public error: boolean = false;

    public artists: any;
    
    public constructor(@Inject(ArtistService) private artistService: ArtistService) {}
    
    public ngOnInit(): void {
        this.artistService.getArtists().then(data => {
            this.artists = data;
            
            this.loading = false;
        }).catch(() => {
            this.error = true;
        });
    }   
}
