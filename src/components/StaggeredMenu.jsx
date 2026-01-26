import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['#0891b2', '#06b6d4'], // Cyan/Teal defaults to match site
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    logoUrl = '/src/assets/images/BGZENBGIJObulat.png', // Use site logo default
    menuButtonColor = '#fff',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    isFixed = false,
    accentColor = '#06b6d4', // Cyan accent
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose,
    isOpen, // Controlled prop
    toggleRef // Ref to external toggle button if needed (optional)
}) => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);

    // Internal refs
    const plusHRef = useRef(null);
    const plusVRef = useRef(null);
    const iconRef = useRef(null);
    const textInnerRef = useRef(null);
    const textWrapRef = useRef(null);
    const [textLines, setTextLines] = useState(['Menu', 'Close']);

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);

    const toggleBtnRef = useRef(null);
    const busyRef = useRef(false);

    const itemEntranceTweenRef = useRef(null);

    // Sync internal state with external isOpen prop
    useEffect(() => {
        if (isOpen !== openRef.current) {
            if (isOpen) {
                handleExternalOpen();
            } else {
                handleExternalClose();
            }
        }
    }, [isOpen]);


    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;

            const plusH = plusHRef.current;
            const plusV = plusVRef.current;
            const icon = iconRef.current;
            const textInner = textInnerRef.current;

            let preLayers = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
            }
            preLayerElsRef.current = preLayers;

            const offscreen = position === 'left' ? -100 : 100;
            gsap.set([panel, ...preLayers], { xPercent: offscreen });

            if (plusH) gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
            if (plusV) gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
            if (icon) gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

            if (textInner) gsap.set(textInner, { yPercent: 0 });

            if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        if (itemEls.length) {
            const itemsStartRatio = 0.15;
            const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );

            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
                    itemsStart + 0.1
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;

            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all = [...layers, panel];
        closeTweenRef.current?.kill();

        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

                const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
                if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

                const socialTitle = panel.querySelector('.sm-socials-title');
                const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

                busyRef.current = false;
            }
        });
    }, [position]);

    // Exposed handlers
    const handleExternalOpen = () => {
        openRef.current = true;
        setOpen(true);
        playOpen();
    };

    const handleExternalClose = () => {
        openRef.current = false;
        setOpen(false);
        playClose();
    };

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateIcon(target);
        animateColor(target);
        animateText(target);
    }, [playOpen, playClose, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            if (onMenuClose) {
                onMenuClose();
            } else {
                handleExternalClose();
            }
        }
    }, [playClose, onMenuClose]);

    const animateIcon = useCallback(opening => {
        const icon = iconRef.current;
        const h = plusHRef.current;
        const v = plusVRef.current;
        if (!icon || !h || !v) return;

        spinTweenRef.current?.kill();

        if (opening) {
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power4.out' } })
                .to(h, { rotate: 45, duration: 0.5 }, 0)
                .to(v, { rotate: -45, duration: 0.5 }, 0);
        } else {
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power3.inOut' } })
                .to(h, { rotate: 0, duration: 0.35 }, 0)
                .to(v, { rotate: 90, duration: 0.35 }, 0)
                .to(icon, { rotate: 0, duration: 0.001 }, 0);
        }
    }, []);

    const animateColor = useCallback(
        opening => {
            const btn = toggleBtnRef.current;
            if (!btn) return;
            colorTweenRef.current?.kill();
            if (changeMenuColorOnOpen) {
                const targetColor = opening ? openMenuButtonColor : menuButtonColor;
                colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
            } else {
                gsap.set(btn, { color: menuButtonColor });
            }
        },
        [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;

        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const cycles = 3;

        const seq = [currentLabel];
        let last = currentLabel;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);

        setTextLines(seq);
        gsap.set(inner, { yPercent: 0 });

        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;

        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.5 + lineCount * 0.07,
            ease: 'power4.out'
        });
    }, []);


    return (
        <div
            className={`sm-scope pointer-events-none fixed top-0 left-0 w-full h-full z-[60] ${open ? 'pointer-events-auto' : ''}`}
        >
            <div
                className={
                    (className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full'
                }
                style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
                data-position={position}
                data-open={open || undefined}
            >
                <div
                    ref={preLayersRef}
                    className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
                    aria-hidden="true"
                >
                    {(() => {
                        const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
                        let arr = [...raw];
                        if (arr.length >= 3) {
                            const mid = Math.floor(arr.length / 2);
                            arr.splice(mid, 1);
                        }
                        return arr.map((c, i) => (
                            <div
                                key={i}
                                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                                style={{ background: c }}
                            />
                        ));
                    })()}
                </div>

                <aside
                    id="staggered-menu-panel"
                    ref={panelRef}
                    className={`staggered-menu-panel absolute top-0 right-0 h-full flex flex-col p-[2em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[16px] pointer-events-auto transition-colors duration-500
                        ${theme === 'dark' ? 'bg-[#11142F]/80 text-white' : 'bg-white/80 text-slate-800'}`}
                    style={{ WebkitBackdropFilter: 'blur(16px)' }}
                    aria-hidden={!open}
                >
                    <div className="flex justify-end mb-4">
                        <button onClick={closeMenu} className={`text-3xl transition-colors ${theme === 'dark' ? 'text-white hover:text-cyan-400' : 'text-slate-800 hover:text-cyan-500'}`}>
                            &times;
                        </button>
                    </div>

                    <div className="sm-panel-inner flex-1 flex flex-col gap-5">
                        <ul
                            className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
                            role="list"
                            data-numbering={displayItemNumbering || undefined}
                        >
                            {items && items.length ? (
                                items.map((it, idx) => (
                                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                        <a
                                            className={`sm-panel-item relative font-semibold text-[3rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[all] duration-150 ease-linear inline-block no-underline pr-[1.4em]
                                                ${theme === 'dark' ? 'text-white hover:text-[#00ffdc]' : 'text-black hover:text-cyan-600'}`}
                                            href={it.link}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (it.onClick) {
                                                    it.onClick(e);
                                                }
                                                closeMenu();
                                            }}
                                            aria-label={it.ariaLabel}
                                            data-index={idx + 1}
                                        >
                                            <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                                {it.label}
                                            </span>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                                    <span className="sm-panel-item relative font-semibold text-[3rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                            No items
                                        </span>
                                    </span>
                                </li>
                            )}
                        </ul>

                        {displaySocials && socialItems && socialItems.length > 0 && (
                            <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                                <h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">Socials</h3>
                                <ul
                                    className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                                    role="list"
                                >
                                    {socialItems.map((s, i) => (
                                        <li key={s.label + i} className="sm-socials-item">
                                            <a
                                                href={s.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`sm-socials-link text-[1.2rem] font-medium no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear
                                                    ${theme === 'dark' ? 'text-slate-300 hover:text-[#00ffdc]' : 'text-[#111] hover:text-cyan-600'}`}
                                            >
                                                {s.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 2em; overflow-y: auto; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: 100%; pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; font-weight: 600; font-size: 3rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
/* Fixed alignment for numbering */
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { 
    counter-increment: smItem; 
    content: counter(smItem, decimal-leading-zero); 
    position: absolute; 
    top: 50%;
    transform: translateY(-50%);
    right: 0; 
    font-size: 18px; 
    font-weight: 400; 
    color: var(--sm-accent, #ff0000); 
    letter-spacing: 0; 
    pointer-events: none; 
    user-select: none; 
    opacity: var(--sm-num-opacity, 0); 
}
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; padding: 1.5em; } .sm-scope .sm-panel-item { font-size: 2.5rem; } }
      `}</style>
        </div>
    );
};
