import fs from 'fs'
import path from 'path'

let cachedKnowledge: string | null = null

export function loadKnowledge(knowledgePath?: string): string {
  if (cachedKnowledge) return cachedKnowledge

  const resolvedPath = knowledgePath || path.join(/* turbopackIgnore: true */ process.cwd(), 'chatbot', 'knowledge.md')

  if (!fs.existsSync(resolvedPath)) {
    console.warn(`Knowledge file not found at ${resolvedPath}`)
    return ''
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8')
  cachedKnowledge = parseKnowledge(raw)
  return cachedKnowledge
}

export function clearKnowledgeCache() {
  cachedKnowledge = null
}

/**
 * MD 파일을 파싱하여 Q&A 구조화된 텍스트로 변환
 * 원본 MD를 그대로 넣지 않고, 가공된 형태로 삽입 (보안)
 */
function parseKnowledge(raw: string): string {
  const lines = raw.split('\n')
  const qaPairs: { question: string; answer: string; category: string }[] = []

  let currentCategory = 'General'
  let currentQuestion = ''
  let currentAnswer: string[] = []

  for (const line of lines) {
    // 카테고리 헤더 (## 레벨)
    const categoryMatch = line.match(/^## (?!Q:)(.+)/)
    if (categoryMatch) {
      // 이전 Q&A 저장
      if (currentQuestion) {
        qaPairs.push({
          question: currentQuestion,
          answer: currentAnswer.join('\n').trim(),
          category: currentCategory,
        })
        currentQuestion = ''
        currentAnswer = []
      }
      currentCategory = categoryMatch[1].trim()
      continue
    }

    // 질문 헤더 (### Q: 또는 ## Q:)
    const questionMatch = line.match(/^#{2,3}\s*Q:\s*(.+)/)
    if (questionMatch) {
      // 이전 Q&A 저장
      if (currentQuestion) {
        qaPairs.push({
          question: currentQuestion,
          answer: currentAnswer.join('\n').trim(),
          category: currentCategory,
        })
      }
      currentQuestion = questionMatch[1].trim()
      currentAnswer = []
      continue
    }

    // 답변 내용 수집 (빈 줄, 구분선, 블록인용 제외)
    if (currentQuestion) {
      const trimmed = line.trim()
      if (trimmed === '---' || trimmed === '') continue
      if (trimmed.startsWith('>')) continue
      currentAnswer.push(trimmed)
    }
  }

  // 마지막 Q&A 저장
  if (currentQuestion) {
    qaPairs.push({
      question: currentQuestion,
      answer: currentAnswer.join('\n').trim(),
      category: currentCategory,
    })
  }

  // 구조화된 텍스트로 변환
  if (qaPairs.length === 0) return ''

  const sections = qaPairs.map(
    (qa) => `[Q] ${qa.question}\n[A] ${qa.answer}`
  )

  return sections.join('\n\n')
}
