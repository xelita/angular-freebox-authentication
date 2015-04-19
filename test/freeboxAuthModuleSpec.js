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
});