import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProblemById } from '../api/problemService';
import Editor from '@monaco-editor/react';
import '../styles/ProblemDetail.css';
import axios from 'axios';
import { Typography, Button, Select, Space, Spin } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submissionResult, setSubmissionResult] = useState(null);
  const editorRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchProblemById(id);
        setProblem(data);
        setCode(getDefaultCode(data.defaultCode, language));
      } catch (err) {
        setError(err.message);
        if (err.message === 'Problem not found') {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, navigate]);

  const getDefaultCode = (defaultCodes, lang) => {
    if (defaultCodes && defaultCodes[lang]) {
      return defaultCodes[lang];
    }
    return `// Write your ${lang} solution here\n`;
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(getDefaultCode(problem?.defaultCode, value));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSubmissionResult(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const submissionData = {
        code,
        language,
      };

      const response = await axios.post(
        `http://127.0.0.1:5055/api/problems/${id}/submit`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = {
        submission_id: response.data.submission_id,
        problem_id: response.data.problem_id,
        status: response.data.status,
        is_correct: response.data.is_correct,
        runtime: response.data.runtime,
        results: response.data.results.map((test) => ({
          input: test.input,
          expected: test.expected,
          actual: test.actual,
          status: test.status,
          runtime: test.runtime,
          error: test.error || null,
        })),
      };

      setSubmissionResult(result);

      if (result.is_correct) {
        console.log('Problem solved successfully!');
      }
    } catch (err) {
      let errorMessage = 'Submission failed';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication expired. Please login again.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.error || 'Invalid submission data';
        } else if (err.response.status === 404) {
          errorMessage = 'Problem not found';
        } else {
          errorMessage = err.response.data.error || `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please try again.';
      } else {
        errorMessage = err.message || 'Submission error';
      }

      setError(errorMessage);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Terminal shaklida natijalarni formatlash funksiyasi
  const formatTerminalOutput = (result) => {
    if (!result) return [];

    const output = [];
    output.push({ text: `=== Submission Result ===`, style: { color: '#d4d4d4' } });
    output.push({ text: `Submission ID: ${result.submission_id}`, style: { color: '#d4d4d4' } });
    output.push({ text: `Problem ID: ${result.problem_id}`, style: { color: '#d4d4d4' } });
    output.push({
      text: `Status: ${result.status}`,
      style: { color: result.status === 'Accepted' ? '#00ff00' : '#ff5555' },
    });
    output.push({
      text: `Result: ${result.is_correct ? 'Correct' : 'Incorrect'}`,
      style: { color: result.is_correct ? '#00ff00' : '#ff5555' },
    });
    output.push({ text: `Runtime: ${result.runtime.toFixed(2)}s`, style: { color: '#d4d4d4' } });

    output.push({ text: `\n=== Test Cases ===`, style: { color: '#d4d4d4' } });
    result.results.forEach((test, i) => {
      output.push({ text: `Test Case ${i + 1}:`, style: { color: '#d4d4d4' } });
      output.push({
        text: `  Status: ${test.status}`,
        style: { color: test.status === 'Accepted' ? '#00ff00' : '#ff5555' },
      });
      output.push({ text: `  Runtime: ${test.runtime.toFixed(2)}s`, style: { color: '#d4d4d4' } });
      output.push({ text: `  Input: ${test.input}`, style: { color: '#d4d4d4' } });
      output.push({ text: `  Expected: ${test.expected}`, style: { color: '#d4d4d4' } });
      output.push({ text: `  Actual: ${test.actual}`, style: { color: '#d4d4d4' } });
      if (test.error) {
        output.push({ text: `  Error: ${test.error}`, style: { color: '#ff5555' } });
      }
      output.push({ text: '', style: {} }); // Bo‘sh qator
    });

    return output;
  };

  if (loading && !problem) {
    return <Spin size="large" tip="Loading problem..." style={{ display: 'block', textAlign: 'center', marginTop: '50px' }} />;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</div>;
  }

  if (!problem) {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', color: '#000' }}>
      {/* Sarlavha va Meta ma'lumotlar */}
      <div style={{ marginBottom: '24px' }}>
        <Space align="center">
          <Title level={2} style={{ color: '#000', margin: 0 }}>
            {problem.title}
          </Title>
          <span style={{ color: '#000', padding: '4px 8px', borderRadius: '4px', background: problem.difficulty.toLowerCase() === 'easy' ? '#52c41a' : problem.difficulty.toLowerCase() === 'medium' ? '#faad14' : '#ff4d4f' }}>
            {problem.difficulty}
          </span>
        </Space>
        <Paragraph style={{ color: 'rgba(0, 0, 0, 0.85)', marginTop: '8px' }}>
          <Space>
            <span>Time Limit: {problem.time_limit}s</span>
            <span>Memory Limit: {problem.memory_limit}MB</span>
            <span>Solved: {problem.solved_count} times</span>
          </Space>
        </Paragraph>
        <div>
          {problem.tags.map((tag, index) => (
            <span key={index} style={{ background: '#1890ff', color: '#000', padding: '2px 8px', borderRadius: '12px', marginRight: '8px' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Masala tavsifi va Test Case’lar */}
      <div style={{ marginBottom: '24px' }}>
        <section style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#000' }}>Description</Title>
          <Paragraph style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            {problem.description}
          </Paragraph>
        </section>

        {problem.test_cases && problem.test_cases.length > 0 && (
          <section>
            <Title level={3} style={{ color: '#000' }}>Test Cases</Title>
            {problem.test_cases.map((testCase, index) => (
              <div key={index} style={{ border: '1px solid #f0f0f0', padding: '16px', borderRadius: '4px', marginBottom: '16px', background: '#fff', color: '#000' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <div style={{ flex: 1 }}>
                      <strong>Input {index + 1}</strong>
                      <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>{testCase.input}</pre>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>Output</strong>
                      <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>{testCase.output}</pre>
                    </div>
                  </Space>
                  {testCase.explanation && (
                    <div>
                      <strong>Explanation</strong>
                      <Paragraph>{testCase.explanation}</Paragraph>
                    </div>
                  )}
                </Space>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Kod oynasi va Terminal (pastda, 100% kenglikda) */}
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Select value={language} onChange={handleLanguageChange} style={{ width: 120 }}>
              {languages.map((lang) => (
                <Option key={lang.value} value={lang.value}>
                  {lang.label}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={loading}
              loading={loading}
            >
              Submit Solution
            </Button>
          </Space>
        </div>

        <Editor
          height="500px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
          style={{ width: '100%' }}
        />

        {submissionResult && (
          <div style={{ marginTop: '16px' }}>
            <Title level={4} style={{ color: '#fff' }}>Submission Result (Terminal View)</Title>
            <div
              style={{
                background: '#1e1e1e',
                padding: '16px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                lineHeight: '1.5',
              }}
            >
              {formatTerminalOutput(submissionResult).map((line, index) => (
                <div key={index} style={line.style}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button onClick={() => navigate(-1)}>
          Back to Problems
        </Button>
      </div>
    </div>
  );
};

export default ProblemDetail;