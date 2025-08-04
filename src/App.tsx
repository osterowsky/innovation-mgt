import { useState } from 'react'
import './App.css'
import QuestionModel from './components/QuestionModel'

const TOPICS_MARKETING = [
  'Principles of Marketing & Ethics',
  'Marketing Strategy and Environment',
  'Creating Customer Value, Satisfaction, Loyalty, and Engagement',
  'Digital Marketing, Information Management and Market Research',
  'Analysing Business and Consumer Markets',
  'Competition and Differentiation from Competitors',
  'Segmenting, Targeting, and Positioning',
  'Products, Services and Brand Management',
  'Pricing',
  'Marketing Communications',
  'Marketing Channels',
  'People, Process, and Physical Evidence'
]

const TOPICS_INNOVATION = [
  'Introduction',
  'Patterns in Innovative Activity',
  'Who innovates, and why',
  'Innovation strategy',
  'Profiting from Innovation'
]

const TOPICS_GUEST_LECTURERS = [
  'pro-beam',
  'TÜV SÜD',
  'Greenwashing'
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
          <h2>Marketing</h2>
          <div className="topic-buttons">
            {TOPICS_MARKETING.map(name => (
              <button
                key={name}
                onClick={() => setTopicName(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <h2>Innovation Management</h2>
          <div className="topic-buttons">
            {TOPICS_INNOVATION.map(name => (
              <button
                key={name}
                onClick={() => setTopicName(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <h2>Guest Lectures</h2>
          <div className="topic-buttons">
            {TOPICS_GUEST_LECTURERS.map(name => (
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