var app = angular.module("myApp", ['ngRoute', 'firebase', 'flash'])

// ------------------------ User creation and login necessities -------------------------------------------------------------
.controller('UserController', function ($scope, $route, $routeParams, $location, $firebaseObject, $firebaseArray, $window, Flash) {
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
                Flash.create('danger', 'Error creating user: ' + error, "flash-message");
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
                        Flash.create('success', 'Account created successfully', "flash-message");
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
                Flash.create('danger', 'Login failed! ' + error, "flash-message");
            } else {
                console.log("Authenticated successfully with payload:", authData);
                Flash.create('success', 'Successfully logged in!', "flash-message");
                $scope.isLoggedIn = myFireRef.getAuth();
                $scope.$apply();
                $route.reload();
            }
        });
    }

    $scope.logout = function () {
        myFireRef.unauth();
        console.log("logging out");
        Flash.create('success', 'Successfully logged out', "flash-message");
        $scope.isLoggedIn = myFireRef.getAuth();
        $scope.$apply();
        $route.reload();
    }

    $scope.forgotPasswordEmail = function (user) {
        myFireRef.resetPassword({
            email: user.email
        }, function (error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        Flash.create('error', 'The specified user account does not exist.', "flash-message");
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error resetting password:", error);
                        Flash.create('danger', 'Error resetting password: ' + error, "flash-message");
                }
            } else {
                console.log("Password reset email sent successfully!");
                Flash.create('success', "Password reset email sent successfully!", "flash-message");
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
                Flash.create('danger', "Error changing password: " + error, "flash-message");
            } else {
                console.log("User password changed successfully!");
                Flash.create('success', "User password changed successfully!", "flash-message");
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