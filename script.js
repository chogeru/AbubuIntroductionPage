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

});
