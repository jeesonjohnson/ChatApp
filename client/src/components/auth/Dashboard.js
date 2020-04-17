import React, { Component } from "react";
import axios from 'axios';
import { Button, Icon, TextInput } from 'react-materialize';
import './Auth.css'
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      companyListVisible: true,
      selectedCompany: "",
      selectedWorkspace: "",
      companies: [],
      workspaces: {}
    };
  }

  componentDidMount(){
    this.loadWorkspacesData()
    //var generatedColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'; //Used to generate random colours
  }
  
  //Gets all workspaces and companies with user 
  loadWorkspacesData(){
    axios.get('/workspaces/')
    .then(res => {
      var companyList = []

      //If recieved data is not empty, add each company name to array 
      if (res.data.data != {}) {
        for(var key in res.data.data){
          companyList.push(key)
        }
      }

      this.setState({
        companies: companyList,
        selectedCompany: companyList[0],
        workspaces: res.data.data, 
        selectedWorkspace: res.data.data[companyList[0]][0].name 
      })
    })
    .catch(err => {
      console.log('Error from loading user company workspaces')
    })
  }

  changeSelectedCompany = e => {
    //if company button selected is not the same as currently selected button
    if (selectedCompanyID !== this.state.selectedCompany){
      var selectedCompanyID = e.currentTarget.id 
       this.setState({ selectedCompany: selectedCompanyID });

      //Set all company button styles
      for(var i = 1; i < e.currentTarget.parentNode.childNodes.length; i++){
        e.currentTarget.parentNode.childNodes[i].className="collection-item"
      }
  
      //Set workspace buttons
      var companyButtons = e.currentTarget.parentNode.parentNode.childNodes[1].childNodes 
      
      if(companyButtons.length > 1) {
        for(var i = 0; i < companyButtons.length-2; i++){
          companyButtons[i].className="collection-item"
        }
      }

      //Set active company button style
      e.currentTarget.className="collection-item selected_company"
    }
  }

  changeSelectedWorkspace = e => {
    //Set all button styles to default, then change active button
    var workspaceButtons = e.currentTarget.parentNode.childNodes

    if(workspaceButtons.length > 2){
      for(var i = 0; i < workspaceButtons.length-2; i++){
        workspaceButtons[i].className="collection-item"
      }
      e.currentTarget.className="collection-item selected_workspace"
    }

    this.setState({selectedWorkspace: e.currentTarget.childNodes[0].dataset.tooltip})
    //Load workspace objects
    //Load users
  }

  //Should hide the company buttons;(Needs to be updated)
  changeCompanyPanelVisiblity = e => {
    if (e.currentTarget.parentNode.parentNode.id == "ShowCompanyPanel"){
      e.currentTarget.parentNode.parentNode.id = "HideCompanyPanel"
    }
    else{
      e.currentTarget.parentNode.parentNode.id = "ShowCompanyPanel"
    }
  }

  //Takes a sentence and returns the first letter of each word as one word
  getAcronym = name => {
    var wordList = name.split(" ")
    var acronym = ""

    for(var wordIndex = 0; wordIndex < wordList.length; wordIndex++){
      wordList[wordIndex].charAt(0)

      acronym = acronym + wordList[wordIndex].charAt(0)
    }

    return acronym
  }

  render() {
    const companies = this.state.companies;
    let companiesList;
    const companyButton = this.state.selectedCompany;
    
    if(!companies) {
      companiesList = "No companies found";
    } 
    else {  
      companiesList = companies.map((companies, k) => {
        var class_name = "collection-item "
        if(k === 0){ 
          class_name = `${class_name}selected_company`
        }
        
        return( 
          <Link to="/dashboard" className={class_name +" show-company-items"} id={companies} key={k} onClick={this.changeSelectedCompany.bind(this)} style={{width:"100%", height:"100%" }}>
            <Button className="collection-item btn-floating btn-large" style={{ width:"48px", height:"48px", backgroundColor:"#f1b92e" }} tooltip={companies} tooltipOptions={{position: 'right'}}>
              <p>{this.getAcronym(companies)}</p>
            </Button>
          </Link>
        )
      });
    }

    const workspaces = this.state.workspaces
    let workspaceList;

    if(companyButton === ""){
      workspaceList = ""
    }
    else{
      workspaceList = workspaces[companyButton].map((workspace, k) => {
        var class_name = "collection-item "
        
        //Sets first workspace when loaded as active
        if(k === 0){ 
          class_name = `${class_name}selected_workspace`
        }

        return(
        <Link to="/dashboard" className={class_name} id={workspace._id} key={k} onClick={this.changeSelectedWorkspace.bind(this)} style={{width:"100%", height:"100%"}}>
          <Button className="collection-item btn-floating btn-large" style={{backgroundColor:"#725bda", width:"48px", height:"48px"}} tooltip={workspace.name} tooltipOptions={{position: 'right'}}>
            <p className="">{this.getAcronym(workspace.name)}</p>
          </Button>
        </Link>
        )
      })
    }

    return (
      <div id="dashboard" className="" style={{}}>
        <div className="row" style={{marginTop:"10px", marginLeft:0, marginRight:0}} >
      
          <div id="ShowCompanyPanel" className="col collection center-align" style={{ width:"4%", backgroundColor: "#25272b", margin:0, padding:0, float:"left", minWidth:"64px"}}>
            <div id="CompanyLogo" className="ShowCompany collection-item" style={{width:"100",minHeight:"64px"}}></div>
            {companiesList}
            <div className="collection-item" >
              <Button className="collection-item btn-large waves-effect waves-teal" style={{backgroundColor:"#36393f", width:"48px", height:"48px"}} tooltip="Join company" tooltipOptions={{position: 'right'}}><Icon >add</Icon></Button>
            </div>
          </div>

          <div className="collection center-align col" style={{width:"4%", minHeight:"64px", marginTop:0, marginLeft:"0", padding:0, float:"left", minWidth:"64px"}}>
            <Link to="/" id="CompanyLogo" className="collection-item center-align" style={{width:"100%", minHeight:"64px"}}>
              <img className="row collection-item circle" alt="logo" src="/logo.png" style={{backgroundColor:"black", width:"48px", height:"48px"}}></img>
            </Link>            
            {workspaceList}
            <div className="collection-item center-align" style={{width:"100%", minHeight:"64px"}}>
              <Button className="collection-item btn-large waves-effect waves-teal" style={{backgroundColor:"#36393f", width:"48px", height:"48px"}} tooltip="Add workspace" tooltipOptions={{position: 'right'}}><Icon >add</Icon></Button>
            </div>
            <Button onClick={this.changeCompanyPanelVisiblity.bind(this)} style={{}}><Icon>chevron_left</Icon></Button>
          </div>

          <div className="col" style={{width:"92%", paddingLeft:0, paddingRight:0}}>

            <div className="row" style={{borderBottomStyle:"solid", borderBottomColor:"black", borderBottomWidth:"2px", width:"100%", margin:0}}>
              <div className="" style={{backgroundColor:"#2f3136", width:"12%", float:"left", borderRadius: "50px 0px 0px 0px"}}>
                <p style={{letterSpacing:"1.5px"}}>{this.state.selectedWorkspace}</p>
              </div>
              <div className="" style={{backgroundColor:"#36393f", width:"88%", float:"left"}}>
                <p className="col s9 left-align">PLANNER</p>
                <div className="col s3">
                  <TextInput className="left-align" id="TextInput-4"/>
                  <Button className="btn-large btn-flat" style={{color:"#a0f3d7"}}><Icon className="right" >search</Icon></Button>
                </div>
              </div>
            </div>

            <div className="row" style={{width:"100%", margin:0}}>
              <div  className="col " style={{backgroundColor:"#2f3136", width:"12%", margin:0, padding:0}}>
                <Button className="col s12 btn-flat" style={{color:"#afafaf"}}><Icon className="left">class</Icon>Planner</Button>
                <Button className="col s12 btn-flat" style={{color:"#afafaf"}}><Icon className="left">chat</Icon>General</Button>
                <Button className="col s12 btn-flat" style={{color:"#afafaf"}}><Icon className="left">announcement</Icon>Announcement</Button>
                <Button className="col s12 btn-flat" style={{color:"#afafaf"}}><Icon className="left">call</Icon>Voice Meeting</Button>
                <Button className="col s12 btn-flat" style={{color:"#afafaf"}}><Icon className="left">videocam</Icon>Video Meeting</Button>
                <div>
                  {
                    //Load chat buttons for user
                  }
                </div>
              </div>

              <div className="col row" style={{backgroundColor:"#36393f", width:"88%", paddingLeft:0, marginLeft:0, marginRight:0, paddingRight:0}}>
                <div>
                  <div className="col" style={{width:"80%"}}>Planner Panel</div>
                  <div className="col" style={{width:"20%", backgroundColor:"#2f3136"}}>
                    Users
                  </div>
                </div>

                <div>Calender</div>

                <div>Charts</div>
    
                <div>General chat</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;