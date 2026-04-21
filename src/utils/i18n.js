export const DEFAULT_LOCALE = 'zh'
export const SUPPORTED_LOCALES = ['zh', 'en']

const STORAGE_KEY = 'dev-cheat-sheet:locale'

const messages = {
  zh: {
    meta: {
      title: 'Dev Cheat Sheet',
      description: 'Dev Cheat Sheet - 面向开发者的命令、方法与工作流速查工作台',
      keywords: '开发者,速查表,cheatsheet,Git,npm,JavaScript,Shell,Windows cmd,PowerShell,Docker,Kubernetes,AI',
      ogTitle: 'Dev Cheat Sheet - 开发者外脑工作台',
      ogDescription: '把常用命令、代码方法与调试知识集中到一个可搜索、可收藏、可快速筛选的工作台。'
    },
    sidebar: {
      panel: 'Quick Panel',
      title: '移动筛选面板',
      desc: '在手机上快速切换分类、标签和当前筛选上下文。'
    },
    brand: {
      subtitle: 'Command Intelligence Desk'
    },
    search: {
      placeholder: '搜索命令、方法、标签、技巧或错误码…',
      hint: '聚焦搜索'
    },
    controls: {
      decreaseFont: '缩小字体',
      increaseFont: '放大字体',
      favoritesOnly: '仅看收藏',
      toggleTheme: '切换主题',
      toggleSidebar: '打开筛选面板',
      switchLanguage: '切换语言'
    },
    hero: {
      eyebrow: 'Developer Intelligence Board',
      title: '把常用命令和方法，折叠成一个真正顺手的工作台。',
      desc: '集中管理 Git、npm、JavaScript、Shell、Windows cmd 等高频知识，用搜索、筛选、收藏和历史记录把“查资料”缩短成几秒钟。',
      chipSearch: '/ 聚焦搜索',
      chipEsc: 'Esc 一键清空',
      chipHelp: '? 查看快捷键',
      chipAI: 'AI 兜底解释'
    },
    overview: {
      snapshot: 'Workspace Snapshot',
      title: '当前工作台状态',
      live: 'Live',
      totalItems: '命令总数',
      visibleItems: '当前可见',
      groups: '知识卡片',
      favorites: '我的收藏',
      waiting: '等待数据加载…',
      clearFilters: '清空筛选'
    },
    recent: {
      eyebrow: 'Recent Trail',
      title: '最近浏览'
    },
    filters: {
      category: '分类',
      tags: '标签',
      all: '全部',
      clear: '清空当前筛选',
      logicOrTitle: '匹配任意一个标签',
      logicAndTitle: '必须同时匹配所有标签'
    },
    empty: {
      title: '没有找到匹配内容',
      desc: '试试别的关键词、切换分类标签，或者清空筛选后重新检索。',
      reset: '清空当前筛选',
      searchTitle: '没有找到「{{query}}」的匹配内容',
      searchDesc: '试试更短的关键词、切换分类标签，或者让 AI 补充解释。',
      filteredTitle: '当前筛选条件下没有结果',
      filteredDesc: '可以清空筛选，或改成更宽松的标签组合后重新查看。'
    },
    footer: {
      shortcuts: '查看快捷键'
    },
    system: {
      dataLoadFailed: '数据加载失败',
      aiUnavailable: 'AI 服务暂不可用'
    },
    state: {
      keyword: '关键词',
      category: '分类',
      tags: '标签',
      favorites: '仅看收藏',
      none: '当前未启用筛选，正在展示完整知识库。'
    },
    results: {
      full: '当前展示完整知识库，共 {{totalItems}} 条命令，覆盖 {{totalGroups}} 张知识卡。',
      filtered: '当前命中 {{visibleItems}} 条命令，来自 {{groups}} 张知识卡。'
    },
    card: {
      eyebrow: 'Knowledge Sheet',
      itemCount: '{{count}} 条',
      expand: '展开更多命令',
      collapse: '收起列表',
      copy: '复制命令',
      favorite: '收藏命令',
      copied: '命令已复制'
    },
    modal: {
      fallbackTitle: '命令详情',
      close: '关闭弹窗',
      copy: '复制命令',
      askAI: '用 AI 解释',
      usage: '作用',
      example: '示例',
      notes: '注意',
      empty: '这条命令还没有详细说明，可以直接用 AI 继续追问。'
    },
    ai: {
      eyebrow: 'Fallback Assistant',
      title: '本地库里没有直接命中结果',
      desc: '可以继续让 AI 解释「{{query}}」，用它补足命令含义、参数差异或排错思路。',
      ask: '让 AI 解释这个问题',
      loading: '正在生成解释…',
      unavailable: 'AI 服务暂不可用：{{message}}'
    },
    error: {
      eyebrow: 'Error Match',
      cause: '原因',
      solution: '解决'
    },
    shortcuts: {
      title: '快捷键',
      focusSearch: '聚焦搜索',
      globalSearch: '全局搜索',
      clearOrClose: '清空 / 关闭',
      showHelp: '显示帮助',
      close: '关闭'
    },
    locale: {
      zh: '中文',
      en: 'English'
    }
  },
  en: {
    meta: {
      title: 'Dev Cheat Sheet',
      description: 'Dev Cheat Sheet - a searchable desk for developer commands, APIs, and workflows.',
      keywords: 'developer,cheat sheet,Git,npm,JavaScript,Shell,Windows cmd,PowerShell,Docker,Kubernetes,AI',
      ogTitle: 'Dev Cheat Sheet - Developer Command Desk',
      ogDescription: 'Collect everyday commands, code APIs, and debugging knowledge into one searchable, pinnable workspace.'
    },
    sidebar: {
      panel: 'Quick Panel',
      title: 'Mobile Filter Panel',
      desc: 'Switch categories, tags, and the current filter context quickly on small screens.'
    },
    brand: {
      subtitle: 'Command Intelligence Desk'
    },
    search: {
      placeholder: 'Search commands, APIs, tags, tips, or error codes…',
      hint: 'Focus search'
    },
    controls: {
      decreaseFont: 'Decrease font size',
      increaseFont: 'Increase font size',
      favoritesOnly: 'Show favorites only',
      toggleTheme: 'Toggle theme',
      toggleSidebar: 'Open filter panel',
      switchLanguage: 'Switch language'
    },
    hero: {
      eyebrow: 'Developer Intelligence Board',
      title: 'Fold everyday commands and methods into a desk that actually feels fast to use.',
      desc: 'Search, filter, bookmark, and revisit Git, npm, JavaScript, Shell, Windows cmd, and more from one command workspace.',
      chipSearch: '/ Focus search',
      chipEsc: 'Esc clear filters',
      chipHelp: '? Keyboard shortcuts',
      chipAI: 'AI fallback explain'
    },
    overview: {
      snapshot: 'Workspace Snapshot',
      title: 'Current Desk State',
      live: 'Live',
      totalItems: 'Total Commands',
      visibleItems: 'Visible Now',
      groups: 'Knowledge Sheets',
      favorites: 'Favorites',
      waiting: 'Waiting for data…',
      clearFilters: 'Clear filters'
    },
    recent: {
      eyebrow: 'Recent Trail',
      title: 'Recently Viewed'
    },
    filters: {
      category: 'Categories',
      tags: 'Tags',
      all: 'All',
      clear: 'Clear current filters',
      logicOrTitle: 'Match any selected tag',
      logicAndTitle: 'Match all selected tags'
    },
    empty: {
      title: 'No matching content found',
      desc: 'Try another keyword, switch filters, or clear the current selection and search again.',
      reset: 'Clear current filters',
      searchTitle: 'No results for "{{query}}"',
      searchDesc: 'Try a shorter keyword, switch filters, or let AI fill in the gap.',
      filteredTitle: 'No results under the current filters',
      filteredDesc: 'Clear the filters or use a looser tag combination and try again.'
    },
    footer: {
      shortcuts: 'View shortcuts'
    },
    system: {
      dataLoadFailed: 'Failed to load data',
      aiUnavailable: 'AI service is temporarily unavailable'
    },
    state: {
      keyword: 'Keyword',
      category: 'Category',
      tags: 'Tags',
      favorites: 'Favorites only',
      none: 'No filters enabled. Showing the full knowledge base.'
    },
    results: {
      full: 'Showing the full knowledge base: {{totalItems}} commands across {{totalGroups}} sheets.',
      filtered: 'Showing {{visibleItems}} commands from {{groups}} sheets.'
    },
    card: {
      eyebrow: 'Knowledge Sheet',
      itemCount: '{{count}} items',
      expand: 'Expand more commands',
      collapse: 'Collapse list',
      copy: 'Copy command',
      favorite: 'Favorite command',
      copied: 'Command copied'
    },
    modal: {
      fallbackTitle: 'Command Details',
      close: 'Close dialog',
      copy: 'Copy command',
      askAI: 'Explain with AI',
      usage: 'Usage',
      example: 'Example',
      notes: 'Notes',
      empty: 'This command does not have detailed notes yet. You can keep asking AI for follow-up context.'
    },
    ai: {
      eyebrow: 'Fallback Assistant',
      title: 'No direct match in the local library',
      desc: 'Ask AI to explain "{{query}}" and fill in meaning, parameter differences, or troubleshooting context.',
      ask: 'Ask AI to explain this',
      loading: 'Generating explanation…',
      unavailable: 'AI service is temporarily unavailable: {{message}}'
    },
    error: {
      eyebrow: 'Error Match',
      cause: 'Cause',
      solution: 'Fix'
    },
    shortcuts: {
      title: 'Keyboard shortcuts',
      focusSearch: 'Focus search',
      globalSearch: 'Global search',
      clearOrClose: 'Clear / Close',
      showHelp: 'Show help',
      close: 'Close'
    },
    locale: {
      zh: 'Chinese',
      en: 'English'
    }
  }
}

const categoryTranslations = {
  '终端': 'Terminal',
  '系统': 'System',
  '容器': 'Containers',
  '数据库': 'Databases',
  '测试': 'Testing',
  '云': 'Cloud',
  '前端': 'Frontend',
  '协作': 'Collaboration',
  '移动': 'Mobile',
  '工具': 'Tools'
}

const tagTranslations = {
  '基础': 'Basics',
  '进阶': 'Advanced',
  '高频': 'Frequent',
  '面试': 'Interview',
  '易错': 'Pitfalls'
}

const groupTranslations = {
  git: {
    title: 'Git Command Cheat Sheet',
    content: 'A quick Git reference covering basic, advanced, daily, interview, and high-risk workflows.'
  },
  npm: {
    title: 'npm / pnpm Command Cheat Sheet',
    content: 'A quick npm / pnpm reference covering beginner, advanced, daily, interview, and failure-prone package workflows.'
  },
  'js-array': {
    title: 'JavaScript Array Methods',
    content: 'A JavaScript array reference spanning basic operations, iteration, search, and modern immutable APIs.'
  },
  'css-flex': {
    title: 'CSS Flexbox Reference',
    content: 'Core properties and layout mental models for CSS Flexbox.'
  },
  shell: {
    title: 'Linux / Shell Commands',
    content: 'A Linux / Shell reference covering daily commands, permissions, processes, networking, and scripting.'
  },
  'windows-cmd': {
    title: 'Windows cmd Commands',
    content: 'A Windows cmd reference for core commands, filesystem work, network diagnostics, batch scripts, and handy tricks.'
  },
  powershell: {
    title: 'PowerShell Commands',
    content: 'A PowerShell reference for filesystem work, services, text processing, HTTP requests, and automation.'
  },
  macos: {
    title: 'macOS Commands',
    content: 'A macOS command reference for Finder integration, clipboard work, system settings, indexing, processes, and troubleshooting.'
  },
  'package-managers': {
    title: 'System Package Manager Commands',
    content: 'High-frequency install, update, and lookup commands across mainstream Linux, macOS, and Windows package managers.'
  },
  docker: {
    title: 'Docker / Compose Commands',
    content: 'Frequent Docker commands for images, containers, Compose orchestration, logging, troubleshooting, and cleanup.'
  },
  kubernetes: {
    title: 'Kubernetes / Helm Commands',
    content: 'Frequent Kubernetes and Helm commands for resource inspection, logs, rollouts, and package management.'
  },
  databases: {
    title: 'Database CLI Commands',
    content: 'Common client, dump, import, and inspection commands for MySQL, PostgreSQL, SQLite, Redis, and MongoDB.'
  },
  python: {
    title: 'Python Development Commands',
    content: 'Common Python commands for interpreters, virtual environments, dependency management, testing, formatting, and tooling.'
  },
  'java-jvm': {
    title: 'Java / JVM Commands',
    content: 'Common Java, Maven, Gradle, and JVM diagnostics commands for build, run, and inspection workflows.'
  },
  go: {
    title: 'Go Commands',
    content: 'Common Go toolchain commands for modules, build, run, test, formatting, and static analysis.'
  },
  rust: {
    title: 'Rust / Cargo Commands',
    content: 'Frequent Rust and Cargo commands for toolchain updates, project management, build, test, formatting, and linting.'
  },
  'cpp-native': {
    title: 'C / C++ and Native Build Commands',
    content: 'Common GCC, Clang, Make, CMake, and native debugging commands in one place.'
  },
  dotnet: {
    title: '.NET Commands',
    content: 'Frequent .NET commands for project scaffolding, restore, run, test, publish, and EF Core migrations.'
  },
  php: {
    title: 'PHP / Composer / Laravel Commands',
    content: 'Frequent PHP commands covering runtime execution, Composer dependency management, and Laravel development.'
  },
  ruby: {
    title: 'Ruby / Bundler / Rails Commands',
    content: 'Frequent Ruby commands covering runtime execution, Gem / Bundler management, and Rails development.'
  },
  'frontend-toolchain': {
    title: 'Frontend Toolchain Commands',
    content: 'High-frequency commands for Yarn, Bun, TypeScript, linting, formatting, and modern frontend build tools.'
  },
  'github-cli': {
    title: 'GitHub CLI Commands',
    content: 'Frequent GitHub CLI commands for auth, repositories, pull requests, issues, Actions, and releases.'
  },
  'mobile-dev': {
    title: 'Mobile Development Commands',
    content: 'Core mobile development commands spanning ADB, Flutter, Gradle, and iOS command-line builds.'
  },
  vscode: {
    title: 'VS Code Shortcuts',
    content: 'High-frequency VS Code shortcuts for Windows and macOS.'
  },
  'typescript-react': {
    title: 'TypeScript / React / Next.js Commands',
    content: 'Common commands for TypeScript apps, React scaffolding, Next.js workflows, and component-driven frontend delivery.'
  },
  'testing-qa': {
    title: 'Testing / QA Commands',
    content: 'Common commands for unit testing, end-to-end testing, coverage, and browser automation across mainstream stacks.'
  },
  'cloud-iac': {
    title: 'Cloud / IaC Commands',
    content: 'High-frequency AWS CLI, Terraform, and cloud deployment commands used in modern DevOps workflows.'
  },
  'editor-cli': {
    title: 'Vim / Neovim / tmux Commands',
    content: 'Frequent editor and terminal multiplexer commands for keyboard-first development workflows.'
  }
}

function resolveMessage(locale, key) {
  return key.split('.').reduce((value, segment) => value?.[segment], messages[locale])
}

function interpolate(template, params = {}) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, token) => String(params[token] ?? ''))
}

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

export function getStoredLocale() {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? normalizeLocale(stored) : null
  } catch {
    return null
  }
}

export function getPreferredLocale() {
  const stored = getStoredLocale()
  if (stored) return stored
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  return normalizeLocale(navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en')
}

export function getLocale() {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  return normalizeLocale(document.documentElement.dataset.locale || getPreferredLocale())
}

export function setLocale(locale) {
  const nextLocale = normalizeLocale(locale)

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.locale = nextLocale
    document.documentElement.lang = nextLocale === 'zh' ? 'zh-CN' : 'en'
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // Ignore storage failures.
    }
  }

  updateDocumentMeta(nextLocale)
  return nextLocale
}

export function t(key, params = {}, locale = getLocale()) {
  const normalizedLocale = normalizeLocale(locale)
  const value = resolveMessage(normalizedLocale, key) ?? resolveMessage(DEFAULT_LOCALE, key) ?? key
  return interpolate(value, params)
}

export function translateTag(tag, locale = getLocale()) {
  if (normalizeLocale(locale) === 'zh') return tag
  return tagTranslations[tag] || tag
}

export function translateCategory(category, locale = getLocale()) {
  if (normalizeLocale(locale) === 'zh') return category
  return categoryTranslations[category] || category
}

export function translateGroupTitle(groupId, fallback, locale = getLocale()) {
  if (normalizeLocale(locale) === 'zh') return fallback
  return groupTranslations[groupId]?.title || fallback
}

export function translateGroupContent(groupId, fallback, locale = getLocale()) {
  if (normalizeLocale(locale) === 'zh') return fallback
  return groupTranslations[groupId]?.content || fallback
}

export function applyI18n(root = document, locale = getLocale()) {
  if (!root?.querySelectorAll) return

  root.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n, {}, locale)
  })

  root.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder, {}, locale))
  })

  root.querySelectorAll('[data-i18n-title]').forEach(node => {
    node.setAttribute('title', t(node.dataset.i18nTitle, {}, locale))
  })

  root.querySelectorAll('[data-i18n-aria]').forEach(node => {
    node.setAttribute('aria-label', t(node.dataset.i18nAria, {}, locale))
  })
}

export function updateDocumentMeta(locale = getLocale()) {
  if (typeof document === 'undefined') return

  document.title = t('meta.title', {}, locale)

  const metaDescription = document.querySelector('meta[name="description"]')
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')

  if (metaDescription) metaDescription.setAttribute('content', t('meta.description', {}, locale))
  if (metaKeywords) metaKeywords.setAttribute('content', t('meta.keywords', {}, locale))
  if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle', {}, locale))
  if (ogDescription) ogDescription.setAttribute('content', t('meta.ogDescription', {}, locale))
}
