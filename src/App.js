import React from 'react';
import './App.css';
import XLSX from 'xlsx';
import isUrl from 'is-url';
function valid_url(url)
{
    if(url !== undefined && isUrl(url))
    {
        return true;
    }
    else
    {
        return false;
    }
}
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:undefined
        };
        this.readData = this.readData.bind(this);
        this.open_according_to_column = this.open_according_to_column.bind(this);
        this.open_according_to_row = this.open_according_to_row.bind(this);
    }
    componentDidMount(){
        //console.log(this.state.data);
    }

    open_according_to_column(label)
    {
        let data = this.state.data;
        for(let i=0;i<data.length;i++)
        {
            let single_row = data[i][label];
            if(valid_url(single_row))
            window.open(single_row.toString());
        }
    }
    open_according_to_row(num)
    {
        let data = this.state.data;
        let specific_row = data[num-1];
        // Loop through all properties of specific_row object
        for(let key in specific_row){
            if (!specific_row.hasOwnProperty(key)) continue;
            let single_col = specific_row[key];
            if(valid_url(single_col))
            {
                window.open(single_col);
            }
        }
    }
    readData(e)
    {
        let rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        let files = e.target.files, f = files[0];
        let reader = new FileReader();
        const this_class = this; //Because the "this" in the onload function does not refer to App class
        reader.onload = async function(e) {
          let data = e.target.result;
          if(!rABS) data = new Uint8Array(data);
          let workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
          let workbook_name = workbook.SheetNames[0];
          let json_file = XLSX.utils.sheet_to_json(workbook.Sheets[workbook_name],{header:"A"});
          await this_class.setState({data:json_file});
          alert("The file has been loaded successfully");
        };
        if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    }
    render(){
        return(
            <div>
            <input type = "file" onChange = {this.readData}></input>
            </div>
        );
    }
}
export default App;