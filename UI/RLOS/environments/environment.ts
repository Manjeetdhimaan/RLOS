// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockingEnabled: true,

  //  DEV ENVIRONMENT
   apiURL: "http://192.168.152.137:8180/rlos",
  DASHBOARD_URL: "http://192.168.153.47/jmmb/dashboard",

  //  UAT ENVIRONMENT
  //apiURL: "http://192.168.153.141:8080/rlos", 
  //DASHBOARD_URL: "http://192.168.153.47/jmmb/dashboard",

  //  PROD ENVIRONMENT
  //apiURL: "/rlos", 
  //DASHBOARD_URL: "/dashboard",

  useContextUrl: false,
  version: '1.0.0'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
