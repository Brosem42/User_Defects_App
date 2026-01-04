// react connnection to documentDB for amplify config 
import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { ResponsiveBar } from "@nivo/bar";
import config from './aws-exports-amplify.js';
import { processTask } from './graphql/mutations';

// configure amplify with aws exports
Amplify.configure(config);

const Client = generateClient();

function App() {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(""); 

    useEffect(() => {
        fetchDefects()
    }, []);

    const fetchDefects = async () => {
        try {
            const response = await Client.graphql({
                query: processTask, 
                variables: {
                    task: "Analyze machine defects",
                    sessionId: "user-1"
                }
            });

            const { summary: agentSummary, nivoData } = response.data.processTask;

            setSummary(agentSummary);
            setData(JSON.parse(nivoData));

        } catch (error) {
            console.error("Unable to fetch defects:", error);  
        }
    };

    return (
        <div style={{ height: "600px", width: "100%", padding: "20px" }}>
            <h2>Defects Analytics Dashboard</h2>
            <p style={{ fontStyle: "italic"}}>{summary || "Loading agentic analysis..."}</p>

            {data.length > 0 ? (
                <ResponsiveBar
                    data={data}
                    keys={['rejectCount', 'severity']}
                    indexBy="machine"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    colors= {{ scheme: "nivo" }}
                    axisBottom={{
                        legend: "Machine ID",
                        legendPosition: "middle",
                        legendOffset: 40
                    }}
                />
                ) : (
                    <p>Connecting to DocumentDB via AppSync...</p>
                )}
        </div>
    )};

 export default App;