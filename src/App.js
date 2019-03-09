import React from 'react';
import './App.css';
import XLSX from 'xlsx';
import isUrl from 'is-url';
let windows = [];
// Filter to find valid url and open it.
function process_url(url)
{
    if(url !== undefined)
    {
        let single_cell = url.toString();
        if(isUrl(single_cell))
        {
            windows.push(window.open(single_cell));
        }
    }
}
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:undefined,
            number_of_tabs_each_time:undefined
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
            process_url(data[i][label]);
        }
    }
    open_according_to_row(num)
    {
        let data = this.state.data;
        let specific_row = data[num-1];
        // Loop through all properties of specific_row object
        for(let key in specific_row){
            if (!specific_row.hasOwnProperty(key)) continue;
            process_url(specific_row[key]);
        }
    }
    close_window()
    {
        for(let i=0;i<windows.length;i++)
        {
            windows[i].close();
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
          this_class.open_according_to_row(2);
        };
        if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    }
    render(){
        return(
            <div>
            <input type = "file" onChange = {this.readData}></input>
            <button onClick = {this.close_window}></button>
            </div>
        );
    }
}
export default App;