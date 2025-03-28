import React, { Component } from 'react';
// we will be using axios to make requests to the back end Express server
//But don't the requests have to pass thru nginx?
import axios from 'axios';

//index is coming from the form input field, and is used to make this a controlled form. onChange.
//When the form is submitted, index gets posted to api/values, which is an object made up of properties for each index.
//seenIndexes is an array of objects from postgres. That is the default  return type from postgress
//values is an object from redis of key value pairs
class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();   //from redis
    this.fetchIndexes();  //from postgress
    //this.fetchStuff();  //from no where in particular
  }


  // async fetchStuff() {
  //   debugger;
  //   const stuff = await axios.get('/api');
  //   debugger;
  //   console.log(`Show me stuff ${stuff}`);
  // }

  //Where are these being saved and held permanently from session to session?
  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
  }

  //Where are these being save and held?
  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({ seenIndexes: seenIndexes.data });
  }



  //index is coming from the form input field, and is used to make this a controlled form. onChange.
  //When the form is submitted, index gets posted to api/values, which is an object made up of properties for each index.
  //index is cleared out of the input field here.
  handleSubmit = async (event) => {
    event.preventDefault();


    const response = await axios.post('/api/values', {
      index: this.state.index,
    });
    debugger;
    //see ConsoleLogFromReactApp.png for where this console log output went to.
    console.log(`The response came back as ${response.data} * * * * * * * * * * `)
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    //debugger;
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  //Its ok to mutate state the when that state is not used in props or application state
  //Here, entries is only used for display, so it can be mutated using push and not cause problems
  renderValues() {
    const entries = [];

    //this.state.values is an object, not an array. To iterate the properties
    //of the object, you can use this. <div key={key}> is required for all react lists
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    // const x = [1,2,3,4,5]
    // const entries = x.map((key, index) => {
    //   return (
    //   <div key={key}>
    //     For index {key} I calculated {x[index]}
    //   </div>
    //   );
    // })


    //this map function wont work since this.state.values is an Object and not an array
    // const entries = this.state.values.map((key, index) => {
    //   return (
    //   <div key={key}>
    //     For index {key} I calculated {this.state.values[key]}
    //   </div>
    //   );
    // })


    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
