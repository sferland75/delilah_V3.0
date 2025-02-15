import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PromptLab } from './index'
import { mockApiResponses } from '@/test/test-utils'
import { generateWithClaude } from '@/services/claude'

// Mock the Claude service
jest.mock('@/services/claude', () => ({
  generateWithClaude: jest.fn()
}))

const mockGenerateWithClaude = generateWithClaude as jest.MockedFunction<typeof generateWithClaude>

describe('PromptLab', () => {
  const defaultProps = {
    sectionId: 'demographics',
    sectionData: { firstName: 'John', lastName: 'Doe' },
    defaultPrompt: 'Generate a report for {{firstName}} {{lastName}}',
    onGenerate: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<PromptLab {...defaultProps} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('displays the default prompt in the editor', () => {
    render(<PromptLab {...defaultProps} />)
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveValue(defaultProps.defaultPrompt)
  })

  it('shows section data in the data viewer tab', () => {
    render(<PromptLab {...defaultProps} />)
    fireEvent.click(screen.getByRole('tab', { name: /data/i }))
    expect(screen.getByText(/"firstName": "John"/)).toBeInTheDocument()
    expect(screen.getByText(/"lastName": "Doe"/)).toBeInTheDocument()
  })

  it('generates content when clicking generate button', async () => {
    mockGenerateWithClaude.mockResolvedValueOnce(mockApiResponses.claudeSuccess)
    
    render(<PromptLab {...defaultProps} />)
    
    const generateButton = screen.getByRole('button', { name: /generate/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(mockGenerateWithClaude).toHaveBeenCalledWith(
        defaultProps.defaultPrompt,
        expect.any(Object)
      )
    })
    
    expect(defaultProps.onGenerate).toHaveBeenCalledWith(
      mockApiResponses.claudeSuccess.content
    )
  })

  it('displays error message when generation fails', async () => {
    mockGenerateWithClaude.mockResolvedValueOnce(mockApiResponses.claudeError)
    
    render(<PromptLab {...defaultProps} />)
    
    const generateButton = screen.getByRole('button', { name: /generate/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(mockApiResponses.claudeError.error!)).toBeInTheDocument()
    })
  })

  it('previews generated content in preview tab', async () => {
    mockGenerateWithClaude.mockResolvedValueOnce(mockApiResponses.claudeSuccess)
    
    render(<PromptLab {...defaultProps} />)
    
    const generateButton = screen.getByRole('button', { name: /generate/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('tab', { name: /preview/i }))
      expect(screen.getByText(mockApiResponses.claudeSuccess.content)).toBeInTheDocument()
    })
  })
})