import pandas as pd # type: ignore
import numpy as np # type: ignore
import ijson # type: ignore
import json # type: ignore
#import requirement installed ijson-3.4.0.post0
#utilize data from json load 
# data parsing to extract "rejection" fields from json to plot for consumer

filename = 'dataset.V1.json'
with open(filename, 'rb') as f:
    #extracting desired fields from json
    records = ijson.items(f, 'item')

    for record in records:
        extract  = {
            "molding_machine_id": record.get("molding_machine_id"),
            "object_detection": record.get("object_detection"),
            "contamination_defect": record.get("contamination_defect")
        }

        print(json.dumps(extract))

#prep data to pass to RPC server for plotting