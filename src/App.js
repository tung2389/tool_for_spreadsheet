import React from 'react';
import './App.css';
import XLSX from 'xlsx';

class App extends React.Component{
    constructor(props){
        super(props);
        this.readData = this.readData.bind(this);
    }
    componentDidMount(){

    };
    readData(e)
    {
        let rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        let files = e.target.files, f = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          let data = e.target.result;
          if(!rABS) data = new Uint8Array(data);
          let workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
          let workbook_name = workbook.SheetNames[0];
          let json_file = XLSX.utils.sheet_to_json(workbook.Sheets[workbook_name]);
          console.log(json_file);
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