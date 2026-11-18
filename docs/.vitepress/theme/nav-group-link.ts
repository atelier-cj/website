/**
 * VitePress 的导航分组只有「展开」没有链接：鼠标悬停展开子项，点击只切换展开。
 * 「生态」「库」两项要的是「点击直达 + 悬停展开」，所以在捕获阶段接管按钮的 click，
 * 拦下 VPFlyout 的 toggle 后自己走 SPA 路由。
 */
const GROUP_TARGETS: Record<string, string> = {
  生态: '/libs/atelier',
  库: '/libs/',
}

export function bindNavGroupLinks(navigate: (href: string) => void) {
  if (typeof document === 'undefined') return

  const groups = document.querySelectorAll<HTMLElement>('.VPNavBarMenuGroup')
  for (const group of groups) {
    const button = group.querySelector<HTMLButtonElement>('button.button')
    if (!button || button.dataset.atNavBound === '1') continue

    // 按钮内容是「文本 + 箭头图标」，箭头是空 span，取文本节点即可
    const label = (button.querySelector<HTMLElement>('.text')?.textContent ?? '').replace(/\s+/g, '')
    const href = GROUP_TARGETS[label]
    if (!href) continue

    button.dataset.atNavBound = '1'
    button.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        event.stopImmediatePropagation()
        navigate(href)
      },
      true,
    )
    // 键盘用户没有「悬停」，焦点落到按钮时也应当能直接进入
    button.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopImmediatePropagation()
      navigate(href)
    })
  }
}
