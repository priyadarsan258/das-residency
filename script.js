import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Setup Star Ratings
    const ratingContainers = document.querySelectorAll('.star-rating');
    const surveyData = {
        ratings: {
            cleanliness: 0,
            hygiene: 0,
            managerBehaviour: 0,
            roomBoyBehaviour: 0
        }
    };

    ratingContainers.forEach(container => {
        // Create 5 stars per container
        // We do it in reverse order because of the RTL CSS trick
        for (let i = 5; i >= 1; i--) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.classList.add('star');
            star.dataset.value = i;
            
            star.addEventListener('click', function() {
                // Remove selected class from all siblings
                const siblings = Array.from(container.children);
                siblings.forEach(s => s.classList.remove('selected'));
                
                // Add selected class to chosen star
                this.classList.add('selected');
                
                // Update survey data
                const category = container.dataset.name;
                surveyData.ratings[category] = parseInt(this.dataset.value);
            });
            
            container.appendChild(star);
        }
    });

    // 2. Handle Form Submission
    const form = document.getElementById('surveyForm');
    const successMessage = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect text/number inputs
        const formData = new FormData(form);
        const submitData = {
            ...surveyData.ratings,
            roomNumber: formData.get('roomNumber'),
            roomRent: formData.get('roomRent'),
            amountPaid: formData.get('amountPaid'),
            paymentType: formData.get('paymentType'),
            extraCharges: formData.get('extraCharges'),
            suggestions: formData.get('suggestions'),
            timestamp: new Date().toISOString()
        };

        // Here, we would normally send to a database (e.g., Firebase)
        console.log("Submitting the following survey data to Database:", submitData);
        
        // Change button to loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;

        // Send to Firebase
        try {
            await addDoc(collection(db, "surveys"), submitData);
            
            // Hide form, show success
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } catch (error) {
            console.error("Firebase error: ", error);
            alert("Error submitting to Firebase. Did you add your config to firebase.js?");
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
        }
    });

    // 3. Reset form logic
    resetBtn.addEventListener('click', () => {
        form.reset();
        
        // Reset stars
        ratingContainers.forEach(container => {
            Array.from(container.children).forEach(s => s.classList.remove('selected'));
        });
        
        // Reset surveyData
        Object.keys(surveyData.ratings).forEach(key => {
            surveyData.ratings[key] = 0;
        });

        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
