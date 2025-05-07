import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import olympiadService from '../store/olympiads';
import Editor from '@monaco-editor/react';
import { Card, Tabs, Spin, Alert, Button, Select, Typography, Space, Tag, Result } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const OlympiadProblems = () => {
  const { olympiad_id } = useParams();
  const navigate = useNavigate();
  const [olympiad, setOlympiad] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [code, setCode] = useState({});
  const [language, setLanguage] = useState('python');
  const [submissionResults, setSubmissionResults] = useState({});
  const [isOlympiadActive, setIsOlympiadActive] = useState(false);

  const [statusInfo, setStatusInfo] = useState({
    status: 'upcoming',
    statusColor: 'blue',
    statusIcon: <ClockCircleOutlined />,
  });

  const difficultyColors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red',
  };

  const languages = [
    { value: 'python', label: 'Python' },
  ];

  useEffect(() => {
    const fetchOlympiadData = async () => {
      try {
        setLoading(true);
        setError('');

        const { data: olympiadData } = await olympiadService.fetchOlympiadById(olympiad_id);
        setOlympiad(olympiadData);

        const { data: problemsData } = await olympiadService.getOlympiadProblems(olympiad_id);
        console.log('Problems Data:', problemsData);
        setProblems(problemsData);

        const initialCode = {};
        problemsData.forEach((problem, index) => {
          initialCode[index] = getDefaultCode(problem.defaultCode, language);
        });
        setCode(initialCode);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        if (err.response?.data?.error === 'Olympiad not found') {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOlympiadData();
  }, [olympiad_id, navigate, language]);

  useEffect(() => {
    if (olympiad) {
      const checkOlympiadStatus = () => {
        const now = moment();
        const start = moment(olympiad.start_time);
        const end = moment(olympiad.end_time);

        let status, statusColor, statusIcon, active;
        if (now.isBefore(start)) {
          status = 'upcoming';
          statusColor = 'blue';
          statusIcon = <ClockCircleOutlined />;
          active = false;
        } else if (now.isSameOrAfter(start) && now.isSameOrBefore(end)) {
          status = 'ongoing';
          statusColor = 'green';
          statusIcon = <CheckCircleOutlined />;
          active = true;
        } else {
          status = 'completed';
          statusColor = 'red';
          statusIcon = <CloseCircleOutlined />;
          active = false;
        }

        setStatusInfo({ status, statusColor, statusIcon });
        setIsOlympiadActive(active);
      };

      checkOlympiadStatus();
      const interval = setInterval(checkOlympiadStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [olympiad]);

  const getDefaultCode = (defaultCodes, lang) => {
    if (defaultCodes && defaultCodes[lang]) {
      return defaultCodes[lang];
    }
    return `# Write your ${lang} solution here\n`;
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    const updatedCode = { ...code };
    problems.forEach((problem, index) => {
      if (!updatedCode[index] || updatedCode[index] === getDefaultCode(problem.defaultCode, language)) {
        updatedCode[index] = getDefaultCode(problem.defaultCode, value);
      }
    });
    setCode(updatedCode);
  };

  const handleProblemTabChange = (key) => {
    setActiveProblemIndex(Number(key));
  };

  const handleCodeChange = (value, index) => {
    setCode((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = async (problemId, problemIndex) => {
    try {
      setLoading(true);
      setError('');

      if (!problemId) {
        throw new Error("Problem ID is undefined");
      }

      const submissionData = {
        problem_id: problemId,
        code: code[problemIndex],
        language,
      };

      console.log('Submitting to /api/olympiads/<olympiad_id>/submit:', submissionData);

      const { data: result } = await olympiadService.submitSolution(olympiad_id, submissionData);

      setSubmissionResults((prev) => ({
        ...prev,
        [problemIndex]: {
          submission_id: result.submission_id,
          problem_id: result.problem_id,
          status: result.status,
          is_correct: result.is_correct,
          runtime: result.runtime,
          results: result.results,
          points_earned: result.points_earned,
          time_taken: result.time_taken,
        },
      }));
    } catch (err) {
      console.error('Submission Error:', err.response?.data || err.message);
      // Instead of setting error for Alert, update submissionResults with error message
      const errorMsg = err.response?.data?.error || err.message || 'Code rejected';
      setSubmissionResults((prev) => ({
        ...prev,
        [problemIndex]: {
          status: 'rejected',
          is_correct: false,
          error: errorMsg,
          runtime: 0,
          results: [],
          points_earned: 0,
          time_taken: 0,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Terminal shaklida natijalarni formatlash funksiyasi
  const formatTerminalOutput = (result) => {
    if (!result) return '';

    let output = `=== Submission Result ===\n`;
    output += `Status: ${result.status}\n`;

    if (result.error) {
      output += `Error: ${result.error}\n`;
      return output;
    }

    output += `Runtime: ${result.runtime.toFixed(2)}s\n`;
    output += `Result: ${result.is_correct ? 'Correct' : 'Incorrect'}\n`;

    if (result.is_correct) {
      output += `Points Earned: ${result.points_earned}\n`;
      output += `Time Taken: ${result.time_taken.toFixed(2)}s\n`;
    }

    output += `\n=== Test Cases ===\n`;
    result.results.forEach((test, i) => {
      output += `Test Case ${i + 1}:\n`;
      output += `  Status: ${test.status}\n`;
      output += `  Runtime: ${test.runtime.toFixed(2)}s\n`;
      output += `  Input: ${test.input}\n`;
      output += `  Expected: ${test.expected}\n`;
      output += `  Actual: ${test.actual}\n`;
      if (test.error) {
        output += `  Error: ${test.error}\n`;
      }
      output += '\n';
    });

    return output;
  };

  if (loading && !olympiad) {
    return <Spin size="large" tip="Loading olympiad data..." style={{ display: 'block', textAlign: 'center', marginTop: '50px' }} />;
  }

  if (error) {
    if (error === 'Olympiad not found') {
      return <Result status="404" title="404" subTitle="Olympiad not found" extra={<Button type="primary" onClick={() => navigate('/olympiads')}>Back to Olympiads</Button>} />;
    }
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!olympiad || problems.length === 0) {
    return (
      <Result
        status="info"
        title="No Problems Available"
        subTitle="This olympiad currently has no problems to solve."
        extra={<Button type="primary" onClick={() => navigate('/olympiads')}>Back to Olympiads</Button>}
      />
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card
        title={
          <Space>
            <Title level={2} style={{ margin: 0 }}>
              {olympiad.name}
            </Title>
            <Tag icon={statusInfo.statusIcon} color={statusInfo.statusColor}>
              {statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
            </Tag>
          </Space>
        }
        extra={<Button type="default" onClick={() => navigate(-1)}>Back to Olympiads</Button>}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Text>
              <strong>Start:</strong> {moment(olympiad.start_time).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <Text>
              <strong>End:</strong> {moment(olympiad.end_time).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <Text>
              <strong>Problems:</strong> {problems.length}
            </Text>
          </Space>
          <Paragraph>{olympiad.description}</Paragraph>

          <Tabs activeKey={String(activeProblemIndex)} onChange={handleProblemTabChange}>
            {problems.map((problem, index) => (
              <TabPane
                tab={
                  <Space>
                    <span>Problem {index + 1}</span>
                    {submissionResults[index]?.is_correct && <CheckCircleOutlined style={{ color: 'green' }} />}
                  </Space>
                }
                key={index}
              >
                <Card style={{ width: '100%' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Space>
                      <Title level={4}>{problem.title}</Title>
                      <Tag color={difficultyColors[problem.difficulty.toLowerCase()] || 'default'}>
                        {problem.difficulty}
                      </Tag>
                    </Space>
                    <div>
                      <Title level={5}>Description</Title>
                      <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                    </div>
                    {problem.test_cases && problem.test_cases.length > 0 && (
                      <div>
                        <Title level={5}>Examples</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {problem.test_cases.slice(0, 2).map((testCase, caseIndex) => (
                            <div key={caseIndex} style={{ border: '1px solid #f0f0f0', padding: '16px', borderRadius: '4px' }}>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Space>
                                  <div style={{ flex: 1 }}>
                                    <Text strong>Input {caseIndex + 1}</Text>
                                    <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>{testCase.input}</pre>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Text strong>Output</Text>
                                    <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>{testCase.output}</pre>
                                  </div>
                                </Space>
                                {testCase.explanation && (
                                  <div>
                                    <Text strong>Explanation</Text>
                                    <Paragraph>{testCase.explanation}</Paragraph>
                                  </div>
                                )}
                              </Space>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Space>
                </Card>
              </TabPane>
            ))}
          </Tabs>

          {/* Kod oynasi va yuborish tugmasi pastda, 100% kenglikda */}
          <Card style={{ width: '100%', marginTop: '16px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Select value={language} onChange={handleLanguageChange} style={{ width: 120 }}>
                  {languages.map((lang) => (
                    <Option key={lang.value} value={lang.value}>
                      {lang.label}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(problems[activeProblemIndex].id, activeProblemIndex)}
                  disabled={loading || !isOlympiadActive}
                  loading={loading}
                >
                  Submit Solution
                </Button>
              </Space>
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code[activeProblemIndex] || ''}
                onChange={(value) => handleCodeChange(value, activeProblemIndex)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
                style={{ width: '100%' }}
              />
              {submissionResults[activeProblemIndex] && (
                <div>
                  <Title level={5}>Submission Result (Terminal View)</Title>
                  <pre
                    style={{
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      padding: '16px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {formatTerminalOutput(submissionResults[activeProblemIndex])}
                  </pre>
                </div>
              )}
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default OlympiadProblems;