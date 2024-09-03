import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Import the sendPasswordResetEmail function
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4pqtcgbvzBCqtDMfS3tTAzArk3F0qVPo",
  authDomain: "job-search-3ddc5.firebaseapp.com",
  projectId: "job-search-3ddc5",
  storageBucket: "job-search-3ddc5.appspot.com",
  messagingSenderId: "830182703384",
  appId: "1:830182703384:web:165e05e96da87cded85e6d",
  measurementId: "G-FT6JQ2H2W9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      showMessage("Account created successfully", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        showMessage("Email Address Already Exists!!!", "signUpMessage");
      } else {
        showMessage("Unable to create User", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login is successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "/Freelancers-main-copy/afterlogin.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not exist", "signInMessage");
      }
    });
});

const recoverPassword = document.getElementById("recoverPassword");
recoverPassword.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const auth = getAuth();

  sendPasswordResetEmail(auth, email)
    .then(() => {
      showMessage(
        "Password recovery email sent. Please check your inbox.",
        "signInMessage"
      );
    })
    .catch((error) => {
      console.error("Error sending password recovery email:", error);
      showMessage(
        "Error sending password recovery email. Please try again.",
        "signInMessage"
      );
    });
});
// Define the validation schema
const emailSchema = yup
  .string()
  .email("Invalid email address")
  .required("Email is required");

// Function to validate email
function validateEmail(email) {
  emailSchema
    .validate(email)
    .then(() => {
      // Email is valid
      console.log("Valid email:", email);
    })
    .catch((err) => {
      // Email is invalid, show error message
      const signUpMessage = document.getElementById("signUpMessage");
      signUpMessage.innerText = err.message;
      signUpMessage.style.display = "block";
    });
}

// Attach the validation to the submit event
document
  .getElementById("submitSignUp")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    validateEmail(email);
  });
