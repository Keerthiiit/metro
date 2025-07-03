document.addEventListener('DOMContentLoaded', function () {
    let next = document.querySelector('.next');
    let prev = document.querySelector('.prev');
    let autoSlideInterval;

    function startAutoSlide() {
        // Start the auto-slide interval
        autoSlideInterval = setInterval(() => {
            next.click(); // Simulate a click on the next button every 3 seconds
        }, 7000); // Change the interval as needed
    }

    function resetAutoSlide() {
        // Clear the existing interval and restart it
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    next.addEventListener('click', function () {
        let items = document.querySelectorAll('.item');
        document.querySelector('.slide').appendChild(items[0]);
        updateContentVisibility();
        resetAutoSlide(); // Reset timer on next button click
    });

    prev.addEventListener('click', function () {
        let items = document.querySelectorAll('.item');
        document.querySelector('.slide').prepend(items[items.length - 1]);
        updateContentVisibility();
        resetAutoSlide(); // Reset timer on previous button click
    });

    function updateContentVisibility() {
        let items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.querySelector('.content').style.display = 'none'; // Hide all content
        });
        items[1].querySelector('.content').style.display = 'block'; // Show the content of the current active slide
    }

    // Start the auto-slide when the page loads
    startAutoSlide();
});
