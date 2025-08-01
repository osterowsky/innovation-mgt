import { useState } from 'react'
import './App.css'
import QuestionModel from './components/QuestionModel'

const TOPICS = [
  'Principles of Marketing & Ethics',
  'Marketing Strategy and Environment',
  'Creating Customer Value, Satisfaction, Loyalty, and Engagement',
  'Digital Marketing, Information Management and Market Research'
]

export default function App() {
  const [topicName, setTopicName] = useState<string | null>(null)

  const handleDone = () => {
    setTopicName(null)
  }

  return (
    <div id="app">
      {topicName === null ? (
        // Topic selector
        <div className="topic-selector">
          <h1>Choose a topic</h1>
          <div className="topic-buttons">
            {TOPICS.map(name => (
              <button
                key={name}
                onClick={() => setTopicName(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Quiz for the chosen topic
        <div>
          <h1>{topicName}</h1>
          <QuestionModel topicName={topicName} onDone={handleDone} />
        </div>
      )}
    </div>
  )
}