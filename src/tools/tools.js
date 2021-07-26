export function debounce(func, delay) {
    //节流阀 / 防抖函数
    let timer = null;
    return function() {
      /*每被调用一次 就清除上次的定时器开启一个新定时器 延时调用func函数。
        如果像goodslist那样不断的图片加载成功 不断的调用debounce 就不断的销毁和重新开启定时器
         直到delay时间之内没有被再次调用 就执行定时器里的函数。 这样可以有效的减少函数的调用次数 达到节流效果。
      */
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this);
      }, delay);
    };
  }
  