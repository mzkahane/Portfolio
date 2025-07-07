// Get modal elements
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
// Make all screenshots clickable
document.querySelectorAll('.screenshot').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
        modal.style.display = 'block';
        modalImg.src = this.src;
        captionText.textContent = this.alt || '';
    });
});
// Close modal on click of close button or outside image
closeBtn.onclick = function () {
    modal.style.display = 'none';
};
modal.onclick = function (e) {
    if (e.target === modal) modal.style.display = 'none';
};