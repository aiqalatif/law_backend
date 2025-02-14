// Toggle Drawer Functionality
const drawer = document.getElementById('drawer');
const toggleButton = document.getElementById('toggleDrawer');

if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        drawer.classList.toggle('collapsed'); 
    });
}

// Load Page Dynamically
function loadPage(pageName) {
    const contentDiv = document.getElementById('dynamic-content');
    fetch(pageName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading ${pageName}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html; // Update the dynamic content area

            // Initialize features after content is loaded
            setupAddRowFeature();
            setupSubmitLawFeature();
            fetchPendingLawyers();
            fetchApprovedLawyers();
        })
        .catch(error => {
            console.error('Error:', error);
            contentDiv.innerHTML = `<p>Error loading content. Please try again later.</p>`;
        });
}

// Setup Add Row Feature
function setupAddRowFeature() {
    const tableBody = document.querySelector('#sections-table tbody');
    const addRowBtn = document.getElementById('add-row-btn');

    if (!tableBody || !addRowBtn) {
        console.error('Table body or Add Row button not found!');
        return;
    }

    addRowBtn.addEventListener('click', function () {
        console.log("➕ Add Row button clicked!"); // Debugging

        // Create a new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="sectionNumber" required></td>
            <td><input type="text" name="sectionTitle" required></td>
            <td><textarea name="sectionDescription" rows="2" required></textarea></td>
            <td><input type="text" name="sectionPunishment" required></td>
            <td><button class="delete-row-btn">Delete</button></td>
        `;
        tableBody.appendChild(newRow);

        // Add delete functionality to the new row
        newRow.querySelector('.delete-row-btn').addEventListener('click', function () {
            tableBody.removeChild(newRow);
        });
    });
}

async function fetchPendingLawyers() {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage

        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }
        const response = await fetch("http://localhost:3000/lawyer/pendingLawyers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            console.error('Failed to fetch pending lawyers:', response.statusText);
            return;
        }
        // Response ko JSON format me convert kar raha hai
        const data = await response.json();
        
        console.log("Fetched Lawyers:", data); // Debugging ke liye

       
        const lawyers = data.lawyers;

       
        const lawyerList = document.getElementById("lawyerList");
        lawyerList.innerHTML = "";  

       
        if (!lawyers.length) {
            lawyerList.innerHTML = "<p>No pending lawyers found.</p>";
            return;
        }

        // Har lawyer ke liye ek card create karega
        lawyers.forEach(lawyer => {
            const lawyerCard = document.createElement("div");
            lawyerCard.classList.add("lawyer-card");

            // Profile Picture check karega, agar nahi hai to default avatar show karega
            const profilePic = lawyer.profilePicture 
                ? `<img src="${lawyer.profilePicture}" class="avatar">` 
                : `<div class="avatar">👤</div>`;

            // Lawyer ka complete info show karega
            lawyerCard.innerHTML = `
                ${profilePic}
                <div class="lawyer-info">
                    <h3>${lawyer.name || "N/A"}</h3>
                    <p><strong>Email:</strong> ${lawyer.email || "N/A"}</p>
                    <p><strong>Phone:</strong> ${lawyer.phone || "N/A"}</p>
                    <p><strong>License Number:</strong> ${lawyer.licenseNumber || "N/A"}</p>
                    <p><strong>License Issuing Authority:</strong> ${lawyer.licenseIssuingAuthority || "N/A"}</p>
                    <p><strong>License Issuing Date:</strong> ${lawyer.licenseIssuingDate ? new Date(lawyer.licenseIssuingDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>License Expiry Date:</strong> ${lawyer.licenseExpiryDate ? new Date(lawyer.licenseExpiryDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Experience (Years):</strong> ${lawyer.experienceYears || "N/A"}</p>
                    <p><strong>Specialties:</strong> ${lawyer.specialties?.join(", ") || "N/A"}</p>
                    <p><strong>Languages Spoken:</strong> ${lawyer.languagesSpoken?.join(", ") || "N/A"}</p>
                    <p><strong>Office Address:</strong> ${lawyer.officeAddress || "N/A"}</p>
                    <p><strong>Bar Council ID:</strong> ${lawyer.barCouncilIDCard || "N/A"}</p>
                </div>
                <button class="approve-btn" onclick="updateLawyerStatus('${lawyer._id}', 'verified')">Approve</button>
                  <button class="reject-btn" onclick="updateLawyerStatus('${lawyer._id}', 'rejected')">Reject</button>
             </div>
            `;

            // Lawyer card ko HTML list me add karega
            lawyerList.appendChild(lawyerCard);
        });

    } catch (error) {
        console.error("Error fetching lawyers:", error);
    }
}


// Setup Submit Law Feature
async function submitLaw(lawType, apiUrl) {
    const categoryName = document.getElementById('categoryName')?.value;
    const tableBody = document.querySelector('#sections-table tbody');
    const sections = [];
    tableBody.querySelectorAll('tr').forEach(row => {
        const sectionNumber = row.querySelector('[name="sectionNumber"]').value;
        const sectionTitle = row.querySelector('[name="sectionTitle"]').value;
        const sectionDescription = row.querySelector('[name="sectionDescription"]').value;
        const sectionPunishment = row.querySelector('[name="sectionPunishment"]').value;
        sections.push({
            sectionNumber,
            title: sectionTitle,
            description: sectionDescription,
            punishment: sectionPunishment
        });
    });
    const lawData = {
        lawType,
        categories: [
            {
                categoryName,
                subcategories: sections
            }
        ]
    };
    try {
        console.log(`📤 Sending data to ${apiUrl}:`, lawData);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lawData)
        });
        if (response.ok) {
            alert(`✅ ${lawType} submitted successfully!`);
        } else {
            alert(`❌ Error submitting ${lawType}.`);
        }
    } catch (error) {
        console.error(`❌ Error submitting ${lawType}:`, error);
        alert('An unexpected error occurred.');
    }
}

function setupSubmitLawFeature() {
    document.getElementById('submit-property-law-btn')?.addEventListener('click', () => {
        submitLaw('Property Law', 'http://localhost:3000/laws/add-property-law');
    });
    document.getElementById('submit-criminal-law-btn')?.addEventListener('click', () => {
        submitLaw('Criminal Law', 'http://localhost:3000/laws/add-criminal-law');
    });
    document.getElementById('submit-Employement-law-btn')?.addEventListener('click', () => {
        submitLaw('Employment Law', 'http://localhost:3000/laws/add-labor-law');
    });
    document.getElementById('submit-famliy-law-btn')?.addEventListener('click', () => {
        submitLaw('Family Law', 'http://localhost:3000/laws/add-family-law');
    });
}

// Function to approve a lawyer
async function updateLawyerStatus(lawyerId, status) {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }
        console.log('Token:', token);
        console.log('status:', status);
        const response = await fetch(`http://localhost:3000/lawyer/approve/${lawyerId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();
        console.log("Update Result:", result);

        if (result.success) {
            alert(`Lawyer status updated to ${status} successfully!`);
            fetchPendingLawyers(); 
        } else {
            alert("Failed to update lawyer status!");
        }
    } catch (error) {
        console.error("Error updating lawyer status:", error);
        alert("Error updating lawyer status!");
    }
}

async function fetchApprovedLawyers() {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        console.log('Token:', token); // Debugging: Print the token to the console

        const response = await fetch("http://localhost:3000/lawyer/approved", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch approved lawyers:', response.statusText);
            return;
        }

        const data = await response.json();
        console.log("Fetched Approved Lawyers:", data); // Debugging: Log the fetched data

        if (data.error) {
            console.error('Error from backend:', data.error);
            return;
        }

        const lawyers = data.lawyers || [];
        const lawyerList = document.getElementById("approverLawyerList");

        if (!lawyerList) {
            console.error('Element with ID "approverLawyerList" not found in the DOM.');
            return;
        }

        lawyerList.innerHTML = ""; // Clear existing content

        if (!lawyers.length) {
            lawyerList.innerHTML = "<p>No approved lawyers found.</p>";
            return;
        }

        lawyers.forEach(lawyer => {
            const lawyerCard = document.createElement("div");
            lawyerCard.classList.add("lawyer-card");

            const profilePic = lawyer.profilePicture
                ? `<img src="${lawyer.profilePicture}" class="avatar">`
                : `<div class="avatar">👤</div>`;

            lawyerCard.innerHTML = `
                ${profilePic}
                <div class="lawyer-info">
                    <h3>${lawyer.name || "N/A"}</h3>
                    <p><strong>Email:</strong> ${lawyer.email || "N/A"}</p>
                    <p><strong>Phone:</strong> ${lawyer.phone || "N/A"}</p>
                    <p><strong>License Number:</strong> ${lawyer.licenseNumber || "N/A"}</p>
                    <p><strong>License Issuing Authority:</strong> ${lawyer.licenseIssuingAuthority || "N/A"}</p>
                    <p><strong>License Issuing Date:</strong> ${lawyer.licenseIssuingDate ? new Date(lawyer.licenseIssuingDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>License Expiry Date:</strong> ${lawyer.licenseExpiryDate ? new Date(lawyer.licenseExpiryDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Experience (Years):</strong> ${lawyer.experienceYears || "N/A"}</p>
                    <p><strong>Specialties:</strong> ${lawyer.specialties?.join(", ") || "N/A"}</p>
                    <p><strong>Languages Spoken:</strong> ${lawyer.languagesSpoken?.join(", ") || "N/A"}</p>
                    <p><strong>Office Address:</strong> ${lawyer.officeAddress || "N/A"}</p>
                    <p><strong>Bar Council ID:</strong> ${lawyer.barCouncilIDCard || "N/A"}</p>
                </div>
            `;

            lawyerList.appendChild(lawyerCard);
        });
    } catch (error) {
        console.error("Error fetching approved lawyers:", error);
    }
}