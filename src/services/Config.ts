export class Config {
    private serviceHost: string;

    public constructor() {
        this.serviceHost = "%%BACKEND_SERVICE_HOST%%";
    }
    
    public getServiceHost(): string {
        return this.serviceHost;
    }
}