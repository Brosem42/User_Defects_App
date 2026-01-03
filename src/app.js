// react connnection to documentDB for amplify config 
import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { ResponsiveBar } from "@nivo/bar";
import config from './aws-exports-amplify.js';

// configure amplify with aws exports
Amplify.configure(config);

const Client = generateClient();

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchDefects()
    }, []);

    const fetchDefects = async () => {
        try {
            const response = await Client.graphql({
                query: `query FinalTest {
                    listDefects {
                        id
                        molding_machine_id 
                        object_detection {
                            reject
                            contamination_defect {
                                pixel_severity {
                                    value
                                }
                            }
                        }
                    }
                }`
            }); 
            const rawData = response.data.listDefects;
            const flattened = rawData.map(item => ({
                machine: item.molding_machine_id,
                reject: item.object_detection?.reject ? 1 : 0,
                severity: item.object_detection?.contamination_defect?.pixel_severity?.value || 0
            }));

            setData(flattened);
        } catch (error) {
            console.error("Error fetching defects:", error);
        }
    };

    return (
        <div style={{ height: "500px", width: "100%", padding: "20px" }}>
            <h2>Defects analytics dashboard</h2>
            {data.length > 0 ? (
                <ResponsiveBar
                    data={data}
                    keys={['reject', 'severity']}
                    indexBy="machine"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    colors= {{ scheme: "nivo" }}
                    legendLabel={d => `${d.id}`}
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
    );
}

export default App;