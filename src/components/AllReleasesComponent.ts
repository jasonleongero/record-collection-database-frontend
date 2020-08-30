import {Component, OnInit, Inject} from "@angular/core";

import {ReleaseService} from "../services/ReleaseService";

@Component({
    template: require("./templates/all-releases-component.html"),
    styles: [require("./styles/all-releases-component.scss")]
})
export class AllReleasesComponent implements OnInit {
    public loading: boolean = true;
    public error: boolean = false;
    public releases: any;
    
    public constructor(@Inject(ReleaseService) private releaseService: ReleaseService) {}
    
    public ngOnInit(): void {
        this.releaseService.getAllReleases().then((data) => {
            this.releases = data;
          
            this.loading = false;
        }).catch(() => {
            this.error = true;
        })
    }   
}
