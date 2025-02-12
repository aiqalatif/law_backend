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
        // Backend se pending lawyers ki list fetch kar raha hai
        const response = await fetch("http://localhost:3000/lawyer/pendingLawyers");
        
        // Response ko JSON format me convert kar raha hai
        const data = await response.json();
        
        console.log("Fetched Lawyers:", data); // Debugging ke liye

        // "lawyers" array ko extract kar raha hai
        const lawyers = data.lawyers;

        // HTML me jahan list dikhani hai usko select kar raha hai
        const lawyerList = document.getElementById("lawyerList");
        lawyerList.innerHTML = "";  // Pehle jo bhi data hai usko clear kar raha hai

        // Agar koi lawyer pending nahi hai to message show karega
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
                <button class="approve-btn" onclick="approveLawyer('${lawyer._id}')">Approve</button>
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
async function approveLawyer(lawyerId) {
    try {
        const response = await fetch(`http://localhost:3000/lawyer/approve/${lawyerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ approved: true })  
        });

        const result = await response.json();
        console.log("Approval Result:", result);

        if (result.success) {
            alert("Lawyer approved successfully!");
            fetchPendingLawyers(); // Refresh lawyer list to remove approved ones
        } else {
            alert("Failed to approve lawyer!");
        }
    } catch (error) {
        console.error("Error approving lawyer:", error);
        alert("Error approving lawyer!");
    }
}

async function fetchApprovedLawyers() {
    try {
        // Backend se pending lawyers ki list fetch kar raha hai
        const response = await fetch("http://localhost:3000/lawyer/approved");
        
        // Response ko JSON format me convert kar raha hai
        const data = await response.json();
        
        console.log("Fetched Lawyers:", data); // Debugging ke liye

        // "lawyers" array ko extract kar raha hai
        const lawyers = data.lawyers;

        // HTML me jahan list dikhani hai usko select kar raha hai
        const lawyerList = document.getElementById("approverLawyerList");
        lawyerList.innerHTML = "";  // Pehle jo bhi data hai usko clear kar raha hai

        // Agar koi lawyer pending nahi hai to message show karega
        if (!lawyers.length) {
            lawyerList.innerHTML = "<p>No Approved lawyers found.</p>";
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
                
            `;

            // Lawyer card ko HTML list me add karega
            lawyerList.appendChild(lawyerCard);
        });

    } catch (error) {
        console.error("Error fetching lawyers:", error);
    }
}
