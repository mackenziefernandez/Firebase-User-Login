var app = angular.module("myApp", ['ngRoute', 'firebase'])

// ------------------------ User creation and login necessities -------------------------------------------------------------
.controller('UserController', function ($scope, $route, $routeParams, $location, $firebaseObject, $firebaseArray, $window) {

    $scope.user;

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    var myFireRef = new Firebase('https://logintool.firebaseio.com/');
    $scope.isLoggedIn = myFireRef.getAuth();

    $scope.createUser = function (user) {
        myFireRef.createUser({
            email: user.email,
            password: user.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                // Log the user in
                myFireRef.authWithPassword({
                    email: user.email,
                    password: user.password
                }, function (error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                        $scope.isLoggedIn = myFireRef.getAuth();
                        $scope.$apply();

                        // Redirect to wherever
                        $scope.$location.path("/");
                    }
                });
            }
        });
    }

    $scope.login = function (user) {
        // Log the user in
        myFireRef.authWithPassword({
            email: user.email,
            password: user.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.isLoggedIn = myFireRef.getAuth();
                $scope.$apply();
            }
        });
    }

    $scope.logout = function () {
        myFireRef.unauth();
        console.log("logging out");
        $scope.isLoggedIn = myFireRef.getAuth();
        $scope.$apply();
    }

    $scope.forgotPasswordEmail = function (user) {
        myFireRef.resetPassword({
            email: user.email
        }, function (error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error resetting password:", error);
                }
            } else {
                console.log("Password reset email sent successfully!");
            }
        });
    }

    $scope.changePassword = function (user) {
        myFireRef.changePassword({
            email: user.email,
            oldPassword: user.oldPassword,
            newPassword: user.newPassword
        }, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("User password changed successfully!");
            }
        });
    };
})

.config(function ($routeProvider, $locationProvider) {
    $routeProvider

    // route for the home page
            .when('/', {
                templateUrl: 'templates/home.html'
            })

    // route for the signup page
            .when('/signup', {
                templateUrl: 'templates/signup.html'
            })

    // route for the forgot password page
            .when('/forgotPassword', {
                templateUrl: 'templates/forgotPassword.html'
            })
    // route for the change password page
            .when('/profile', {
                templateUrl: 'templates/profile.html'
            });

});