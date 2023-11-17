// script.js
  // Your web app's Firebase configuration
  var firebaseConfig = {
  apiKey: "AIzaSyBWnP2IdTgspl7EK-tTu82Rvw-AC5hE7wA",
  authDomain: "anti-gbv-ba60b.firebaseapp.com",
  databaseURL: "https://anti-gbv-ba60b-default-rtdb.firebaseio.com",
  projectId: "anti-gbv-ba60b",
  storageBucket: "anti-gbv-ba60b.appspot.com",
  messagingSenderId: "769370213481",
  appId: "1:769370213481:web:6e12d0cf5004f9a9c066f8",
  measurementId: "G-WL1GEGVLNV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

/*Logout confirmation*/ 
  function confirmLogout(event) {
        var confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
	
	 // Your web app's Firebase configuration
  var firebaseConfig = {
  apiKey: "AIzaSyBWnP2IdTgspl7EK-tTu82Rvw-AC5hE7wA",
  authDomain: "anti-gbv-ba60b.firebaseapp.com",
  databaseURL: "https://anti-gbv-ba60b-default-rtdb.firebaseio.com",
  projectId: "anti-gbv-ba60b",
  storageBucket: "anti-gbv-ba60b.appspot.com",
  messagingSenderId: "769370213481",
  appId: "1:769370213481:web:6e12d0cf5004f9a9c066f8",
  measurementId: "G-WL1GEGVLNV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get the sign-up form
  var signUpForm = document.getElementById("signup-form");

  // Add an event listener for the form submission
  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Call the signUp function
    signUp();
  });
  // Call the initMap function after APIs are loaded
  initMap();
});

function signUp() {
  var name = document.getElementById("name").value;
  var phoneNumber = document.getElementById("phone-number").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;
  
  // South African phone number validation
  var phoneRegex = /^(\+27|0)[67]\d{8}$/; // Validating South African mobile numbers starting with 06 or 07
  if (!phoneRegex.test(phoneNumber)) {
    alert("Please enter a valid South African phone number.");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      var user = userCredential.user;
	  var userId = user.uid; // Get the UID of the newly created user
      // Store user data in Firestore
	  
	  var database = firebase.database();
                    var newUser = database.ref('Users');
                    newUser.push().set({
          uid: userId,
		  name: name,
		  phoneNumber: phoneNumber,
          email: email,
		  password: password,
		  profileImage: '',
		  userType: 'user',
		  timestamp: firebase.database.ServerValue.TIMESTAMP // Add server's timestamp
        })
        .then(function (user) {
          alert("Sign up successful!");
          window.location.href = "homepage logged in.html";
        })
        .catch(function (error) {
          var errorMessage = error.message;
          alert("Sign up error: " + errorMessage);
        });
    })
    .catch(function (error) {
      var errorMessage = error.message;
      alert("Sign up error: " + errorMessage);
    });
}

function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
	
	// Email address validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(user) {
        // Login successful, perform any additional actions or redirection here
        alert("Login successful");
		window.location.href = "homepage logged in.html";
      })
      .catch(function(error) {
        // Handle login errors
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Login error: " + errorMessage);
      });
  }
  
  function sendAlert() {
	  
	var phoneNumberInput = document.getElementById("phoneNumberInput");
    var phoneNumber = phoneNumberInput.value;

    var abuseTypeSelect = document.getElementById("abuseTypeSelect");
    var selectedAbuseType = abuseTypeSelect.value;
	
	// Regular expression pattern for South African phone numbers
    var saPhoneNumberPattern = /^((\+|00)27|0)(\d{2})-?(\d{3})-?(\d{4})$/;

    // Validate the phone number against the pattern
    if (saPhoneNumberPattern.test(phoneNumber)) {
        // Phone number is valid, perform any necessary actions here (e.g., sending the alert)
		
		// Get the current date and time
        var currentDate = new Date();
        var timestamp = currentDate.getTime();

        // Format the timestamp to the desired date format
        var dateFormat = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        var alertDate = dateFormat.format(currentDate);
		
// Get the user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    
                    // Save the alert in Firebase database
                    var database = firebase.database();
                    var alertsRef = database.ref('Alerts');
                    alertsRef.push().set({
						uid: alertDate,
                        latitude: latitude,
                        longitude: longitude,
						selectedAbuseType: selectedAbuseType,
						phoneNumber: phoneNumber,
						userType: 'anonymous',
                        alertDate: alertDate
                    }).then(function() {
                        // Show a pop-up message
                        alert("Alert sent! Do expect a call from us to confirm your alert");
                    window.location.href = "index.html";
					}).catch(function(error) {
                        console.log(error);
                    });
                }, function(error) {
                    console.log(error);
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
    } else {
        // Phone number is not valid, display an error message or take appropriate action
        alert('Please enter a valid South African phone number.');
    }
            
}

function showAbuseTypeDialog() {
    var abuseTypeDialog = document.getElementById("abuseTypeDialog");
    abuseTypeDialog.style.display = "block";
}

function showPhoneNumberDialog() {
    var abuseTypeSelect = document.getElementById("abuseTypeSelect");
    var selectedAbuseType = abuseTypeSelect.value;
            
    // Store the selected abuse type in a variable or database if needed
            
    var abuseTypeDialog = document.getElementById("abuseTypeDialog");
    abuseTypeDialog.style.display = "none";

    var phoneNumberDialog = document.getElementById("phoneNumberDialog");
    phoneNumberDialog.style.display = "block";
	
}

function showDialog(dialogId) {
    var dialog = document.getElementById(dialogId);
    dialog.style.display = "flex";
}

function closeDialog(dialogId) {
    var dialog = document.getElementById(dialogId);
    dialog.style.display = "none";
}
  
// Function to check user authentication state
function checkUserAuthState() {
    console.log("Checking user authentication state...");
    var abuseTypeSelect = document.getElementById("abuseTypeSelect");
    var selectedAbuseType = abuseTypeSelect.value;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("User is authenticated:", user.uid);
            // User is authenticated, call the function to retrieve user information
            getUserInfo(selectedAbuseType);
        } else {
            console.log("No user is currently logged in");
        }
    });
}

// Function to retrieve user information from the database
function getUserInfo(selectedAbuseType) {
  var database = firebase.database();
  var user = firebase.auth().currentUser;
  
  if (user) {
    var userId = user.uid;
    var usersRef = database.ref('Users');

    usersRef.orderByChild('uid').equalTo(userId).once('value', function(snapshot) {
      var user = snapshot.val();
      if (user) {
        var userData = Object.values(user)[0];
        var phoneNumber = userData.phoneNumber;
        var name = userData.name;
        var userType = userData.userType;
		var uid = userId;

        // Call the function to send the alert
        sendAlerts(selectedAbuseType, phoneNumber, userType, name, uid);
      } else {
        console.log("User not found");
      }
    }, function(error) {
      console.log(error);
    });
  } else {
    console.log("No user is currently logged in");
  }
}

// ...

// Update the sendAlert function to accept additional parameters
function sendAlerts(selectedAbuseType, phoneNumber, userType, name, uid) {
	// Get the current date and time
        var currentDate = new Date();
        var timestamp = currentDate.getTime();

        // Format the timestamp to the desired date format
        var dateFormat = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        var alertDate = dateFormat.format(currentDate);
		
    // Get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            
            // Save the alert in Firebase database
            var database = firebase.database();
            var alertsRef = database.ref('Alerts');
            alertsRef.push().set({
                latitude: latitude,
                longitude: longitude,
                selectedAbuseType: selectedAbuseType,
                phoneNumber: phoneNumber,
                userType: userType,
                name: name,
				uid: uid,
				alertDate: alertDate
            }).then(function() {
                // Show a pop-up message
                alert("Alert sent! Do expect a call from us to confirm your alert");
                window.location.href = "homepage logged in.html";
            }).catch(function(error) {
                console.log(error);
            });
        }, function(error) {
            console.log(error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Function to show the abuse type dialog
function showAbuseTypeDialog() {
    var abuseTypeDialog = document.getElementById("abuseTypeDialog");
    abuseTypeDialog.style.display = "block";
}

// Function to close the dialog
function closeDialog(dialogId) {
    var dialog = document.getElementById(dialogId);
    dialog.style.display = "none";
}

// Function to handle the next button click
function nextButtonClicked() {

    // Close the abuse type dialog
    closeDialog('abuseTypeDialog');
	
    // Call the function to check user authentication state
checkUserAuthState();
}

 
	
// Function to fetch forum details from the Firebase Realtime Database
function getForumDetails() {
    const forumRef = firebase.database().ref('Forums');

    forumRef.on('value', (snapshot) => {
        const forumList = snapshot.val();

        // Clear the forumList element before appending the updated data
        const forumListElement = document.getElementById('message-container');
        forumListElement.innerHTML = '';

        for (const key in forumList) {
            if (forumList.hasOwnProperty(key)) {
                const forum = forumList[key];
                const forumItem = document.createElement('div');
                forumItem.classList.add('forum-item'); // Add a class for styling
                // Apply inline styles for color
                forumItem.innerHTML = `
                    <img src="${forum.profileImage}" alt="${forum.username}'s Profile Image" class="profile-image">
                    <div class="username">
                        <h3 style="color: black; margin-left: 15px;">Username: ${forum.username}</h3>
                        <div class="info">
                        <p style="color: black; margin-left: 15px;">Message: ${forum.message}</p>
                    </div>
                    </div>
                    
                    <button onclick="reportForum(${forum.id})">Report</button>`;
                forumListElement.appendChild(forumItem);

                 // Add a horizontal line after each forum
                const horizontalLine = document.createElement('hr');
                forumListElement.appendChild(horizontalLine);
            }
        }
    });
}

// Function to check user authentication state
function checkUserAuthStates() {
	event.preventDefault(); // Prevent the default form submission

  console.log("Checking user authentication state...");
  
  // Get the message from the textarea
      var forumMessage = document.getElementById("message");
      var message = forumMessage.value;
	  
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("User is authenticated:", user.uid);
            // User is authenticated, call the function to retrieve user information
            getUserInfos(message);
        } else {
            console.log("No user is currently logged in");
        }
    });
}

// Function to post to the forum
function postToForum() {
    console.log("Posting to the forum...");

    // Get the message from the textarea
    var forumMessage = document.getElementById("message").value;

    // Perform authentication checks
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is authenticated
            console.log("User is authenticated:", user.uid);
            getUserInfoAndPostForum(user, forumMessage);
        } else {
            // User is not authenticated
            console.log("No user is currently logged in");
            // Handle the case where the user is not authenticated (e.g., show a login modal).
        }
    });
}

// Function to get user information and post to the forum
function getUserInfoAndPostForum(user, message) {
    var userId = user.uid;
    // You can fetch user information and post to the forum here.
    // For simplicity, I'm using a placeholder name, profileImage, and userType.

    var name = "John Doe"; // Replace with actual user name
    var profileImage = "profile.jpg"; // Replace with actual profile image URL
    var userType = "user";

    postForum(name, userId, profileImage, message);
}

function getUserInfos(message) {
  var database = firebase.database();
  var userId = user.uid;
  var usersRef = database.ref('Users');

  usersRef.orderByChild('uid').equalTo(userId).once('value', function (snapshot) {
    var user = snapshot.val();
    if (user) {
      var userData = Object.values(user)[0];
      var phoneNumber = userData.phoneNumber;
      var profileImage = userData.profileImage;
      var name = userData.name;
      var userType = userData.userType;

      

      // Call the function to send the alert
      postForum(name, userId, profileImage, message);
    } else {
      console.log("User not found");
    }
  }, function (error) {
    console.log(error);
  });
}

function postForum(name, userId, profileImage, message) {
  // Get the current timestamp
  const timestamp = new Date().getTime();

  if (userId) {
    const forumData = {
      id: timestamp,
      uid: userId,
      message: message,
      username: name,
      profileImage: profileImage,
      forumDate: new Date(timestamp).toLocaleString(),
      userType: "user"
    };

    // Reference to the "Forums" node
    const forumRef = firebase.database().ref("Forums");

    // Push the data as a new child
    forumRef.push(forumData)
      .then(() => {
        alert("Forum Posted...");
        // You can redirect to another page or perform additional actions here
		// Clear the message textarea
    document.getElementById("message").value = "";
      })
      .catch(error => {
        console.error("Failed to post forum:", error);
        alert("Failed to post forum.");
      });
  }
}



 function initMap() {
      // Create a map centered at a specific location
      var center = { lat: -25.7461, lng: 28.1882 };
      var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 12
      });

      // Retrieve hotspot data from the database
      var database = firebase.database()
      var alertsRef = database.ref('Alerts');
      alertsRef.once('value', function(snapshot) {
        var alerts = snapshot.val();

        // Add hotspots as markers on the map
        for (var key in alerts) {
          if (alerts.hasOwnProperty(key)) {
            var alert = alerts[key];
            var lat = alert.latitude;
            var lng = alert.longitude;
            var hotspotName = "Hotspot " + key;

            var marker = new google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
              title: hotspotName
            });
          }
        }
      });
    }


// Call the function to display the forum details on page load
window.onload = getForumDetails;

//login page

document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  
  // Perform your login logic here
  // Example: You can send an AJAX request to a server-side script for authentication
  
  // After successful login, redirect the user to another page
  window.location.href = "welcome.html";
});





//sign up page

document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  // Perform your sign-up logic here
  // Example: You can send an AJAX request to a server-side script to create a new user
  
  // After successful sign-up, redirect the user to another page
  window.location.href = "welcome.html";
});


//forum
document.getElementById("forum-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  var name = document.getElementById("name").value;
  var message = document.getElementById("message").value;
  var image = document.getElementById("image").files[0];
  
  // Perform any necessary validation on the inputs
  
  // Create a FormData object to send data including the image
  var formData = new FormData();
  formData.append("name", name);
  formData.append("message", message);
  formData.append("image", image);
  
  // Perform your forum post logic here
  // Example: You can send an AJAX request to a server-side script to handle the form data
  
  // Reset the form after submission
  document.getElementById("forum-form").reset();
});


document.addEventListener("DOMContentLoaded", function () {
    const postButton = document.getElementById("post-button");

    postButton.addEventListener("click", function () {
        alert("Button Clicked"); // Display a simple alert

        // Check if the user is authenticated
        const user = firebase.auth().currentUser;

        if (user) {
            // User is authenticated, proceed with posting logic
            const forumForm = document.getElementById("forum-form");
            const messageInput = document.getElementById("message");

            const message = messageInput.value;
            if (message) {
                // Perform your forum post logic here
                // You can access the user's information with: user.uid, user.displayName, etc.

const forumData = {
      id: timestamp,
      uid: userId,
      message: message,
      username: name,
      profileImage: profileImage,
      forumDate: new Date(timestamp).toLocaleString(),
      userType: "user"
    };

    // Reference to the "Forums" node
    const forumRef = firebase.database().ref("Forums");

    // Push the data as a new child
    forumRef.push(forumData)
      .then(() => {
        alert("Forum Posted...");
        // You can redirect to another page or perform additional actions here
		// Clear the message textarea
    document.getElementById("message").value = "";
      })
      .catch(error => {
        console.error("Failed to post forum:", error);
        alert("Failed to post forum.");
      });
  
                alert("Post your forum message: " + message);
            } else {
                alert("Please enter a message before posting.");
            }
        } else {
            alert("You must be logged in to post in the forum.");
            // You can redirect to the login page or take other actions as needed.
        }
    });
});
