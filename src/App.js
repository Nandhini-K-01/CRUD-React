import React,{useEffect,useState} from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function App() {
  let formValues={ 
    id:"",
    name:"",
    age:"",
    email:"",
    gender:"",
    courses:"",
    error:{
      name:"",
      age:"",
      email:"",
      gender:"",
      courses:"",
    }
  }
  const[formData,setFormData] = useState(formValues)
  const[userStateData,setuserStateData] = useState([]);
  useEffect(()=>{
    async function getData(){
    const response = await axios.get("https://6341084520f1f9d7996b15ce.mockapi.io/users")
    setuserStateData(response.data)
  }
  getData();
  },[]);
  const handleChange= (e) =>{
    let error = {...formData.error}
    if(e.target.value === ""){
    error[e.target.name] = `${e.target.name} is required`
    }else{
      error[e.target.name] = ""
    }
    setFormData({...formData,[e.target.name]:e.target.value,error})
  }

  const onPopulateData = (id) =>{
    const selectedData = userStateData.filter((row)=>row.id===id)[0];
    setFormData({...formData,...selectedData});
  }

  const handleDelete = async (id) => {
    const response = await axios.delete(`https://6341084520f1f9d7996b15ce.mockapi.io/users/${id}`);
    console.log(response);
    const user = userStateData.filter((row) => row.id !== id);
    setuserStateData(user);
  };

  const handleSubmit= async (e) =>{
    console.log("came")
      e.preventDefault();
      const errKeys = Object.keys(formData).filter((key)=>{
        if(formData[key] === "" && key!="error" && key!="id"){
          return key;
        }});
        if(errKeys.length>=1){
          alert("Please fill all the values and then click submit")
        }else{
          if(formData.id){
            //Update
            const response = await axios.put(`https://6341084520f1f9d7996b15ce.mockapi.io/users/${formData.id}`,{
            name: formData.name,
            age: formData.age,
            email: formData.email,
            gender: formData.gender,
            courses: formData.courses,
          });
            let users = [...userStateData]
            let index = userStateData.findIndex((row)=>row.id===formData.id)
            users[index] = response.data; //or users[index] = formData;
            setuserStateData(users);
        }
        else{
          //Create
            const response = await axios.post("https://6341084520f1f9d7996b15ce.mockapi.io/users",{
            name: formData.name,
            age: formData.age,
            email: formData.email,
            gender: formData.gender,
            courses: formData.courses,
          })
          setuserStateData([...userStateData,response.data])
        }
          }
          setFormData(formValues) //for clearing values in form
          console.log("came")
          console.log(formData)
          console.log(userStateData)
        }
  return (
    <div style={{padding:20}}>
      <h3>User Form</h3>
      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      autoComplete="off"
      onSubmit={(e)=>handleSubmit(e)}
    >
      <TextField id="name" label="Name" variant="standard" value={formData.name} name="name" 
      onChange={(e)=>handleChange(e)}/>
      <br/>
      <span style={{color:"red"}}>{formData.error.name}</span><br/>
      <TextField id="age" label="Age" variant="standard" type="number" value={formData.age} name="age" 
      onChange={(e)=>handleChange(e)} />
      <br/>
      <span style={{color:"red"}}>{formData.error.age}</span><br/>
      <TextField id="email" label="Email" variant="standard" type="email" value={formData.email} name="email" 
      onChange={(e)=>handleChange(e)}/>
      <br/> 
      <span style={{color:"red"}}>{formData.error.email}</span><br/>
      <FormControl>
      <FormLabel id="gender">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="gender"
        value={formData.gender}
        onChange={(e)=>handleChange(e)}
      >
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl><br/>
    <span style={{color:"red"}}>{formData.error.gender}</span><br/>
    <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Courses</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="courses"
    name="courses"
    value={formData.courses}
    onChange={(e)=>handleChange(e)}
  >
    <MenuItem value="React">React</MenuItem>
    <MenuItem value="Node">Node</MenuItem>
    <MenuItem value="Javascript">Javascript</MenuItem>
  </Select>
</FormControl><br/>
<span style={{color:"red"}}>{formData.error.courses}</span><br/>
      <Button variant="contained" type="submit">Submit</Button>
    </Box>

      <h3>User Data</h3>
      <TableContainer component={Paper}>
      <Table sx={{width: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Courses</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userStateData.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.age}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.gender}</TableCell>
              <TableCell align="right">{row.courses}</TableCell>
              <TableCell>
                <Button variant="text" onClick={()=>onPopulateData(row.id)}>Edit</Button> <br />
                <Button variant="text" onClick={()=>handleDelete(row.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default App;
