import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ submission, problem }) => {
  // Parse stringified arrays
  const memoryArr = JSON.parse(submission?.memory || "[]");
  const timeArr = JSON.parse(submission?.time || "[]");

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission?.testCases?.filter((tc) => tc.passed).length;
  const totalTests = submission?.testCases?.length;
  const successRate = (passedTests / totalTests) * 100;

  const [selectedTab, setSelectedTab] = useState("testResults");
  const [selectedTest, setSelectedTest] = useState(1);

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      {submission && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-xs">Status</h3>
              <div
                className={`text-sm font-semibold ${
                  submission?.status === "Accepted"
                    ? "text-success"
                    : "text-error"
                }`}
              >
                {submission?.status}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow p-2">
            <div className="card-body p-2">
              <h3 className="card-title text-xs">Success Rate</h3>
              <div className="text-sm font-semibold">
                {successRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow p-2">
            <div className="card-body p-2">
              <h3 className="card-title text-xs">
                <Clock className="w-4 h-4" />
                Avg. Runtime
              </h3>
              <div className="text-sm font-semibold">
                {avgTime.toFixed(3)} s
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow p-2">
            <div className="card-body p-2">
              <h3 className="card-title text-xs flex items-center gap-2">
                <Memory className="w-4 h-4" />
                Avg. Memory
              </h3>
              <div className="text-sm font-semibold">
                {avgMemory.toFixed(0)} KB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl">
        {/*
   <h2 className="card-title mb-4">Test Cases Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono">{testCase.expected}</td>
                    <td className="font-mono">{testCase.stdout || "null"}</td>
                    <td>{testCase.memory}</td>
                    <td>{testCase.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          */}

        <div className="border-base-300  bg-base-100 overflow-auto h-[250px]">
          <div className="flex items-center justify-start gap-3 mb-4 bg-[#1d232a]">
            <h3
              onClick={() => setSelectedTab("testCases")}
              className="card-title cursor-pointer"
            >
              Test Cases
            </h3>
            <h3
              onClick={() => setSelectedTab("testResults")}
              className="card-title cursor-pointer"
            >
              Test Results
            </h3>
          </div>
          {selectedTab === "testCases" && (
            <div className="overflow-x-auto bg-[#1d232a]">
              <div className="inline-flex justify-start text-[16px] mb-2 gap-5">
                {problem?.testcases?.map((_, index) => (
                  <p
                    key={index}
                    onClick={() => setSelectedTest(index + 1)}
                    className="font-semibold cursor-pointer"
                  >
                    Test{index + 1}
                  </p>
                ))}
              </div>
              {problem?.testcases?.map(
                (testCase, index) =>
                  selectedTest === index + 1 && (
                    <div key={index}>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">Input :</p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.input}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">
                          Expected Output :
                        </p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.expectedOutput}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
          {selectedTab === "testResults" && (
            <div className="overflow-x-auto bg-[#1d232a]">
              <div className="inline-flex justify-start text-[16px] mb-2 gap-5">
                {submission?.testCases?.map((testCase) => (
                  <p
                    key={testCase.testCase}
                    onClick={() => setSelectedTest(testCase.testCase)}
                    className={`font-semibold cursor-pointer ${
                      selectedTest === testCase.testCase
                        ? "text-[#605dff]"
                        : "text-white"
                    }`}
                  >
                    Test{testCase.testCase}
                  </p>
                ))}
              </div>

              {submission?.testCases?.map(
                (testCase) =>
                  selectedTest === testCase.testCase && (
                    <div key={testCase.id}>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">Input:</p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {submission.stdin.split("\n")[testCase.testCase - 1]}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">
                          Your Output:
                        </p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.stdout || "null"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">
                          Expected Output:
                        </p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.expected}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">Error:</p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.stderr || "No error"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">Memory:</p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.memory}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-md font-semibold py-1">Time:</p>
                        <div className="bg-black/90 px-4 py-2 rounded-sm">
                          {testCase.time}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
