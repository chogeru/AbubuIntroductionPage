/* ============================================================
   KENICHI HAYASHI PORTFOLIO — JAVASCRIPT
   ============================================================
   1. Nav: スクロール検知 + ハンバーガーメニュー
   2. スクロールリビール (IntersectionObserver)
   3. Works フィルタリング (カテゴリタブ)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------
    // 1. Navigation
    // -------------------------------------------------------
    const nav        = document.getElementById('nav');
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');

    // スクロールで .scrolled を付与
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ハンバーガーの開閉
    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    // モバイルメニューのリンクをクリックしたらメニューを閉じる
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'メニューを開く');
        });
    });

    // メニュー外をタップしたら閉じる
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('is-open') &&
            !nav.contains(e.target)) {
            nav.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });


    // -------------------------------------------------------
    // 2. Scroll Reveal (IntersectionObserver)
    // -------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一度表示したら監視解除 (パフォーマンス最適化)
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // スキルカードにスタガーアニメーション
    document.querySelector('.skills__grid')
        ?.querySelectorAll('.reveal')
        .forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.07}s`;
        });


    // -------------------------------------------------------
    // 3. Works フィルタリング
    // -------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workGroups = document.querySelectorAll('.works__group');
    const worksCount = document.getElementById('worksCount');
    const allCards   = document.querySelectorAll('.work-card');

    // メタバースのサブグループ: カードが0件なら非表示
    document.querySelectorAll('.works__subgroup').forEach(sub => {
        const hasCards = sub.querySelectorAll('.work-card').length > 0;
        sub.classList.toggle('is-empty', !hasCards);
    });

    function countVisible(filter) {
        if (filter === 'all') return allCards.length;
        return document.querySelectorAll(`.work-card[data-category="${filter}"]`).length;
    }

    function applyFilter(filter) {
        // グループの表示/非表示
        workGroups.forEach(group => {
            const match = filter === 'all' || group.dataset.group === filter;
            group.classList.toggle('is-hidden', !match);
        });

        // 件数更新
        const n = countVisible(filter);
        worksCount.textContent = n > 0 ? `${n} 件` : '';

        // 表示グループ内カードにスタガー付与
        workGroups.forEach(group => {
            if (group.classList.contains('is-hidden')) return;
            group.querySelectorAll('.work-card').forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.06}s`;
            });
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            applyFilter(btn.dataset.filter);
        });
    });

    // 初期表示
    applyFilter('all');


    // -------------------------------------------------------
    // 4. ページトップへ戻るボタン
    // -------------------------------------------------------
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // -------------------------------------------------------
    // 5. Gallery Modal
    // -------------------------------------------------------
    const modal      = document.getElementById('galleryModal');
    const modalImg   = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc  = document.getElementById('modalDesc');
    const modalDots  = document.getElementById('modalDots');
    const modalPrev  = document.getElementById('modalPrev');
    const modalNext  = document.getElementById('modalNext');
    const modalClose = document.getElementById('modalClose');

    let gallery = [];
    let gIndex  = 0;

    function showModalImage() {
        modalImg.src = gallery[gIndex];
        modalImg.alt = `${gIndex + 1} / ${gallery.length}`;
        modalPrev.hidden = gallery.length <= 1;
        modalNext.hidden = gallery.length <= 1;
        modalDots.querySelectorAll('.modal__dot').forEach((d, i) =>
            d.classList.toggle('is-active', i === gIndex));
    }

    function buildDots() {
        modalDots.innerHTML = '';
        if (gallery.length <= 1) return;
        gallery.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'modal__dot' + (i === gIndex ? ' is-active' : '');
            d.setAttribute('aria-label', `${i + 1}枚目`);
            d.addEventListener('click', () => { gIndex = i; showModalImage(); });
            modalDots.appendChild(d);
        });
    }

    function openModal(images, title, desc) {
        gallery = images;
        gIndex  = 0;
        modalTitle.textContent = title;
        modalDesc.textContent  = desc.trim();
        buildDots();
        showModalImage();
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    document.querySelector('.modal__backdrop').addEventListener('click', closeModal);

    modalPrev.addEventListener('click', () => {
        gIndex = (gIndex - 1 + gallery.length) % gallery.length;
        showModalImage();
    });

    modalNext.addEventListener('click', () => {
        gIndex = (gIndex + 1) % gallery.length;
        showModalImage();
    });

    document.addEventListener('keydown', e => {
        if (modal.hidden) return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowLeft')  { gIndex = (gIndex - 1 + gallery.length) % gallery.length; showModalImage(); }
        if (e.key === 'ArrowRight') { gIndex = (gIndex + 1) % gallery.length; showModalImage(); }
    });

    document.querySelectorAll('.work-card[data-gallery]').forEach(card => {
        const thumb  = card.querySelector('img.work-card__thumb');
        if (!thumb) return;
        const images = card.dataset.gallery.split(',').map(s => s.trim());
        const title  = card.querySelector('.work-card__title')?.textContent ?? '';
        const desc   = card.querySelector('.work-card__desc')?.textContent  ?? '';
        thumb.addEventListener('click', () => openModal(images, title, desc));
    });


    // -------------------------------------------------------
    // 6. コピーライト年自動更新
    // -------------------------------------------------------
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});
