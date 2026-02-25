(function (global) {

  const { createApp, reactive, ref, h } = Vue;

  const ToastComponent = {
    props: ['toast', 'remove'],
    setup(props) {

      const progress = ref(100);
      let startTime;
      let timeLeft = props.toast.duration;
      let frame;

      function startTimer() {
        startTime = Date.now();

        function update() {
          const elapsed = Date.now() - startTime;
          const percent = Math.max(0, 1 - elapsed / timeLeft);
          progress.value = percent * 100;

          if (elapsed >= timeLeft) {
            props.remove(props.toast.id);
          } else {
            frame = requestAnimationFrame(update);
          }
        }

        frame = requestAnimationFrame(update);
      }

      function pause() {
        cancelAnimationFrame(frame);
        timeLeft -= Date.now() - startTime;
      }

      function resume() {
        startTimer();
      }

      function close() {
        cancelAnimationFrame(frame);
        props.remove(props.toast.id);
      }

      if (props.toast.duration > 0) {
        startTimer();
      }

      return () =>
        h(
          'div',
          {
            onMouseenter: pause,
            onMouseleave: resume,
            class: `
              relative flex gap-3 w-[320px] p-4 rounded-xl shadow-lg
              bg-white text-gray-800
              dark:bg-gray-800 dark:text-gray-100
              transition-all duration-300
            `
          },
          [
            h('div', { class: iconClass(props.toast.type) }, iconSvg(props.toast.type)),

            h('div', { class: 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400' }, props.toast.message),

            h(
              'button',
              {
                onClick: close,
                class: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              },
              '×'
            ),

            h('div', {
              class: 'absolute bottom-0 left-0 w-full h-1 bg-current opacity-20 rounded-b-xl'
            }, [
              h('div', {
                class: 'h-full bg-current transition-all',
                style: { width: progress.value + '%' }
              })
            ])
          ]
        );
    }
  };

  function iconClass(type) {
    return {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    }[type] || 'text-blue-500';
  }

  function iconSvg(type) {
    const icons = {
      success: 'M5 13l4 4L19 7',
      error: 'M6 18L18 6M6 6l12 12',
      warning: 'M12 8v4m0 4h.01',
      info: 'M13 16h-1v-4h-1m1-4h.01'
    };

    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: icons[type] || icons.info
      })
    ]);
  }

  const ToastApp = {
    setup() {

      const toasts = reactive([]);
      let counter = 0;

      function remove(id) {
        const index = toasts.findIndex(t => t.id === id);
        if (index !== -1) toasts.splice(index, 1);
      }

      function show(options) {
        toasts.push({
          id: counter++,
          message: options.message || '',
          type: options.type || 'info',
          duration: options.duration ?? 4000
        });
      }

      global.toast = show;

      return () =>
        h(
          'div',
          {
            class: 'fixed top-5 right-5 flex flex-col gap-3 z-50'
          },
          toasts.map(t =>
            h(ToastComponent, {
              key: t.id,
              toast: t,
              remove
            })
          )
        );
    }
  };

  const mountPoint = document.createElement('div');
  document.body.appendChild(mountPoint);

  createApp(ToastApp).mount(mountPoint);

})(window);