(function (global) {
  const { computed, createApp, h, onBeforeUnmount, onMounted, reactive, ref } = Vue;

  const TOAST_TYPES = {
    success: {
      title: 'Success',
      accent: '#12B76A',
      icon: 'M5 13l4 4L19 7'
    },
    error: {
      title: 'Error',
      accent: '#F04438',
      icon: 'M6 18L18 6M6 6l12 12'
    },
    warning: {
      title: 'Warning',
      accent: '#F79009',
      icon: 'M12 8v5m0 3h.01'
    },
    info: {
      title: 'Info',
      accent: '#465FFF',
      icon: 'M13 16h-1v-4h-1m1-4h.01'
    }
  };

  function getTypeConfig(type) {
    return TOAST_TYPES[type] || TOAST_TYPES.info;
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace('#', '');
    const fullHex = normalized.length === 3
      ? normalized.split('').map(char => char + char).join('')
      : normalized;

    const red = parseInt(fullHex.slice(0, 2), 16);
    const green = parseInt(fullHex.slice(2, 4), 16);
    const blue = parseInt(fullHex.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const ToastComponent = {
    props: ['toast', 'remove', 'isDark'],
    setup(props) {
      const hasAutoDismiss = Number.isFinite(props.toast.duration) && props.toast.duration > 0;
      const totalDuration = hasAutoDismiss ? props.toast.duration : 0;
      const progress = ref(100);

      let frame = null;
      let startTime = 0;
      let remainingAtStart = totalDuration;
      let remaining = totalDuration;

      const typeConfig = computed(() => getTypeConfig(props.toast.type));
      const palette = computed(() => {
        const accent = typeConfig.value.accent;
        const dark = props.isDark;

        return {
          accent,
          icon: typeConfig.value.icon,
          title: props.toast.title || typeConfig.value.title,
          cardBackground: dark ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          cardBorder: dark ? 'rgba(75, 85, 99, 0.75)' : 'rgba(229, 231, 235, 0.95)',
          titleColor: dark ? '#F9FAFB' : '#111827',
          messageColor: dark ? '#D1D5DB' : '#4B5563',
          closeColor: dark ? '#9CA3AF' : '#6B7280',
          closeHoverBackground: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(17, 24, 39, 0.06)',
          iconBackground: hexToRgba(accent, dark ? 0.22 : 0.12),
          progressTrack: dark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(17, 24, 39, 0.08)'
        };
      });

      function cancelFrame() {
        if (frame !== null) {
          cancelAnimationFrame(frame);
          frame = null;
        }
      }

      function startTimer() {
        if (!hasAutoDismiss || remaining <= 0) return;

        cancelFrame();
        startTime = Date.now();
        remainingAtStart = remaining;

        const update = () => {
          const elapsed = Date.now() - startTime;
          remaining = Math.max(0, remainingAtStart - elapsed);
          progress.value = (remaining / totalDuration) * 100;

          if (remaining <= 0) {
            props.remove(props.toast.id);
            return;
          }

          frame = requestAnimationFrame(update);
        };

        frame = requestAnimationFrame(update);
      }

      function pause() {
        if (!hasAutoDismiss || frame === null) return;
        remaining = Math.max(0, remainingAtStart - (Date.now() - startTime));
        progress.value = (remaining / totalDuration) * 100;
        cancelFrame();
      }

      function resume() {
        if (!hasAutoDismiss || remaining <= 0 || frame !== null) return;
        startTimer();
      }

      function close() {
        cancelFrame();
        props.remove(props.toast.id);
      }

      if (hasAutoDismiss) {
        startTimer();
      }

      onBeforeUnmount(() => {
        cancelFrame();
      });

      return () => {
        const view = palette.value;
        const message = props.toast.message == null ? '' : String(props.toast.message);

        return h(
          'div',
          {
            onMouseenter: pause,
            onMouseleave: resume,
            role: 'alert',
            'aria-live': 'polite',
            style: {
              pointerEvents: 'auto',
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '42px minmax(0, 1fr) 28px',
              gap: '12px',
              alignItems: 'start',
              width: '100%',
              borderRadius: '14px',
              border: `1px solid ${view.cardBorder}`,
              borderLeft: `4px solid ${view.accent}`,
              background: view.cardBackground,
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.24)',
              backdropFilter: 'blur(8px)',
              color: view.titleColor,
              overflow: 'hidden',
              padding: '14px 14px 14px 12px'
            }
          },
          [
            h(
              'div',
              {
                style: {
                  height: '32px',
                  width: '32px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: view.iconBackground,
                  color: view.accent,
                  marginTop: '1px'
                }
              },
              [iconSvg(view.icon)]
            ),
            h('div', { style: { minWidth: 0, paddingRight: '4px' } }, [
              h(
                'div',
                {
                  style: {
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: '600',
                    color: view.titleColor
                  }
                },
                view.title
              ),
              h(
                'div',
                {
                  style: {
                    marginTop: '2px',
                    fontSize: '13px',
                    lineHeight: '19px',
                    color: view.messageColor,
                    wordBreak: 'break-word'
                  }
                },
                message
              )
            ]),
            h(
              'button',
              {
                onClick: close,
                type: 'button',
                'aria-label': 'Close notification',
                style: {
                  height: '28px',
                  width: '28px',
                  borderRadius: '8px',
                  border: 'none',
                  marginLeft: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  lineHeight: '1',
                  color: view.closeColor,
                  background: 'transparent',
                  transition: 'background-color 150ms ease, color 150ms ease'
                },
                onMouseenter: event => {
                  event.currentTarget.style.background = view.closeHoverBackground;
                  event.currentTarget.style.color = view.titleColor;
                },
                onMouseleave: event => {
                  event.currentTarget.style.background = 'transparent';
                  event.currentTarget.style.color = view.closeColor;
                }
              },
              '×'
            ),
            hasAutoDismiss
              ? h(
                'div',
                {
                  style: {
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    height: '3px',
                    background: view.progressTrack
                  }
                },
                [
                  h('div', {
                    style: {
                      height: '100%',
                      width: `${progress.value}%`,
                      background: view.accent,
                      transition: 'width 90ms linear'
                    }
                  })
                ]
              )
              : null
          ]
        );
      };
    }
  };

  function iconSvg(path) {
    return h(
      'svg',
      {
        width: '18',
        height: '18',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'aria-hidden': 'true'
      },
      [
        h('path', {
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: path
        })
      ]
    );
  }

  const ToastApp = {
    setup() {
      const toasts = reactive([]);
      const isDark = ref(document.documentElement.classList.contains('dark'));

      let counter = 0;
      let observer = null;

      function remove(id) {
        const index = toasts.findIndex(toast => toast.id === id);
        if (index !== -1) toasts.splice(index, 1);
      }

      function show(options = {}) {
        const parsedDuration = Number(options.duration ?? 4000);

        toasts.push({
          id: counter++,
          message: options.message || '',
          title: options.title || '',
          type: options.type || 'info',
          duration: Number.isFinite(parsedDuration) ? parsedDuration : 4000
        });
      }

      onMounted(() => {
        observer = new MutationObserver(() => {
          isDark.value = document.documentElement.classList.contains('dark');
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        });
      });

      onBeforeUnmount(() => {
        if (observer) observer.disconnect();
      });

      global.toast = show;

      return () =>
        h(
          'div',
          {
            style: {
              position: 'fixed',
              top: '16px',
              right: '16px',
              width: 'min(94vw, 380px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: '1000000',
              pointerEvents: 'none'
            }
          },
          toasts.map(toast =>
            h(ToastComponent, {
              key: toast.id,
              toast,
              remove,
              isDark: isDark.value
            })
          )
        );
    }
  };

  const mountPoint = document.createElement('div');
  document.body.appendChild(mountPoint);
  createApp(ToastApp).mount(mountPoint);
})(window);
