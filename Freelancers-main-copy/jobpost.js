// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6z-MD707Cb4QGwsp-T-kgRUSZ2h-fvnU",
    authDomain: "database-17ddb.firebaseapp.com",
    databaseURL: "https://database-17ddb-default-rtdb.firebaseio.com",
    projectId: "database-17ddb",
    storageBucket: "database-17ddb.appspot.com",
    messagingSenderId: "791345215284",
    appId: "1:791345215284:web:e6aedd12341ea1664c9761",
    measurementId: "G-XNRLVW7HDS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
const database = firebase.database();

function showJobForm() {
    document.getElementById("job-form").style.display = "block";
}

function addJobListing(event) {
    event.preventDefault();

    // Get form values
    const jobTitle = document.getElementById("job-title").value;
    const companyName = document.getElementById("company-name").value;
    const location = document.getElementById("location").value;
    const jobDescription = document.getElementById("job-description").value;

    // Create new job listing object
    const newJob = {
        title: jobTitle,
        company: companyName,
        location: location,
        description: jobDescription
    };

    console.log("Adding job listing:", newJob); // Debug statement

    // Push new job listing to Firebase
    database.ref('jobs').push(newJob)
        .then(() => {
            console.log("Job listing added successfully."); // Debug statement

            // Create new job card
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.innerHTML = `
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p>${jobDescription}</p>
            `;

            // Add new job card to job list
            document.getElementById("job-list").appendChild(jobCard);

            // Reset and hide the form
            document.getElementById("job-form").reset();
            document.getElementById("job-form").style.display = "none";
        })
        .catch(error => {
            console.error("Error adding job listing: ", error);
        });
}

// Function to display job listings from Firebase
function loadJobListings() {
    database.ref('jobs').on('value', snapshot => {
        const jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // Clear existing listings
        snapshot.forEach(childSnapshot => {
            const job = childSnapshot.val();
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
            `;
            jobList.appendChild(jobCard);
        });
    });
}

// Load job listings when the page loads
window.onload = loadJobListings;
