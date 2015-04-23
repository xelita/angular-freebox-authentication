describe("fbAuthModule Tests Suite", function () {

    // fbAuthConstants

    describe("fbAuthConstants Tests", function () {

        var fbAuthConstants;

        beforeEach(function () {
            module('fbAuthModule');
            inject(function (_fbAuthConstants_) {
                fbAuthConstants = _fbAuthConstants_;
            });
        });

        it("urls", function () {
            expect(fbAuthConstants.urls.authorize).toBe('/login/authorize');
            expect(fbAuthConstants.urls.login).toBe('/login/login');
            expect(fbAuthConstants.urls.session).toBe('/login/session');
            expect(fbAuthConstants.urls.logout).toBe('/login/logout');
        });

        it("authorizationStatus", function () {
            expect(fbAuthConstants.authorizationStatus.unknown).toBe('unknown');
            expect(fbAuthConstants.authorizationStatus.pending).toBe('pending');
            expect(fbAuthConstants.authorizationStatus.timeout).toBe('timeout');
            expect(fbAuthConstants.authorizationStatus.granted).toBe('granted');
            expect(fbAuthConstants.authorizationStatus.denied).toBe('denied');
        });

        it("tracking", function () {
            expect(fbAuthConstants.tracking.waitingTimeMillis).toBe(5000);
        });
    });

    // fbAuthService


    describe("fbAuthService Tests", function () {

        var fbAuthService;
        var fbAuthConstants;

        var fbCommonService;

        var $http;
        var $httpBackend;

        beforeEach(function () {
            module('fbAuthModule');
            inject(function (_fbAuthService_, _fbAuthConstants_, _fbCommonService_, _$http_, _$httpBackend_) {
                fbAuthService = _fbAuthService_;
                fbAuthConstants = _fbAuthConstants_;
                fbCommonService = _fbCommonService_;
                $http = _$http_;
                $httpBackend = _$httpBackend_;
            });
        });

        it("requestAuthorization", function () {
            var expectedApiVersion = {
                "uid": "23b86ec8091013d668829fe12791fdab",
                "device_name": "Freebox Server",
                "api_version": "3.0",
                "api_base_url": "/api/",
                "device_type": "FreeboxServer1,1"
            };
            var expectedApiCallResponse = {
                "status": "OK"
            };

            $httpBackend.expectGET('http://mafreebox.freebox.fr/api_version').respond(expectedApiVersion);
            $httpBackend.expectPOST('http://mafreebox.freebox.fr/api/v3/login/authorize', {token: ''}).respond(expectedApiCallResponse);
            var promise = fbAuthService.requestAuthorization({token: ''});
            promise.then(function (response) {
                expect(response.data.status).toBe(expectedApiCallResponse.status);
            });
            $httpBackend.flush();
        });
    });
});