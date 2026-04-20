import { queryAIStream } from '../utils/aiClient.js'

let currentQuery = ''

export function renderAIPrompt(container, query) {
  if (query === currentQuery && container.children.length > 0) return
  currentQuery = query

  container.innerHTML = `
    <div class="bg-indigo-50 dark:bg-indigo-950/50 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        <span class="text-sm font-medium text-indigo-700 dark:text-indigo-300">本地未找到结果</span>
      </div>
      <button id="ai-ask-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
        让 AI 帮我解答「${escapeHtml(query)}」
      </button>
      <div id="ai-result" class="mt-3 hidden"></div>
    </div>
  `

  container.querySelector('#ai-ask-btn').addEventListener('click', () => {
    const resultEl = container.querySelector('#ai-result')
    const btn = container.querySelector('#ai-ask-btn')

    btn.disabled = true
    btn.textContent = '正在思考…'
    resultEl.classList.remove('hidden')
    resultEl.innerHTML = `
      <pre id="ai-stream-text" class="text-sm whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed"></pre>
      <span id="ai-cursor" class="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse align-middle ml-0.5"></span>
    `

    const textEl = resultEl.querySelector('#ai-stream-text')
    const cursor = resultEl.querySelector('#ai-cursor')

    queryAIStream(
      query,
      (chunk) => { textEl.textContent += chunk },
      () => { cursor.remove(); btn.classList.add('hidden') },
      (e) => {
        resultEl.innerHTML = `<p class="text-sm text-red-500">AI 服务暂不可用：${escapeHtml(e.message)}</p>`
        btn.disabled = false
        btn.textContent = `让 AI 帮我解答「${escapeHtml(query)}」`
      }
    )
  })
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
