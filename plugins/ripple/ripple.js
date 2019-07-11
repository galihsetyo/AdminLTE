const buttons = document.querySelectorAll('[data-animation="ripple"]');

[...buttons].forEach(button => {
    button.onmousedown = function (e) {

        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        const w = this.offsetWidth;

        const ripple = document.createElement('span');

        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.setProperty('--scale', w);

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.parentNode.removeChild(ripple);
        }, 500);
    }
})