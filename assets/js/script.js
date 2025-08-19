// Theme toggle: switch label between "Light Mode" and "Dark Mode"
(function () {
    var body = document.querySelector('body');
    var btn = document.getElementById('darkModeToggle');
    if (!btn || !body) return;

    function updateToggleLabel() {
        var isLight = body.classList.contains('light');
        var label = isLight ? 'Dark Mode' : 'Light Mode';
        btn.textContent = label;
        btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    }

    btn.addEventListener('click', function () {
        body.classList.toggle('light');
        updateToggleLabel();
    });

    // Initialize label on load
    updateToggleLabel();
})();

// Mobile nav toggle
(function () {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function setExpanded(isOpen) {
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.classList.toggle('is-active', isOpen);
        menu.classList.toggle('is-open', isOpen);
    }

    toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        setExpanded(!isOpen);
    });

    // Close when clicking a link (useful on mobile)
    menu.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.closest('.nav-link')) {
            setExpanded(false);
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setExpanded(false);
    });
})();

// Project cards -> modal interactions
(function () {
    var modal = document.getElementById('projectModal');
    if (!modal) return;
    var backdrop = modal.querySelector('.modal-backdrop');
    var dialog = modal.querySelector('.modal-dialog');
    var closeBtn = modal.querySelector('.modal-close');
    var img = modal.querySelector('.modal-image');
    var title = modal.querySelector('.modal-title');
    var desc = modal.querySelector('.modal-desc');
    var tags = modal.querySelector('.modal-tags');
    var lastFocused = null;

    function openModal(data) {
        lastFocused = document.activeElement;
        if (data.image) img.src = data.image; else img.removeAttribute('src');
        title.textContent = data.title || '';
        desc.textContent = data.description || '';
        tags.innerHTML = '';
        if (data.tags && data.tags.length) {
            data.tags.forEach(function (t) {
                var el = document.createElement('span');
                el.className = 'tag';
                el.textContent = t;
                tags.appendChild(el);
            });
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.view-details');
        var card = btn ? btn.closest('.project-card') : e.target.closest('.project-card[data-open-on-card=true]');
        if (!btn && !card) return;
        if (!card) card = btn.closest('.project-card');
        if (!card) return;
        var data = {
            title: card.getAttribute('data-title'),
            description: card.getAttribute('data-description'),
            image: card.getAttribute('data-image'),
            tags: (card.getAttribute('data-tags') || '').split(',').filter(Boolean)
        };
        openModal(data);
    });

    // Close handlers
    [backdrop, closeBtn].forEach(function (el) { if (el) el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
})();