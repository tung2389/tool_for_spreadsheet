import React from 'react';
import './App.css';
import XLSX from 'xlsx';
import isUrl from 'is-url';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
            number_of_tabs_each_time:undefined,
            time:undefined,
            hidden:true,
            row_or_column:undefined,
            status_of_option:0
        };
        this.readData = this.readData.bind(this);
        this.open_according_to_column = this.open_according_to_column.bind(this);
        this.open_according_to_row = this.open_according_to_row.bind(this);
        this.onChange_tasks = this.onChange_tasks.bind(this);
        this.onChange_time = this.onChange_time.bind(this);
        this.onChange_row_or_column = this.onChange_row_or_column.bind(this);
        this.open_window = this.open_window.bind(this);
        this.IsEnough = this.IsEnough.bind(this);
        this.input_of_option = this.input_of_option.bind(this);
    }
    IsEnough()
    {
        if(this.state.number_of_tabs_each_time && this.state.time && this.state.row_or_column)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    componentDidMount(){
        //console.log(this.state.data);
    }

    open_according_to_column(label,start,endd)
    {
        let data = this.state.data;
        for(let i=start;i<=endd;i++)
        {
            process_url(data[i][label]);
        }
    }
    open_according_to_row(num,start,endd)
    {
        let data = this.state.data;
        let specific_row = data[num-1];
        let cnt = 0;
        // Loop through all properties of specific_row object
        for(let key in specific_row){
            cnt++;
            // Throw out the key that doesn't belong to object and the key outside the range
            if (!specific_row.hasOwnProperty(key) || cnt < start || cnt > endd) continue; 
            process_url(specific_row[key]);
        }
    }
    open_window()
    {
        if(this.IsEnough())
        {
            let num_tabs = this.state.number_of_tabs_each_time;
            let num_time = this.state.time;
            let main_data = this.state.row_or_column;
            //Caculate the range
            let start = num_time * num_tabs - num_tabs;
            let endd = num_time * num_tabs - 1;
            if(this.status_of_option === 0)
            {
                this.open_according_to_column(main_data,start,endd);
            }
            else
            {
                this.open_according_to_row(parseInt(main_data),start,endd);
            }
        }
        else
        {
            alert("Missing data from inputs");
        }
    }
    close_window()
    {
        for(let i=0;i<windows.length;i++)
        {
            windows[i].close();
        }
    }
    onChange_tasks(e)
    {
        this.setState({number_of_tabs_each_time:parseInt(e.target.value)});
    }
    onChange_time(e)
    {
        this.setState({time:parseInt(e.target.value)});
    }
    onChange_row_or_column(e)
    {
        this.setState({row_or_column:e.target.value});
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
    input_of_option()
    {
        if(this.state.status_of_option === 0)
        return (
            <div className = "div3">
                <p className = "p1">Enter the label of the column you want to choose.Example: A</p>
                <TextField label = "Label" onChange = {this.onChange_row_or_column}></TextField>
            </div>
        );
        else
        return(
            <div className = "div3">
                <p className = "p1">Enter the number of row you want to choose. Example: 1</p>
                <TextField label = "number of row"> onChange = {this.onChange_row_or_column}</TextField>
            </div>
        );
    }
    render(){
        return(
            <div>
            {/* upload file */}
            <input type = "file" onChange = {this.readData}></input>

            {/* Two option */}
            <button onClick = {this.Change_page1} className = "btn_page1">Open according to column</button>
            <button onClick = {this.Change_page2} className = "btn_page2">Open according to row</button>

            {/* Two parameter to open */}
            {this.input_of_option()}
            <div className = "div1">
                <TextField type = "number" onChange = {this.onChange_tasks} label = "Number of tabs each time" className = "inp1"></TextField>
            </div>
            <div className = "div2">
                <TextField type = "number" onChange = {this.onChange_time} label = "Number of time" className = "inp2"></TextField>
            </div>

            {/* Button to open and close window*/}
            <button>Open</button>
            <button onClick = {this.close_window}>close</button>
            </div>
        );
    }
}
export default App;