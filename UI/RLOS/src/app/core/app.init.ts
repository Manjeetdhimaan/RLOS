import { environment } from '../../../environments/environment';
import { Constants } from './constants/app.constants';
import { AppConfigService } from './services';

export function onAppInit(appConfig: AppConfigService): () => Promise<any> {
    return (): Promise<void> => {
        return new Promise((resolve, reject) => {
            //appConfig.loadApplicationEnvConfig().subscribe(config => {

            if (environment.useContextUrl) {
                let baseUrl = window.location.href.split('#')[0];
                environment.apiURL = (baseUrl[baseUrl.length - 1] === '/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
            } else {
                environment.apiURL = environment.apiURL; //config.apiURL
            }

            //   }, error => {
            //   });

            resolve();
        });
    };
}