function showPage(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.main-container').innerHTML = html;
            history.pushState(null, "", pageUrl); // URL update karega
        })
        .catch(error => console.error("Error:", error));
}






function setupAddRowFeature() {
    const tableBody = document.querySelector('#sections-table tbody');
    const addRowBtn = document.getElementById('add-row-btn');

    

    addRowBtn.addEventListener('click', function () {
        console.log("➕ Add Row button clicked!"); // Debugging

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="sectionNumber" required></td>
            <td><input type="text" name="sectionTitle" required></td>
            <td><textarea name="sectionDescription" rows="2" required></textarea></td>
            <td><input type="text" name="sectionPunishment" required></td>
            <td><button class="delete-row-btn">Delete</button></td>
        `;
        tableBody.appendChild(newRow);

        // Delete Row Button
        newRow.querySelector('.delete-row-btn').addEventListener('click', function () {
            tableBody.removeChild(newRow);
        });
    });
}

async function submitLaw(lawType, apiUrl) {
    const categoryName = document.getElementById('categoryName').value;
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

document.addEventListener('DOMContentLoaded', function () {
    setupSubmitLawFeature();
});

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
