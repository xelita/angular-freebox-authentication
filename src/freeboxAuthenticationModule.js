/**
 * Angular Module relying on Freebox OS API.
 * http://dev.freebox.fr/sdk/os/
 */
var freeboxAuthenticationModule = angular.module('freeboxAuthenticationModule', ['fbCommonModule']);

// Constants

/**
 * Constants service used in the whole module.
 */
freeboxAuthenticationModule.constant('freeboxAuthenticationConstants', {
    urls: {
        authorize: '/login/authorize',
        login: '/login/login',
        session: '/login/session',
        logout: '/login/logout'
    },
    authorizationStatus: {
        unknown: 'unknown',
        pending: 'pending',
        timeout: 'timeout',
        granted: 'granted',
        denied: 'denied'
    },
    tracking: {
        waitingTimeMillis: 2000
    }
});

// Services

/**
 * Main service of the module.
 */
freeboxAuthenticationModule.factory('freeboxAuthenticationService', ['$log', '$http', '$q', 'freeboxAuthenticationConstants', 'fbCommonService', 'fbCommonConstants', function ($log, $http, $q, freeboxAuthenticationConstants, fbCommonService, fbCommonConstants) {

    return {

        /**
         * Request an authentication token to the FB.
         * @see http://dev.freebox.fr/sdk/os/login/#request-authorization
         *
         * @param tokenRequest some information needed by the FB to generate the authentication token
         * @return HttpPromise
         */
        requestAuthorization: function (tokenRequest) {
            $log.debug('freeboxAuthenticationService.requestAuthorization.');

            // Deferred result
            var deferred = $q.defer();

            // Request url (user must be connected to the local network)
            fbCommonService.apiRequestUrl(freeboxAuthenticationConstants.urls.authorize).then(function (requestUrl) {

                // Calling FB
                $http({method: 'POST', url: requestUrl, data: tokenRequest}).then(function (response) {
                    deferred.resolve(response);
                });
            });

            // Returning promise
            return deferred.promise;
        },

        /**
         * Track the authorization progress of an application token.
         * @see http://dev.freebox.fr/sdk/os/login/#track-authorization-progress
         *
         * @param trackingId the identifier used to track the authorization progress
         * @return HttpPromise
         */
        trackAuthorizationProgress: function (trackingId) {
            $log.debug('freeboxAuthenticationService.trackAuthorizationProgress.');

            // Deferred result
            var deferred = $q.defer();

            // Request url (user must be connected to the local network)
            fbCommonService.apiRequestUrl(freeboxAuthenticationConstants.urls.authorize + '/' + trackingId).then(function (requestUrl) {

                // Calling FB
                $http({method: 'GET', url: requestUrl}).then(function (response) {
                    deferred.resolve(response);
                });
            });

            // Returning promise
            return deferred.promise;
        },

        /**
         * Poll the authorization progress until a decision is made upon the application token.
         * @see http://dev.freebox.fr/sdk/os/login/#track-authorization-progress
         *
         * @param trackingId the tracker identifier
         * @param appToken the token to validate
         * @return HttpPromise
         */
        trackAuthorizationProgressUntil: function (trackingId, appToken) {
            $log.debug('freeboxAuthenticationService.trackAuthorizationProgressUntil.');

            // Pointer to this object
            var _this = this;

            // Deferred object
            var deferred = $q.defer();

            // Polling function
            var pollingFunction = function (deferred) {
                // Polling waiting time
                var waitingTimeMs = freeboxAuthenticationConstants.tracking.waitingTimeMillis || 5000;

                // Start tracking
                _this.trackAuthorizationProgress(trackingId).then(function (response) {
                    var status = response.data.result.status;
                    switch (status) {
                        case 'granted':
                            $log.debug(status);
                            deferred.resolve(appToken);
                            break;
                        case 'denied':
                            $log.debug(status);
                            deferred.reject(status);
                            break;
                        case 'timeout':
                            $log.debug(status);
                            deferred.reject(status);
                            break;
                        default :
                            $log.debug(status);

                            deferred.notify(status);

                            sleepMs(waitingTimeMs);
                            pollingFunction(deferred);

                            break;
                    }
                });
            };

            // Start the polling function
            pollingFunction(deferred);

            // Return the promise
            return deferred.promise;
        },

        /**
         * http://dev.freebox.fr/sdk/os/login/#getting-the-challenge-value
         * eg. GET http://mafreebox.freebox.fr/api/v3/login
         *     GET http://[url]/api/v3/login
         */
        login: function (url) {
            $log.debug('freeboxAuthenticationService.login.');

            // Request url
            var requestUrl = fbCommonService.apiRequestUrl(freeboxAuthenticationConstants.urls.login, url);
            $log.debug('requestUrl is: ' + requestUrl);

            // Return promise
            return $http.get(requestUrl);
        },

        /**
         * http://dev.freebox.fr/sdk/os/login/#obtaining-a-session-token
         * eg. POST http://mafreebox.freebox.fr/api/v3/login/session
         *     POST http://[url]/api/v3/login/session
         */
        session: function (url, appId, password) {
            $log.debug('freeboxAuthenticationService.session.');

            // Request url
            var requestUrl = fbCommonService.apiRequestUrl(freeboxAuthenticationConstants.urls.session, url);
            $log.debug('requestUrl is: ' + requestUrl);

            // Return promise
            return $http.post(requestUrl, {app_id: appId, password: password});
        },

        /**
         * http://dev.freebox.fr/sdk/os/login/#closing-the-current-session
         * eg. POST http://mafreebox.freebox.fr/api/v3/login/logout
         *     POST http://[url]/api/v3/login/logout
         */
        logout: function (url) {
            $log.debug('freeboxAuthenticationService.logout.');

            // Request url
            var requestUrl = fbCommonService.apiRequestUrl(freeboxAuthenticationConstants.urls.logout, url);
            $log.debug('requestUrl is: ' + requestUrl);

            // Return promise
            return $http.post(requestUrl);
        },

        // CALL

        /**
         * http://dev.freebox.fr/sdk/os/login/#make-an-authenticated-call-to-the-api
         * eg. GET http://mafreebox.freebox.fr/api/v3/login/logout
         *     GET http://[url]/api/v3/[apiUrl]
         */
        callAPI: function (url, apiUrl, sessionToken) {
            $log.debug('freeboxAuthenticationService.callAPI.');

            // Request url
            var requestUrl = fbCommonService.apiRequestUrl(apiUrl, url);
            $log.debug('requestUrl is: ' + requestUrl);

            // Return promise
            return $http.get(requestUrl, {headers: {'X-Fbx-App-Auth': sessionToken}});
        }
    };
}]);