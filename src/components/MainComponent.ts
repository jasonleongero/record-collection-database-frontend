import {Component, OnInit, Inject} from "@angular/core";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Router, NavigationEnd} from '@angular/router';
import {BreadCrumbService, BreadCrumb} from "../services/BreadCrumbService";

@Component({
    selector: "main-app",
    template: require("./templates/main-component.html"),
    styles: [require("./styles/main-component.scss")]
})
export class MainComponent implements OnInit {
    public breadCrumbs: BreadCrumb[] = [];
    public hierarchicalView: boolean;
    public flatView: boolean;

    public constructor(
        @Inject(Router) private router: Router,
        @Inject(BreadCrumbService) private breadCrumbService: BreadCrumbService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setViewRadioButton();
            
                this.breadCrumbService.getBreadCrumbs(router).then((results) => {
                    this.breadCrumbs = results;
                }).catch((error) => {});
            }
        });
    }
    
    public ngOnInit(): void {}
    
    public setViewRadioButton(): void {
        let currentRoute: string = this.router.url;
    
        if (/^\/hierarchical-view/.test(currentRoute)) {
            this.hierarchicalView = true;
        } else if (/^\/flat-view/.test(currentRoute)) {
            this.flatView = true;
        }
    }
    
    public viewingModeChange(mode: String): void {
        switch (mode) {
            case "Hierarchical":
                this.router.navigateByUrl("/hierarchical-view");
                break;
            case "Flat":
                this.router.navigateByUrl("/flat-view");
                break;
        }
    }
}
