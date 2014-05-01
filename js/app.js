var willsApp = angular.module('willsApp', []);

willsApp.filter('capitalize', function() {
    return function(text) {
        if (text!=null)
            return text.substring(0,1).toUpperCase()+text.substring(1);
    }
});

// Test directive

willsApp.directive("loaded", function() {
    return {
        restrict: "A",
        link: function() {
            alert("I'm working!");
        } 
    };
});



function AppCtrl ($scope) {

// General functions

	// Cross-browser compatable function to count properties/keys in an object

	$scope.countProperties = function(obj) {
		var count = 0;
		for (var prop in obj) {
			if(obj.hasOwnProperty(prop))
			count++;
		}
		return count;
	};

	// function that returns true if val is the value of any obj.prop.key (ie object property of an object)

	$scope.checkValues = function(val, key, obj) {
		for (var prop in obj) {
			if(obj[prop][key]==val){
				return true;
			}
		}
		return false;
	};

// App specific functions

// Menu options view control

	$scope.showSteps = true;
	$scope.showAbout = false;
	$scope.showContact = false;
	$scope.showInfo = false;

// Step view control

	$scope.step1 = "partials/step1.html";
	$scope.step2 = "partials/step2.html";
	$scope.step3 = "partials/step3.html";
	$scope.step4 = "partials/step4.html";
	$scope.step5 = "partials/step5.html";
	$scope.yourWill = "partials/will.html";

	$scope.showStep1 = true;
	$scope.showStep2 = false;
	$scope.showStep3 = false;
	$scope.showStep4 = false;
	$scope.showStep5 = false;
	$scope.showWill = false;

// Variable entry view control

	// Step 1
	$scope.showName = true;
	$scope.showAltName = false;
	$scope.showResidence = false;
	$scope.showOccupation = false;

	// Step 2
	$scope.showRelStatus = true;
	$scope.showHaveChildren = false;
	$scope.showChildren = false;

	// Step 3
	$scope.showTrusteesIntro = false;
	$scope.showTrustees = true;

	// Step 4
	$scope.showWishes = true;
	$scope.showBurialWish = false;

	// Will
	$scope.showVerifyDetails = true;
	$scope.showFinalWill = false;


// Variables

	// Step 1
	$scope.fullName = "";
	$scope.gender = "";
	$scope.haveAltName = false;
	$scope.altName = "";
	$scope.residence = "";
	$scope.occupation = "";

	// Step 2
	$scope.relStatus = "single";
	$scope.partnerName = "";
	$scope.partnerGender = "";
	$scope.haveChildren = false;
	$scope.numberChildren = 1;

	$scope.setChildrenEntry = function() {
		$scope.children = {};
		for (var i = 1; i <= $scope.numberChildren; i++) {
			$scope.children[i] = {"name": "", "age": 0, "gender": ""};
		}
		if ($scope.haveChildren) {
			$scope.showHaveChildren = false;
			$scope.showChildren = true;
		} else {
			$scope.showStep2 = false;
			$scope.showStep3 = true;
		}
	};

	// Step 3 - TRUSTEES
	$scope.partnerAsTrusteeDecided = false;
	$scope.partnerAsTrustee = false;
	$scope.blankTrustee = {};
	$scope.enteredTrustee = {};
	$scope.trustees = {};
	$scope.numberTrustees = 0;
	$scope.referTrustees = "trustee";
	$scope.trusteeNumber = 0;


	$scope.addTrustee = function(newTrustee) {
		//check if nothing has been entered
		somethingEntered = (newTrustee.name!==""&&newTrustee.name!==undefined);
		if (somethingEntered) {

			// check if trustee with that name already exists
			trusteeAlready = $scope.checkValues(newTrustee.name, "name", $scope.trustees);
			if (trusteeAlready) {

				// find the number for this trustee
				for (var prop in $scope.trustees) {
					if ($scope.trustees[prop].name==newTrustee.name) {
						newTrustee.number = $scope.trustees[prop].number;
					}
				}

			} else {

				// set the number for this trustee
				$scope.trusteeNumber++;
				newTrustee.number = $scope.trusteeNumber;
			}

			// add trustee
			$scope.trustees[newTrustee.number] = newTrustee;

			// update number of trustees
			$scope.numberTrustees = $scope.countProperties($scope.trustees);

			// empty entry boxes
			$scope.reset();
		}
	};

	$scope.reset = function() {
		$scope.enteredTrustee = angular.copy($scope.blankTrustee);
	};

	$scope.editTrustee = function(trustee) {
		$scope.enteredTrustee = trustee;
	};

	$scope.removeTrustee = function(trustee) {
		delete $scope.trustees[trustee.number];

		// update number of trustees
		$scope.numberTrustees = $scope.countProperties($scope.trustees);
	};

	$scope.setTrustees = function() {

		// Reset string for naming trustees
		$scope.referTrustees = "trustee";

		// Finalise count
		$scope.numberTrustees = $scope.countProperties($scope.trustees);

		// Alert if none entered
		if ($scope.numberTrustees==0) {
			alert("You need to enter some trustees before proceeding. Make sure you click SAVE after entering the details of a trustee.");
		} else {

			// Add punctuation and relationship to trustees.trustee object as single strings
			if ($scope.numberTrustees==1) {
				for (var trustee in $scope.trustees) {
					if ($scope.trustees[trustee].relationship==undefined||$scope.trustees[trustee].relationship=="other") {
						$scope.trustees[trustee].introMy = "";
						$scope.trustees[trustee].introYour = "";
					} else {
						$scope.trustees[trustee].introMy = "my " + $scope.trustees[trustee].relationship + " ";
						$scope.trustees[trustee].introYour = "your " + $scope.trustees[trustee].relationship + " ";
					}
				}
			} else {
				$scope.referTrustees = "trustees";
				var count = 0;
				for (var trustee in $scope.trustees) {
					count++;
					thisRelationship = $scope.trustees[trustee].relationship;
					if (thisRelationship==undefined||thisRelationship=="other") {
						hasNoRelationship = true;
					} else {
						hasNoRelationship = false;
					}
					if (count==1) {
						if (hasNoRelationship) {
							$scope.trustees[trustee].introMy = "";
							$scope.trustees[trustee].introYour = "";
						} else {
							$scope.trustees[trustee].introMy = "my " + thisRelationship + " ";
							$scope.trustees[trustee].introYour = "your " + thisRelationship + " ";
						}
					} else if (count==$scope.numberTrustees) {
						if (hasNoRelationship) {
							$scope.trustees[trustee].introMy = " and ";
							$scope.trustees[trustee].introYour = " and ";
						} else {
							$scope.trustees[trustee].introMy = " and my " + thisRelationship + " ";
							$scope.trustees[trustee].introYour = " and your " + thisRelationship + " ";
						}
					} else {
						if (hasNoRelationship) {
							$scope.trustees[trustee].introMy = ", ";
							$scope.trustees[trustee].introYour = ", ";
						} else {
							$scope.trustees[trustee].introMy = ", my " + thisRelationship + " ";
							$scope.trustees[trustee].introYour = ", your " + thisRelationship + " ";
						}
					}
				}
			}

			// Move to next screen
			$scope.showStep3 = false;
			$scope.showStep4 = true;
		}
	};

	$scope.reset();


	// Step 4
	$scope.generalWishes = "";
	$scope.giftOverGrandchildren = true;
	$scope.giftOverNN = true;
	$scope.finalBeneficiaries = "";
	$scope.charity = "";
	$scope.funeralWishes = "";

	// Will

	$scope.will = {
		"para1": {
			"number": 1,
			"show": true,
		},
		"para2": {
			"number": 2,
			"show": false,
		},
		"para3": {
			"number": 2,
			"show": true,
		},
		"para4": {
			"number": 3,
			"show": false,
		},
		"para5": {
			"number": 3,
			"show": true,
		},
		"para6": {
			"number": 4,
			"show": true,
		}
	};

	$scope.draftWill = function(){

		// Reset paragraph numbers
		$scope.will.para1.number = 1;
		$scope.will.para2.number = 2;
		$scope.will.para3.number = 2;
		$scope.will.para4.number = 3;
		$scope.will.para5.number = 3;
		$scope.will.para6.number = 4;

		// Set to show conditional paragraphs

		if ($scope.relStatus!=="single"&&$scope.partnerAsTrustee&&($scope.generalWishes=="partner-children"||$scope.generalWishes=="partner-siblings")) {
			$scope.will.para2.show = true;
			$scope.will.para3.number++;
			$scope.will.para4.number++;
			$scope.will.para5.number++;
			$scope.will.para6.number++;
			}

		if ($scope.funeralWishes!=='none') {
			$scope.will.para4.show = true;
			$scope.will.para5.number++;
			$scope.will.para6.number++;
			}

		// Show will
		$scope.showStep5 = false;
		$scope.showWill = true;
	};

	$scope.printWill = function(){
		// Print function
	};

}
