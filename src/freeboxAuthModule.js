/**
 * AngularJS authentication module for Freebox OS.
 * http://dev.freebox.fr/sdk/os/
 *
 * @author xelita (https://github.com/xelita)
 */
var fbAuthModule = angular.module('fbAuthModule', ['fbCommonModule', 'basicAuthModule']);

// Constants

/**
 * Constants service used in the whole module.
 */
fbAuthModule.constant('fbAuthConstants', {
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
        waitingTimeMillis: 5000
    }
});

// Services

/**
 * Main service of the module.
 */
fbAuthModule.factory('fbAuthService', ['$log', '$http', '$q', 'fbAuthConstants', 'fbCommonService', 'fbCommonConstants', function ($log, $http, $q, fbAuthConstants, fbCommonService, fbCommonConstants) {

    return {

        /**
         * Request an authentication token to the FB.
         * This operation can only be performed on the local network.
         * @see http://dev.freebox.fr/sdk/os/login/#request-authorization
         *
         * @param tokenRequest some information needed by the FB to generate the authentication token
         * @return HttpPromise
         */
        requestAuthorization: function (tokenRequest) {
            $log.debug('fbAuthService.requestAuthorization.');

            // Deferred result
            var deferred = $q.defer();

            // Request url (user must be connected to the local network)
            fbCommonService.apiRequestUrl(fbAuthConstants.urls.authorize).then(function (requestUrl) {

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
         * This operation can only be performed on the local network.
         * @see http://dev.freebox.fr/sdk/os/login/#track-authorization-progress
         *
         * @param trackingId the identifier used to track the authorization progress
         * @return HttpPromise
         */
        trackAuthorizationProgress: function (trackingId) {
            $log.debug('fbAuthService.trackAuthorizationProgress.');

            // Deferred result
            var deferred = $q.defer();

            // Request url (user must be connected to the local network)
            fbCommonService.apiRequestUrl(fbAuthConstants.urls.authorize + '/' + trackingId).then(function (requestUrl) {

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
         * This operation can only be performed on the local network.
         * @see http://dev.freebox.fr/sdk/os/login/#track-authorization-progress
         *
         * @param trackingId the tracker identifier
         * @param appToken the token to validate
         * @return HttpPromise
         */
        trackAuthorizationProgressUntil: function (trackingId, appToken) {
            $log.debug('fbAuthService.trackAuthorizationProgressUntil.');

            // Pointer to this object
            var _this = this;

            // Deferred object
            var deferred = $q.defer();

            // Polling function
            var pollingFunction = function (deferred) {
                // Polling waiting time
                var waitingTimeMs = fbAuthConstants.tracking.waitingTimeMillis || 5000;

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
         * Ask for a login on the given box url: remote or local (http://mafreebox.freebox.fr)
         * @see http://dev.freebox.fr/sdk/os/login/#getting-the-challenge-value
         *
         * @param url the remote box url (optional)
         * @return HttpPromise
         */
        login: function (url) {
            $log.debug('fbAuthService.login.');

            // Deferred result
            var deferred = $q.defer();

            // Request url
            fbCommonService.apiRequestUrl(fbAuthConstants.urls.login, url).then(function (requestUrl) {

                // Calling FB
                $http({method: 'GET', url: requestUrl}).then(function (response) {
                    deferred.resolve(response);
                });
            });

            // Returning promise
            return deferred.promise;
        },

        /**
         * Ask for a session token on the given box url: remote or local (http://mafreebox.freebox.fr)
         * @see http://dev.freebox.fr/sdk/os/login/#obtaining-a-session-token
         *
         * @param url the remote box url (optional)
         * @param appId the application identifier
         * @param password the password
         * @return HttpPromise
         */
        session: function (url, appId, password) {
            $log.debug('fbAuthService.session.');

            // Deferred result
            var deferred = $q.defer();

            // Request url
            var requestUrl = fbCommonService.apiRequestUrl(fbAuthConstants.urls.session, url);
            $log.debug('requestUrl is: ' + requestUrl);

            // Request url
            fbCommonService.apiRequestUrl(fbAuthConstants.urls.session).then(function (requestUrl) {

                // Calling FB
                $http({
                    method: 'POST',
                    url: requestUrl,
                    data: {app_id: appId, password: password}
                }).then(function (response) {
                    deferred.resolve(response);
                });
            });

            // Returning promise
            return deferred.promise;
        },
        
        /**
         * Ask for a logout on the given box url: remote or local (http://mafreebox.freebox.fr)
         * @see http://dev.freebox.fr/sdk/os/login/#closing-the-current-session
         *
         * @param url the remote box url (optional)
         * @return HttpPromise
         */
        logout: function (url) {
            $log.debug('fbAuthService.logout.');

            // Deferred result
            var deferred = $q.defer();

            // Request url
            fbCommonService.apiRequestUrl(fbAuthConstants.urls.logout, url).then(function (requestUrl) {

                // Calling FB
                $http({method: 'POST', url: requestUrl}).then(function (response) {
                    deferred.resolve(response);
                });
            });

            // Returning promise
            return deferred.promise;
        }
    };
}]);