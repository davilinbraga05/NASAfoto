document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const dateInput = document.getElementById('date-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.text');
    const loader = submitBtn.querySelector('.loader');

    const errorContainer = document.getElementById('error-message');
    const errorText = errorContainer.querySelector('.error-text');
    const resultContainer = document.getElementById('result-container');

    const apodTitle = document.getElementById('apod-title');
    const apodImage = document.getElementById('apod-image');
    const apodVideo = document.getElementById('apod-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const apodDate = document.getElementById('apod-date');
    const apodCopyright = document.getElementById('apod-copyright');
    const apodExplanation = document.getElementById('apod-explanation');
    const hdLink = document.getElementById('hd-link');

    // Set max date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.max = formattedToday;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        // Reset UI with subtle transitions
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        apodImage.classList.add('hidden');
        videoWrapper.classList.add('hidden');
        apodImage.src = '';
        apodVideo.src = '';

        // Loading State
        submitBtn.disabled = true;
        btnText.style.opacity = '0';
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`/api/apod?date=${selectedDate}`);

            const contentType = response.headers.get("content-type");
            let data = null;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }

            if (!response.ok) {
                // Better error messages for the user
                let msg = data?.detail || `Erro do Servidor (${response.status})`;
                if (response.status === 404) msg = "NASA não possui registros astronômicos para esta data específica.";
                if (response.status === 429) msg = "Limite de requisições excedido. Tente novamente mais tarde.";
                throw new Error(msg);
            }

            if (!data) throw new Error("Falha na comunicação com os servidores galáticos.");

            // Populate data
            apodTitle.textContent = data.title;

            // Nice Date Formatting
            const dateObj = new Date(data.date + 'T12:00:00'); // Centralize to avoid timezone shift
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            apodDate.textContent = dateObj.toLocaleDateString('pt-BR', options).toUpperCase();

            apodCopyright.textContent = data.copyright || 'Domínio Público / NASA';
            apodExplanation.textContent = data.explanation;

            // Media Handling
            if (data.media_type === 'video') {
                apodVideo.src = data.url;
                videoWrapper.classList.remove('hidden');
            } else {
                apodImage.src = data.hdurl || data.url;
                apodImage.classList.remove('hidden');
                hdLink.href = data.hdurl || data.url;
                hdLink.classList.toggle('hidden', !data.hdurl);
            }

            // Reveal Result
            resultContainer.classList.remove('hidden');

            // Smooth scroll to result
            setTimeout(() => {
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (error) {
            console.error('Portal Error:', error);
            errorText.textContent = error.message;
            errorContainer.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            loader.classList.add('hidden');
        }
    });
});
