import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './QuestionModel.css'
import { MathJax, MathJaxContext } from 'better-react-mathjax'


type OptionKey = 'A' | 'B' | 'C' | 'D'

interface Question {
  Question: string
  A: string
  B: string
  C: string
  D: string
  'Correct Option': OptionKey
  Explanation: string
}

interface Props {
  topicName: string
  onDone: () => void
}

const mathConfig = {
  loader: { load: ['[tex]/autoload', '[tex]/ams'] },
  tex: {
    // these are the delimiters MathJax will look for
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    packages: { '[+]': ['autoload', 'ams'] },
  }
}

export default function QuestionModel({ topicName, onDone }: Props) {
  const [questions,    setQuestions]   = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected,     setSelected]     = useState<OptionKey | null>(null)
  const [answered,     setAnswered]     = useState(false)
  const [score,        setScore]        = useState(0)

  useEffect(() => {
    async function loadSheet() {
      // Load the Excel file from the public directory
      const res = await fetch(`${import.meta.env.BASE_URL}innovation_marketing_questions.xlsx`)
      const buf = await res.arrayBuffer()
      const wb  = XLSX.read(buf, { type: 'array' })

      // find the sheet which (possibly truncated, as excel have char limit) name matches the start of topicName
      const sheetNames = wb.SheetNames
      // sort by length descending so longer names are tried first
      sheetNames.sort((a, b) => b.length - a.length)
      const matched = sheetNames.find(name =>
        // Excel sheet names are a prefix of the original topic, up to 31 chars
        topicName.startsWith(name)
      )

      if (!matched) {
        console.error(`No sheet matching “${topicName}”`)
        setQuestions([])
        return
      }

      const ws = wb.Sheets[matched]
      const data = XLSX.utils.sheet_to_json<Question>(ws)
      setQuestions(data)
      setCurrentIndex(0)
      setSelected(null)
      setAnswered(false)
    }
    loadSheet()
  }, [topicName])

  const handleClick = (opt: OptionKey) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)

    if (opt === questions[currentIndex]['Correct Option']) {
      setScore(s => s + 1)
    }
  }

  const getClass = (opt: OptionKey) => {
    if (!answered) return ''
    if (opt === questions[currentIndex]['Correct Option']) return 'correct'
    if (opt === selected) return 'incorrect'
    return ''
  }

  const nextQuestion = () => {
    setCurrentIndex(i => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  if (!questions.length) return <div>No questions</div>

  // if we've stepped past the last index, show results
  if (currentIndex >= questions.length) {
    return (
      <div className="results">
        <p>Achieved points: {score} / {questions.length}</p>
        <button onClick={onDone}>
          Back to Topics
        </button>
      </div>
    )
  }

  if (!questions.length) return <div>Error, sorry</div>

  const q = questions[currentIndex]

 return (
    <MathJaxContext config={mathConfig}>
      <div className="question-model">
        {/* QUESTION (uses display mode by default) */}
        <h2><MathJax dynamic>{q.Question}</MathJax></h2>

        <p className="counter">{currentIndex + 1}/{questions.length}</p>

        {/* OPTIONS (inline mode) */}
        <div className="options">
          {(['A','B','C','D'] as OptionKey[]).map(opt => (
            <button
              key={opt}
              onClick={() => handleClick(opt)}
              className={getClass(opt)}
            >
              <MathJax dynamic inline>
                {q[opt]}
              </MathJax>
            </button>
          ))}
        </div>

        {answered && (
          <div className="feedback">
            {selected === q['Correct Option']
              ? <p className="you-got-it">🎉 Correct!</p>
              : <p className="you-missed">
                  ❌ Nope. It was:&nbsp;
                  <MathJax dynamic inline>{q[q['Correct Option']]}</MathJax>
                </p>
            }
            <p className="explanation">
              <MathJax dynamic inline>
                {q.Explanation}
              </MathJax>
            </p>
            <button onClick={nextQuestion}>Next</button>
          </div>
        )}
      </div>
    </MathJaxContext>
  )
}
