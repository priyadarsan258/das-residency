document.addEventListener('DOMContentLoaded', () => {
    const ratingContainers = document.querySelectorAll('.star-rating');
    const surveyData = {
        ratings: {
            cleanliness: 0,
            hygiene: 0,
            managerBehaviour: 0,
            roomBoyBehaviour: 0
        }
    };

    // Setup Star Ratings
    ratingContainers.forEach(container => {
        for (let i = 5; i >= 1; i--) {
            const star = document.createElement('span');
            star.innerHTML = '★';
            star.classList.add('star');
            star.dataset.value = i;
            star.addEventListener('click', function () {
                const siblings = Array.from(container.children);
                siblings.forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                const category = container.dataset.name;
                surveyData.ratings[category] = parseInt(this.dataset.value);
            });
            container.appendChild(star);
        }
    });

    const form = document.getElementById('surveyForm');
    const successMessage = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    // Handle Form Submission to Neon via Vercel API
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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

        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/submit-survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            if (!response.ok) throw new Error('Database error');

            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Error saving to database. Check Vercel Environment Variables.");
        } finally {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
        }
    });

    // Reset form logic
    resetBtn.addEventListener('click', () => {
        form.reset();
        ratingContainers.forEach(container => {
            Array.from(container.children).forEach(s => s.classList.remove('selected'));
        });
        Object.keys(surveyData.ratings).forEach(key => surveyData.ratings[key] = 0);
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});