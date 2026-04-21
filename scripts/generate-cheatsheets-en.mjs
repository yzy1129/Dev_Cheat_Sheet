import fs from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const sourceFile = path.join(rootDir, 'public', 'data', 'cheatsheets.json')
const targetFile = path.join(rootDir, 'public', 'data', 'cheatsheets.en.json')
const envFile = path.join(rootDir, '.env')

const model = 'doubao-seed-2-0-pro-260215'

const categoryMap = {
  Git: 'Git',
  'Node.js': 'Node.js',
  JavaScript: 'JavaScript',
  CSS: 'CSS',
  '终端': 'Terminal',
  Windows: 'Windows',
  macOS: 'macOS',
  '系统': 'System',
  '容器': 'Containers',
  '数据库': 'Databases',
  Python: 'Python',
  Java: 'Java',
  Go: 'Go',
  Rust: 'Rust',
  'C/C++': 'C/C++',
  '.NET': '.NET',
  PHP: 'PHP',
  Ruby: 'Ruby',
  '前端': 'Frontend',
  '协作': 'Collaboration',
  '移动': 'Mobile',
  '测试': 'Testing',
  '云': 'Cloud',
  '工具': 'Tools'
}

const tagMap = {
  '基础': 'Basics',
  '进阶': 'Advanced',
  '高频': 'Frequent',
  '面试': 'Interview',
  '易错': 'Pitfalls'
}

const groupTitleMap = {
  git: 'Git Command Cheat Sheet',
  npm: 'npm / pnpm Command Cheat Sheet',
  'js-array': 'JavaScript Array Methods',
  'css-flex': 'CSS Flexbox Reference',
  shell: 'Linux / Shell Commands',
  'windows-cmd': 'Windows cmd Commands',
  powershell: 'PowerShell Commands',
  macos: 'macOS Commands',
  'package-managers': 'System Package Manager Commands',
  docker: 'Docker / Compose Commands',
  kubernetes: 'Kubernetes / Helm Commands',
  databases: 'Database CLI Commands',
  python: 'Python Development Commands',
  'java-jvm': 'Java / JVM Commands',
  go: 'Go Commands',
  rust: 'Rust / Cargo Commands',
  'cpp-native': 'C / C++ and Native Build Commands',
  dotnet: '.NET Commands',
  php: 'PHP / Composer / Laravel Commands',
  ruby: 'Ruby / Bundler / Rails Commands',
  'frontend-toolchain': 'Frontend Toolchain Commands',
  'github-cli': 'GitHub CLI Commands',
  'mobile-dev': 'Mobile Development Commands',
  'typescript-react': 'TypeScript / React / Next.js Commands',
  'testing-qa': 'Testing / QA Commands',
  'cloud-iac': 'Cloud / IaC Commands',
  'editor-cli': 'Vim / Neovim / tmux Commands',
  vscode: 'VS Code Shortcuts'
}

const groupContentMap = {
  git: 'A quick Git reference covering basic, advanced, daily, interview, and high-risk workflows.',
  npm: 'A quick npm / pnpm reference covering beginner, advanced, daily, interview, and failure-prone package workflows.',
  'js-array': 'A JavaScript array reference spanning basic operations, iteration, search, and modern immutable APIs.',
  'css-flex': 'Core properties and layout mental models for CSS Flexbox.',
  shell: 'A Linux / Shell reference covering daily commands, permissions, processes, networking, and scripting.',
  'windows-cmd': 'A Windows cmd reference for core commands, filesystem work, network diagnostics, batch scripts, and handy tricks.',
  powershell: 'A PowerShell reference for filesystem work, services, text processing, HTTP requests, and automation.',
  macos: 'A macOS command reference for Finder integration, clipboard work, system settings, indexing, processes, and troubleshooting.',
  'package-managers': 'High-frequency install, update, and lookup commands across mainstream Linux, macOS, and Windows package managers.',
  docker: 'Frequent Docker commands for images, containers, Compose orchestration, logging, troubleshooting, and cleanup.',
  kubernetes: 'Frequent Kubernetes and Helm commands for resource inspection, logs, rollouts, and package management.',
  databases: 'Common client, dump, import, and inspection commands for MySQL, PostgreSQL, SQLite, Redis, and MongoDB.',
  python: 'Common Python commands for interpreters, virtual environments, dependency management, testing, formatting, and tooling.',
  'java-jvm': 'Common Java, Maven, Gradle, and JVM diagnostics commands for build, run, and inspection workflows.',
  go: 'Common Go toolchain commands for modules, build, run, test, formatting, and static analysis.',
  rust: 'Frequent Rust and Cargo commands for toolchain updates, project management, build, test, formatting, and linting.',
  'cpp-native': 'Common GCC, Clang, Make, CMake, and native debugging commands in one place.',
  dotnet: 'Frequent .NET commands for project scaffolding, restore, run, test, publish, and EF Core migrations.',
  php: 'Frequent PHP commands covering runtime execution, Composer dependency management, and Laravel development.',
  ruby: 'Frequent Ruby commands covering runtime execution, Gem / Bundler management, and Rails development.',
  'frontend-toolchain': 'High-frequency commands for Yarn, Bun, TypeScript, linting, formatting, and modern frontend build tools.',
  'github-cli': 'Frequent GitHub CLI commands for auth, repositories, pull requests, issues, Actions, and releases.',
  'mobile-dev': 'Core mobile development commands spanning ADB, Flutter, Gradle, and iOS command-line builds.',
  'typescript-react': 'High-frequency commands for TypeScript apps, React scaffolding, Next.js workflows, and component-driven frontend delivery.',
  'testing-qa': 'Common commands for unit testing, end-to-end testing, coverage, and browser automation across mainstream stacks.',
  'cloud-iac': 'High-frequency AWS CLI, Terraform, and cloud deployment commands used in modern DevOps workflows.',
  'editor-cli': 'Frequent editor and terminal multiplexer commands for keyboard-first development workflows.',
  vscode: 'High-frequency VS Code shortcuts for Windows and macOS.'
}

async function main() {
  const apiKey = await readApiKey()
  if (!apiKey) {
    throw new Error('Missing DOUBAO_API_KEY in .env')
  }

  const source = JSON.parse(await fs.readFile(sourceFile, 'utf8'))
  const translatedGroups = await loadExistingTranslations()
  const finished = new Set(translatedGroups.map(group => group.id))

  for (const group of source) {
    if (finished.has(group.id)) {
      console.log(`Skipping ${group.id}, already translated.`)
      continue
    }

    console.log(`Translating ${group.id} (${group.items.length} items)...`)
    const items = await translateGroupItems(group, apiKey)
    translatedGroups.push(buildEnglishGroup(group, items))
    await writeTranslations(translatedGroups)
  }

  await writeTranslations(translatedGroups)
  console.log(`Wrote ${targetFile}`)
}

async function readApiKey() {
  const env = await fs.readFile(envFile, 'utf8')
  const line = env.split(/\r?\n/).find(item => item.startsWith('DOUBAO_API_KEY='))
  return line?.slice('DOUBAO_API_KEY='.length).trim() || ''
}

async function loadExistingTranslations() {
  try {
    const file = await fs.readFile(targetFile, 'utf8')
    const groups = JSON.parse(file)
    if (Array.isArray(groups)) {
      console.log(`Loaded ${groups.length} translated groups from existing file.`)
      return groups
    }
  } catch {
    // No existing output yet.
  }
  return []
}

async function writeTranslations(groups) {
  await fs.writeFile(targetFile, `${JSON.stringify(groups, null, 2)}\n`, 'utf8')
}

function buildEnglishGroup(group, translatedItems) {
  const itemMap = new Map(translatedItems.map(item => [item.id, item]))

  return {
    id: group.id,
    title: groupTitleMap[group.id] || group.title,
    category: categoryMap[group.category] || group.category,
    tags: (group.tags || []).map(tag => tagMap[tag] || tag),
    content: groupContentMap[group.id] || group.content,
    items: group.items.map(item => {
      const translated = itemMap.get(item.id)
      if (!translated) {
        throw new Error(`Missing translated item ${item.id}`)
      }

      return {
        id: item.id,
        cmd: item.cmd,
        ...(item.code ? { code: item.code } : {}),
        desc: translated.desc,
        tags: (item.tags || []).map(tag => tagMap[tag] || tag),
        detail: {
          usage: translated.detail?.usage || '',
          example: translated.detail?.example || '',
          notes: translated.detail?.notes || ''
        }
      }
    })
  }
}

async function translateGroupItems(group, apiKey) {
  const payload = group.items.map(item => ({
    id: item.id,
    cmd: item.cmd,
    desc: item.desc,
    detail: {
      usage: item.detail?.usage || '',
      example: item.detail?.example || '',
      notes: item.detail?.notes || ''
    }
  }))

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const translated = await callTranslationApi(group.id, payload, apiKey)
      validateGroupItems(group, translated)
      return translated
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for ${group.id}: ${error.message}`)
      if (attempt === 3) throw error
      await sleep(1000 * attempt)
    }
  }

  throw new Error(`Failed to translate ${group.id}`)
}

async function callTranslationApi(groupId, items, apiKey) {
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      stream: false,
      messages: [
        {
          role: 'system',
          content: [
            'You are a senior technical translator.',
            'Translate Simplified Chinese cheat-sheet entries into concise, natural English for global developers.',
            'Return strict JSON only.',
            'Do not wrap the JSON in markdown.',
            'Preserve every id and every command token exactly.',
            'Keep command names, flags, file paths, URLs, package names, environment variables, and code literals unchanged.',
            'Translate only the human-readable explanatory text.',
            'Use short, documentation-style English.'
          ].join(' ')
        },
        {
          role: 'user',
          content: [
            'Translate the following item array for group:',
            groupId,
            '',
            'Return JSON in exactly this shape:',
            '{"items":[{"id":"...","desc":"...","detail":{"usage":"...","example":"...","notes":"..."}}]}',
            '',
            'Source JSON:',
            JSON.stringify(items)
          ].join('\n')
        }
      ]
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Upstream API error ${response.status}: ${text}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty translation response')
  }

  const cleaned = String(content)
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')

  const parsed = JSON.parse(cleaned)
  return parsed.items
}

function validateGroupItems(group, items) {
  if (!Array.isArray(items)) {
    throw new Error(`Translated payload for ${group.id} is not an array`)
  }

  if (items.length !== group.items.length) {
    throw new Error(`Translated item count mismatch for ${group.id}: ${items.length} !== ${group.items.length}`)
  }

  const expectedIds = group.items.map(item => item.id)
  const actualIds = items.map(item => item.id)

  for (let index = 0; index < expectedIds.length; index += 1) {
    if (expectedIds[index] !== actualIds[index]) {
      throw new Error(`Translated item order mismatch for ${group.id} at ${index}: ${actualIds[index]} !== ${expectedIds[index]}`)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
