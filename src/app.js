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
    

               