import React from 'react';
import NVD3Chart from 'react-nvd3';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import WaveProgress from './WaveProgress.jsx';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';


const styles = {
  container: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#C6D8D3',
		width: '48%',
		float: 'right'
  }
}


export default class SRAdminGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Tvalue: [],
      activeWaves: [],
      waves: [],
			toggle: 'block',
			toggleLabel: 'Show Details'
    }
    this.handleTChange = this.handleTChange.bind(this);
    this.getWaves = this.getWaves.bind(this);
		this.toggleGraph = this.toggleGraph.bind(this);
	}
  componentWillMount() {
    this.getWaves();
  }
  handleTChange(event, key, values) {
    this.setState({Tvalue: values})
  }

	toggleGraph() {
		if(this.state.toggle === 'block') {
			this.setState({
				toggle: 'none',
				toggleLabel: 'Hide Details'
			})
		}
		else {
			this.setState({
				toggle: 'block',
				toggleLabel: 'Show Details'
			})
		}
	}

  getWaves() {
    let th = this;
    Request.get('/dashboard/wavesDuration').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err)
      else {
        let activeWaves = []
        console.log(res.body, "getwaves")
        res.body.map(function(wave, key) {
          console.log(wave, "wave")
          let sdate = new Date(parseInt(wave.StartDate, 10));
          let edate = new Date(parseInt(wave.EndDate, 10));
          console.log(sdate, "sadate")
          if (sdate < Date.now() && edate > Date.now())
            activeWaves.push(wave);
          }
        )
        th.setState({activeWaves: activeWaves, waves: res.body})
        console.log(th.state.activeWaves, "activewavesState")
        console.log(th.state.waves, "wavesin state")
      }
    })
  }
  render() {

    let sampledata = []
    console.log(this.state.activeWaves, "this.state.activeWaves")
    this.state.activeWaves.map(function(activewave, i) {
      console.log(activewave, "activewave")
      let myobj = {}
      myobj.waveid = activewave.CourseName + '(' + activewave.WaveID + ')';
      let sdate = new Date(parseInt(activewave.StartDate, 10));
      let edate = new Date(parseInt(activewave.EndDate, 10));
      let total = edate - sdate;
      let total1 = total / 1000;
      total1 = Math.floor(total1 / 86400) + 1;
      let prog = Date.now() - sdate;
      let progg = prog / 1000;
      progg = Math.floor(progg / 86400) + 1;
      myobj.value = progg;
      myobj.total = total1;
      myobj.duration = activewave.Duration;
      sampledata.push(myobj);

      console.log(myobj.waveid, myobj.value)
    })

    console.log(sampledata, "myobj");

    let Titems = [];
    for (let i = 0; i < sampledata.length; i++) {
      Titems.push(sampledata[i].waveid)
    }
    console.log(Titems, "titems")

    let th = this;
    var Tdatavalue = []
    console.log(this.state.Tvalue, "Tvalue")
    if (this.state.Tvalue != null) {
      for (var i = 0; i < sampledata.length; i++) {
        if (sampledata[i].waveid === this.state.Tvalue) {
          console.log(sampledata[i].waveid)
          Tdatavalue.push(sampledata[i])
        }
      }

    }
    console.log(Tdatavalue, "Tdatavalue")
    let displayvalue = []
    let myobj = {}
    let myobj1 = {}
    Tdatavalue.map(function(val, i) {

      myobj.label = "Days completed";
      myobj.value = val.value;
      myobj.color = "#008DD5";
      myobj1.label = "Days yet to go";
      myobj1.value = val.total - val.value;
      myobj1.color = "#EE4266";
      console.log(myobj, "maaobj")
      console.log(myobj1, "wdbwejhf")
      displayvalue.push(myobj);
      displayvalue.push(myobj1);
    })

    console.log(displayvalue, "displayvalue")
    return (
      <div>
				<Paper style = {styles.container}>
					<h3> Wave progress Graph</h3><Toggle
						onToggle={this.toggleGraph}
						title={this.state.toggleLabel}
						defaultToggled={false}
						style={{marginLeft: '90%', marginTop: '-10%'}}
					/>
          <div style = {{display : this.state.toggle}}>
            <SelectField value={this.state.Tvalue} onChange={this.handleTChange} floatingLabelText="Wave Training Status">
              {sampledata.map(function(item, key) {
                return <MenuItem key={key} value={item.waveid} primaryText={item.waveid}/>
              })
}
            </SelectField>
            <NVD3Chart id="pieChart" type="pieChart" tooltip={{
              enabled: true
            }} datum={displayvalue} x="label" y="value" height={500} width={500}/>
					</div>
					</Paper>
      </div>
    )
  }
}
